import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ADAPTIVE_TARGETS,
  createSampleExpenseApprovalCtx,
  dispatchAdaptiveAction,
  renderAdaptiveCtx,
  renderAllAdaptiveTargets,
  renderStandaloneHtmlPreview,
  runIcpAdaptiveDemo,
} from "../src/index.mjs";
import { runIcpRenderCli } from "../src/cli.mjs";

test("renders identical semantic fidelity & zero secret leakage across all 4 form-factor targets", () => {
  const ctx = createSampleExpenseApprovalCtx();
  const suite = renderAllAdaptiveTargets(ctx);

  assert.deepEqual(Object.keys(suite.targets), [...ADAPTIVE_TARGETS]);
  assert.equal(suite.semanticModel.sideEffectsExecuted, 0);
  assert.equal(suite.semanticModel.redactedSecretCount, 1);

  const rawSecret = "4532-9910-8841";
  const desktop = suite.targets["desktop-web"];
  const mobile = suite.targets["mobile-compact"];
  const cli = suite.targets["terminal-cli"];
  const voice = suite.targets["voice-audio"];

  // Zero secret leak across all 4 targets
  assert.equal(desktop.html.includes(rawSecret), false);
  assert.equal(mobile.html.includes(rawSecret), false);
  assert.equal(cli.output.includes(rawSecret), false);
  assert.equal(voice.spokenScript.includes(rawSecret), false);

  // Zero unapproved side effects executed during rendering
  for (const t of ADAPTIVE_TARGETS) {
    assert.equal(suite.targets[t].sideEffectsExecuted, 0);
    assert.equal(suite.targets[t].ctxId, ctx.meta.id);
    assert.equal(suite.targets[t].headline, suite.semanticModel.headline);
  }

  // 1. desktop-web checks: accessible region table, object pointer chip, CAP-gated submit buttons, zero inline onclick
  assert.match(desktop.html, /role="region"/);
  assert.match(desktop.html, /class="icp-object-chip"/);
  assert.match(desktop.html, /#EXP-2026-42/);
  assert.match(desktop.html, /data-icp-cap-gated="true"/);
  assert.equal(desktop.html.includes("onclick="), false);

  // 2. mobile-compact checks: summary card + primary Approve & Reject buttons
  assert.equal(mobile.primaryActions.length, 2);
  assert.equal(mobile.primaryActions[0].intentRole, "approve");
  assert.equal(mobile.primaryActions[1].intentRole, "reject");
  assert.match(mobile.html, /safe-area-inset-bottom/);

  // 3. terminal-cli checks: ASCII aligned table + numbered prompts [1] and [2]
  assert.match(cli.output, /\+-+\+-+/);
  assert.match(cli.output, /Edge NPU DevKit x2/);
  assert.equal(cli.numberedPrompts.length, 2);
  assert.match(cli.numberedPrompts[0].prompt, /^\[1\] Approve \$2,140\.00/);
  assert.match(cli.numberedPrompts[1].prompt, /^\[2\] Reject Batch/);

  // 4. voice-audio checks: concise spoken script + single-word grammar
  assert.match(voice.spokenScript, /redacted secret/);
  assert.match(voice.spokenScript, /Say "approve"/);
  assert.deepEqual(voice.grammar.singleWordCommands.approve.utterances, [
    "approve",
    "confirm",
    "yes",
  ]);
  assert.match(voice.grammar.jsgf, /#JSGF V1\.0;/);
});

test("enforces CAP Default-Deny gate identically across desktop actionId, CLI number, and voice utterance", () => {
  const ctx = createSampleExpenseApprovalCtx();
  const suite = renderAllAdaptiveTargets(ctx);
  const approveActionId = suite.semanticModel.actionIds[0];

  // Unconsented invocations from any form factor MUST be denied
  for (const selector of [approveActionId, 1, "approve", "YES"]) {
    const denied = dispatchAdaptiveAction(ctx, selector, {});
    assert.equal(denied.allowed, false);
    assert.equal(denied.code, "E_ICP_CONSENT_REQUIRED");
    assert.equal(denied.capDelegation, null);
  }

  // Non-Human-Prime actor (e.g. autonomous agent spoofing consent) MUST be denied
  const spoofed = dispatchAdaptiveAction(ctx, 1, {
    consent: { granted: true, actor: "rogue_agent" },
    provenance: { verified: true },
  });
  assert.equal(spoofed.allowed, false);
  assert.equal(spoofed.code, "E_ICP_CONSENT_REQUIRED");

  // Explicit Human Prime consent + verified provenance emits identical CAP 1.0 delegation across all 4 endpoints
  const consentOpts = {
    consent: {
      granted: true,
      actor: "human_prime",
      consentId: "c_hp_99",
      singleUse: true,
    },
    provenance: {
      verified: true,
      signerFayId: "ifay_financeguardian23456",
    },
  };

  const fromDesktop = dispatchAdaptiveAction(ctx, approveActionId, consentOpts);
  const fromCli = dispatchAdaptiveAction(ctx, 1, consentOpts);
  const fromVoice = dispatchAdaptiveAction(ctx, "confirm", consentOpts);

  assert.equal(fromDesktop.allowed, true);
  assert.equal(fromDesktop.decision, "delegate_to_cap");
  assert.deepEqual(fromDesktop.capDelegation, fromCli.capDelegation);
  assert.deepEqual(fromDesktop.capDelegation, fromVoice.capDelegation);
  assert.equal(fromVoice.capDelegation.protocol, "cap/1.0");
  assert.equal(fromVoice.capDelegation.params.name, "finance.reimbursement.approve");
});

test("icp-render preview --out preview.html generates standalone HTML5 preview and demo passes", () => {
  const tmp = mkdtempSync(join(tmpdir(), "icp-preview-test-"));
  try {
    const outHtml = join(tmp, "preview.html");
    const exitCode = runIcpRenderCli(["preview", "--out", outHtml]);
    assert.equal(exitCode, 0);

    const html = readFileSync(outHtml, "utf8");
    assert.match(html, /^<!DOCTYPE html>/);
    assert.match(html, /1\. desktop-web/);
    assert.match(html, /2\. mobile-compact/);
    assert.match(html, /3\. terminal-cli/);
    assert.match(html, /4\. voice-audio/);
    assert.equal(html.includes("4532-9910-8841"), false);

    const singleDesktop = renderAdaptiveCtx(createSampleExpenseApprovalCtx(), "desktop-web");
    assert.equal(singleDesktop.target, "desktop-web");

    const demoReport = runIcpAdaptiveDemo({ silent: true });
    assert.equal(demoReport.sideEffectsExecutedDuringRender, 0);
    assert.equal(demoReport.unconsentedGateDecision.allowed, false);
    assert.equal(demoReport.consentedCapDelegation.protocol, "cap/1.0");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
