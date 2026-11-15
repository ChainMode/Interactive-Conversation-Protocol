/**
 * ICP 1.0 Security Module:
 * - Secret span masking & zero-leak audit serialization
 * - Reaction parameter XSS sanitization
 * - Default-Deny Reaction Safety Gate & CAP 1.0 Delegation Envelope emitter
 */

import { parseInline } from "./inline.mjs";

export const DEFAULT_SECRET_MASK = "••••••••";

function escapeHtmlString(str) {
  return String(str)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeValue(val) {
  if (typeof val === "string") return escapeHtmlString(val);
  if (Array.isArray(val)) return val.map(sanitizeValue);
  if (val && typeof val === "object") {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = sanitizeValue(v);
    }
    return out;
  }
  return val;
}

export function sanitizeReactionParams(reaction) {
  if (!reaction || typeof reaction !== "object") return reaction;
  return {
    ...reaction,
    params: sanitizeValue(reaction.params || {}),
  };
}

function extractSecretSpans(ctx, externalContent) {
  const mode = ctx?.source?.mode;
  let baseText = "";
  const spanMap = new Map(); // key "start:end" -> { start, end, id }
  let nonCoordSecretCount = 0;

  if (mode === "inline" || mode === "embedded") {
    const parsed = parseInline(ctx?.source?.content || "");
    baseText = parsed.cleanText;
    for (const pAnn of parsed.annotations) {
      if (pAnn.signs?.includes("secret") && pAnn.anchor?.scope === "coordinate" && pAnn.anchor.text) {
        const { start, end } = pAnn.anchor.text;
        spanMap.set(`${start}:${end}`, { start, end, id: pAnn.id || null });
      }
    }
  } else if (mode === "sidecar" || mode === "detached") {
    baseText = typeof externalContent === "string" ? externalContent : "";
  } else {
    baseText = typeof ctx?.source?.content === "string" ? ctx.source.content : "";
  }

  for (const ann of ctx?.annotations || []) {
    if (!ann?.signs?.includes("secret")) continue;
    if (ann.anchor?.scope === "coordinate" && ann.anchor.text) {
      const { start, end } = ann.anchor.text;
      const key = `${start}:${end}`;
      const prev = spanMap.get(key);
      spanMap.set(key, {
        start,
        end,
        id: ann.id || prev?.id || null,
      });
    } else {
      nonCoordSecretCount += 1;
    }
  }

  return {
    baseText,
    spans: [...spanMap.values()].sort((a, b) => a.start - b.start || a.end - b.end),
    nonCoordSecretCount,
  };
}

export function maskSecretsForDisplay(ctx, options = {}) {
  const mask = options.mask ?? DEFAULT_SECRET_MASK;
  const revealedSet = new Set(options.revealedIds || []);
  const { baseText, spans, nonCoordSecretCount } = extractSecretSpans(
    ctx,
    options.externalContent
  );

  const activeSpans = spans.filter((sp) => !(sp.id && revealedSet.has(sp.id)));
  const redactedIds = activeSpans.map((sp) => sp.id).filter(Boolean);
  const secretValues = [];

  // Merge overlapping spans before slicing
  const mergedRanges = [];
  for (const sp of activeSpans) {
    const s = Math.max(0, Math.min(sp.start, baseText.length));
    const e = Math.max(0, Math.min(sp.end, baseText.length));
    if (e <= s) continue;
    secretValues.push(baseText.slice(s, e));
    if (mergedRanges.length > 0 && s <= mergedRanges[mergedRanges.length - 1].end) {
      mergedRanges[mergedRanges.length - 1].end = Math.max(
        mergedRanges[mergedRanges.length - 1].end,
        e
      );
    } else {
      mergedRanges.push({ start: s, end: e });
    }
  }

  let maskedText = baseText;
  for (let i = mergedRanges.length - 1; i >= 0; i--) {
    const { start, end } = mergedRanges[i];
    maskedText = maskedText.slice(0, start) + mask + maskedText.slice(end);
  }

  return {
    maskedText,
    redactedIds,
    redactedSecretCount: activeSpans.length + nonCoordSecretCount,
    _secretValues: secretValues,
  };
}

