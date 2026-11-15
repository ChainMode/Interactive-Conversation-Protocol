/**
 * ICP 1.0 Deterministic Inline Markup Parser & Pretty-Printer.
 * Satisfies parseInline(printInline(parseInline(text))) AST equivalence.
 */

const CANONICAL_SIGN_ORDER = ["highlight", "warning", "question", "secret"];

const SIGN_TO_DELIM = {
  highlight: "**",
  warning: "!!",
  question: "?",
  secret: "~",
};

const DELIM_DEFS = [
  { delim: "**", sign: "highlight" },
  { delim: "__", sign: "highlight" },
  { delim: "!!", sign: "warning" },
  { delim: "?", sign: "question" },
  { delim: "~", sign: "secret" },
];

const REACTION_PRIMARY_KEY = {
  render: "component",
  function: "name",
  app: "id",
  command: "cmd",
  url: "url",
};

function getLineCol(input, offset) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < offset && i < input.length; i++) {
    if (input[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column, offset };
}

function makeSyntaxError(code, message, pos) {
  const err = new SyntaxError(`${message} (line ${pos.line}, column ${pos.column})`);
  err.code = code;
  err.line = pos.line;
  err.column = pos.column;
  err.offset = pos.offset;
  return err;
}

function canonicalizeSigns(signs) {
  const unique = [...new Set(signs)];
  return unique.sort((a, b) => {
    const ia = CANONICAL_SIGN_ORDER.indexOf(a);
    const ib = CANONICAL_SIGN_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

function consumeEscape(input, i) {
  if (input.startsWith("\\**", i)) return { literal: "**", next: i + 3 };
  if (input.startsWith("\\__", i)) return { literal: "__", next: i + 3 };
  if (input.startsWith("\\!!", i)) return { literal: "!!", next: i + 3 };
  if (i + 1 < input.length && "?~@[]{}\\*_!".includes(input[i + 1])) {
    return { literal: input[i + 1], next: i + 2 };
  }
  return { literal: "\\", next: i + 1 };
}

function findMatchingDelimOnLine(input, startAfterOpen, delim, stopIdx) {
  let j = startAfterOpen;
  while (j < stopIdx) {
    if (input[j] === "\n") return -1;
    if (input[j] === "\\") {
      j = consumeEscape(input, j).next;
      continue;
    }
    if (input.startsWith(delim, j)) {
      if (j === startAfterOpen) return -1;
      return j;
    }
    j += 1;
  }
  return -1;
}

function findMatchingBracketOnLine(input, openIdx, stopIdx) {
  let j = openIdx + 1;
  while (j < stopIdx) {
    if (input[j] === "\n") return -1;
    if (input[j] === "\\") {
      j = consumeEscape(input, j).next;
      continue;
    }
    if (input[j] === "]") {
      return j > openIdx + 1 ? j : -1;
    }
    j += 1;
  }
  return -1;
}

function splitTopLevelArgs(argStr) {
  const parts = [];
  let cur = "";
  let depthBracket = 0;
  let depthBrace = 0;
  let inQuote = false;
  let escaped = false;

  for (let i = 0; i < argStr.length; i++) {
    const ch = argStr[i];
    if (inQuote) {
      cur += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inQuote = false;
      }
      continue;
    }
    if (ch === '"') {
      inQuote = true;
      cur += ch;
    } else if (ch === "[") {
      depthBracket += 1;
      cur += ch;
    } else if (ch === "]") {
      depthBracket = Math.max(0, depthBracket - 1);
      cur += ch;
    } else if (ch === "{") {
      depthBrace += 1;
      cur += ch;
    } else if (ch === "}") {
      depthBrace = Math.max(0, depthBrace - 1);
      cur += ch;
    } else if (ch === "," && depthBracket === 0 && depthBrace === 0) {
      if (cur.trim().length > 0) parts.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim().length > 0) parts.push(cur.trim());
  return parts;
}

function parseParamValue(raw) {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    trimmed === "true" ||
    trimmed === "false" ||
    trimmed === "null" ||
    /^-?\d+(?:\.\d+)?$/.test(trimmed)
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

function findMatchingParen(input, openParenIdx, stopIdx) {
  let depth = 1;
  let inQuote = false;
  let escaped = false;
  for (let j = openParenIdx + 1; j < stopIdx; j++) {
    const ch = input[j];
    if (inQuote) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inQuote = false;
      }
      continue;
    }
    if (ch === '"') {
      inQuote = true;
    } else if (ch === "(") {
      depth += 1;
    } else if (ch === ")") {
      depth -= 1;
      if (depth === 0) return j;
    }
  }
  return -1;
}

function consumeTrailingModifiers(input, startIdx, stopIdx) {
  let idx = startIdx;
  let id = null;
  const reactions = [];

  while (idx < stopIdx) {
    const idMatch = /^\{#([A-Za-z0-9_-]+)\}/.exec(input.slice(idx, stopIdx));
    if (idMatch && id === null) {
      id = idMatch[1];
      idx += idMatch[0].length;
      continue;
    }

    if (input.startsWith("->", idx)) {
      const rxHead = /^->([A-Za-z0-9_:-]+)\(/.exec(input.slice(idx, stopIdx));
      if (!rxHead) break;
      const rxType = rxHead[1];
      const openParenIdx = idx + rxHead[0].length - 1;
      const closeParenIdx = findMatchingParen(input, openParenIdx, stopIdx);
      if (closeParenIdx === -1) break;
      const inside = input.slice(openParenIdx + 1, closeParenIdx);
      const argTokens = splitTopLevelArgs(inside);
      const params = {};
      const primaryKey = REACTION_PRIMARY_KEY[rxType] || "target";

      argTokens.forEach((tok, tokIdx) => {
        let eqPos = -1;
        let inQuote = false;
        let esc = false;
        let dBrk = 0;
        let dBrc = 0;
        for (let k = 0; k < tok.length; k++) {
          const c = tok[k];
          if (inQuote) {
            if (esc) esc = false;
            else if (c === "\\") esc = true;
            else if (c === '"') inQuote = false;
            continue;
          }
          if (c === '"') inQuote = true;
          else if (c === "[") dBrk += 1;
          else if (c === "]") dBrk = Math.max(0, dBrk - 1);
          else if (c === "{") dBrc += 1;
          else if (c === "}") dBrc = Math.max(0, dBrc - 1);
          else if (c === "=" && dBrk === 0 && dBrc === 0) {
            eqPos = k;
            break;
          }
        }

        if (eqPos !== -1) {
          const kName = tok.slice(0, eqPos).trim();
          const vRaw = tok.slice(eqPos + 1).trim();
          params[kName] = parseParamValue(vRaw);
        } else if (tokIdx === 0) {
          params[primaryKey] = parseParamValue(tok);
        }
      });

      reactions.push({ type: rxType, params });
      idx = closeParenIdx + 1;
      continue;
    }

    break;
  }

  return { id, reactions, next: idx };
}

export function parseInline(text, options = {}) {
  const input = String(text ?? "");
  const strict = Boolean(options.strict);
  const warnings = [];
  const rawAnnotations = [];
  const markerOffsets = [];
  let cleanText = "";

  const emitWarning = (code, message, offset) => {
    const pos = getLineCol(input, offset);
    if (strict) {
      throw makeSyntaxError(code, message, pos);
    }
    warnings.push({ code, message, ...pos });
  };

  function parseSegment(startIdx, stopIdx, activeSignSet) {
    let i = startIdx;
    while (i < stopIdx) {
      // 1. Backslash escape
      if (input[i] === "\\") {
        const esc = consumeEscape(input, i);
        cleanText += esc.literal;
        i = esc.next;
        continue;
      }

      // 2. Standalone named marker {#marker-name}
      if (input.startsWith("{#", i)) {
        const m = /^\{#([A-Za-z0-9_-]+)\}/.exec(input.slice(i, stopIdx));
        if (m) {
          const markerName = m[1];
          const annotationIndex = rawAnnotations.length;
          markerOffsets.push({
            annotationIndex,
            offset: cleanText.length,
            name: markerName,
          });
          rawAnnotations.push({
            order: annotationIndex,
            ann: {
              anchor: { scope: "marker", name: markerName },
            },
          });
          i += m[0].length;
          continue;
        }
      }

      // 3. Sign delimiters (**, __, !!, ?, ~)
      let matchedDelim = null;
      for (const def of DELIM_DEFS) {
        if (input.startsWith(def.delim, i)) {
          matchedDelim = def;
          break;
        }
      }

      if (matchedDelim) {
        const { delim, sign } = matchedDelim;

        // Detect immediate doubled self-nesting e.g. ****text****, ____text____, !!!!text!!!!
        if (delim.length === 2 && input.startsWith(delim + delim, i)) {
          const doubled = delim + delim;
          emitWarning(
            "W_ICP_INLINE_SELF_NESTING",
            `Self-nested inline marker "${doubled}" is forbidden`,
            i
          );
          const closeDoubled = findMatchingDelimOnLine(input, i + doubled.length, doubled, stopIdx);
          if (closeDoubled !== -1) {
            cleanText += input.slice(i, closeDoubled + doubled.length);
            i = closeDoubled + doubled.length;
          } else {
            cleanText += doubled;
            i += doubled.length;
          }
          continue;
        }

        if (activeSignSet.has(sign)) {
          emitWarning(
            "W_ICP_INLINE_SELF_NESTING",
            `Self-nested inline sign "${sign}" is forbidden`,
            i
          );
          cleanText += delim;
          i += delim.length;
          continue;
        }

        const closeIdx = findMatchingDelimOnLine(input, i + delim.length, delim, stopIdx);
        if (closeIdx === -1) {
          emitWarning(
            "W_ICP_INLINE_UNCLOSED_MARKER",
            `Unclosed inline marker "${delim}"`,
            i
          );
          cleanText += delim;
          i += delim.length;
          continue;
        }

        const spanStart = cleanText.length;
        const orderSlot = rawAnnotations.length;
        rawAnnotations.push(null); // reserve pre-order slot so outer spans precede inner spans

        const nextSignSet = new Set(activeSignSet);
        nextSignSet.add(sign);
        parseSegment(i + delim.length, closeIdx, nextSignSet);

        const spanEnd = cleanText.length;
        const trailing = consumeTrailingModifiers(input, closeIdx + delim.length, stopIdx);

        if (spanEnd > spanStart) {
          const ann = {
            ...(trailing.id ? { id: trailing.id } : {}),
            signs: [sign],
            anchor: {
              scope: "coordinate",
              text: { start: spanStart, end: spanEnd },
            },
            ...(trailing.reactions.length > 0
              ? { context: { reactions: trailing.reactions } }
              : {}),
          };
          rawAnnotations[orderSlot] = { order: orderSlot, ann };
        }
        i = trailing.next;
        continue;
      }

      // 4. @person prefix marker
      if (input[i] === "@" && (i === 0 || !/[\p{L}\p{N}]/u.test(input[i - 1]))) {
        const m = /^@([\p{L}\p{N}_-]+)/u.exec(input.slice(i, stopIdx));
        if (m) {
          const personName = m[1];
          const spanStart = cleanText.length;
          cleanText += personName;
          const spanEnd = cleanText.length;
          const trailing = consumeTrailingModifiers(input, i + m[0].length, stopIdx);
          const orderSlot = rawAnnotations.length;
          rawAnnotations.push({
            order: orderSlot,
            ann: {
              ...(trailing.id ? { id: trailing.id } : {}),
              whatis: "person",
              anchor: {
                scope: "coordinate",
                text: { start: spanStart, end: spanEnd },
              },
              ...(trailing.reactions.length > 0
                ? { context: { reactions: trailing.reactions } }
                : {}),
            },
          });
          i = trailing.next;
          continue;
        }
      }

      // 5. [datetime] or [annotated content]->reaction(...)
      if (input[i] === "[") {
        const closeBrk = findMatchingBracketOnLine(input, i, stopIdx);
        if (closeBrk !== -1) {
          const spanStart = cleanText.length;
          const orderSlot = rawAnnotations.length;
          rawAnnotations.push(null);

          parseSegment(i + 1, closeBrk, activeSignSet);
          const spanEnd = cleanText.length;
          const trailing = consumeTrailingModifiers(input, closeBrk + 1, stopIdx);

          if (spanEnd > spanStart) {
            if (trailing.reactions.length > 0) {
              rawAnnotations[orderSlot] = {
                order: orderSlot,
                ann: {
                  ...(trailing.id ? { id: trailing.id } : {}),
                  anchor: {
                    scope: "coordinate",
                    text: { start: spanStart, end: spanEnd },
                  },
                  context: { reactions: trailing.reactions },
                },
              };
            } else {
              rawAnnotations[orderSlot] = {
                order: orderSlot,
                ann: {
                  ...(trailing.id ? { id: trailing.id } : {}),
                  whatis: "time",
                  anchor: {
                    scope: "coordinate",
                    text: { start: spanStart, end: spanEnd },
                  },
                },
              };
            }
          }
          i = trailing.next;
          continue;
        }
      }

      // 6. Plain character
      cleanText += input[i];
      i += 1;
    }
  }

  parseSegment(0, input.length, new Set());

  // Merge identical-range sign-only/compatible annotations (e.g. **!!text!!** <-> !!**text**!!)
  const merged = [];
  const coordIndexByKey = new Map();
  const oldIndexToNewIndex = new Map();

  rawAnnotations.forEach((entry, rawIdx) => {
    if (!entry) return;
    const { ann } = entry;
    if (ann.anchor?.scope === "coordinate" && ann.anchor.text) {
      const { start, end } = ann.anchor.text;
      const key = `${start}:${end}`;
      const existingIdx = coordIndexByKey.get(key);
      if (existingIdx !== undefined) {
        const target = merged[existingIdx];
        // Merge nested signs / ids / reactions on identical coordinate span
        if (ann.signs) {
          target.signs = canonicalizeSigns([...(target.signs || []), ...ann.signs]);
        }
        if (ann.whatis && !target.whatis) {
          target.whatis = ann.whatis;
        }
        if (ann.id && !target.id) {
          target.id = ann.id;
        }
        if (ann.context?.reactions) {
          target.context = target.context || {};
          target.context.reactions = [
            ...(target.context.reactions || []),
            ...ann.context.reactions,
          ];
        }
        oldIndexToNewIndex.set(rawIdx, existingIdx);
        return;
      }
      if (ann.signs) {
        ann.signs = canonicalizeSigns(ann.signs);
      }
      const newIdx = merged.length;
      merged.push(ann);
      coordIndexByKey.set(key, newIdx);
      oldIndexToNewIndex.set(rawIdx, newIdx);
    } else {
      const newIdx = merged.length;
      merged.push(ann);
      oldIndexToNewIndex.set(rawIdx, newIdx);
    }
  });

  const normalizedMarkerOffsets = markerOffsets.map((m) => ({
    annotationIndex: oldIndexToNewIndex.get(m.annotationIndex) ?? m.annotationIndex,
    offset: m.offset,
    name: m.name,
  }));

  return {
    cleanText,
    annotations: merged,
    warnings,
    markerOffsets: normalizedMarkerOffsets,
  };
}

function escapeLiteralText(segment) {
  let out = "";
  let i = 0;
  while (i < segment.length) {
    if (segment[i] === "\\") {
      out += "\\\\";
      i += 1;
    } else if (segment.startsWith("**", i)) {
      out += "\\**";
      i += 2;
    } else if (segment.startsWith("__", i)) {
      out += "\\__";
      i += 2;
    } else if (segment.startsWith("!!", i)) {
      out += "\\!!";
      i += 2;
    } else if (segment[i] === "?") {
      out += "\\?";
      i += 1;
    } else if (segment[i] === "~") {
      out += "\\~";
      i += 1;
    } else if (segment[i] === "@") {
      out += "\\@";
      i += 1;
    } else if (segment[i] === "[") {
      out += "\\[";
      i += 1;
    } else if (segment.startsWith("{#", i)) {
      out += "\\{#";
      i += 2;
    } else {
      out += segment[i];
      i += 1;
    }
  }
  return out;
}

function formatReactionBlock(rx) {
  const type = rx.type;
  const params = rx.params || {};
  const primaryKey = REACTION_PRIMARY_KEY[type];
  const parts = [];

  if (primaryKey && Object.hasOwn(params, primaryKey)) {
    const val = params[primaryKey];
    if (typeof val === "string" && /^[A-Za-z0-9._:-]+$/.test(val)) {
      parts.push(val);
    } else {
      parts.push(JSON.stringify(val));
    }
  }

  const restKeys = Object.keys(params)
    .filter((k) => k !== primaryKey)
    .sort();
  for (const k of restKeys) {
    parts.push(`${k}=${JSON.stringify(params[k])}`);
  }

  return `->${type}(${parts.join(", ")})`;
}

function buildWrapperTokens(ann) {
  const builtInSigns = canonicalizeSigns(
    (ann.signs || []).filter((s) => Object.hasOwn(SIGN_TO_DELIM, s))
  );
  const reactions = (ann.context?.reactions || []).filter(
    (rx) => typeof rx?.type === "string"
  );
  const hasReactions = reactions.length > 0;
  const whatis = ann.whatis;

  // Priority (§7.7.2): signs (innermost) -> whatis (middle) -> reactions (outermost) + optional {#id}
  let open = "";
  let close = "";

  // Innermost: signs
  const signOpen = builtInSigns.map((s) => SIGN_TO_DELIM[s]).join("");
  const signClose = [...builtInSigns]
    .reverse()
    .map((s) => SIGN_TO_DELIM[s])
    .join("");
  open = signOpen;
  close = signClose;

  // Middle: whatis (person / time)
  if (whatis === "person") {
    open = `@${open}`;
  } else if (whatis === "time" && !hasReactions) {
    open = `[${open}`;
    close = `${close}]`;
  }

  // Outermost: reactions
  if (hasReactions) {
    open = `[${open}`;
    close = `${close}]${reactions.map(formatReactionBlock).join("")}`;
  }

  const hasInlineRepresentation =
    builtInSigns.length > 0 || whatis === "person" || whatis === "time" || hasReactions;

  if (hasInlineRepresentation && typeof ann.id === "string" && /^[A-Za-z0-9_-]+$/.test(ann.id)) {
    close = `${close}{#${ann.id}}`;
  }

  return hasInlineRepresentation ? { open, close } : null;
}

export class PrettyPrinter {
  print(input, maybeAnnotations) {
    let cleanText = "";
    let annotations = [];
    let markerOffsets = [];

    if (typeof input === "string") {
      cleanText = input;
      annotations = Array.isArray(maybeAnnotations) ? maybeAnnotations : [];
    } else if (input && typeof input === "object") {
      if (typeof input.cleanText === "string") {
        cleanText = input.cleanText;
        annotations = Array.isArray(input.annotations) ? input.annotations : [];
        markerOffsets = Array.isArray(input.markerOffsets) ? input.markerOffsets : [];
      } else if (input.source && typeof input.source.content === "string") {
        cleanText = input.source.content;
        annotations = Array.isArray(input.annotations) ? input.annotations : [];
      }
    }

    const markerOffsetByIndex = new Map();
    for (const m of markerOffsets) {
      markerOffsetByIndex.set(m.annotationIndex, m.offset);
    }

    const markersAtPos = new Map();
    const opensAtPos = new Map();
    const closesAtPos = new Map();

    annotations.forEach((ann, idx) => {
      if (!ann || !ann.anchor) return;
      if (ann.anchor.scope === "marker" && typeof ann.anchor.name === "string") {
        const pos = Math.min(
          Math.max(0, markerOffsetByIndex.get(idx) ?? 0),
          cleanText.length
        );
        if (!markersAtPos.has(pos)) markersAtPos.set(pos, []);
        markersAtPos.get(pos).push(`{#${ann.anchor.name}}`);
        return;
      }

      if (ann.anchor.scope === "coordinate" && ann.anchor.text) {
        const { start, end } = ann.anchor.text;
        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 0 ||
          end > cleanText.length ||
          start >= end
        ) {
          return;
        }
        const tokens = buildWrapperTokens(ann);
        if (!tokens) return;

        if (!opensAtPos.has(start)) opensAtPos.set(start, []);
        opensAtPos.get(start).push({ start, end, idx, token: tokens.open });

        if (!closesAtPos.has(end)) closesAtPos.set(end, []);
        closesAtPos.get(end).push({ start, end, idx, token: tokens.close });
      }
    });

    // At any position:
    // - Opens: outer spans (larger end, smaller idx) open first
    for (const list of opensAtPos.values()) {
      list.sort((a, b) => b.end - a.end || a.idx - b.idx);
    }
    // - Closes: inner spans (larger start, larger idx) close first
    for (const list of closesAtPos.values()) {
      list.sort((a, b) => b.start - a.start || b.idx - a.idx);
    }

    const breakpoints = new Set([0, cleanText.length]);
    for (const p of markersAtPos.keys()) breakpoints.add(p);
    for (const p of opensAtPos.keys()) breakpoints.add(p);
    for (const p of closesAtPos.keys()) breakpoints.add(p);
    const sortedPos = [...breakpoints].sort((a, b) => a - b);

    let out = "";
    for (let k = 0; k < sortedPos.length; k++) {
      const pos = sortedPos[k];

      // 1. Close spans ending at pos
      if (closesAtPos.has(pos)) {
        for (const item of closesAtPos.get(pos)) {
          out += item.token;
        }
      }

      // 2. Emit 0-width markers at pos
      if (markersAtPos.has(pos)) {
        for (const mk of markersAtPos.get(pos)) {
          out += mk;
        }
      }

      // 3. Open spans starting at pos
      if (opensAtPos.has(pos)) {
        for (const item of opensAtPos.get(pos)) {
          out += item.token;
        }
      }

      // 4. Emit escaped literal text until next breakpoint
      if (k + 1 < sortedPos.length) {
        const nextPos = sortedPos[k + 1];
        if (nextPos > pos) {
          out += escapeLiteralText(cleanText.slice(pos, nextPos));
        }
      }
    }

    return out;
  }
}

const defaultPrinter = new PrettyPrinter();

export function printInline(input, maybeAnnotations) {
  return defaultPrinter.print(input, maybeAnnotations);
}
