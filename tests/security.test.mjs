import test from "node:test";
import assert from "node:assert/strict";
import {
  maskSecretsForDisplay,
  serializeForAuditLog,
  evaluateReactionGate,
  evaluateReactionChain,
  sanitizeReactionParams,
} from "../src/security.mjs";

test("security: maskSecretsForDisplay masks secret spans by default and allows explicit per-id reveal", () => {
  const ctx = {
    meta: { version: "icp-ctx-file/1.0", id: "ctx-sec-1", created: "2025-10-25T10:00:00Z" },
    source: {
      mode: "standalone",
      type: "text/plain",
      content: "账号 alice，临时口令 secret-code-9988，请妥善保管。",
    },
    annotations: [
      {
        id: "ann-pass",
        signs: ["secret", "warning"],
        anchor: { scope: "coordinate", text: { start: 14, end: 30 } },
      },
    ],
  };

  const masked = maskSecretsForDisplay(ctx);
  assert.equal(masked.maskedText, "账号 alice，临时口令 ••••••••，请妥善保管。");
  assert.ok(!masked.maskedText.includes("secret-code-9988"));
  assert.deepEqual(masked.redactedIds, ["ann-pass"]);

  const revealed = maskSecretsForDisplay(ctx, { revealedIds: ["ann-pass"] });
  assert.equal(revealed.maskedText, ctx.source.content);
});

test("security: serializeForAuditLog never leaks secret spans or secret inline markers", () => {
  const inlineCtx = {
    meta: { version: "icp-ctx-file/1.0", id: "ctx-sec-inline", created: "2025-10-25T10:00:00Z" },
    source: {
      mode: "embedded",
      type: "text/markdown",
      content: "公开摘要 **正常可见**，私密备注 ~private-phrase-xyz~。",
    },
    annotations: [
      { signs: ["highlight"], anchor: { scope: "coordinate", text: { start: 5, end: 9 } } },
      {
        id: "ann-priv",
        signs: ["secret"],
        anchor: { scope: "coordinate", text: { start: 15, end: 33 } },
        context: { subtext: ["包含 private-phrase-xyz 的上下文说明"] },
      },
    ],
  };

  const auditJson = serializeForAuditLog(inlineCtx);
  assert.equal(typeof auditJson, "string");
  assert.ok(!auditJson.includes("private-phrase-xyz"));
  const parsedAudit = JSON.parse(auditJson);
  assert.equal(parsedAudit.redactedSecretCount, 1);
});

test("security: pure render Reaction is allowed without Human Prime consent", () => {
  const res = evaluateReactionGate({
    type: "render",
    params: { component: "highlight_marker", color: "#FFD700" },
  });
  assert.equal(res.allowed, true);
  assert.equal(res.decision, "allow");
  assert.equal(res.requiresConsent, false);
  assert.equal(res.capDelegation, null);
});

test("security: blocks unconsented url, function, app, and command Reactions even if in preset allowlist", () => {
  for (const reaction of [
    { type: "url", params: { url: "https://example.org" } },
    { type: "function", params: { name: "ring_bell" } },
    { type: "app", params: { id: "com.example.notes", action: "open" } },
    { type: "command", params: { cmd: "ls -la" } },
  ]) {
    const res = evaluateReactionGate(reaction, {
      inPresetAllowlist: true,
      provenance: { verified: true, signerFayId: "ifay_signer_1" },
    });
    assert.equal(res.allowed, false, `expected ${reaction.type} to be blocked without consent`);
    assert.equal(res.code, "E_ICP_CONSENT_REQUIRED");
  }
});