function scrubSecretsDeep(value, secretValues, mask) {
  if (typeof value === "string") {
    let out = value;
    for (const secret of secretValues) {
      if (secret && secret.length > 0) {
        out = out.replaceAll(secret, mask);
      }
    }
    return out;
  }
  if (Array.isArray(value)) {
    return value.map((v) => scrubSecretsDeep(v, secretValues, mask));
  }
  if (value && typeof value === "object") {
    const res = {};
    for (const [k, v] of Object.entries(value)) {
      res[k] = scrubSecretsDeep(v, secretValues, mask);
    }
    return res;
  }
  return value;
}

export function serializeForAuditLog(ctx, options = {}) {
  const mask = options.mask ?? DEFAULT_SECRET_MASK;
  const maskedInfo = maskSecretsForDisplay(ctx, {
    mask,
    revealedIds: [],
    externalContent: options.externalContent,
  });

  const clone = structuredClone(ctx);
  if (clone?.source && typeof clone.source.content === "string") {
    clone.source.content = maskedInfo.maskedText;
  }

  // Redact context strings on secret-signed annotations and scrub extracted secret values everywhere
  if (Array.isArray(clone?.annotations)) {
    clone.annotations = clone.annotations.map((ann) => {
      if (!ann?.signs?.includes("secret")) return ann;
      const sanitizedAnn = { ...ann };
      if (sanitizedAnn.context) {
        sanitizedAnn.context = scrubSecretsDeep(
          sanitizedAnn.context,
          maskedInfo._secretValues,
          mask
        );
      }
      return sanitizedAnn;
    });
  }

  const scrubbedDoc = scrubSecretsDeep(clone, maskedInfo._secretValues, mask);
  const auditRecord = {
    ...scrubbedDoc,
    redactedSecretCount: maskedInfo.redactedSecretCount,
    redactedIds: maskedInfo.redactedIds,
  };

  return JSON.stringify(auditRecord);
}

