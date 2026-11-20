#!/usr/bin/env node
/**
 * `icp-render` CLI — Multi-Endpoint Adaptive `.ctx` Renderer & HTML Preview Generator
 */

import { readFileSync, writeFileSync } from "node:fs";
import {
  ADAPTIVE_TARGETS,
  renderAdaptiveCtx,
  renderStandaloneHtmlPreview,
} from "./adaptive.mjs";
import { createSampleExpenseApprovalCtx, runIcpAdaptiveDemo } from "./demo.mjs";

const USAGE = `Usage:
  icp-render demo
  icp-render preview [--input <file.ctx.json>] --out <preview.html>
  icp-render render  --target <desktop-web|mobile-compact|terminal-cli|voice-audio> [--input <file.ctx.json>]
`;

function getFlag(argv, flag) {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && idx + 1 < argv.length) {
    return argv[idx + 1];
  }
  return undefined;
}

export function runIcpRenderCli(argv = process.argv.slice(2)) {
  const cmd = argv[0];
  if (!cmd || cmd === "--help" || cmd === "-h" || cmd === "help") {
    console.log(USAGE);
    return 0;
  }

  if (cmd === "demo") {
    runIcpAdaptiveDemo();
    return 0;
  }

  const inputPath = getFlag(argv, "--input");
  const ctx = inputPath
    ? JSON.parse(readFileSync(inputPath, "utf8"))
    : createSampleExpenseApprovalCtx();

  if (cmd === "preview") {
    const outPath = getFlag(argv, "--out");
    if (!outPath) {
      console.error("Error: --out <preview.html> is required for `icp-render preview`");
      return 1;
    }
    const html = renderStandaloneHtmlPreview(ctx);
    writeFileSync(outPath, html, "utf8");
    console.log(
      JSON.stringify({
        status: "written",
        out: outPath,
        bytes: Buffer.byteLength(html, "utf8"),
      })
    );
    return 0;
  }

  if (cmd === "render") {
    const target = getFlag(argv, "--target") ?? "terminal-cli";
    if (!ADAPTIVE_TARGETS.includes(target)) {
      console.error(
        `Error: unknown --target "${target}". Expected one of ${ADAPTIVE_TARGETS.join(", ")}`
      );
      return 1;
    }
    const res = renderAdaptiveCtx(ctx, target);
    if (target === "terminal-cli") {
      console.log(res.output);
    } else if (target === "desktop-web" || target === "mobile-compact") {
      console.log(res.html);
    } else {
      console.log(JSON.stringify(res, null, 2));
    }
    return 0;
  }

  console.error(`Unknown command: ${cmd}`);
  console.error(USAGE);
  return 1;
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("/src/cli.mjs") ||
    process.argv[1].endsWith("\\src\\cli.mjs") ||
    process.argv[1].endsWith("icp-render"));

if (isMain) {
  const code = runIcpRenderCli();
  if (code !== 0) process.exitCode = code;
}
