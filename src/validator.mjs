/**
 * ICP 1.0 (.ctx) Structural & Semantic Validator.
 * Protocol wire identifier: icp-ctx-file/1.0 (Edition 2025-10-25).
 */

export const BUILT_IN_SIGNS = Object.freeze([
  "highlight",
  "warning",
  "question",
  "secret",
]);

export const BUILT_IN_WHATIS = Object.freeze([
  "person",
  "organization",
  "event",
  "time",
  "place",
  "term",
  "object",
  "skill",
  "emotion",
]);

export const BUILT_IN_REACTION_TYPES = Object.freeze([
  "render",
  "url",
  "function",
  "app",
  "command",
]);

export const BUILT_IN_RENDER_COMPONENTS = Object.freeze([
  "checkbox_list",
  "form",
  "highlight_marker",
  "circle_overlay",
  "timeline_card",
  "action_button",
  "data_table",
  "media_preview",
  "text_block",
]);

export const SUPPORTED_MODES = Object.freeze([
  "inline",
  "sidecar",
  "bundled",
  "embedded",
  "detached",
  "standalone",
]);

export const SKILL_BRIDGE_PROTOCOLS = Object.freeze([
  "mcp",
  "google-a2a",
  "openapi",
  "ssp",
]);

const VENDOR_NAMESPACE_RE = /^[a-z0-9-]+:[a-z0-9_]+$/;
const WIRE_VERSION_RE = /^(?:icp-ctx-file\/)?(\d+)\.(\d+)$/;
const MIME_TYPE_RE = /^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/;
const RFC3339_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export function isValidVendorNamespace(value) {
  return typeof value === "string" && VENDOR_NAMESPACE_RE.test(value);
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pushError(errors, code, path, message) {
  errors.push({ code, path, message });
}

function validateExtensibleObjectKeys(obj, allowedKeys, basePath, errors) {
  for (const key of Object.keys(obj)) {
    if (allowedKeys.has(key)) continue;
    if (key.includes(":")) {
      if (!isValidVendorNamespace(key)) {
        pushError(
          errors,
          "E_ICP_INVALID_NAMESPACE",
          `${basePath}.${key}`,
          `Invalid vendor namespace property "${key}"; expected vendor:name`
        );
      }
    } else {
      pushError(
        errors,
        "E_ICP_UNKNOWN_PROPERTY",
        `${basePath}.${key}`,
        `Unrecognized unnamespaced property "${key}"`
      );
    }
  }
}

function validateStrictObjectKeys(
  obj,
  allowedKeys,
  basePath,
  errors,
  code = "E_ICP_UNKNOWN_PROPERTY"
) {
  for (const key of Object.keys(obj)) {
    if (!allowedKeys.has(key)) {
      pushError(
        errors,
        code,
        `${basePath}.${key}`,
        `Unexpected property "${key}" at ${basePath}`
      );
    }
  }
}

function validateImageRect(rect, path, errors) {
  if (!isPlainObject(rect)) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", path, "Image rect must be an object");
    return;
  }
  validateStrictObjectKeys(
    rect,
    new Set(["x", "y", "width", "height"]),
    path,
    errors,
    "E_ICP_INVALID_ANCHOR"
  );
  if (typeof rect.x !== "number" || !Number.isFinite(rect.x) || rect.x < 0) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", `${path}.x`, "Image rect x must be >= 0");
  }
  if (typeof rect.y !== "number" || !Number.isFinite(rect.y) || rect.y < 0) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", `${path}.y`, "Image rect y must be >= 0");
  }
  if (typeof rect.width !== "number" || !Number.isFinite(rect.width) || rect.width <= 0) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", `${path}.width`, "Image rect width must be > 0");
  }
  if (typeof rect.height !== "number" || !Number.isFinite(rect.height) || rect.height <= 0) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", `${path}.height`, "Image rect height must be > 0");
  }
}