function isSafeHttpUrl(urlStr) {
  if (typeof urlStr !== "string" || urlStr.trim().length === 0) return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function evaluateReactionGate(reaction, options = {}) {
  if (!reaction || typeof reaction !== "object" || typeof reaction.type !== "string") {
    return {
      allowed: false,
      decision: "deny",
      code: "E_ICP_INVALID_REACTION",
      requiresConsent: true,
      capDelegation: null,
    };
  }

  const sanitizedReaction = sanitizeReactionParams(reaction);
  const targetDevice = reaction.params?.target_device || reaction.params?.device || null;
  const isCrossDevice =
    Boolean(targetDevice) &&
    (!options.localDeviceId || targetDevice !== options.localDeviceId);

  // 1. Pure UI render reaction without cross-device target is allowed without consent
  if (reaction.type === "render" && !isCrossDevice) {
    return {
      allowed: true,
      decision: "allow",
      requiresConsent: false,
      capDelegation: null,
      sanitizedReaction,
    };
  }

  // 2. All side-effect / external / cross-device reactions require explicit Human Prime consent
  // Note: preset function tables or allowlists NEVER exempt consent (ADR 0001 / close-reaction-consent-asymmetry).
  const consent = options.consent;
  if (
    !consent ||
    consent.granted !== true ||
    (consent.actor !== undefined && consent.actor !== "human_prime")
  ) {
    return {
      allowed: false,
      decision: "deny",
      code: "E_ICP_CONSENT_REQUIRED",
      requiresConsent: true,
      capDelegation: null,
    };
  }

  // 3. Provenance verification: checksum != provenance; unverified .ctx is Default-Deny
  const provenanceVerified = options.provenance?.verified === true;
  if (!provenanceVerified) {
    if (consent.allowUnverifiedProvenance === true) {
      if (consent.persistent === true) {
        return {
          allowed: false,
          decision: "deny",
          code: "E_ICP_PERSISTENT_UNVERIFIED_CONSENT_FORBIDDEN",
          requiresConsent: true,
          capDelegation: null,
        };
      }
      if (consent.singleUse !== true) {
        return {
          allowed: false,
          decision: "deny",
          code: "E_ICP_UNVERIFIED_PROVENANCE",
          requiresConsent: true,
          capDelegation: null,
        };
      }
    } else {
      return {
        allowed: false,
        decision: "deny",
        code: "E_ICP_UNVERIFIED_PROVENANCE",
        requiresConsent: true,
        capDelegation: null,
      };
    }
  }

  // 4. Reaction-type specific safety checks
  if (reaction.type === "url") {
    if (!isSafeHttpUrl(reaction.params?.url)) {
      return {
        allowed: false,
        decision: "deny",
        code: "E_ICP_UNSAFE_URL",
        requiresConsent: true,
        capDelegation: null,
      };
    }
  }

  if (reaction.type === "command") {
    if (options.environment === "production") {
      const allowlist = Array.isArray(options.commandAllowlist) ? options.commandAllowlist : [];
      if (!allowlist.includes(reaction.params?.cmd)) {
        return {
          allowed: false,
          decision: "deny",
          code: "E_ICP_COMMAND_NOT_ALLOWLISTED",
          requiresConsent: true,
          capDelegation: null,
        };
      }
    }
  }

  // 5. Cross-device target Human Prime consent check
  if (isCrossDevice) {
    const tc = consent.targetDeviceConsent;
    if (
      !tc ||
      tc.granted !== true ||
      (tc.actor !== undefined && tc.actor !== "human_prime") ||
      (tc.deviceId !== undefined && tc.deviceId !== targetDevice)
    ) {
      return {
        allowed: false,
        decision: "deny",
        code: "E_ICP_TARGET_DEVICE_CONSENT_REQUIRED",
        requiresConsent: true,
        capDelegation: null,
      };
    }
  }

  // 6. Pure URL navigation (non-cross-device) executes locally after Human Prime consent
  if (reaction.type === "url" && !isCrossDevice) {
    return {
      allowed: true,
      decision: "allow",
      requiresConsent: true,
      capDelegation: null,
      sanitizedReaction,
    };
  }

  // 7. System side-effect & cross-device reactions delegate to CAP 1.0
  const capDelegation = {
    protocol: "cap/1.0",
    intent: "icp.reaction.execute",
    ctx_id: options.ctxId || null,
    annotation_id: options.annotationId || null,
    reaction_type: reaction.type,
    target:
      targetDevice ||
      reaction.params?.id ||
      reaction.params?.name ||
      reaction.params?.cmd ||
      "local_host",
    params: sanitizedReaction.params,
    initiator_consent: {
      actor: consent.actor || "human_prime",
      consent_id: consent.consentId || null,
      single_use: Boolean(consent.singleUse),
    },
    target_device_consent: isCrossDevice
      ? {
          actor: consent.targetDeviceConsent.actor || "human_prime",
          device_id: targetDevice,
          consent_id: consent.targetDeviceConsent.consentId || null,
        }
      : null,
    provenance_verified: provenanceVerified,
    signer_fay_id: options.provenance?.signerFayId || null,
  };

  return {
    allowed: true,
    decision: "delegate_to_cap",
    requiresConsent: true,
    capDelegation,
    sanitizedReaction,
  };
}

export function evaluateReactionChain(reactions, options = {}) {
  const list = Array.isArray(reactions) ? reactions : [];
  const results = [];
  const auditLog = [];

  list.forEach((rx, index) => {
    const itemConsent =
      options.perReactionConsents && Object.hasOwn(options.perReactionConsents, index)
        ? options.perReactionConsents[index]
        : options.consent;

    const gateRes = evaluateReactionGate(rx, {
      ...options,
      consent: itemConsent,
    });
    results.push(gateRes);

    if (!gateRes.allowed) {
      auditLog.push({
        index,
        type: rx?.type || "unknown",
        code: gateRes.code,
        decision: gateRes.decision,
        reason: "skipped_unconsented_or_denied",
      });
    }
  });

  return {
    results,
    auditLog,
  };
}
