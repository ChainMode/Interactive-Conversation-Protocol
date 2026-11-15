import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateCtx,
  verifyChecksum,
  convertMode,
  parseInline,
  printInline,
  maskSecretsForDisplay,
  serializeForAuditLog,
  evaluateReactionGate,
  renderComponentModel,
  degradeToPlainText,
} from "../src/index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const suitePath = path.resolve(__dirname, "../vectors/icp-1.0-conformance.json");
const suite = JSON.parse(fs.readFileSync(suitePath, "utf8"));

test("conformance suite metadata: contains >= 16 vectors targeting icp-ctx-file/1.0", () => {
  assert.equal(suite.suite, "icp-ctx-file/1.0");
  assert.equal(suite.edition, "2025-10-25");
  assert.ok(Array.isArray(suite.vectors));
  assert.ok(suite.vectors.length >= 16, `expected >= 16 vectors, got ${suite.vectors.length}`);
});

for (const vec of suite.vectors) {
  test(`conformance vector ${vec.id} (${vec.category}): ${vec.description}`, () => {
    switch (vec.category) {
      case "validation":
      case "version_check":
      case "cycle_detection": {
        const res = validateCtx(vec.input.ctx);
        assert.equal(res.valid, vec.expected.valid, JSON.stringify(res.errors));
        if (vec.expected.errorCodes) {
          const actualCodes = new Set(res.errors.map((e) => e.code));
          for (const expectedCode of vec.expected.errorCodes) {
            assert.ok(
              actualCodes.has(expectedCode),
              `expected ${expectedCode} in ${JSON.stringify(res.errors)}`
            );
          }
        }
        break;
      }

      case "validation_and_checksum":
      case "checksum_mismatch": {
        const res = validateCtx(vec.input.ctx);
        assert.equal(res.valid, vec.expected.valid);
        const chk = verifyChecksum(vec.input.externalContent, vec.input.ctx.source.checksum);
        assert.equal(chk.ok, vec.expected.checksumOk);
        if (vec.expected.errorCode) {
          assert.equal(chk.code, vec.expected.errorCode);
        }
        break;
      }

      case "secret_masking": {
        const masked = maskSecretsForDisplay(vec.input.ctx);
        assert.equal(masked.maskedText, vec.expected.maskedText);
        const audit = serializeForAuditLog(vec.input.ctx);
        assert.ok(!audit.includes(vec.expected.auditMustNotContain));
        break;
      }

      case "reaction_gate": {
        const gate = evaluateReactionGate(vec.input.reaction, vec.input.options);
        assert.equal(gate.allowed, vec.expected.allowed);
        if (vec.expected.code) {
          assert.equal(gate.code, vec.expected.code);
        }
        if (vec.expected.decision) {
          assert.equal(gate.decision, vec.expected.decision);
        }
        if (vec.expected.capProtocol) {
          assert.equal(gate.capDelegation?.protocol, vec.expected.capProtocol);
        }
        break;
      }

      case "extension_preservation": {
        const res = validateCtx(vec.input.ctx);
        assert.equal(res.valid, vec.expected.valid);
        const { ctx: embedded } = convertMode(vec.input.ctx, "embedded");
        const { ctx: detached, externalContent } = convertMode(embedded, "detached");
        const { ctx: restored } = convertMode(detached, "standalone", { externalContent });
        assert.equal(restored.meta[vec.expected.preservedVendorField], "trace-99");
        assert.ok(restored.annotations[0].signs.includes(vec.expected.preservedVendorSign));
        assert.equal(restored.annotations[0]["acme:priority"], 2);
        break;
      }

      case "inline_roundtrip": {
        const p1 = parseInline(vec.input.inlineText);
        assert.equal(p1.cleanText, vec.expected.cleanText);
        const printed = printInline(p1);
        const p2 = parseInline(printed);
        assert.equal(p2.cleanText, p1.cleanText);
        assert.deepEqual(p2.annotations, p1.annotations);
        break;
      }

      case "terminal_degradation": {
        const comp = renderComponentModel(vec.input.renderReaction);
        assert.equal(comp.degraded, vec.expected.degraded);
        assert.equal(comp.component, vec.expected.fallbackComponent);
        const plain = degradeToPlainText(vec.input.ctx);
        assert.equal(plain, vec.expected.plainText);
        break;
      }

      default:
        assert.fail(`Unhandled vector category: ${vec.category}`);
    }
  });
}
