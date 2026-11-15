export declare const BUILT_IN_SIGNS: readonly ["highlight", "warning", "question", "secret"];
export declare const BUILT_IN_WHATIS: readonly [
  "person",
  "organization",
  "event",
  "time",
  "place",
  "term",
  "object",
  "skill",
  "emotion",
];
export declare const BUILT_IN_REACTION_TYPES: readonly [
  "render",
  "url",
  "function",
  "app",
  "command",
];
export declare const BUILT_IN_RENDER_COMPONENTS: readonly [
  "checkbox_list",
  "form",
  "highlight_marker",
  "circle_overlay",
  "timeline_card",
  "action_button",
  "data_table",
  "media_preview",
  "text_block",
];
export declare const SUPPORTED_MODES: readonly [
  "inline",
  "sidecar",
  "bundled",
  "embedded",
  "detached",
  "standalone",
];
export declare const SKILL_BRIDGE_PROTOCOLS: readonly ["mcp", "google-a2a", "openapi", "ssp"];
export declare const DEFAULT_SECRET_MASK = "••••••••";

export interface ValidationError {
  code: string;
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export declare function isValidVendorNamespace(value: string): boolean;
export declare function validateCtx(doc: unknown): ValidationResult;

export interface ChecksumVerificationResult {
  ok: boolean;
  algorithm: "sha256" | "md5" | "unknown";
  code?: string;
  expected?: string;
  actual?: string;
}

export declare function computeSha256Checksum(content: string | Uint8Array): string;
export declare function verifyChecksum(
  content: string | Uint8Array,
  expectedChecksum: string
): ChecksumVerificationResult;

export interface ModeConvertOptions {
  externalContent?: string | Uint8Array;
}

export interface ModeConvertResult {
  ctx: Record<string, unknown>;
  externalContent?: string | Uint8Array;
}

export declare function convertMode(
  ctx: Record<string, unknown>,
  targetMode: string,
  options?: ModeConvertOptions
): ModeConvertResult;
export declare function toStandalone(
  ctx: Record<string, unknown>,
  options?: ModeConvertOptions
): ModeConvertResult;
export declare function toBundled(
  ctx: Record<string, unknown>,
  options?: ModeConvertOptions
): ModeConvertResult;
export declare function toEmbedded(
  ctx: Record<string, unknown>,
  options?: ModeConvertOptions
): ModeConvertResult;
export declare function toInline(
  ctx: Record<string, unknown>,
  options?: ModeConvertOptions
): ModeConvertResult;
export declare function toDetached(
  ctx: Record<string, unknown>,
  options?: ModeConvertOptions
): ModeConvertResult;
export declare function toSidecar(
  ctx: Record<string, unknown>,
  options?: ModeConvertOptions
): ModeConvertResult;

export interface InlineWarning {
  code: string;
  message: string;
  line: number;
  column: number;
  offset: number;
}

export interface ParsedInlineResult {
  cleanText: string;
  annotations: Record<string, unknown>[];
  warnings: InlineWarning[];
  markerOffsets: Array<{ annotationIndex: number; offset: number; name: string }>;
}

export declare function parseInline(
  text: string,
  options?: { strict?: boolean }
): ParsedInlineResult;
export declare function printInline(
  input: string | ParsedInlineResult | Record<string, unknown>,
  maybeAnnotations?: Record<string, unknown>[]
): string;
export declare class PrettyPrinter {
  print(
    input: string | ParsedInlineResult | Record<string, unknown>,
    maybeAnnotations?: Record<string, unknown>[]
  ): string;
}

export interface ReactionGateResult {
  allowed: boolean;
  decision: "allow" | "deny" | "delegate_to_cap";
  code?: string;
  requiresConsent: boolean;
  capDelegation: Record<string, unknown> | null;
  sanitizedReaction?: Record<string, unknown>;
}

export declare function sanitizeReactionParams(
  reaction: Record<string, unknown>
): Record<string, unknown>;
export declare function maskSecretsForDisplay(
  ctx: Record<string, unknown>,
  options?: { mask?: string; revealedIds?: string[]; externalContent?: string }
): {
  maskedText: string;
  redactedIds: string[];
  redactedSecretCount: number;
};
export declare function serializeForAuditLog(
  ctx: Record<string, unknown>,
  options?: { mask?: string; externalContent?: string }
): string;
export declare function evaluateReactionGate(
  reaction: Record<string, unknown>,
  options?: Record<string, unknown>
): ReactionGateResult;
export declare function evaluateReactionChain(
  reactions: Record<string, unknown>[],
  options?: Record<string, unknown>
): {
  results: ReactionGateResult[];
  auditLog: Array<{ index: number; type: string; code?: string; decision: string; reason: string }>;
};

export interface RenderedComponentModel {
  component: string;
  originalComponent: string;
  degraded: boolean;
  props: Record<string, unknown>;
  plainText: string;
  warnings: Array<{
    code: string;
    originalComponent: string;
    fallbackComponent: string;
    message: string;
  }>;
}

export declare function renderComponentModel(
  reaction: Record<string, unknown>,
  options?: { supportedComponents?: string[] }
): RenderedComponentModel;
export declare function degradeToPlainText(
  ctx: Record<string, unknown>,
  options?: { mask?: string; revealedIds?: string[]; externalContent?: string }
): string;
export declare function renderTerminalDocument(
  ctx: Record<string, unknown>,
  options?: { supportedComponents?: string[]; mask?: string; revealedIds?: string[] }
): {
  plainText: string;
  annotations: Record<string, unknown>[];
};
