import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateCtx, isValidVendorNamespace } from "../src/validator.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function baseCtx(overrides = {}) {
  return {
    meta: {
      version: "icp-ctx-file/1.0",
      id: "ctx-test-001",
      created: "2025-10-25T10:00:00Z",
    },
    source: {
      mode: "standalone",
      type: "text/markdown",
      content: "测试文档内容：用于校验器单元测试。",
    },
    annotations: [],
    ...overrides,
  };
}

test("validator: accepts canonical 'icp-ctx-file/1.0', shorthand '1.0', and same-major '1.2'", () => {
  for (const version of ["icp-ctx-file/1.0", "1.0", "icp-ctx-file/1.2", "1.2"]) {
    const res = validateCtx(
      baseCtx({
        meta: { version, id: `ctx-${version}`, created: "2025-10-25T10:00:00Z" },
      })
    );
    assert.equal(res.valid, true, `expected ${version} to be valid`);
    assert.equal(res.errors.length, 0);
  }
});

test("validator: rejects major != 1 and three-segment versions with E_ICP_VERSION_INCOMPATIBLE", () => {
  for (const badVersion of ["icp-ctx-file/2.0", "2.0", "0.9", "1.0.0", "icp-ctx-file/2025-10-25"]) {
    const res = validateCtx(
      baseCtx({
        meta: { version: badVersion, id: "ctx-bad-ver", created: "2025-10-25T10:00:00Z" },
      })
    );
    assert.equal(res.valid, false, `expected ${badVersion} to be rejected`);
    assert.ok(
      res.errors.some((e) => e.code === "E_ICP_VERSION_INCOMPATIBLE"),
      `missing E_ICP_VERSION_INCOMPATIBLE for ${badVersion}: ${JSON.stringify(res.errors)}`
    );
  }
});

test("validator: locks meta.created and source.type (OQ-3) and rejects missing top-level sections", () => {
  const missingSections = validateCtx({ meta: { version: "1.0", id: "x", created: "2025-10-25T00:00:00Z" } });
  assert.equal(missingSections.valid, false);
  assert.equal(missingSections.errors.filter((e) => e.code === "E_ICP_MISSING_REQUIRED").length, 2);

  const legacyNames = validateCtx({
    meta: { version: "1.0", id: "x", created_at: "2025-10-25T00:00:00Z" },
    source: { mode: "standalone", media_type: "text/plain", content: "abc" },
    annotations: [],
  });
  assert.equal(legacyNames.valid, false);
  const codes = new Set(legacyNames.errors.map((e) => e.code));
  assert.ok(codes.has("E_ICP_MISSING_REQUIRED"));
  assert.ok(codes.has("E_ICP_UNKNOWN_PROPERTY"));
});

test("validator: validates all 6 Anchor scopes and coordinate range bounds", () => {
  const validDoc = baseCtx({
    annotations: [
      { id: "a1", anchor: { scope: "global" } },
      { id: "a2", anchor: { scope: "coordinate", text: { start: 0, end: 4 } } },
      { id: "a3", anchor: { scope: "marker", name: "intro" } },
      { id: "a4", anchor: { scope: "pattern", rule: "regex", expression: "测试+" } },
      { id: "a5", anchor: { scope: "annotation", ref: "a2" } },
    ],
  });
  assert.equal(validateCtx(validDoc).valid, true);

  const validImageDoc = baseCtx({
    source: { mode: "sidecar", type: "image/png", checksum: "sha256:" + "a".repeat(64) },
    annotations: [
      { anchor: { scope: "feature", kind: "face", value: "张工" } },
      { anchor: { scope: "coordinate", image: { x: 0, y: 0, width: 50, height: 40 } } },
      { anchor: { scope: "coordinate", image: { polygon: { points: [[0, 0], [10, 0], [5, 10]] } } } },
    ],
  });
  assert.equal(validateCtx(validImageDoc).valid, true);

  const badRange = baseCtx({
    annotations: [
      { anchor: { scope: "coordinate", text: { start: 8, end: 4 } } },
      { anchor: { scope: "coordinate", text: { start: 0, end: 2 }, audio: { start: 0, end: 1 } } },
    ],
  });
  const badRes = validateCtx(badRange);
  assert.equal(badRes.valid, false);
  assert.ok(badRes.errors.length >= 2);
});

test("validator: enforces anchor-media compatibility matrix and aggregates multiple distinct errors", () => {
  const res = validateCtx({
    meta: { version: "icp-ctx-file/1.0", id: "ctx-matrix", created: "2025-10-25T10:00:00Z" },
    source: { mode: "sidecar", type: "audio/mp3", checksum: "sha256:" + "b".repeat(64) },
    annotations: [
      { id: "no-anchor", signs: ["highlight"] },
      { id: "bad-pattern-on-audio", anchor: { scope: "pattern", rule: "regex", expression: "x" } },
      { id: "bad-text-coord-on-audio", anchor: { scope: "coordinate", text: { start: 0, end: 5 } } },
    ],
  });
  assert.equal(res.valid, false);
  assert.ok(res.errors.some((e) => e.code === "E_ICP_MISSING_ANCHOR"));
  assert.equal(
    res.errors.filter((e) => e.code === "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE").length,
    2
  );

  const textWithFeature = validateCtx(
    baseCtx({
      annotations: [{ anchor: { scope: "feature", kind: "face", value: "person-1" } }],
    })
  );
  assert.equal(textWithFeature.valid, false);
  assert.ok(textWithFeature.errors.some((e) => e.code === "E_ICP_ANCHOR_MEDIA_INCOMPATIBLE"));
});

