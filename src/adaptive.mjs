/**
 * ICP 1.0 Multi-Endpoint Adaptive `.ctx` Renderer Suite (`icp-adaptive`).
 *
 * Deterministically renders the exact same `.ctx` Conception Annotation payload across
 * 4 concrete form-factor targets while preserving identical semantic fidelity,
 * solving the "cursor-missing effect" via addressable object-pointer annotations,
 * masking `secret` spans, and enforcing zero unapproved side-effect execution (CAP Gate):
 *   1. `desktop-web`    — semantic interactive HTML/CSS widget + standalone HTML preview
 *   2. `mobile-compact` — minimal thumb-friendly summary card + primary Approve/Reject bar
 *   3. `terminal-cli`   — clean ANSI/ASCII aligned table, object pointers & numbered prompts
 *   4. `voice-audio`    — concise TTS spoken script + single-word voice confirmation grammar
 */

import { validateCtx } from "./validator.mjs";
import {
  DEFAULT_SECRET_MASK,
  evaluateReactionGate,
  maskSecretsForDisplay,
  sanitizeReactionParams,
} from "./security.mjs";
import { renderTerminalDocument } from "./degrade.mjs";
import { parseInline } from "./inline.mjs";

export const ADAPTIVE_TARGETS = Object.freeze([
  "desktop-web",
  "mobile-compact",
  "terminal-cli",
  "voice-audio",
]);

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveRawBaseText(ctx, externalContent) {
  const mode = ctx?.source?.mode;
  if (mode === "inline" || mode === "embedded") {
    return parseInline(ctx?.source?.content || "").cleanText;
  }
  if (mode === "sidecar" || mode === "detached") {
    return typeof externalContent === "string" ? externalContent : "";
  }
  return typeof ctx?.source?.content === "string" ? ctx.source.content : "";
}

function inferActionIntentRole(label, reactionName, index) {
  const hay = `${label} ${reactionName}`.toLowerCase();
  if (/\b(reject|decline|deny|cancel|abort)\b/.test(hay)) {
    return "reject";
  }
  if (/\b(approve|confirm|accept|submit|authorize|execute|pay)\b/.test(hay)) {
    return "approve";
  }
  return index === 0 ? "approve" : "secondary";
}

/**
 * Extracts a canonical, form-factor-independent semantic model from a `.ctx` document.
 * Guarantees 0 side-effect executions during extraction/rendering.
 */