test("security: enforces Default-Deny on unverified provenance and forbids persistent override", () => {
  const rx = { type: "function", params: { name: "sync_calendar" } };

  const checksumOnly = evaluateReactionGate(rx, {
    checksumVerified: true,
    provenance: { verified: false },
    consent: { granted: true, actor: "human_prime", singleUse: true },
  });
  assert.equal(checksumOnly.allowed, false);
  assert.equal(checksumOnly.code, "E_ICP_UNVERIFIED_PROVENANCE");

  const persistentOverride = evaluateReactionGate(rx, {
    provenance: { verified: false },
    consent: {
      granted: true,
      actor: "human_prime",
      allowUnverifiedProvenance: true,
      persistent: true,
    },
  });
  assert.equal(persistentOverride.allowed, false);
  assert.equal(persistentOverride.code, "E_ICP_PERSISTENT_UNVERIFIED_CONSENT_FORBIDDEN");

  const singleUseOverride = evaluateReactionGate(rx, {
    provenance: { verified: false },
    consent: {
      granted: true,
      actor: "human_prime",
      allowUnverifiedProvenance: true,
      singleUse: true,
    },
  });
  assert.equal(singleUseOverride.allowed, true);
  assert.equal(singleUseOverride.decision, "delegate_to_cap");
});

test("security: emits CAP 1.0 delegation envelope for function, app, command, and cross-device target_device", () => {
  const cmdRes = evaluateReactionGate(
    { type: "command", params: { cmd: "open https://example.org" } },
    {
      ctxId: "ctx-100",
      annotationId: "ann-cmd",
      environment: "production",
      commandAllowlist: ["open https://example.org"],
      provenance: { verified: true, signerFayId: "ifay_alice" },
      consent: { granted: true, actor: "human_prime", consentId: "c-1", singleUse: true },
    }
  );
  assert.equal(cmdRes.allowed, true);
  assert.equal(cmdRes.decision, "delegate_to_cap");
  assert.equal(cmdRes.capDelegation.protocol, "cap/1.0");
  assert.equal(cmdRes.capDelegation.reaction_type, "command");

  const prodBlockedCmd = evaluateReactionGate(
    { type: "command", params: { cmd: "rm -rf /tmp/something" } },
    {
      environment: "production",
      provenance: { verified: true, signerFayId: "ifay_alice" },
      consent: { granted: true, actor: "human_prime", consentId: "c-2", singleUse: true },
    }
  );
  assert.equal(prodBlockedCmd.allowed, false);
  assert.equal(prodBlockedCmd.code, "E_ICP_COMMAND_NOT_ALLOWLISTED");
});

test("security: blocks javascript: URL injection and allows https: URL with explicit Human Prime consent", () => {
  const badUrl = evaluateReactionGate(
    { type: "url", params: { url: "javascript:alert(1)" } },
    {
      provenance: { verified: true, signerFayId: "ifay_alice" },
      consent: { granted: true, actor: "human_prime", singleUse: true },
    }
  );
  assert.equal(badUrl.allowed, false);
  assert.equal(badUrl.code, "E_ICP_UNSAFE_URL");

  const goodUrl = evaluateReactionGate(
    { type: "url", params: { url: "https://ifay.ai/zh-CN/docs" } },
    {
      provenance: { verified: true, signerFayId: "ifay_alice" },
      consent: { granted: true, actor: "human_prime", singleUse: true },
    }
  );
  assert.equal(goodUrl.allowed, true);
  assert.equal(goodUrl.decision, "allow");
});

test("security: evaluateReactionChain evaluates per-item consent independently and sanitizes XSS params", () => {
  const chain = [
    { type: "render", params: { component: "text_block", text: "<script>alert(1)</script>" } },
    { type: "app", params: { id: "com.calendar", action: "create_event" } },
    { type: "function", params: { name: "notify_team" } },
  ];

  const chainResult = evaluateReactionChain(chain, {
    provenance: { verified: true, signerFayId: "ifay_alice" },
    perReactionConsents: {
      1: { granted: false },
      2: { granted: true, actor: "human_prime", consentId: "c-idx-2", singleUse: true },
    },
  });

  assert.equal(chainResult.results[0].allowed, true);
  assert.equal(chainResult.results[1].allowed, false);
  assert.equal(chainResult.results[2].allowed, true);
  assert.equal(chainResult.results[2].decision, "delegate_to_cap");
  assert.equal(chainResult.auditLog.length, 1);

  const sanitized = sanitizeReactionParams(chain[0]);
  assert.ok(!sanitized.params.text.includes("<script>"));
  assert.ok(sanitized.params.text.includes("&lt;script&gt;"));
});
