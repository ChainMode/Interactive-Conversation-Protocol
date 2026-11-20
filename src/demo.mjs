/**
 * Canonical `.ctx` Demo Fixture & E2E Runner for `icp-adaptive`.
 */

import {
  dispatchAdaptiveAction,
  renderAllAdaptiveTargets,
  renderStandaloneHtmlPreview,
} from "./adaptive.mjs";

export function createSampleExpenseApprovalCtx() {
  const content =
    "Q4 Hardware & Cloud Expense Batch #EXP-2026-42 totaling $2,140.00 submitted by Lin Wei ( Corporate Card: 4532-9910-8841 ) requires Human Prime CAP authorization.";
  const secretSpan = "4532-9910-8841";
  const secretStart = content.indexOf(secretSpan);
  const secretEnd = secretStart + secretSpan.length;

  const batchSpan = "#EXP-2026-42";
  const batchStart = content.indexOf(batchSpan);
  const batchEnd = batchStart + batchSpan.length;

  return {
    meta: {
      version: "icp-ctx-file/1.0",
      id: "ctx_expense_approval_2026_42",
      created: "2026-11-20T16:00:00Z",
      locale: "en-US",
    },
    source: {
      mode: "bundled",
      type: "text/plain",
      content,
    },
    concepts: [
      {
        id: "concept_cap_expense",
        uri: "https://ifay.ai/concepts/cap-expense-approval",
        label: "Expense Approval #EXP-2026-42 ($2,140.00)",
      },
    ],
    annotations: [
      {
        id: "ann_card_secret",
        anchor: {
          scope: "coordinate",
          text: { start: secretStart, end: secretEnd },
        },
        signs: ["secret"],
        context: {
          situation: ["Corporate settlement card span masked by default"],
        },
      },
      {
        id: "ann_batch_pointer",
        anchor: {
          scope: "coordinate",
          text: { start: batchStart, end: batchEnd },
        },
        signs: ["highlight"],
        whatis: "object",
        context: {
          situation: ["Pointed expense batch solving the cursor-missing effect"],
          reactions: [
            {
              type: "render",
              params: {
                component: "data_table",
                caption: "Expense Line Items (#EXP-2026-42)",
                columns: ["Item", "Category", "Amount", "Host Policy"],
                rows: [
                  ["Edge NPU DevKit x2", "Hardware", "$1,280.00", "Within Cap"],
                  ["GPU Fine-Tuning Cluster", "Cloud Compute", "$860.00", "Requires CAP"],
                ],
              },
            },
          ],
        },
      },
      {
        id: "ann_cap_form",
        anchor: { scope: "global" },
        whatis: "event",
        context: {
          situation: ["Audit note & cost center confirmation"],
          reactions: [
            {
              type: "render",
              params: {
                component: "form",
                title: "CAP Cost-Center Verification",
                fields: [
                  {
                    name: "cost_center",
                    label: "Cost Center Code",
                    type: "text",
                    required: true,
                    default: "CC-RND-04",
                    help: "Format: CC-DEPT-NN",
                  },
                ],
              },
            },
          ],
        },
      },
      {
        id: "ann_approve_action",
        anchor: { scope: "annotation", ref: "ann_batch_pointer" },
        whatis: "skill",
        context: {
          subtext: ["Approve expense batch via CAP 1.0"],
          reactions: [
            {
              type: "render",
              params: {
                component: "action_button",
                label: "Approve $2,140.00",
              },
            },
            {
              type: "function",
              params: {
                name: "finance.reimbursement.approve",
                batch_id: "EXP-2026-42",
                amount_usd: 2140,
              },
            },
          ],
        },
      },
      {
        id: "ann_reject_action",
        anchor: { scope: "annotation", ref: "ann_batch_pointer" },
        whatis: "skill",
        context: {
          subtext: ["Reject expense batch"],
          reactions: [
            {
              type: "render",
              params: {
                component: "action_button",
                label: "Reject Batch",
              },
            },
            {
              type: "function",
              params: {
                name: "finance.reimbursement.reject",
                batch_id: "EXP-2026-42",
              },
            },
          ],
        },
      },
    ],
  };
}

export function runIcpAdaptiveDemo(options = {}) {
  const ctx = createSampleExpenseApprovalCtx();
  const rendered = renderAllAdaptiveTargets(ctx);
  const previewHtml = renderStandaloneHtmlPreview(ctx);

  // Verify Default-Deny without Human Prime consent
  const unconsentedAttempt = dispatchAdaptiveAction(ctx, "approve", {});

  // Verify CAP 1.0 Delegation Envelope on explicit Human Prime consent
  const consentedVoiceApproval = dispatchAdaptiveAction(ctx, "approve", {
    consent: {
      granted: true,
      actor: "human_prime",
      consentId: "consent_hp_demo_01",
      singleUse: true,
    },
    provenance: {
      verified: true,
      signerFayId: "ifay_demoauditor234567",
    },
  });

  const report = {
    ctxId: rendered.semanticModel.ctxId,
    headline: rendered.semanticModel.headline,
    targetsRendered: Object.keys(rendered.targets),
    redactedSecretCount: rendered.semanticModel.redactedSecretCount,
    sideEffectsExecutedDuringRender: rendered.semanticModel.sideEffectsExecuted,
    standalonePreviewHtmlBytes: Buffer.byteLength(previewHtml, "utf8"),
    terminalCliPreview: rendered.targets["terminal-cli"].output,
    voiceSpokenScript: rendered.targets["voice-audio"].spokenScript,
    unconsentedGateDecision: {
      allowed: unconsentedAttempt.allowed,
      code: unconsentedAttempt.code,
    },
    consentedCapDelegation: consentedVoiceApproval.capDelegation,
  };

  if (!options.silent) {
    console.log("=== ICP 1.0 Multi-Device Adaptive Renderer Demo ===");
    console.log(rendered.targets["terminal-cli"].output);
    console.log("\n[Voice Spoken Script]:", rendered.targets["voice-audio"].spokenScript);
    console.log(
      "\n[Gate Summary]:",
      JSON.stringify(
        {
          targetsRendered: report.targetsRendered,
          sideEffectsExecutedDuringRender: report.sideEffectsExecutedDuringRender,
          unconsentedGateDecision: report.unconsentedGateDecision,
          consentedCapIntent: report.consentedCapDelegation?.intent,
        },
        null,
        2
      )
    );
  }

  return report;
}