function validateImagePolygon(poly, path, errors) {
  if (!isPlainObject(poly)) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", path, "Image polygon must be an object");
    return;
  }
  validateStrictObjectKeys(poly, new Set(["points"]), path, errors, "E_ICP_INVALID_ANCHOR");
  if (!Array.isArray(poly.points) || poly.points.length < 3) {
    pushError(
      errors,
      "E_ICP_INVALID_ANCHOR",
      `${path}.points`,
      "Polygon points must contain at least 3 [x, y] pairs"
    );
    return;
  }
  poly.points.forEach((pt, idx) => {
    if (
      !Array.isArray(pt) ||
      pt.length !== 2 ||
      typeof pt[0] !== "number" ||
      typeof pt[1] !== "number" ||
      pt[0] < 0 ||
      pt[1] < 0
    ) {
      pushError(
        errors,
        "E_ICP_INVALID_ANCHOR",
        `${path}.points[${idx}]`,
        "Polygon point must be [x >= 0, y >= 0]"
      );
    }
  });
}

function validateImageRegion(region, path, errors) {
  if (!isPlainObject(region)) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", path, "Image region must be an object");
    return;
  }
  if (Object.hasOwn(region, "rect")) {
    validateStrictObjectKeys(region, new Set(["rect"]), path, errors, "E_ICP_INVALID_ANCHOR");
    validateImageRect(region.rect, `${path}.rect`, errors);
  } else if (Object.hasOwn(region, "polygon")) {
    validateStrictObjectKeys(region, new Set(["polygon"]), path, errors, "E_ICP_INVALID_ANCHOR");
    validateImagePolygon(region.polygon, `${path}.polygon`, errors);
  } else if (Object.hasOwn(region, "points")) {
    validateImagePolygon(region, path, errors);
  } else {
    validateImageRect(region, path, errors);
  }
}

