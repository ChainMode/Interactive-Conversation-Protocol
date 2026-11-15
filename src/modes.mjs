/**
 * ICP 1.0 Packaging Mode Converter & Checksum Integrity Verifier.
 * Supports canonical modes:
 *   - inline / embedded
 *   - sidecar / detached
 *   - bundled / standalone
 */

import crypto from "node:crypto";
import { parseInline, printInline } from "./inline.mjs";
import { SUPPORTED_MODES } from "./validator.mjs";

function makeModeError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

function toBytes(content) {
  if (Buffer.isBuffer(content)) return content;
  if (content instanceof Uint8Array) return Buffer.from(content);
  return Buffer.from(String(content ?? ""), "utf8");
}

export function computeSha256Checksum(content) {
  const hex = crypto.createHash("sha256").update(toBytes(content)).digest("hex");
  return `sha256:${hex}`;
}

export function verifyChecksum(content, expectedChecksum) {
  if (typeof expectedChecksum !== "string" || expectedChecksum.length === 0) {
    return {
      ok: false,
      algorithm: "unknown",
      code: "E_ICP_CHECKSUM_MISMATCH",
    };
  }

  const buf = toBytes(content);
  const normalizedExpected = expectedChecksum.trim().toLowerCase();

  if (normalizedExpected.startsWith("sha256:")) {
    const hex = normalizedExpected.slice("sha256:".length);
    if (!/^[0-9a-f]{64}$/.test(hex)) {
      return {
        ok: false,
        algorithm: "sha256",
        code: "E_ICP_CHECKSUM_MISMATCH",
      };
    }
    const actual = `sha256:${crypto.createHash("sha256").update(buf).digest("hex")}`;
    return actual === normalizedExpected
      ? { ok: true, algorithm: "sha256", actual }
      : {
          ok: false,
          algorithm: "sha256",
          code: "E_ICP_CHECKSUM_MISMATCH",
          expected: expectedChecksum,
          actual,
        };
  }

  if (/^[0-9a-f]{64}$/.test(normalizedExpected)) {
    const actual = crypto.createHash("sha256").update(buf).digest("hex");
    return actual === normalizedExpected
      ? { ok: true, algorithm: "sha256", actual }
      : {
          ok: false,
          algorithm: "sha256",
          code: "E_ICP_CHECKSUM_MISMATCH",
          expected: expectedChecksum,
          actual,
        };
  }

  if (/^[0-9a-f]{32}$/.test(normalizedExpected)) {
    const actual = crypto.createHash("md5").update(buf).digest("hex");
    return actual === normalizedExpected
      ? { ok: true, algorithm: "md5", actual }
      : {
          ok: false,
          algorithm: "md5",
          code: "E_ICP_CHECKSUM_MISMATCH",
          expected: expectedChecksum,
          actual,
        };
  }

  return {
    ok: false,
    algorithm: "unknown",
    code: "E_ICP_CHECKSUM_MISMATCH",
  };
}

function anchorSignature(anchor) {
  if (!anchor || typeof anchor !== "object") return "";
  if (anchor.scope === "coordinate" && anchor.text) {
    return `coord:text:${anchor.text.start}:${anchor.text.end}`;
  }
  if (anchor.scope === "marker") {
    return `marker:${anchor.name}`;
  }
  return JSON.stringify(anchor);
}

function mergeAnnotationsPreservingMetadata(existingAnnotations, parsedAnnotations) {
  if (!Array.isArray(existingAnnotations) || existingAnnotations.length === 0) {
    return structuredClone(parsedAnnotations);
  }
  const cloned = structuredClone(existingAnnotations);
  const existingSigs = new Set(cloned.map((a) => anchorSignature(a.anchor)));
  for (const pAnn of parsedAnnotations) {
    const sig = anchorSignature(pAnn.anchor);
    if (!existingSigs.has(sig)) {
      cloned.push(structuredClone(pAnn));
      existingSigs.add(sig);
    }
  }
  return cloned;
}