export function extractAdaptiveSemanticModel(ctx, options = {}) {
  const validation = validateCtx(ctx);
  if (!validation.valid) {
    const summary = validation.errors.map((e) => `${e.code}@${e.path}`).join(", ");
    throw new Error(`Invalid ICP .ctx payload: ${summary}`);
  }

  const mask = options.mask ?? DEFAULT_SECRET_MASK;
  const maskedInfo = maskSecretsForDisplay(ctx, {
    mask,
    revealedIds: options.revealedIds ?? [],
    externalContent: options.externalContent,
  });
  const rawBaseText = resolveRawBaseText(ctx, options.externalContent);
  const terminalDoc = renderTerminalDocument(ctx, {
    mask,
    revealedIds: options.revealedIds ?? [],
    externalContent: options.externalContent,
  });

  const objectPointers = [];
  const tables = [];
  const forms = [];
  const cards = [];
  const actions = [];

  (ctx.annotations || []).forEach((rawAnn, annIdx) => {
    const annId = rawAnn.id || `ann_${annIdx + 1}`;
    const signs = Array.isArray(rawAnn.signs) ? rawAnn.signs : [];
    const isSecret = signs.includes("secret");
    const whatis = rawAnn.whatis || null;
    const anchor = rawAnn.anchor || { scope: "global" };

    let pointedText = "";
    if (anchor.scope === "coordinate" && anchor.text && typeof rawBaseText === "string") {
      const s = Math.max(0, Math.min(anchor.text.start, rawBaseText.length));
      const e = Math.max(0, Math.min(anchor.text.end, rawBaseText.length));
      pointedText = isSecret ? mask : rawBaseText.slice(s, e);
    } else if (anchor.scope === "marker" && anchor.name) {
      pointedText = `#${anchor.name}`;
    } else if (anchor.scope === "annotation" && anchor.ref) {
      pointedText = `@${anchor.ref}`;
    }

    const rawNote =
      rawAnn.context?.situation ?? rawAnn.context?.subtext ?? rawAnn.context?.memory;
    const description = isSecret
      ? mask
      : typeof rawNote === "string"
        ? rawNote
        : Array.isArray(rawNote)
          ? rawNote.filter((x) => typeof x === "string").join("; ")
          : "";

    if (whatis || signs.length > 0 || anchor.scope === "coordinate") {
      objectPointers.push({
        pointerId: annId,
        whatis: whatis || "term",
        signs,
        anchorScope: anchor.scope,
        pointedText: pointedText || description || annId,
        description,
        isSecret,
      });
    }

    const reactions = Array.isArray(rawAnn.context?.reactions) ? rawAnn.context.reactions : [];
    reactions.forEach((rx, rxIdx) => {
      if (!rx || typeof rx.type !== "string") return;
      if (rx.type === "render") {
        const comp = rx.params?.component;
        if (comp === "data_table") {
          tables.push({
            tableId: `${annId}_table_${tables.length + 1}`,
            annotationId: annId,
            caption:
              rx.params?.caption ||
              rx.params?.title ||
              description ||
              "Annotated Data Table",
            columns: Array.isArray(rx.params?.columns) ? rx.params.columns.map(String) : [],
            rows: Array.isArray(rx.params?.rows)
              ? rx.params.rows.map((r) => (Array.isArray(r) ? r.map(String) : [String(r)]))
              : [],
          });
        } else if (comp === "form") {
          forms.push({
            formId: `${annId}_form_${forms.length + 1}`,
            annotationId: annId,
            title: rx.params?.title || description || "Parameter Input",
            fields: Array.isArray(rx.params?.fields)
              ? rx.params.fields.map((f, fIdx) => ({
                  name: String(f.name || `field_${fIdx + 1}`),
                  label: String(f.label || f.name || `Field ${fIdx + 1}`),
                  type: String(f.type || "text"),
                  required: Boolean(f.required),
                  defaultValue: f.default !== undefined ? String(f.default) : "",
                  helpText: typeof f.help === "string" ? f.help : "",
                  options: Array.isArray(f.options) ? f.options.map(String) : undefined,
                }))
              : [],
          });
        } else if (comp === "action_button") {
          // Pure visual label metadata if paired with a side-effect reaction on same annotation
          cards.push({
            cardId: `${annId}_btn_${rxIdx + 1}`,
            component: comp,
            label: String(rx.params?.label || rx.params?.action || "Action"),
          });
        } else {
          cards.push({
            cardId: `${annId}_card_${cards.length + 1}`,
            component: comp || "text_block",
            text:
              terminalDoc.annotations[annIdx]?.renderedComponents?.[0]?.plainText ||
              description ||
              "",
          });
        }
      } else {
        // Side-effect reaction (function, command, app, url): strictly CAP-gated, NEVER executed on render
        const sanitized = sanitizeReactionParams(rx);
        const rawTargetName =
          rx.params?.name || rx.params?.cmd || rx.params?.action || rx.params?.url || rx.type;
        const explicitLabel =
          rx.params?.label ||
          rawAnn.context?.reactions?.find(
            (r) => r?.type === "render" && r?.params?.component === "action_button"
          )?.params?.label ||
          `${rx.type}: ${rawTargetName}`;
        const intentRole = inferActionIntentRole(
          String(explicitLabel),
          String(rawTargetName),
          actions.length
        );
        actions.push({
          actionId: `act_${actions.length + 1}_${annId}`,
          index: actions.length + 1,
          annotationId: annId,
          label: String(explicitLabel),
          intentRole,
          reactionType: rx.type,
          targetName: String(rawTargetName),
          reaction: rx,
          sanitizedParams: sanitized.params,
          requiresCapConsent: true,
          executed: false,
        });
      }
    });
  });

  const headline =
    ctx.concepts?.[0]?.label ||
    tables[0]?.caption ||
    forms[0]?.title ||
    maskedInfo.maskedText.split(/\r?\n/)[0]?.slice(0, 96) ||
    `ICP Context ${ctx.meta.id}`;

  return {
    ctxId: ctx.meta.id,
    locale: ctx.meta.locale || "en-US",
    created: ctx.meta.created,
    headline,
    maskedText: maskedInfo.maskedText,
    redactedSecretCount: maskedInfo.redactedSecretCount,
    objectPointers,
    tables,
    forms,
    cards,
    actions,
    sideEffectsExecuted: 0,
  };
}