function validateAnchor(anchor, mediaCategory, path, errors, options = {}) {
  const { checkMediaCompatibility = true, onAnnotationRef } = options;
  if (!isPlainObject(anchor)) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", path, "Anchor must be an object");
    return;
  }
  const scope = anchor.scope;
  if (typeof scope !== "string" || scope.length === 0) {
    pushError(errors, "E_ICP_INVALID_ANCHOR", `${path}.scope`, "Anchor scope is required");
    return;
  }

  switch (scope) {
    case "global": {
      validateStrictObjectKeys(anchor, new Set(["scope"]), path, errors, "E_ICP_INVALID_ANCHOR");
      break;
    }

    case "coordinate": {
      validateStrictObjectKeys(
        anchor,
        new Set(["scope", "text", "image", "video", "audio"]),
        path,
        errors,
        "E_ICP_INVALID_ANCHOR"
      );
      const subTypes = ["text", "image", "video", "audio"].filter(
        (k) => Object.hasOwn(anchor, k) && anchor[k] !== undefined
      );
      if (subTypes.length !== 1) {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          path,
          "Coordinate anchor must specify exactly one of text, image, video, or audio"
        );
        break;
      }
      const sub = subTypes[0];
      if (sub === "text") {
        const tr = anchor.text;
        if (!isPlainObject(tr)) {
          pushError(errors, "E_ICP_INVALID_ANCHOR", `${path}.text`, "Text range must be an object");
        } else {
          validateStrictObjectKeys(
            tr,
            new Set(["start", "end"]),
            `${path}.text`,
            errors,
            "E_ICP_INVALID_ANCHOR"
          );
          if (
            !Number.isInteger(tr.start) ||
            !Number.isInteger(tr.end) ||
            tr.start < 0 ||
            tr.end < 1 ||
            tr.start >= tr.end
          ) {
            pushError(
              errors,
              "E_ICP_INVALID_ANCHOR",
              `${path}.text`,
              "Text coordinate range must satisfy integer 0 <= start < end"
            );
          }
        }
        if (checkMediaCompatibility && mediaCategory && mediaCategory !== "text") {
          pushError(
            errors,
            "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE",
            `${path}.text`,
            `Coordinate text anchor is incompatible with ${mediaCategory}/* media`
          );
        }
      } else if (sub === "image") {
        validateImageRegion(anchor.image, `${path}.image`, errors);
        if (
          checkMediaCompatibility &&
          mediaCategory &&
          mediaCategory !== "image" &&
          mediaCategory !== "video"
        ) {
          pushError(
            errors,
            "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE",
            `${path}.image`,
            `Coordinate image anchor is incompatible with ${mediaCategory}/* media`
          );
        }
      } else if (sub === "video") {
        const vr = anchor.video;
        if (!isPlainObject(vr)) {
          pushError(
            errors,
            "E_ICP_INVALID_ANCHOR",
            `${path}.video`,
            "Video range must be an object"
          );
        } else {
          validateStrictObjectKeys(
            vr,
            new Set(["start", "end", "region"]),
            `${path}.video`,
            errors,
            "E_ICP_INVALID_ANCHOR"
          );
          if (
            typeof vr.start !== "number" ||
            typeof vr.end !== "number" ||
            vr.start < 0 ||
            vr.end < 0 ||
            vr.start > vr.end
          ) {
            pushError(
              errors,
              "E_ICP_INVALID_ANCHOR",
              `${path}.video`,
              "Video coordinate range must satisfy 0 <= start <= end"
            );
          }
          if (vr.region !== undefined) {
            validateImageRegion(vr.region, `${path}.video.region`, errors);
          }
        }
        if (checkMediaCompatibility && mediaCategory && mediaCategory !== "video") {
          pushError(
            errors,
            "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE",
            `${path}.video`,
            `Coordinate video anchor is incompatible with ${mediaCategory}/* media`
          );
        }
      } else if (sub === "audio") {
        const ar = anchor.audio;
        if (!isPlainObject(ar)) {
          pushError(
            errors,
            "E_ICP_INVALID_ANCHOR",
            `${path}.audio`,
            "Audio range must be an object"
          );
        } else {
          validateStrictObjectKeys(
            ar,
            new Set(["start", "end"]),
            `${path}.audio`,
            errors,
            "E_ICP_INVALID_ANCHOR"
          );
          if (
            typeof ar.start !== "number" ||
            typeof ar.end !== "number" ||
            ar.start < 0 ||
            ar.end < 0 ||
            ar.start > ar.end
          ) {
            pushError(
              errors,
              "E_ICP_INVALID_ANCHOR",
              `${path}.audio`,
              "Audio coordinate range must satisfy 0 <= start <= end"
            );
          }
        }
        if (checkMediaCompatibility && mediaCategory && mediaCategory !== "audio") {
          pushError(
            errors,
            "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE",
            `${path}.audio`,
            `Coordinate audio anchor is incompatible with ${mediaCategory}/* media`
          );
        }
      }
      break;
    }

    case "marker": {
      validateStrictObjectKeys(
        anchor,
        new Set(["scope", "name"]),
        path,
        errors,
        "E_ICP_INVALID_ANCHOR"
      );
      if (typeof anchor.name !== "string" || anchor.name.length === 0) {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          `${path}.name`,
          "Marker anchor requires non-empty name"
        );
      }
      if (checkMediaCompatibility && mediaCategory && mediaCategory !== "text") {
        pushError(
          errors,
          "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE",
          path,
          `Marker anchor is incompatible with ${mediaCategory}/* media`
        );
      }
      break;
    }

    case "feature": {
      validateStrictObjectKeys(
        anchor,
        new Set(["scope", "kind", "value", "sample"]),
        path,
        errors,
        "E_ICP_INVALID_ANCHOR"
      );
      if (typeof anchor.kind !== "string" || anchor.kind.length === 0) {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          `${path}.kind`,
          "Feature anchor requires non-empty kind"
        );
      }
      if (typeof anchor.value !== "string" || anchor.value.length === 0) {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          `${path}.value`,
          "Feature anchor requires non-empty value"
        );
      }
      if (anchor.sample !== undefined && typeof anchor.sample !== "string") {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          `${path}.sample`,
          "Feature anchor sample must be a string"
        );
      }
      if (
        checkMediaCompatibility &&
        mediaCategory &&
        mediaCategory !== "image" &&
        mediaCategory !== "video"
      ) {
        pushError(
          errors,
          "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE",
          path,
          `Feature anchor is incompatible with ${mediaCategory}/* media`
        );
      }
      break;
    }

    case "pattern": {
      validateStrictObjectKeys(
        anchor,
        new Set(["scope", "rule", "expression"]),
        path,
        errors,
        "E_ICP_INVALID_ANCHOR"
      );
      if (typeof anchor.rule !== "string" || anchor.rule.length === 0) {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          `${path}.rule`,
          "Pattern anchor requires non-empty rule"
        );
      }
      if (typeof anchor.expression !== "string" || anchor.expression.length === 0) {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          `${path}.expression`,
          "Pattern anchor requires non-empty expression"
        );
      }
      if (checkMediaCompatibility && mediaCategory && mediaCategory !== "text") {
        pushError(
          errors,
          "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE",
          path,
          `Pattern anchor is incompatible with ${mediaCategory}/* media`
        );
      }
      break;
    }

    case "annotation": {
      validateStrictObjectKeys(
        anchor,
        new Set(["scope", "ref"]),
        path,
        errors,
        "E_ICP_INVALID_ANCHOR"
      );
      if (typeof anchor.ref !== "string" || anchor.ref.length === 0) {
        pushError(
          errors,
          "E_ICP_INVALID_ANCHOR",
          `${path}.ref`,
          "Annotation anchor requires non-empty ref"
        );
      } else if (onAnnotationRef) {
        onAnnotationRef(anchor.ref, `${path}.ref`);
      }
      break;
    }

    default:
      pushError(
        errors,
        "E_ICP_INVALID_ANCHOR",
        `${path}.scope`,
        `Unsupported anchor scope "${scope}"`
      );
  }
}

