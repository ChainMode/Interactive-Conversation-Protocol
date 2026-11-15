import test from "node:test";
import assert from "node:assert/strict";
import { parseInline, printInline, PrettyPrinter } from "../src/inline.mjs";

test("inline: parses all 4 built-in sign delimiters and normalizes __text__ to **text**", () => {
  const input = "普通 **高亮1** 与 __高亮2__，!!警告项!!，?疑问点?，以及 ~内部标记~。";
  const parsed = parseInline(input);
  assert.equal(parsed.cleanText, "普通 高亮1 与 高亮2，警告项，疑问点，以及 内部标记。");
  assert.equal(parsed.annotations.length, 5);
  assert.deepEqual(
    parsed.annotations.map((a) => a.signs),
    [["highlight"], ["highlight"], ["warning"], ["question"], ["secret"]]
  );

  const printed = printInline(parsed);
  assert.equal(printed, "普通 **高亮1** 与 **高亮2**，!!警告项!!，?疑问点?，以及 ~内部标记~。");
});

test("inline: nested signs **!!text!!** and !!**text**!! produce identical canonical AST", () => {
  const r1 = parseInline("注意 **!!高危变更!!** 事项");
  const r2 = parseInline("注意 !!**高危变更**!! 事项");
  assert.equal(r1.cleanText, r2.cleanText);
  assert.deepEqual(r1.annotations, r2.annotations);
  assert.deepEqual(r1.annotations[0].signs, ["highlight", "warning"]);
  assert.equal(printInline(r1), printInline(r2));
});

test("inline: parses @person, [time], {#marker}, and annotation {#id} tags", () => {
  const input = "{#chap-1}联系 @李四 于 [2025-12-01] 评审 **设计稿**{#ann-doc}。";
  const r1 = parseInline(input);
  assert.equal(r1.cleanText, "联系 李四 于 2025-12-01 评审 设计稿。");
  assert.equal(r1.annotations.length, 4);
  assert.deepEqual(r1.annotations[0], {
    anchor: { scope: "marker", name: "chap-1" },
  });
  assert.equal(r1.annotations[1].whatis, "person");
  assert.equal(r1.annotations[2].whatis, "time");
  assert.equal(r1.annotations[3].id, "ann-doc");
  assert.deepEqual(r1.annotations[3].signs, ["highlight"]);

  const reParsed = parseInline(printInline(r1));
  assert.equal(reParsed.cleanText, r1.cleanText);
  assert.deepEqual(reParsed.annotations, r1.annotations);
});

test("inline: parses chained trailing reactions ->render(...)->function(...)", () => {
  const input =
    '[完成发布清单]->render(checkbox_list, items=["构建","测试"])->function(notify_channel, args={"room":"ops"})';
  const r1 = parseInline(input);
  assert.equal(r1.cleanText, "完成发布清单");
  assert.equal(r1.annotations.length, 1);
  assert.equal(r1.annotations[0].context.reactions.length, 2);
  assert.equal(r1.annotations[0].context.reactions[0].type, "render");
  assert.deepEqual(r1.annotations[0].context.reactions[0].params, {
    component: "checkbox_list",
    items: ["构建", "测试"],
  });
  assert.equal(r1.annotations[0].context.reactions[1].type, "function");
  assert.equal(r1.annotations[0].context.reactions[1].params.name, "notify_channel");

  const printed = printInline(r1);
  const r2 = parseInline(printed);
  assert.deepEqual(r2.annotations, r1.annotations);
});

test("inline: backslash escapes preserve literal special characters across round-trip", () => {
  const input = "价格 \\**100\\** 元，邮箱 user\\@example.com，字面 \\[括号] 与 \\~波浪\\~ 及 \\\\ 反斜杠。";
  const r1 = parseInline(input);
  assert.equal(
    r1.cleanText,
    "价格 **100** 元，邮箱 user@example.com，字面 [括号] 与 ~波浪~ 及 \\ 反斜杠。"
  );
  assert.equal(r1.annotations.length, 0);

  const printed = printInline(r1);
  const r2 = parseInline(printed);
  assert.equal(r2.cleanText, r1.cleanText);
  assert.equal(r2.annotations.length, 0);
});

