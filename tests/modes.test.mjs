import test from "node:test";
import assert from "node:assert/strict";
import {
  computeSha256Checksum,
  verifyChecksum,
  convertMode,
  toStandalone,
  toEmbedded,
  toDetached,
} from "../src/modes.mjs";
import { validateCtx } from "../src/validator.mjs";

test("modes: computes deterministic sha256:<hex> checksum and verifies match/mismatch", () => {
  const content = "Fay 语境注解完整性测试文本";
  const sum = computeSha256Checksum(content);
  assert.match(sum, /^sha256:[0-9a-f]{64}$/);

  const okRes = verifyChecksum(content, sum);
  assert.equal(okRes.ok, true);
  assert.equal(okRes.algorithm, "sha256");

  const mismatchRes = verifyChecksum(content + "!", sum);
  assert.equal(mismatchRes.ok, false);
  assert.equal(mismatchRes.code, "E_ICP_CHECKSUM_MISMATCH");
});

test("modes: supports legacy 32-hex MD5 drift verification while flagging algorithm as md5", () => {
  // MD5("1") = c4ca4238a0b923820dcc509a6f75849b
  const ok = verifyChecksum("1", "c4ca4238a0b923820dcc509a6f75849b");
  assert.equal(ok.ok, true);
  assert.equal(ok.algorithm, "md5");

  const bad = verifyChecksum("2", "c4ca4238a0b923820dcc509a6f75849b");
  assert.equal(bad.ok, false);
  assert.equal(bad.code, "E_ICP_CHECKSUM_MISMATCH");
});

test("modes: lossless standalone -> embedded -> detached -> standalone cycle preserves annotations and vendor extensions", () => {
  const cleanText = "请 张工 在 2025-11-10 前复核 关键架构变更。";
  const standaloneDoc = {
    meta: {
      version: "icp-ctx-file/1.0",
      id: "ctx-mode-cycle",
      created: "2025-10-25T12:00:00Z",
      "acme:channel": "review-board",
    },
    source: {
      mode: "standalone",
      type: "text/markdown",
      content: cleanText,
      checksum: computeSha256Checksum(cleanText),
      filename: "arch-note.md",
    },
    annotations: [
      {
        id: "ann-person",
        whatis: "person",
        anchor: { scope: "coordinate", text: { start: 2, end: 4 } },
      },
      {
        id: "ann-time",
        whatis: "time",
        anchor: { scope: "coordinate", text: { start: 7, end: 17 } },
      },
      {
        id: "ann-warn",
        signs: ["highlight", "warning"],
        "acme:severity": "p1",
        anchor: { scope: "coordinate", text: { start: 22, end: 28 } },
      },
    ],
  };

  const { ctx: embeddedDoc } = toEmbedded(standaloneDoc);
  assert.equal(embeddedDoc.source.mode, "embedded");
  assert.ok(embeddedDoc.source.content.includes("@张工"));
  assert.ok(embeddedDoc.source.content.includes("[2025-11-10]"));
  assert.ok(embeddedDoc.source.content.includes("**!!关键架构变更!!**"));
  assert.equal(validateCtx(embeddedDoc).valid, true);

  const { ctx: detachedDoc, externalContent } = toDetached(embeddedDoc);
  assert.equal(detachedDoc.source.mode, "detached");
  assert.equal(detachedDoc.source.content, undefined);
  assert.equal(externalContent, cleanText);
  assert.equal(verifyChecksum(externalContent, detachedDoc.source.checksum).ok, true);
  assert.equal(validateCtx(detachedDoc).valid, true);

  const { ctx: restoredDoc } = toStandalone(detachedDoc, { externalContent });
  assert.equal(restoredDoc.source.mode, "standalone");
  assert.equal(restoredDoc.source.content, cleanText);
  assert.equal(restoredDoc.meta["acme:channel"], "review-board");
  assert.deepEqual(restoredDoc.annotations, standaloneDoc.annotations);
  assert.equal(validateCtx(restoredDoc).valid, true);
});

test("modes: canonical aliases bundled <-> inline <-> sidecar convert losslessly", () => {
  const inlineDoc = {
    meta: {
      version: "icp-ctx-file/1.0",
      id: "ctx-inline-alias",
      created: "2025-10-25T12:10:00Z",
    },
    source: {
      mode: "inline",
      type: "text/plain",
      content: "提醒：**准时参会**，?是否需要远程接入?",
    },
    annotations: [],
  };

  const { ctx: sidecarDoc, externalContent } = convertMode(inlineDoc, "sidecar");
  assert.equal(sidecarDoc.source.mode, "sidecar");
  assert.equal(externalContent, "提醒：准时参会，是否需要远程接入");
  assert.equal(sidecarDoc.annotations.length, 2);

  const { ctx: bundledDoc } = convertMode(sidecarDoc, "bundled", { externalContent });
  assert.equal(bundledDoc.source.mode, "bundled");
  assert.equal(bundledDoc.source.content, "提醒：准时参会，是否需要远程接入");

  const { ctx: backToInline } = convertMode(bundledDoc, "inline");
  assert.equal(backToInline.source.mode, "inline");
  assert.equal(backToInline.source.content, "提醒：**准时参会**，?是否需要远程接入?");
});

test("modes: rejects converting binary media to inline/embedded with E_ICP_MODE_INCOMPATIBLE", () => {
  const binaryDoc = {
    meta: { version: "1.0", id: "ctx-bin", created: "2025-10-25T12:20:00Z" },
    source: {
      mode: "bundled",
      type: "image/png",
      content: Buffer.from("PNG_BYTES").toString("base64"),
      checksum: computeSha256Checksum(Buffer.from("PNG_BYTES")),
    },
    annotations: [],
  };

  assert.throws(
    () => convertMode(binaryDoc, "embedded"),
    (err) => err.code === "E_ICP_MODE_INCOMPATIBLE"
  );
});

test("modes: rejects detached -> standalone conversion when externalContent checksum mismatches", () => {
  const detachedDoc = {
    meta: { version: "1.0", id: "ctx-tampered", created: "2025-10-25T12:30:00Z" },
    source: {
      mode: "detached",
      type: "text/plain",
      checksum: computeSha256Checksum("original clean text"),
    },
    annotations: [],
  };

  assert.throws(
    () => toStandalone(detachedDoc, { externalContent: "modified external text" }),
    (err) => err.code === "E_ICP_CHECKSUM_MISMATCH"
  );
});

test("modes: rejects detached -> embedded when externalContent is missing", () => {
  const detachedDoc = {
    meta: { version: "1.0", id: "ctx-missing-ext", created: "2025-10-25T12:35:00Z" },
    source: {
      mode: "detached",
      type: "text/plain",
      checksum: computeSha256Checksum("abc"),
    },
    annotations: [],
  };

  assert.throws(
    () => toEmbedded(detachedDoc),
    (err) => err.code === "E_ICP_MISSING_EXTERNAL_CONTENT"
  );
});