function validateSkillsBridge(list, path, errors) {
  if (!Array.isArray(list)) {
    pushError(errors, "E_ICP_INVALID_FIELD", path, "skills_bridge must be an array");
    return;
  }
  const allowed = new Set(["id", "protocol", "uri", "endpoint", "operation", "description"]);
  list.forEach((entry, idx) => {
    const p = `${path}[${idx}]`;
    if (!isPlainObject(entry)) {
      pushError(errors, "E_ICP_INVALID_FIELD", p, "skills_bridge entry must be an object");
      return;
    }
    validateExtensibleObjectKeys(entry, allowed, p, errors);
    if (!SKILL_BRIDGE_PROTOCOLS.includes(entry.protocol)) {
      pushError(
        errors,
        "E_ICP_INVALID_FIELD",
        `${p}.protocol`,
        `skills_bridge.protocol must be one of ${SKILL_BRIDGE_PROTOCOLS.join(", ")}`
      );
    }
  });
}

function validateConcepts(list, path, errors) {
  if (!Array.isArray(list)) {
    pushError(errors, "E_ICP_INVALID_FIELD", path, "concepts must be an array");
    return;
  }
  const allowed = new Set(["id", "uri", "context_uri", "label"]);
  list.forEach((entry, idx) => {
    const p = `${path}[${idx}]`;
    if (!isPlainObject(entry)) {
      pushError(errors, "E_ICP_INVALID_FIELD", p, "concepts entry must be an object");
      return;
    }
    validateExtensibleObjectKeys(entry, allowed, p, errors);
    if (typeof entry.uri !== "string" || entry.uri.length === 0) {
      pushError(
        errors,
        "E_ICP_MISSING_REQUIRED",
        `${p}.uri`,
        "concepts entry requires non-empty uri"
      );
    }
  });
}