export function convertMode(ctx, targetMode, options = {}) {
  if (!SUPPORTED_MODES.includes(targetMode)) {
    throw makeModeError("E_ICP_INVALID_MODE", `Unsupported target mode "${targetMode}"`);
  }

  const sourceMode = ctx?.source?.mode;
  const mediaType = String(ctx?.source?.type || "");
  const isTextMedia = mediaType.startsWith("text/");
  const targetIsInline = targetMode === "inline" || targetMode === "embedded";
  const targetIsSidecar = targetMode === "sidecar" || targetMode === "detached";

  if (targetIsInline && !isTextMedia) {
    throw makeModeError(
      "E_ICP_MODE_INCOMPATIBLE",
      `Cannot convert binary media "${mediaType}" to ${targetMode} mode`
    );
  }

  const next = structuredClone(ctx);
  let cleanContent = null;
  let markerOffsets = [];

  if (sourceMode === "inline" || sourceMode === "embedded") {
    const parsed = parseInline(next.source.content || "");
    cleanContent = parsed.cleanText;
    markerOffsets = parsed.markerOffsets;
    next.annotations = mergeAnnotationsPreservingMetadata(next.annotations, parsed.annotations);
  } else if (sourceMode === "sidecar" || sourceMode === "detached") {
    if (targetIsSidecar) {
      if (options.externalContent !== undefined && next.source.checksum) {
        const chk = verifyChecksum(options.externalContent, next.source.checksum);
        if (!chk.ok) {
          throw makeModeError(
            "E_ICP_CHECKSUM_MISMATCH",
            "External content checksum does not match detached/sidecar source.checksum"
          );
        }
      }
      next.source.mode = targetMode;
      delete next.source.content;
      return { ctx: next, externalContent: options.externalContent };
    }

    if (options.externalContent === undefined || options.externalContent === null) {
      throw makeModeError(
        "E_ICP_MISSING_EXTERNAL_CONTENT",
        `externalContent is required to convert from ${sourceMode} to ${targetMode}`
      );
    }
    if (next.source.checksum) {
      const chk = verifyChecksum(options.externalContent, next.source.checksum);
      if (!chk.ok) {
        throw makeModeError(
          "E_ICP_CHECKSUM_MISMATCH",
          "External content checksum does not match detached/sidecar source.checksum"
        );
      }
    }
    cleanContent =
      typeof options.externalContent === "string"
        ? options.externalContent
        : Buffer.from(options.externalContent).toString(isTextMedia ? "utf8" : "base64");
  } else if (sourceMode === "bundled" || sourceMode === "standalone") {
    cleanContent = next.source.content ?? "";
  } else {
    throw makeModeError("E_ICP_INVALID_MODE", `Unsupported source mode "${sourceMode}"`);
  }

  const rawIntegrityBytes = isTextMedia
    ? Buffer.from(String(cleanContent), "utf8")
    : Buffer.from(String(cleanContent), "base64");

  if (targetIsInline) {
    next.source.mode = targetMode;
    next.source.content = printInline({
      cleanText: String(cleanContent),
      annotations: next.annotations,
      markerOffsets,
    });
    next.source.checksum = computeSha256Checksum(rawIntegrityBytes);
    return { ctx: next };
  }

  if (targetIsSidecar) {
    next.source.mode = targetMode;
    next.source.checksum = next.source.checksum || computeSha256Checksum(rawIntegrityBytes);
    // Recompute SHA-256 against clean content if converting from inline/embedded where content was modified
    if (sourceMode === "inline" || sourceMode === "embedded" || !next.source.checksum) {
      next.source.checksum = computeSha256Checksum(rawIntegrityBytes);
    }
    delete next.source.content;
    return {
      ctx: next,
      externalContent: isTextMedia ? String(cleanContent) : rawIntegrityBytes,
    };
  }

  // target is standalone or bundled
  next.source.mode = targetMode;
  next.source.content = String(cleanContent);
  if (!next.source.checksum) {
    next.source.checksum = computeSha256Checksum(rawIntegrityBytes);
  }
  return { ctx: next };
}

export function toStandalone(ctx, options = {}) {
  return convertMode(ctx, "standalone", options);
}

export function toBundled(ctx, options = {}) {
  return convertMode(ctx, "bundled", options);
}

export function toEmbedded(ctx, options = {}) {
  return convertMode(ctx, "embedded", options);
}

export function toInline(ctx, options = {}) {
  return convertMode(ctx, "inline", options);
}

export function toDetached(ctx, options = {}) {
  return convertMode(ctx, "detached", options);
}

export function toSidecar(ctx, options = {}) {
  return convertMode(ctx, "sidecar", options);
}