const DESKTOP_SCOPED_CSS = `
:root { --target-size: 24px; }
@media (pointer: coarse) {
  :root { --target-size: 44px; }
}
.icp-adaptive-widget {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #16181d;
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  padding: 1.25rem;
  max-inline-size: 56rem;
  line-height: 1.5;
  overflow-wrap: break-word;
}
.icp-adaptive-widget :where(h1, h2, h3) {
  text-wrap: balance;
  margin-block: 0 0.5rem;
}
.icp-adaptive-widget :where(p, li) {
  text-wrap: pretty;
}
.icp-adaptive-widget :where(a, code) {
  overflow-wrap: anywhere;
}
.icp-adaptive-widget :where(button, select, textarea, input:not([type="checkbox"], [type="radio"]), [role="button"], label:has(input[type="checkbox"], input[type="radio"])) {
  min-block-size: var(--target-size);
  min-inline-size: var(--target-size);
}
.icp-adaptive-widget :where(button, input, select, textarea):focus-visible {
  outline: 3px solid #0b57d0;
  outline-offset: 2px;
}
.icp-pointer-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: 0.75rem 1rem;
}
.icp-object-chip {
  font: inherit;
  font-size: 0.875rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid #0b57d0;
  background: #eef4ff;
  color: #0b3d91;
  cursor: pointer;
}
.icp-table-wrapper {
  overflow: auto;
  max-inline-size: 100%;
  max-block-size: min(440px, 75vh);
  container-type: inline-size;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  margin-block: 0.75rem 1rem;
}
.icp-table-wrapper table {
  inline-size: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.icp-table-wrapper caption {
  text-align: start;
  font-weight: 600;
  padding: 0.65rem 0.75rem;
  background: #f6f8fa;
  border-block-end: 1px solid #d0d7de;
}
.icp-table-wrapper thead {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
}
.icp-table-wrapper th,
.icp-table-wrapper td {
  padding: 0.6rem 0.75rem;
  text-align: start;
  border-block-end: 1px solid #eaeef2;
  white-space: nowrap;
}
.icp-table-wrapper thead th {
  background: #f6f8fa;
  font-weight: 600;
}
.icp-table-wrapper tbody th {
  position: sticky;
  inset-inline-start: 0;
  background: #ffffff;
  font-weight: 600;
}
@container (width < 600px) {
  .icp-table-wrapper table,
  .icp-table-wrapper thead,
  .icp-table-wrapper tbody,
  .icp-table-wrapper tr,
  .icp-table-wrapper th,
  .icp-table-wrapper td {
    display: block;
    white-space: normal;
  }
  .icp-table-wrapper thead {
    display: none;
  }
  .icp-table-wrapper tr {
    margin-block-end: 1rem;
    border: 1px solid #d0d7de;
  }
  .icp-table-wrapper tbody th {
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
    background: #f6f8fa;
  }
  .icp-table-wrapper td[data-col-label]::before {
    content: attr(data-col-label) ": ";
    font-weight: 600;
  }
}
.icp-form-fieldset {
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 1rem;
  margin-block: 0.75rem 1rem;
}
.icp-form-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  margin-block-end: 1rem;
}
.icp-form-field input,
.icp-form-field select,
.icp-form-field textarea {
  font: inherit;
  font-size: max(1rem, 1em);
  padding: 0.55rem 0.75rem;
  min-block-size: 48px;
  inline-size: 100%;
  max-inline-size: 28rem;
  box-sizing: border-box;
  border: 1px solid #767676;
  border-radius: 6px;
}
.icp-form-field input:user-invalid,
.icp-form-field select:user-invalid,
.icp-form-field textarea:user-invalid {
  border-color: #b3261e;
}
.icp-hint {
  font-size: 0.85rem;
  color: #57606a;
}
.icp-action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-block-start: 1rem;
}
.icp-btn-approve,
.icp-btn-reject,
.icp-btn-secondary {
  font: inherit;
  font-weight: 600;
  padding: 0.65rem 1.15rem;
  min-block-size: 48px;
  border-radius: 8px;
  cursor: pointer;
}
.icp-btn-approve {
  background: #0b57d0;
  color: #ffffff;
  border: 1px solid #0b57d0;
}
.icp-btn-reject {
  background: #ffffff;
  color: #b3261e;
  border: 1px solid #b3261e;
}
.icp-btn-secondary {
  background: #f6f8fa;
  color: #24292f;
  border: 1px solid #767676;
}
`.trim();

