import test from "node:test";
import assert from "node:assert/strict";
import {
  BUILT_IN_RENDER_COMPONENTS,
  renderComponentModel,
  degradeToPlainText,
  renderTerminalDocument,
} from "../src/degrade.mjs";

test("degrade: renders all 9 built-in render components without fallback degradation", () => {
  assert.equal(BUILT_IN_RENDER_COMPONENTS.length, 9);

  const samples = [
    { component: "checkbox_list", items: ["任务A", "任务B"] },
    { component: "form", fields: [{ name: "score", type: "number", label: "评分" }] },
    { component: "highlight_marker", color: "#FFD700" },
    { component: "circle_overlay", cx: 100, cy: 120, radius: 40 },
    { component: "timeline_card", title: "立项评审", time: "10:00" },
    { component: "action_button", label: "提交", action: "submit_form" },
    { component: "data_table", columns: ["模块", "状态"], rows: [["ICP", "Final"]] },
    { component: "media_preview", src: "https://example.org/demo.png", alt: "示意图" },
    { component: "text_block", text: "基础文本块" },
  ];

  for (const params of samples) {
    const model = renderComponentModel({ type: "render", params });
    assert.equal(model.degraded, false, `expected ${params.component} not to degrade`);
    assert.equal(model.component, params.component);
    assert.ok(model.plainText.length > 0);
  }
});

test("degrade: unknown custom vendor component degrades to text_block and emits warning", () => {
  const model = renderComponentModel({
    type: "render",
    params: {
      component: "acme:kanban_board",
      title: "迭代冲刺看板",
      items: ["待办", "进行中", "已完成"],
    },
  });

  assert.equal(model.degraded, true);
  assert.equal(model.component, "text_block");
  assert.equal(model.originalComponent, "acme:kanban_board");
  assert.ok(model.props.text.includes("迭代冲刺看板"));
  assert.equal(model.warnings.length, 1);
  assert.equal(model.warnings[0].code, "W_ICP_COMPONENT_DEGRADED");
});

test("degrade: partial-capability terminal degrades unsupported built-in component to text_block", () => {
  const model = renderComponentModel(
    {
      type: "render",
      params: {
        component: "data_table",
        columns: ["协议", "版本"],
        rows: [["ICP", "1.0"]],
      },
    },
    { supportedComponents: ["text_block", "checkbox_list"] }
  );

  assert.equal(model.degraded, true);
  assert.equal(model.component, "text_block");
  assert.ok(model.plainText.includes("协议"));
  assert.ok(model.plainText.includes("ICP"));
});

test("degrade: degradeToPlainText strips inline markup while masking secret spans by default", () => {
  const ctx = {
    meta: { version: "icp-ctx-file/1.0", id: "ctx-deg-1", created: "2025-10-25T10:00:00Z" },
    source: {
      mode: "inline",
      type: "text/markdown",
      content: "{#top}通知 @王工：请在 [18:00] 前确认 **发布说明**，口令 ~temp-pass-01~。",
    },
    annotations: [],
  };

  const plain = degradeToPlainText(ctx);
  assert.equal(plain, "通知 王工：请在 18:00 前确认 发布说明，口令 ••••••••。");
  assert.ok(!plain.includes("temp-pass-01"));
});

test("degrade: ignores unknown signs and unknown whatis per-item without dropping annotation", () => {
  const ctx = {
    meta: { version: "icp-ctx-file/1.0", id: "ctx-deg-2", created: "2025-10-25T10:00:00Z" },
    source: {
      mode: "standalone",
      type: "text/plain",
      content: "重要架构决议内容",
    },
    annotations: [
      {
        id: "ann-mixed",
        signs: ["highlight", "futureapp:glow"],
        whatis: "futureapp:decision_node",
        anchor: { scope: "coordinate", text: { start: 0, end: 8 } },
        context: {
          reactions: [
            { type: "futureapp:haptic_pulse", params: { strength: 2 } },
            { type: "render", params: { component: "acme:badge", label: "已归档" } },
          ],
        },
      },
    ],
  };

  const view = renderTerminalDocument(ctx);
  assert.equal(view.plainText, "重要架构决议内容");
  assert.equal(view.annotations.length, 1);
  assert.deepEqual(view.annotations[0].recognizedSigns, ["highlight"]);
  assert.deepEqual(view.annotations[0].ignoredSigns, ["futureapp:glow"]);
  assert.equal(view.annotations[0].recognizedWhatis, null);
  assert.equal(view.annotations[0].skippedReactions.length, 1);
  assert.equal(view.annotations[0].renderedComponents[0].component, "text_block");
});

test("degrade: handles detached binary media gracefully on plain-text terminal", () => {
  const detachedImg = {
    meta: { version: "icp-ctx-file/1.0", id: "ctx-deg-bin", created: "2025-10-25T10:00:00Z" },
    source: {
      mode: "detached",
      type: "image/png",
      checksum: "sha256:" + "0".repeat(64),
      filename: "architecture.png",
    },
    annotations: [],
  };

  const plain = degradeToPlainText(detachedImg);
  assert.equal(plain, "[image/png: architecture.png]");
});

test("degrade: three-tier terminal rendering preserves readability across full, partial, and minimal terminals", () => {
  const ctx = {
    meta: { version: "icp-ctx-file/1.0", id: "ctx-3tier", created: "2025-10-25T10:00:00Z" },
    source: {
      mode: "standalone",
      type: "text/plain",
      content: "发布前核对事项",
    },
    annotations: [
      {
        signs: ["highlight"],
        anchor: { scope: "global" },
        context: {
          reactions: [
            {
              type: "render",
              params: { component: "checkbox_list", items: ["Schema校验", "术语门禁"] },
            },
          ],
        },
      },
    ],
  };

  const fullView = renderTerminalDocument(ctx);
  const partialView = renderTerminalDocument(ctx, { supportedComponents: ["text_block"] });
  const minimalText = degradeToPlainText(ctx);

  assert.equal(fullView.annotations[0].renderedComponents[0].component, "checkbox_list");
  assert.equal(partialView.annotations[0].renderedComponents[0].component, "text_block");
  assert.equal(minimalText, "发布前核对事项");
});