function validateReaction(rx, path, errors) {
  if (!isPlainObject(rx)) {
    pushError(errors, "E_ICP_INVALID_REACTION", path, "Reaction must be an object");
    return;
  }
  validateExtensibleObjectKeys(rx, new Set(["type", "params"]), path, errors);
  if (typeof rx.type !== "string" || rx.type.length === 0) {
    pushError(errors, "E_ICP_MISSING_REQUIRED", `${path}.type`, "Reaction.type is required");
  } else if (!BUILT_IN_REACTION_TYPES.includes(rx.type) && !isValidVendorNamespace(rx.type)) {
    pushError(
      errors,
      "E_ICP_INVALID_NAMESPACE",
      `${path}.type`,
      `Invalid reaction type "${rx.type}"; must be built-in or vendor:name`
    );
  }
  if (!isPlainObject(rx.params)) {
    pushError(
      errors,
      "E_ICP_MISSING_REQUIRED",
      `${path}.params`,
      "Reaction.params object is required"
    );
    return;
  }

  if (rx.type === "render") {
    const comp = rx.params.component;
    if (typeof comp !== "string" || comp.length === 0) {
      pushError(
        errors,
        "E_ICP_MISSING_REQUIRED",
        `${path}.params.component`,
        "render reaction requires params.component"
      );
    } else if (!BUILT_IN_RENDER_COMPONENTS.includes(comp) && !isValidVendorNamespace(comp)) {
      pushError(
        errors,
        "E_ICP_INVALID_NAMESPACE",
        `${path}.params.component`,
        `Invalid render component "${comp}"; must be built-in or vendor:name`
      );
    }
  } else if (rx.type === "url") {
    if (typeof rx.params.url !== "string" || rx.params.url.length === 0) {
      pushError(
        errors,
        "E_ICP_MISSING_REQUIRED",
        `${path}.params.url`,
        "url reaction requires params.url"
      );
    }
  } else if (rx.type === "function") {
    if (typeof rx.params.name !== "string" || rx.params.name.length === 0) {
      pushError(
        errors,
        "E_ICP_MISSING_REQUIRED",
        `${path}.params.name`,
        "function reaction requires params.name"
      );
    }
  } else if (rx.type === "app") {
    if (typeof rx.params.id !== "string" || rx.params.id.length === 0) {
      pushError(
        errors,
        "E_ICP_MISSING_REQUIRED",
        `${path}.params.id`,
        "app reaction requires params.id"
      );
    }
    if (typeof rx.params.action !== "string" || rx.params.action.length === 0) {
      pushError(
        errors,
        "E_ICP_MISSING_REQUIRED",
        `${path}.params.action`,
        "app reaction requires params.action"
      );
    }
  } else if (rx.type === "command") {
    if (typeof rx.params.cmd !== "string" || rx.params.cmd.length === 0) {
      pushError(
        errors,
        "E_ICP_MISSING_REQUIRED",
        `${path}.params.cmd`,
        "command reaction requires params.cmd"
      );
    }
  }
}