function renderDesktopWebTarget(model) {
  const safeId = escapeHtml(model.ctxId);
  const headingId = `icp-heading-${safeId}`;

  const pointerHtml =
    model.objectPointers.length > 0
      ? `<div class="icp-pointer-strip" role="group" aria-label="Object Pointer Annotations">\n` +
        model.objectPointers
          .map(
            (p) =>
              `  <button type="button" class="icp-object-chip" data-icp-pointer-id="${escapeHtml(p.pointerId)}" data-icp-whatis="${escapeHtml(p.whatis)}">[${escapeHtml(p.whatis)}] ${escapeHtml(p.pointedText)}</button>`
          )
          .join("\n") +
        `\n</div>`
      : "";

  const tablesHtml = model.tables
    .map((tbl) => {
      const capId = `icp-cap-${escapeHtml(tbl.tableId)}`;
      const cssVars = tbl.columns
        .map((c, idx) => `--label-${idx + 1}: "${escapeHtml(c)}"`)
        .join("; ");
      const ths = tbl.columns.map((c) => `<th scope="col">${escapeHtml(c)}</th>`).join("");
      const trs = tbl.rows
        .map((row) => {
          const cells = row
            .map((cell, cIdx) => {
              if (cIdx === 0) {
                return `<th scope="row">${escapeHtml(cell)}</th>`;
              }
              const colLabel = tbl.columns[cIdx] || `Column ${cIdx + 1}`;
              return `<td data-col-label="${escapeHtml(colLabel)}">${escapeHtml(cell)}</td>`;
            })
            .join("");
          return `      <tr>${cells}</tr>`;
        })
        .join("\n");

      return [
        `<div tabindex="0" role="region" aria-labelledby="${capId}" class="icp-table-wrapper">`,
        `  <table style="${cssVars}">`,
        `    <caption id="${capId}">${escapeHtml(tbl.caption)}</caption>`,
        `    <thead><tr>${ths}</tr></thead>`,
        `    <tbody>`,
        trs,
        `    </tbody>`,
        `  </table>`,
        `</div>`,
      ].join("\n");
    })
    .join("\n");

  const formFieldsHtml = model.forms
    .map((frm) => {
      const controls = frm.fields
        .map((f) => {
          const inputId = `icp-${escapeHtml(frm.formId)}-${escapeHtml(f.name)}`;
          const helpId = `${inputId}-help`;
          const reqMark = f.required ? ` <span aria-hidden="true">*</span>` : "";
          const reqAttr = f.required ? " required" : "";
          const descAttr = f.helpText ? ` aria-describedby="${helpId}"` : "";
          let controlMarkup = "";
          if (Array.isArray(f.options) && f.options.length >= 6) {
            const opts = f.options
              .map(
                (o) =>
                  `<option value="${escapeHtml(o)}"${o === f.defaultValue ? " selected" : ""}>${escapeHtml(o)}</option>`
              )
              .join("");
            controlMarkup = `<select id="${inputId}" name="${escapeHtml(f.name)}"${descAttr}${reqAttr}>${opts}</select>`;
          } else {
            controlMarkup = `<input type="${escapeHtml(f.type === "number" ? "text" : f.type)}" id="${inputId}" name="${escapeHtml(f.name)}" value="${escapeHtml(f.defaultValue)}"${descAttr}${reqAttr}>`;
          }
          const helpMarkup = f.helpText
            ? `\n    <span id="${helpId}" class="icp-hint">${escapeHtml(f.helpText)}</span>`
            : "";
          return `  <div class="icp-form-field">\n    <label for="${inputId}">${escapeHtml(f.label)}${reqMark}</label>\n    ${controlMarkup}${helpMarkup}\n  </div>`;
        })
        .join("\n");
      return `<fieldset class="icp-form-fieldset">\n  <legend>${escapeHtml(frm.title)}</legend>\n${controls}\n</fieldset>`;
    })
    .join("\n");

  const actionsHtml =
    model.actions.length > 0
      ? `<div class="icp-action-bar">\n` +
        model.actions
          .map((act) => {
            const cls =
              act.intentRole === "approve"
                ? "icp-btn-approve"
                : act.intentRole === "reject"
                  ? "icp-btn-reject"
                  : "icp-btn-secondary";
            return `  <button type="submit" name="icp_action_id" value="${escapeHtml(act.actionId)}" class="${cls}" data-icp-cap-gated="true" data-icp-reaction-type="${escapeHtml(act.reactionType)}">${escapeHtml(act.label)}</button>`;
          })
          .join("\n") +
        `\n</div>`
      : "";

  const formSection =
    formFieldsHtml || actionsHtml
      ? `<form action="#icp-cap-gate" method="POST" aria-labelledby="${headingId}" data-icp-consent-gate="human_prime_required">\n${formFieldsHtml}\n${actionsHtml}\n  <div role="status" aria-live="polite" class="icp-hint" data-icp-gate-status>CAP 1.0 Default-Deny Gate active: 0 side effects executed without Human Prime confirmation.</div>\n</form>`
      : "";

  const html = [
    `<style>${DESKTOP_SCOPED_CSS}</style>`,
    `<article class="icp-adaptive-widget" data-icp-ctx-id="${safeId}" data-icp-target="desktop-web">`,
    `  <h2 id="${headingId}">${escapeHtml(model.headline)}</h2>`,
    `  <p class="icp-source-text">${escapeHtml(model.maskedText)}</p>`,
    pointerHtml,
    tablesHtml,
    formSection,
    `</article>`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    target: "desktop-web",
    ctxId: model.ctxId,
    headline: model.headline,
    html,
    objectPointerCount: model.objectPointers.length,
    actionCount: model.actions.length,
    redactedSecretCount: model.redactedSecretCount,
    sideEffectsExecuted: 0,
  };
}