test("inline: reports exact 1-based line and column on unclosed and self-nested markers while preserving literal text", () => {
  const multiline = "第一行正常 **高亮**\n第二行存在 **未闭合高亮标记";
  const res = parseInline(multiline);
  assert.equal(res.cleanText, "第一行正常 高亮\n第二行存在 **未闭合高亮标记");
  assert.equal(res.annotations.length, 1);
  assert.equal(res.warnings.length, 1);
  assert.equal(res.warnings[0].line, 2);
  assert.equal(res.warnings[0].column, 7);

  assert.throws(
    () => parseInline(multiline, { strict: true }),
    (err) => err.line === 2 && err.column === 7
  );

  const selfNested = parseInline("非法 ****自嵌套**** 文本");
  assert.ok(selfNested.warnings.some((w) => w.code === "W_ICP_INLINE_SELF_NESTING"));
});

test("inline: PrettyPrinter class produces byte-for-byte identical output on repeated invocations", () => {
  const printer = new PrettyPrinter();
  const sample = "{#m1}请 @王五 在 [明天下午] 审核 **!!核心方案!!** 并 [点击确认]->render(action_button, action=\"ok\", label=\"确认\")";
  const parsed = parseInline(sample);
  const out1 = printer.print(parsed);
  const out2 = printer.print(parsed);
  assert.equal(out1, out2);
});

test("inline: supports proper nested sub-spans inside outer sign span", () => {
  const sample = "**外部高亮包含 !!内部警告!! 结尾**";
  const r1 = parseInline(sample);
  assert.equal(r1.cleanText, "外部高亮包含 内部警告 结尾");
  assert.equal(r1.annotations.length, 2);
  const printed = printInline(r1);
  const r2 = parseInline(printed);
  assert.equal(r2.cleanText, r1.cleanText);
  assert.deepEqual(r2.annotations, r1.annotations);
});

test("inline: property-style round-trip parse(print(parse(text))) holds across 60 generated documents", () => {
  let seed = 20261116;
  const nextInt = (max) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed % max;
  };

  const words = ["报告", "评审", "里程碑", "架构", "模块A", "安全门禁", "终端视图", "方案"];
  const people = ["张三", "李四", "王工", "Alice", "Bob"];
  const times = ["2025-10-25", "明天14:00", "下周三", "Q4末"];
  const signWrappers = [
    (s) => `**${s}**`,
    (s) => `__${s}__`,
    (s) => `!!${s}!!`,
    (s) => `?${s}?`,
    (s) => `~${s}~`,
    (s) => `**!!${s}!!**`,
    (s) => `!!~${s}~!!`,
  ];

  for (let i = 0; i < 60; i++) {
    const parts = [];
    if (nextInt(3) === 0) {
      parts.push(`{#sec-${i}}`);
    }
    const segCount = 3 + nextInt(5);
    for (let j = 0; j < segCount; j++) {
      const kind = nextInt(6);
      const w = words[nextInt(words.length)];
      if (kind === 0) {
        parts.push(w);
      } else if (kind === 1) {
        const wrap = signWrappers[nextInt(signWrappers.length)];
        parts.push(wrap(w));
      } else if (kind === 2) {
        parts.push(`@${people[nextInt(people.length)]}`);
      } else if (kind === 3) {
        parts.push(`[${times[nextInt(times.length)]}]`);
      } else if (kind === 4) {
        parts.push(`字面\\**${w}\\**`);
      } else {
        parts.push(`[${w}]->render(text_block, text="${w}")`);
      }
    }
    const text = parts.join(" ");
    const first = parseInline(text);
    assert.equal(first.warnings.length, 0, `unexpected warning for: ${text}`);
    const printed = printInline(first);
    const second = parseInline(printed);
    assert.equal(second.cleanText, first.cleanText, `cleanText mismatch on sample #${i}: ${text}`);
    assert.deepEqual(
      second.annotations,
      first.annotations,
      `AST mismatch on sample #${i}:\ninput: ${text}\nprinted: ${printed}`
    );
  }
});
