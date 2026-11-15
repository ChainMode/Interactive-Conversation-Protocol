/**
 * ICP 1.0 Component & Terminal Degradation Engine.
 * Provides universal text_block fallback for unknown/unsupported UI components
 * and deterministic plain-text rendering for minimal terminals.
 */

import {
  BUILT_IN_RENDER_COMPONENTS,
  BUILT_IN_SIGNS,
  BUILT_IN_WHATIS,
  BUILT_IN_REACTION_TYPES,
} from "./validator.mjs";
import { maskSecretsForDisplay } from "./security.mjs";

export { BUILT_IN_RENDER_COMPONENTS };

function formatBuiltInPlainText(component, params = {}) {
  switch (component) {
    case "checkbox_list":
      return (Array.isArray(params.items) ? params.items : [])
        .map((item) => `[ ] ${item}`)
        .join("\n");

    case "form":
      return (Array.isArray(params.fields) ? params.fields : [])
        .map((f) => `${f.label || f.name || "field"}: [${f.type || "text"}]`)
        .join("\n");

    case "highlight_marker":
      return params.color ? `[highlight ${params.color}]` : "[highlight]";

    case "circle_overlay":
      return `[circle (${params.cx ?? 0}, ${params.cy ?? 0}) r=${params.radius ?? 0}]`;

    case "timeline_card": {
      const prefix = params.time ? `[${params.time}] ` : "";
      const suffix = params.description ? ` — ${params.description}` : "";
      return `${prefix}${params.title || ""}${suffix}`.trim();
    }

    case "action_button":
      return `[${params.label || params.action || "button"}]`;

    case "data_table": {
      const cols = Array.isArray(params.columns) ? params.columns : [];
      const rows = Array.isArray(params.rows) ? params.rows : [];
      const lines = [];
      if (cols.length > 0) lines.push(cols.join(" | "));
      for (const r of rows) {
        if (Array.isArray(r)) lines.push(r.join(" | "));
      }
      return lines.join("\n");
    }

    case "media_preview":
      return `[media: ${params.alt || params.src || "preview"}]`;

    case "text_block":
      return String(params.text ?? "");

    default:
      return "";
  }
}

function extractFallbackText(component, params = {}) {
  if (BUILT_IN_RENDER_COMPONENTS.includes(component)) {
    const formatted = formatBuiltInPlainText(component, params);
    if (formatted.length > 0) return formatted;
  }

  const pieces = [];
  for (const key of ["text", "title", "label", "description", "src"]) {
    if (typeof params[key] === "string" && params[key].trim().length > 0) {
      pieces.push(params[key].trim());
    }
  }
  if (Array.isArray(params.items) && params.items.length > 0) {
    pieces.push(params.items.join(", "));
  }
  if (pieces.length > 0) {
    return pieces.join(" — ");
  }
  return `[${component || "text_block"}]`;
}

export function renderComponentModel(reaction, options = {}) {
  const params = reaction?.params || {};
  const requested = typeof params.component === "string" ? params.component : "text_block";
  const supportedSet = options.supportedComponents
    ? new Set(options.supportedComponents)
    : new Set(BUILT_IN_RENDER_COMPONENTS);

  const isKnownBuiltIn = BUILT_IN_RENDER_COMPONENTS.includes(requested);
  const isSupported = isKnownBuiltIn && supportedSet.has(requested);

  if (isSupported) {
    const { component: _ignored, ...props } = params;
    return {
      component: requested,
      originalComponent: requested,
      degraded: false,
      props,
      plainText: formatBuiltInPlainText(requested, params),
      warnings: [],
    };
  }

  const fallbackText = extractFallbackText(requested, params);
  return {
    component: "text_block",
    originalComponent: requested,
    degraded: true,
    props: { text: fallbackText },
    plainText: fallbackText,
    warnings: [
      {
        code: "W_ICP_COMPONENT_DEGRADED",
        originalComponent: requested,
        fallbackComponent: "text_block",
        message: `Component "${requested}" is unsupported and degraded to "text_block"`,
      },
    ],
  };
}

export function degradeToPlainText(ctx, options = {}) {
  const mediaType = String(ctx?.source?.type || "application/octet-stream");
  if (!mediaType.startsWith("text/")) {
    const filename = ctx?.source?.filename || "attachment";
    return `[${mediaType}: ${filename}]`;
  }

  const { maskedText } = maskSecretsForDisplay(ctx, options);
  return maskedText;
}

export function renderTerminalDocument(ctx, options = {}) {
  const plainText = degradeToPlainText(ctx, options);
  const annotations = (ctx?.annotations || []).map((ann) => {
    const signs = Array.isArray(ann?.signs) ? ann.signs : [];
    const recognizedSigns = signs.filter((s) => BUILT_IN_SIGNS.includes(s));
    const ignoredSigns = signs.filter((s) => !BUILT_IN_SIGNS.includes(s));

    const recognizedWhatis =
      typeof ann?.whatis === "string" && BUILT_IN_WHATIS.includes(ann.whatis)
        ? ann.whatis
        : null;
    const ignoredWhatis =
      typeof ann?.whatis === "string" && !BUILT_IN_WHATIS.includes(ann.whatis)
        ? ann.whatis
        : null;

    const renderedComponents = [];
    const actionableReactions = [];
    const skippedReactions = [];

    for (const rx of ann?.context?.reactions || []) {
      if (!rx || typeof rx.type !== "string") continue;
      if (rx.type === "render") {
        renderedComponents.push(renderComponentModel(rx, options));
      } else if (BUILT_IN_REACTION_TYPES.includes(rx.type)) {
        actionableReactions.push(rx);
      } else {
        skippedReactions.push({
          type: rx.type,
          reason: "unknown_reaction_type",
        });
      }
    }

    return {
      id: ann?.id || null,
      anchor: ann?.anchor || null,
      recognizedSigns,
      ignoredSigns,
      recognizedWhatis,
      ignoredWhatis,
      renderedComponents,
      actionableReactions,
      skippedReactions,
    };
  });

  return {
    plainText,
    annotations,
  };
}