function renderMobileCompactTarget(model) {
  const approveAction =
    model.actions.find((a) => a.intentRole === "approve") || model.actions[0] || null;
  const rejectAction =
    model.actions.find((a) => a.intentRole === "reject") || model.actions[1] || null;

  const rowSummary =
    model.tables.length > 0
      ? `${model.tables[0].rows.length} item(s) in ${model.tables[0].caption}`
      : null;

  const pointerBadges = model.objectPointers
    .filter((p) => !p.isSecret)
    .slice(0, 3)
    .map((p) => `${p.whatis}: ${p.pointedText}`);

  const safeId = escapeHtml(model.ctxId);
  const primaryButtons = [approveAction, rejectAction]
    .filter(Boolean)
    .map((act) => {
      const roleClass =
        act.intentRole === "reject" ? "icp-mobile-btn-reject" : "icp-mobile-btn-approve";
      return `<button type="submit" name="icp_action_id" value="${escapeHtml(act.actionId)}" class="${roleClass}" data-icp-cap-gated="true">${escapeHtml(act.label)}</button>`;
    })
    .join("\n      ");

  const html = [
    `<section class="icp-mobile-card" data-icp-ctx-id="${safeId}" data-icp-target="mobile-compact" style="font-family: system-ui, sans-serif; max-inline-size: 24rem; border: 1px solid #d0d7de; border-radius: 14px; padding: 1rem; padding-bottom: max(1rem, env(safe-area-inset-bottom, 0px)); overflow-wrap: break-word;">`,
    `  <h3 style="text-wrap: balance; margin: 0 0 0.5rem;">${escapeHtml(model.headline)}</h3>`,
    `  <p style="text-wrap: pretty; margin: 0 0 0.75rem; font-size: 0.95rem;">${escapeHtml(model.maskedText)}</p>`,
    rowSummary
      ? `  <p style="margin: 0 0 0.5rem; font-size: 0.85rem; color: #57606a;">Summary: ${escapeHtml(rowSummary)}</p>`
      : "",
    pointerBadges.length > 0
      ? `  <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.75rem;">${pointerBadges
          .map(
            (b) =>
              `<span style="font-size: 0.8rem; background: #eef4ff; color: #0b3d91; padding: 0.2rem 0.5rem; border-radius: 999px;">${escapeHtml(b)}</span>`
          )
          .join("")}</div>`
      : "",
    primaryButtons
      ? `  <form action="#icp-cap-gate" method="POST" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">\n      ${primaryButtons}\n  </form>`
      : "",
    `</section>`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    target: "mobile-compact",
    ctxId: model.ctxId,
    headline: model.headline,
    summaryText: model.maskedText,
    rowSummary,
    pointerBadges,
    primaryActions: [approveAction, rejectAction]
      .filter(Boolean)
      .map((a) => ({
        actionId: a.actionId,
        label: a.label,
        intentRole: a.intentRole,
        requiresCapConsent: true,
      })),
    html,
    redactedSecretCount: model.redactedSecretCount,
    sideEffectsExecuted: 0,
  };
}

