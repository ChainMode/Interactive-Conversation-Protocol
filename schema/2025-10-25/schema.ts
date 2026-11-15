/**
 * Auto-generated from schema.json (icp://schemas/ctx-file/1.0). DO NOT EDIT MANUALLY.
 */

// ---------------------------------------------------------------------------
// Enums & Union Types
// ---------------------------------------------------------------------------

/** Namespaced custom identifier in vendor:name format (`^[a-z0-9-]+:[a-z0-9_]+$`). */
export type VendorIdentifier = `${string}:${string}`;

/** Frozen ICP 1.0 built-in sign keywords. */
export type BuiltInSign = "highlight" | "warning" | "question" | "secret";

/** Either a built-in sign keyword or a vendor:name custom sign. */
export type SignKeyword = BuiltInSign | VendorIdentifier;

/** Frozen ICP 1.0 built-in whatis keywords. */
export type BuiltInWhatis =
  | "person"
  | "organization"
  | "event"
  | "time"
  | "place"
  | "term"
  | "object"
  | "skill"
  | "emotion";

/** Either a built-in whatis keyword or a vendor:name custom whatis. */
export type WhatisKeyword = BuiltInWhatis | VendorIdentifier;

/** Packaging mode for the source content (canonical modes + synonymous wire aliases). */
export type SourceMode =
  | "inline"
  | "sidecar"
  | "bundled"
  | "embedded"
  | "detached"
  | "standalone";

/** Built-in reaction type or vendor:name custom reaction type. */
export type ReactionType =
  | "render"
  | "url"
  | "function"
  | "app"
  | "command"
  | VendorIdentifier;

/** Anchor scope discriminator. */
export type AnchorScope =
  | "global"
  | "coordinate"
  | "marker"
  | "feature"
  | "pattern"
  | "annotation";

// ---------------------------------------------------------------------------
// Meta & Source
// ---------------------------------------------------------------------------

/** Metadata block for the .ctx file. */
export interface Meta {
  /** Two-segment protocol wire version, e.g. "icp-ctx-file/1.0" or "1.0". */
  version: string;
  /** Unique identifier of this .ctx file. */
  id: string;
  /** Creation timestamp in RFC 3339 format. */
  created: string;
  /** BCP-47 locale tag, e.g. "zh-CN". */
  locale?: string;
  /** Schema URI reference, e.g. "icp://schemas/ctx-file/1.0". */
  schema?: string;
  /** Namespaced vendor extension fields. */
  [vendorKey: `${string}:${string}`]: unknown;
}

/** Describes the original content being annotated. */
export interface Source {
  /** Packaging mode. */
  mode: SourceMode;
  /** MIME type of the original content, e.g. "text/markdown", "image/png". */
  type: string;
  /** Integrity checksum (canonical SHA-256 "sha256:<64-hex>" or legacy MD5). Required when mode is "sidecar" or "detached". */
  checksum?: string;
  /** Original content. Required when mode is "inline"/"embedded" or "bundled"/"standalone"; forbidden when "sidecar"/"detached". */
  content?: string;
  /** Original filename for human readability. */
  filename?: string;
  /** Namespaced vendor extension fields. */
  [vendorKey: `${string}:${string}`]: unknown;
}

// ---------------------------------------------------------------------------
// Range & Region Types
// ---------------------------------------------------------------------------

/** Text character range for coordinate anchors (start < end). */
export interface TextRange {
  /** Start character offset (inclusive). */
  start: number;
  /** End character offset (exclusive). */
  end: number;
}

/** Rectangular image region. */
export interface ImageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Polygon image region. Array of [x, y] coordinate pairs (minimum 3 points). */
export interface ImagePolygon {
  points: [number, number][];
}

/** Image region — either a rectangle or a polygon (direct or wrapped in rect/polygon). */
export type ImageRegion =
  | ImageRect
  | ImagePolygon
  | { rect: ImageRect }
  | { polygon: ImagePolygon };