test("validator: detects self, 2-node, and context-reference cycles with E_ICP_ANCHOR_CYCLE (OQ-8)", () => {
  const selfCycle = validateCtx(
    baseCtx({
      annotations: [{ id: "self", anchor: { scope: "annotation", ref: "self" } }],
    })
  );
  assert.equal(selfCycle.valid, false);
  assert.ok(selfCycle.errors.some((e) => e.code === "E_ICP_ANCHOR_CYCLE"));

  const threeNodeContextCycle = validateCtx(
    baseCtx({
      annotations: [
        {
          id: "n1",
          anchor: { scope: "global" },
          context: { memory: [{ scope: "annotation", ref: "n2" }] },
        },
        {
          id: "n2",
          anchor: { scope: "annotation", ref: "n3" },
        },
        {
          id: "n3",
          anchor: { scope: "global" },
          context: { references: [{ scope: "annotation", ref: "n1" }] },
        },
      ],
    })
  );
  assert.equal(threeNodeContextCycle.valid, false);
  assert.ok(threeNodeContextCycle.errors.some((e) => e.code === "E_ICP_ANCHOR_CYCLE"));

  const danglingRef = validateCtx(
    baseCtx({
      annotations: [{ id: "n1", anchor: { scope: "annotation", ref: "missing-id" } }],
    })
  );
  assert.equal(danglingRef.valid, false);
  assert.ok(danglingRef.errors.some((e) => e.code === "E_ICP_ANCHOR_REF_NOT_FOUND"));
});

test("validator: supports skills_bridge, concepts, and harmonized Participant | ContextValue (OQ-2, OQ-9)", () => {
  const doc = baseCtx({
    skills_bridge: [
      { id: "mcp-weather", protocol: "mcp", uri: "mcp://weather/forecast" },
      { id: "a2a-consult", protocol: "google-a2a", endpoint: "https://agent.example.org/a2a" },
      { id: "rest-order", protocol: "openapi", uri: "https://api.example.org/openapi.json" },
      { id: "ssp-translate", protocol: "ssp", uri: "https://skills.example.org/.well-known/skill-sharing" },
    ],
    concepts: [{ id: "c1", uri: "https://schema.org/Action", label: "Action" }],
    annotations: [
      {
        id: "ann-1",
        anchor: { scope: "global" },
        context: {
          participants: [
            { id: "ifay_001", role: "initiator", name: "陈工" },
            "外部观察员",
            { scope: "marker", name: "speaker-1" },
          ],
        },
      },
    ],
  });
  const res = validateCtx(doc);
  assert.equal(res.valid, true, JSON.stringify(res.errors));
});

test("validator: enforces vendor:name namespace grammar and freezes built-in signs/whatis (OQ-4)", () => {
  assert.equal(isValidVendorNamespace("acme-corp:custom_sign_1"), true);
  assert.equal(isValidVendorNamespace("BadVendor:sign"), false);
  assert.equal(isValidVendorNamespace("acme:bad-dash"), false);
  assert.equal(isValidVendorNamespace(":empty"), false);
  assert.equal(isValidVendorNamespace("a:b:c"), false);

  const rejectedDraftSign = validateCtx(
    baseCtx({
      annotations: [{ signs: ["mask", "todo"], anchor: { scope: "global" } }],
    })
  );
  assert.equal(rejectedDraftSign.valid, false);
  assert.ok(rejectedDraftSign.errors.some((e) => e.code === "E_ICP_INVALID_NAMESPACE"));
});

test("validator: schemas/icp-1.0.json and schema/2025-10-25/schema.json are synced and self-contained", () => {
  const s1 = fs.readFileSync(path.join(repoRoot, "schemas/icp-1.0.json"), "utf8");
  const s2 = fs.readFileSync(path.join(repoRoot, "schema/2025-10-25/schema.json"), "utf8");
  assert.equal(s1, s2);
  const parsed = JSON.parse(s1);
  assert.equal(parsed.$id, "icp://schemas/ctx-file/1.0");
  const refs = [...s1.matchAll(/"\$ref"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length > 0);
  for (const ref of refs) {
    assert.ok(ref.startsWith("#/$defs/"), `external ref forbidden: ${ref}`);
    const defName = ref.slice("#/$defs/".length);
    assert.ok(Object.hasOwn(parsed.$defs, defName), `missing $defs.${defName}`);
  }
});

test("validator: all full CTX_File JSON examples in §12 of zh-CN specification pass validateCtx", () => {
  const specMd = fs.readFileSync(
    path.join(repoRoot, "docs/zh-CN/specification/2025-10-25/index.md"),
    "utf8"
  );
  const sec12 = specMd.slice(specMd.indexOf("## 12. 示例文档"), specMd.indexOf("## 附录 A"));
  const blocks = [...sec12.matchAll(/```json\n([\s\S]*?)```/g)].map((m) => JSON.parse(m[1]));
  assert.equal(blocks.length, 8);
  for (const example of blocks) {
    const res = validateCtx(example);
    assert.equal(res.valid, true, `example ${example.meta?.id} failed: ${JSON.stringify(res.errors)}`);
  }
});