function formatAsciiTable(caption, columns, rows) {
  const allRows = [columns, ...rows];
  const colCount = Math.max(columns.length, ...rows.map((r) => r.length), 0);
  if (colCount === 0) return caption;

  const widths = Array(colCount).fill(0);
  for (const r of allRows) {
    for (let c = 0; c < colCount; c++) {
      const cell = String(r[c] ?? "");
      if (cell.length > widths[c]) widths[c] = cell.length;
    }
  }

  const border = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";
  const renderRow = (r) =>
    "|" +
    widths
      .map((w, idx) => ` ${String(r[idx] ?? "").padEnd(w, " ")} `)
      .join("|") +
    "|";

  const lines = [`[${caption}]`, border];
  if (columns.length > 0) {
    lines.push(renderRow(columns));
    lines.push(border);
  }
  for (const r of rows) {
    lines.push(renderRow(r));
  }
  lines.push(border);
  return lines.join("\n");
}

function renderTerminalCliTarget(model) {
  const lines = [
    `============================================================`,
    `ICP 1.0 (.ctx) :: ${model.headline} [id: ${model.ctxId}]`,
    `============================================================`,
    model.maskedText,
  ];

  if (model.objectPointers.length > 0) {
    lines.push("");
    lines.push("Object Pointers (Cursor-Anchored Semantics):");
    for (const p of model.objectPointers) {
      const signTag = p.signs.length > 0 ? ` {${p.signs.join(",")}}` : "";
      lines.push(`  • [@${p.pointerId} · ${p.whatis}${signTag}] -> "${p.pointedText}"`);
    }
  }

  for (const tbl of model.tables) {
    lines.push("");
    lines.push(formatAsciiTable(tbl.caption, tbl.columns, tbl.rows));
  }

  for (const frm of model.forms) {
    lines.push("");
    lines.push(`Form (${frm.title}):`);
    for (const f of frm.fields) {
      const def = f.defaultValue ? ` (default: ${f.defaultValue})` : "";
      lines.push(`  - ${f.label} [${f.type}${f.required ? ", required" : ""}]${def}`);
    }
  }

  const numberedPrompts = [];
  if (model.actions.length > 0) {
    lines.push("");
    lines.push("CAP-Gated Actions (Requires Human Prime Confirmation):");
    for (const act of model.actions) {
      const line = `[${act.index}] ${act.label} -> (${act.reactionType}: ${act.targetName})`;
      numberedPrompts.push({
        number: act.index,
        actionId: act.actionId,
        prompt: line,
      });
      lines.push(`  ${line}`);
    }
  }

  return {
    target: "terminal-cli",
    ctxId: model.ctxId,
    headline: model.headline,
    output: lines.join("\n"),
    numberedPrompts,
    redactedSecretCount: model.redactedSecretCount,
    sideEffectsExecuted: 0,
  };
}

function renderVoiceAudioTarget(model) {
  const cleanNarrationText = model.maskedText.replaceAll(
    DEFAULT_SECRET_MASK,
    "redacted secret"
  );
  const pointerPhrase =
    model.objectPointers.filter((p) => !p.isSecret).length > 0
      ? `Highlighted items: ${model.objectPointers
          .filter((p) => !p.isSecret)
          .slice(0, 3)
          .map((p) => `${p.pointedText} (${p.whatis})`)
          .join(", ")}.`
      : "";

  const tablePhrase =
    model.tables.length > 0
      ? `Includes table "${model.tables[0].caption}" with ${model.tables[0].rows.length} rows.`
      : "";

  const approveAction = model.actions.find((a) => a.intentRole === "approve") || model.actions[0];
  const rejectAction = model.actions.find((a) => a.intentRole === "reject") || model.actions[1];

  const promptTail = approveAction
    ? rejectAction
      ? `Say "approve" to authorize ${approveAction.label}, or say "reject" to ${rejectAction.label}.`
      : `Say "approve" to authorize ${approveAction.label}, or say "cancel" to abort.`
    : `No external actions require confirmation.`;

  const spokenScript = [cleanNarrationText, pointerPhrase, tablePhrase, promptTail]
    .filter((s) => s && s.trim().length > 0)
    .join(" ");

  const grammar = {
    locale: model.locale,
    singleWordCommands: {
      ...(approveAction
        ? {
            approve: {
              utterances: ["approve", "confirm", "yes"],
              mapsToActionId: approveAction.actionId,
            },
          }
        : {}),
      ...(rejectAction
        ? {
            reject: {
              utterances: ["reject", "deny", "no", "cancel"],
              mapsToActionId: rejectAction.actionId,
            },
          }
        : approveAction
          ? {
              cancel: {
                utterances: ["cancel", "no", "stop"],
                mapsToActionId: null,
              },
            }
          : {}),
      repeat: {
        utterances: ["repeat", "details"],
        mapsToActionId: null,
      },
    },
    jsgf: `#JSGF V1.0;\ngrammar icp_voice_confirm;\npublic <command> = approve | confirm | yes | reject | deny | no | cancel | repeat | details;`,
  };

  return {
    target: "voice-audio",
    ctxId: model.ctxId,
    headline: model.headline,
    spokenScript,
    grammar,
    redactedSecretCount: model.redactedSecretCount,
    sideEffectsExecuted: 0,
  };
}