/** Video time range with optional spatial region (start <= end). */
export interface VideoRange {
  start: number;
  end: number;
  region?: ImageRegion;
}

/** Audio time range (start <= end). */
export interface AudioRange {
  start: number;
  end: number;
}

// ---------------------------------------------------------------------------
// Anchor (6 scope variants)
// ---------------------------------------------------------------------------

export interface AnchorGlobal {
  scope: "global";
}

export interface AnchorCoordinate {
  scope: "coordinate";
  text?: TextRange;
  image?: ImageRegion;
  video?: VideoRange;
  audio?: AudioRange;
}

export interface AnchorMarker {
  scope: "marker";
  name: string;
}

export interface AnchorFeature {
  scope: "feature";
  kind: string;
  value: string;
  sample?: string;
}

export interface AnchorPattern {
  scope: "pattern";
  rule: string;
  expression: string;
}

export interface AnchorAnnotation {
  scope: "annotation";
  ref: string;
}

export type Anchor =
  | AnchorGlobal
  | AnchorCoordinate
  | AnchorMarker
  | AnchorFeature
  | AnchorPattern
  | AnchorAnnotation;

// ---------------------------------------------------------------------------
// Complementary Protocol Bridge & Concepts
// ---------------------------------------------------------------------------

export type ComplementaryProtocol = "mcp" | "google-a2a" | "openapi" | "ssp";

/** Complementary protocol skill binding entry. */
export interface SkillBridgeEntry {
  id?: string;
  protocol: ComplementaryProtocol;
  uri?: string;
  endpoint?: string;
  operation?: string;
  description?: string;
  [vendorKey: `${string}:${string}`]: unknown;
}

export type SkillsBridge = SkillBridgeEntry[];

/** JSON-LD linked concept reference. */
export interface ConceptEntry {
  id?: string;
  uri: string;
  context_uri?: string;
  label?: string;
  [vendorKey: `${string}:${string}`]: unknown;
}

export type ConceptsList = ConceptEntry[];

// ---------------------------------------------------------------------------
// Context, ContextValue, Participant, Reaction
// ---------------------------------------------------------------------------

/** Structured participant data. */
export interface Participant {
  id: string;
  role: string;
  name?: string;
  [vendorKey: `${string}:${string}`]: unknown;
}

/** A context value — either a text description / URL (string) or an anchor reference. */
export type ContextValue = string | Anchor;

/** Participant array element — accepts both ContextValue and structured Participant. */
export type ParticipantItem = ContextValue | Participant;

/** A reaction triggered when the annotation is displayed. */
export interface Reaction {
  type: ReactionType;
  params: Record<string, unknown>;
  [vendorKey: `${string}:${string}`]: unknown;
}

/** Contextual sub-structure for an annotation. */
export interface Context {
  participants?: ParticipantItem[];
  memory?: ContextValue[];
  situation?: ContextValue[];
  subtext?: ContextValue[];
  culture?: ContextValue[];
  references?: ContextValue[];
  reactions?: Reaction[];
  skills_bridge?: SkillsBridge;
  concepts?: ConceptsList;
  [vendorKey: `${string}:${string}`]: unknown;
}

// ---------------------------------------------------------------------------
// Annotation & Root Document
// ---------------------------------------------------------------------------

/** A single semantic annotation on the source content. */
export interface Annotation {
  id?: string;
  signs?: SignKeyword[];
  whatis?: WhatisKeyword;
  anchor: Anchor;
  context?: Context;
  [vendorKey: `${string}:${string}`]: unknown;
}

/** ICP Contextual Annotation File (root object). */
export interface CTXFile {
  meta: Meta;
  source: Source;
  annotations: Annotation[];
  skills_bridge?: SkillsBridge;
  concepts?: ConceptsList;
  [vendorKey: `${string}:${string}`]: unknown;
}