export function validateCtx(doc) {
  const errors = [];
  if (!isPlainObject(doc)) {
    pushError(errors, "E_ICP_INVALID_ROOT", "$", "CTX_File root must be a JSON object");
    return { valid: false, errors };
  }

  for (const req of ["meta", "source", "annotations"]) {
    if (!Object.hasOwn(doc, req) || doc[req] === undefined) {
      pushError(errors, "E_ICP_MISSING_REQUIRED", `$.${req}`, `Missing required top-level "${req}"`);
    }
  }

  validateExtensibleObjectKeys(
    doc,
    new Set(["meta", "source", "annotations", "skills_bridge", "concepts"]),
    "$",
    errors
  );

  // 1. Validate meta
  if (doc.meta !== undefined) {
    if (!isPlainObject(doc.meta)) {
      pushError(errors, "E_ICP_INVALID_FIELD", "$.meta", "meta must be an object");
    } else {
      for (const req of ["version", "id", "created"]) {
        if (!Object.hasOwn(doc.meta, req) || doc.meta[req] === undefined) {
          pushError(
            errors,
            "E_ICP_MISSING_REQUIRED",
            `$.meta.${req}`,
            `Missing required meta.${req}`
          );
        }
      }
      validateExtensibleObjectKeys(
        doc.meta,
        new Set(["version", "id", "created", "locale", "schema"]),
        "$.meta",
        errors
      );

      if (doc.meta.version !== undefined) {
        if (typeof doc.meta.version !== "string") {
          pushError(
            errors,
            "E_ICP_VERSION_INCOMPATIBLE",
            "$.meta.version",
            "meta.version must be a two-segment version string"
          );
        } else {
          const m = WIRE_VERSION_RE.exec(doc.meta.version);
          if (!m || Number(m[1]) !== 1) {
            pushError(
              errors,
              "E_ICP_VERSION_INCOMPATIBLE",
              "$.meta.version",
              `Incompatible ICP wire version "${doc.meta.version}"; expected icp-ctx-file/1.x or 1.x`
            );
          }
        }
      }
      if (
        doc.meta.id !== undefined &&
        (typeof doc.meta.id !== "string" || doc.meta.id.length === 0)
      ) {
        pushError(errors, "E_ICP_INVALID_FIELD", "$.meta.id", "meta.id must be a non-empty string");
      }
      if (doc.meta.created !== undefined) {
        if (
          typeof doc.meta.created !== "string" ||
          !RFC3339_RE.test(doc.meta.created) ||
          Number.isNaN(Date.parse(doc.meta.created))
        ) {
          pushError(
            errors,
            "E_ICP_INVALID_FIELD",
            "$.meta.created",
            "meta.created must be a valid RFC 3339 timestamp"
          );
        }
      }
      if (
        doc.meta.locale !== undefined &&
        (typeof doc.meta.locale !== "string" || doc.meta.locale.length < 2)
      ) {
        pushError(
          errors,
          "E_ICP_INVALID_FIELD",
          "$.meta.locale",
          "meta.locale must be a BCP-47 string"
        );
      }
      if (doc.meta.schema !== undefined && typeof doc.meta.schema !== "string") {
        pushError(errors, "E_ICP_INVALID_FIELD", "$.meta.schema", "meta.schema must be a string");
      }
    }
  }

  // 2. Validate source
  let mediaCategory = null;
  if (doc.source !== undefined) {
    if (!isPlainObject(doc.source)) {
      pushError(errors, "E_ICP_INVALID_FIELD", "$.source", "source must be an object");
    } else {
      for (const req of ["mode", "type"]) {
        if (!Object.hasOwn(doc.source, req) || doc.source[req] === undefined) {
          pushError(
            errors,
            "E_ICP_MISSING_REQUIRED",
            `$.source.${req}`,
            `Missing required source.${req}`
          );
        }
      }
      validateExtensibleObjectKeys(
        doc.source,
        new Set(["mode", "type", "checksum", "content", "filename"]),
        "$.source",
        errors
      );

      const mode = doc.source.mode;
      if (mode !== undefined && !SUPPORTED_MODES.includes(mode)) {
        pushError(
          errors,
          "E_ICP_INVALID_MODE",
          "$.source.mode",
          `Unsupported source.mode "${mode}"`
        );
      }

      if (doc.source.type !== undefined) {
        if (typeof doc.source.type !== "string" || !MIME_TYPE_RE.test(doc.source.type)) {
          pushError(
            errors,
            "E_ICP_INVALID_MEDIA_TYPE",
            "$.source.type",
            `Invalid MIME type "${doc.source.type}"`
          );
        } else {
          mediaCategory = doc.source.type.split("/")[0].toLowerCase();
        }
      }

      if (mode === "sidecar" || mode === "detached") {
        if (typeof doc.source.checksum !== "string" || doc.source.checksum.length === 0) {
          pushError(
            errors,
            "E_ICP_MODE_CONSTRAINT",
            "$.source.checksum",
            `source.checksum is required when source.mode is "${mode}"`
          );
        }
        if (doc.source.content !== undefined) {
          pushError(
            errors,
            "E_ICP_MODE_CONSTRAINT",
            "$.source.content",
            `source.content is forbidden when source.mode is "${mode}"`
          );
        }
      } else if (mode === "inline" || mode === "embedded") {
        if (typeof doc.source.content !== "string") {
          pushError(
            errors,
            "E_ICP_MODE_CONSTRAINT",
            "$.source.content",
            `source.content string is required when source.mode is "${mode}"`
          );
        }
        if (mediaCategory && mediaCategory !== "text") {
          pushError(
            errors,
            "E_ICP_MODE_CONSTRAINT",
            "$.source.type",
            `source.mode "${mode}" only supports text/* media types`
          );
        }
      } else if (mode === "bundled" || mode === "standalone") {
        if (typeof doc.source.content !== "string") {
          pushError(
            errors,
            "E_ICP_MODE_CONSTRAINT",
            "$.source.content",
            `source.content string is required when source.mode is "${mode}"`
          );
        }
      }
    }
  }

  // 3. Optional top-level skills_bridge & concepts
  if (doc.skills_bridge !== undefined) {
    validateSkillsBridge(doc.skills_bridge, "$.skills_bridge", errors);
  }
  if (doc.concepts !== undefined) {
    validateConcepts(doc.concepts, "$.concepts", errors);
  }

  // 4. Validate annotations + collect reference graph
  if (doc.annotations !== undefined) {
    if (!Array.isArray(doc.annotations)) {
      pushError(errors, "E_ICP_INVALID_FIELD", "$.annotations", "annotations must be an array");
    } else {
      const knownIds = new Set();
      doc.annotations.forEach((ann, idx) => {
        if (isPlainObject(ann) && typeof ann.id === "string" && ann.id.length > 0) {
          if (knownIds.has(ann.id)) {
            pushError(
              errors,
              "E_ICP_DUPLICATE_ID",
              `$.annotations[${idx}].id`,
              `Duplicate annotation id "${ann.id}"`
            );
          }
          knownIds.add(ann.id);
        }
      });

      const edges = new Map();
      const pendingRefs = [];

      doc.annotations.forEach((ann, idx) => {
        const annPath = `$.annotations[${idx}]`;
        if (!isPlainObject(ann)) {
          pushError(errors, "E_ICP_INVALID_FIELD", annPath, "Annotation must be an object");
          return;
        }
        const nodeId =
          typeof ann.id === "string" && ann.id.length > 0 ? ann.id : `__anon_${idx}`;
        if (!edges.has(nodeId)) edges.set(nodeId, []);

        validateExtensibleObjectKeys(
          ann,
          new Set(["id", "signs", "whatis", "anchor", "context"]),
          annPath,
          errors
        );

        if (ann.id !== undefined && (typeof ann.id !== "string" || ann.id.length === 0)) {
          pushError(
            errors,
            "E_ICP_INVALID_FIELD",
            `${annPath}.id`,
            "Annotation id must be non-empty"
          );
        }

        if (ann.signs !== undefined) {
          if (!Array.isArray(ann.signs) || ann.signs.length === 0) {
            pushError(
              errors,
              "E_ICP_INVALID_FIELD",
              `${annPath}.signs`,
              "Annotation signs must be a non-empty array when present"
            );
          } else {
            ann.signs.forEach((s, sIdx) => {
              if (
                typeof s !== "string" ||
                (!BUILT_IN_SIGNS.includes(s) && !isValidVendorNamespace(s))
              ) {
                pushError(
                  errors,
                  "E_ICP_INVALID_NAMESPACE",
                  `${annPath}.signs[${sIdx}]`,
                  `Invalid sign "${s}"; must be one of [${BUILT_IN_SIGNS.join(", ")}] or vendor:name`
                );
              }
            });
          }
        }

        if (ann.whatis !== undefined) {
          if (
            typeof ann.whatis !== "string" ||
            (!BUILT_IN_WHATIS.includes(ann.whatis) && !isValidVendorNamespace(ann.whatis))
          ) {
            pushError(
              errors,
              "E_ICP_INVALID_NAMESPACE",
              `${annPath}.whatis`,
              `Invalid whatis "${ann.whatis}"; must be one of [${BUILT_IN_WHATIS.join(", ")}] or vendor:name`
            );
          }
        }

        const recordRef = (targetRef, refPath) => {
          pendingRefs.push({ from: nodeId, to: targetRef, path: refPath });
        };

        if (!Object.hasOwn(ann, "anchor") || ann.anchor === undefined || ann.anchor === null) {
          pushError(
            errors,
            "E_ICP_MISSING_ANCHOR",
            `${annPath}.anchor`,
            "Annotation anchor is required"
          );
        } else {
          validateAnchor(ann.anchor, mediaCategory, `${annPath}.anchor`, errors, {
            checkMediaCompatibility: true,
            onAnnotationRef: recordRef,
          });
        }

        if (ann.context !== undefined) {
          const ctxPath = `${annPath}.context`;
          if (!isPlainObject(ann.context)) {
            pushError(
              errors,
              "E_ICP_INVALID_FIELD",
              ctxPath,
              "Annotation context must be an object"
            );
          } else {
            validateExtensibleObjectKeys(
              ann.context,
              new Set([
                "participants",
                "memory",
                "situation",
                "subtext",
                "culture",
                "references",
                "reactions",
                "skills_bridge",
                "concepts",
              ]),
              ctxPath,
              errors
            );

            if (ann.context.participants !== undefined) {
              if (!Array.isArray(ann.context.participants)) {
                pushError(
                  errors,
                  "E_ICP_INVALID_FIELD",
                  `${ctxPath}.participants`,
                  "context.participants must be an array"
                );
              } else {
                ann.context.participants.forEach((pItem, pIdx) => {
                  const pPath = `${ctxPath}.participants[${pIdx}]`;
                  if (typeof pItem === "string") return;
                  if (isPlainObject(pItem) && typeof pItem.scope === "string") {
                    validateAnchor(pItem, mediaCategory, pPath, errors, {
                      checkMediaCompatibility: false,
                      onAnnotationRef: recordRef,
                    });
                  } else if (isPlainObject(pItem)) {
                    validateExtensibleObjectKeys(
                      pItem,
                      new Set(["id", "role", "name"]),
                      pPath,
                      errors
                    );
                    if (typeof pItem.id !== "string" || pItem.id.length === 0) {
                      pushError(
                        errors,
                        "E_ICP_MISSING_REQUIRED",
                        `${pPath}.id`,
                        "Participant.id is required"
                      );
                    }
                    if (typeof pItem.role !== "string" || pItem.role.length === 0) {
                      pushError(
                        errors,
                        "E_ICP_MISSING_REQUIRED",
                        `${pPath}.role`,
                        "Participant.role is required"
                      );
                    }
                    if (pItem.name !== undefined && typeof pItem.name !== "string") {
                      pushError(
                        errors,
                        "E_ICP_INVALID_FIELD",
                        `${pPath}.name`,
                        "Participant.name must be a string"
                      );
                    }
                  } else {
                    pushError(
                      errors,
                      "E_ICP_INVALID_FIELD",
                      pPath,
                      "Participant item must be string, Anchor, or Participant object"
                    );
                  }
                });
              }
            }

            for (const ctxField of ["memory", "situation", "subtext", "culture", "references"]) {
              const arr = ann.context[ctxField];
              if (arr === undefined) continue;
              if (!Array.isArray(arr)) {
                pushError(
                  errors,
                  "E_ICP_INVALID_FIELD",
                  `${ctxPath}.${ctxField}`,
                  `context.${ctxField} must be an array`
                );
                continue;
              }
              arr.forEach((val, vIdx) => {
                const vPath = `${ctxPath}.${ctxField}[${vIdx}]`;
                if (typeof val === "string") return;
                if (isPlainObject(val)) {
                  validateAnchor(val, mediaCategory, vPath, errors, {
                    checkMediaCompatibility: false,
                    onAnnotationRef: recordRef,
                  });
                } else {
                  pushError(
                    errors,
                    "E_ICP_INVALID_FIELD",
                    vPath,
                    `context.${ctxField} entry must be a string or Anchor`
                  );
                }
              });
            }

            if (ann.context.reactions !== undefined) {
              if (!Array.isArray(ann.context.reactions)) {
                pushError(
                  errors,
                  "E_ICP_INVALID_FIELD",
                  `${ctxPath}.reactions`,
                  "context.reactions must be an array"
                );
              } else {
                ann.context.reactions.forEach((rx, rIdx) => {
                  validateReaction(rx, `${ctxPath}.reactions[${rIdx}]`, errors);
                });
              }
            }

            if (ann.context.skills_bridge !== undefined) {
              validateSkillsBridge(ann.context.skills_bridge, `${ctxPath}.skills_bridge`, errors);
            }
            if (ann.context.concepts !== undefined) {
              validateConcepts(ann.context.concepts, `${ctxPath}.concepts`, errors);
            }
          }
        }
      });

      // Validate dangling annotation references & build DAG adjacency
      for (const refItem of pendingRefs) {
        if (!knownIds.has(refItem.to)) {
          pushError(
            errors,
            "E_ICP_ANCHOR_REF_NOT_FOUND",
            refItem.path,
            `Annotation reference "${refItem.to}" does not match any Annotation.id in this document`
          );
        } else {
          edges.get(refItem.from).push(refItem);
        }
      }

      // 3-color DFS directed cycle detection
      const state = new Map(); // 0 = unvisited, 1 = visiting, 2 = visited
      let cycleReported = false;
      const dfs = (u, stack) => {
        state.set(u, 1);
        const neighbors = edges.get(u) || [];
        for (const edge of neighbors) {
          const v = edge.to;
          const vState = state.get(v) || 0;
          if (vState === 1) {
            if (!cycleReported) {
              cycleReported = true;
              const cycleChain = [...stack, u, v].join(" -> ");
              pushError(
                errors,
                "E_ICP_ANCHOR_CYCLE",
                edge.path,
                `Directed annotation reference cycle detected: ${cycleChain}`
              );
            }
          } else if (vState === 0) {
            dfs(v, [...stack, u]);
          }
        }
        state.set(u, 2);
      };

      for (const node of edges.keys()) {
        if ((state.get(node) || 0) === 0) {
          dfs(node, []);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