/**
 * Deterministically render a `.ctx` document to one of the 4 locked adaptive targets:
 * `desktop-web` | `mobile-compact` | `terminal-cli` | `voice-audio`.
 */
export function renderAdaptiveCtx(ctx, target, options = {}) {
  if (!ADAPTIVE_TARGETS.includes(target)) {
    throw new Error(
      `Unsupported ICP adaptive target "${target}"; expected one of ${ADAPTIVE_TARGETS.join(", ")}`
    );
  }
  const model = extractAdaptiveSemanticModel(ctx, options);
  switch (target) {
    case "desktop-web":
      return renderDesktopWebTarget(model);
    case "mobile-compact":
      return renderMobileCompactTarget(model);
    case "terminal-cli":
      return renderTerminalCliTarget(model);
    case "voice-audio":
      return renderVoiceAudioTarget(model);
  }
}

/**
 * Render the exact same `.ctx` payload across all 4 form-factor targets in a single call.
 */
export function renderAllAdaptiveTargets(ctx, options = {}) {
  const model = extractAdaptiveSemanticModel(ctx, options);
  return {
    semanticModel: {
      ctxId: model.ctxId,
      headline: model.headline,
      objectPointerIds: model.objectPointers.map((p) => p.pointerId),
      actionIds: model.actions.map((a) => a.actionId),
      redactedSecretCount: model.redactedSecretCount,
      sideEffectsExecuted: 0,
    },
    targets: {
      "desktop-web": renderDesktopWebTarget(model),
      "mobile-compact": renderMobileCompactTarget(model),
      "terminal-cli": renderTerminalCliTarget(model),
      "voice-audio": renderVoiceAudioTarget(model),
    },
  };
}

/**
 * Route an interactive selection from ANY of the 4 form factors (`actionId`, CLI number `1`,
 * or single-word voice utterance `"approve"` / `"reject"`) through the ICP Default-Deny
 * Reaction Safety Gate (`evaluateReactionGate`).
 *
 * Guarantees zero unapproved side-effect execution: without explicit `consent: { granted: true, actor: "human_prime" }`
 * and verified provenance, returns `allowed: false` (`E_ICP_CONSENT_REQUIRED` / `E_ICP_UNVERIFIED_PROVENANCE`).
 */
export function dispatchAdaptiveAction(ctx, selector, options = {}) {
  const model = extractAdaptiveSemanticModel(ctx, options);
  let matched = null;

  if (typeof selector === "number" || /^\d+$/.test(String(selector))) {
    const num = Number(selector);
    matched = model.actions.find((a) => a.index === num) || null;
  } else if (typeof selector === "string") {
    const trimmed = selector.trim();
    matched = model.actions.find((a) => a.actionId === trimmed) || null;
    if (!matched) {
      const voice = renderVoiceAudioTarget(model);
      const lower = trimmed.toLowerCase();
      for (const entry of Object.values(voice.grammar.singleWordCommands)) {
        if (entry.utterances.includes(lower) && entry.mapsToActionId) {
          matched = model.actions.find((a) => a.actionId === entry.mapsToActionId) || null;
          break;
        }
      }
    }
  }

  if (!matched) {
    return {
      allowed: false,
      decision: "deny",
      code: "E_ICP_ACTION_NOT_FOUND",
      requiresConsent: true,
      capDelegation: null,
    };
  }

  return evaluateReactionGate(matched.reaction, {
    ...options,
    ctxId: model.ctxId,
    annotationId: matched.annotationId,
  });
}

/**
 * Generate a self-contained HTML5 preview page (`icp-render preview --out preview.html`)
 * displaying all 4 adaptive form-factor renderings of a `.ctx` document.
 */
export function renderStandaloneHtmlPreview(ctx, options = {}) {
  const suite = renderAllAdaptiveTargets(ctx, options);
  const desktop = suite.targets["desktop-web"];
  const mobile = suite.targets["mobile-compact"];
  const cli = suite.targets["terminal-cli"];
  const voice = suite.targets["voice-audio"];

  return [
    `<!DOCTYPE html>`,
    `<html lang="${escapeHtml(ctx?.meta?.locale || "en")}">`,
    `<head>`,
    `  <meta charset="utf-8">`,
    `  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`,
    `  <title>ICP 1.0 Adaptive Preview — ${escapeHtml(desktop.headline)}</title>`,
    `  <style>`,
    `    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 1.5rem; background: #f6f8fa; color: #16181d; overflow-wrap: break-word; }`,
    `    header { max-inline-size: 72rem; margin: 0 auto 1.5rem; }`,
    `    h1 { text-wrap: balance; margin: 0 0 0.35rem; }`,
    `    .preview-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr)); gap: 1.25rem; max-inline-size: 72rem; margin: 0 auto; }`,
    `    .preview-pane { background: #ffffff; border: 1px solid #d0d7de; border-radius: 12px; padding: 1rem; }`,
    `    .preview-pane > h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.04em; color: #57606a; margin-top: 0; }`,
    `    pre { background: #0d1117; color: #e6edf3; padding: 1rem; border-radius: 8px; overflow: auto; font-size: 0.82rem; line-height: 1.45; }`,
    `    .icp-mobile-btn-approve { font: inherit; font-weight: 600; min-block-size: 48px; border-radius: 8px; background: #0b57d0; color: #fff; border: 1px solid #0b57d0; cursor: pointer; }`,
    `    .icp-mobile-btn-reject { font: inherit; font-weight: 600; min-block-size: 48px; border-radius: 8px; background: #fff; color: #b3261e; border: 1px solid #b3261e; cursor: pointer; }`,
    `  </style>`,
    `</head>`,
    `<body>`,
    `  <header>`,
    `    <h1>ICP 1.0 Multi-Device Adaptive Degradation Suite</h1>`,
    `    <p>Source <code>.ctx</code> ID: <code>${escapeHtml(desktop.ctxId)}</code> · Redacted secrets: ${desktop.redactedSecretCount} · Unapproved side effects executed: 0</p>`,
    `  </header>`,
    `  <main class="preview-grid">`,
    `    <section class="preview-pane">`,
    `      <h2>1. desktop-web</h2>`,
    desktop.html,
    `    </section>`,
    `    <section class="preview-pane">`,
    `      <h2>2. mobile-compact</h2>`,
    mobile.html,
    `    </section>`,
    `    <section class="preview-pane">`,
    `      <h2>3. terminal-cli</h2>`,
    `      <pre>${escapeHtml(cli.output)}</pre>`,
    `    </section>`,
    `    <section class="preview-pane">`,
    `      <h2>4. voice-audio</h2>`,
    `      <p><strong>Spoken Script:</strong> ${escapeHtml(voice.spokenScript)}</p>`,
    `      <pre>${escapeHtml(JSON.stringify(voice.grammar, null, 2))}</pre>`,
    `    </section>`,
    `  </main>`,
    `  <script type="module">`,
    `    document.addEventListener("submit", (event) => {`,
    `      const form = event.target;`,
    `      if (!(form instanceof HTMLFormElement)) return;`,
    `      event.preventDefault();`,
    `      const submitter = event.submitter;`,
    `      const actionId = submitter && "value" in submitter ? submitter.value : "unknown";`,
    `      const statusNode = form.querySelector("[data-icp-gate-status]");`,
    `      if (statusNode) {`,
    `        statusNode.textContent = "CAP 1.0 Gate intercepted action " + actionId + ": awaiting Human Prime cryptographic confirmation.";`,
    `      }`,
    `    });`,
    `  </script>`,
    `</body>`,
    `</html>`,
  ].join("\n");
}
