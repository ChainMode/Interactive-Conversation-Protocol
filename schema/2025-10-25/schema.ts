/**
 * Auto-generated from schema.json (icp://schemas/ctx-file/2025-10-25). DO NOT EDIT MANUALLY.
 */

// ---------------------------------------------------------------------------
// Enums & Union Types
// ---------------------------------------------------------------------------

/** Packaging mode for the source content. */
export type SourceMode = "inline" | "sidecar" | "bundled";

/** Reaction type triggered when an annotation is displayed. */
export type ReactionType = "render" | "function" | "app" | "command";

/** Anchor scope discriminator. */
export type AnchorScope =
  | "global"
  | "coordinate"
  | "marker"
  | "feature"
  | "pattern"
  | "annotation";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

/** Metadata block for the .ctx file. */
export interface Meta {
  /** Protocol version identifier, e.g. "1.0.0". */
  version: string;
  /** Unique identifier of this .ctx file. */
  id: string;
  /** Creation timestamp in RFC 3339 format. */
  created: string;
  /** BCP-47 locale tag, e.g. "zh-CN". */
  locale?: string;
  /** Schema URI reference, e.g. "icp://schemas/ctx-file/2025-10-25". */
  schema?: string;
}

// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

/** Describes the original content being annotated. */
export interface Source {
  /** Packaging mode. */
  mode: SourceMode;
  /** MIME type of the original content, e.g. "text/markdown", "image/png". */
  type: string;
  /** MD5 hash of the original file. MUST be present when mode is "sidecar". */
  checksum?: string;
  /** Original content. MUST be present when mode is "inline" or "bundled". Binary content is base64-encoded. */
  content?: string;
  /** Original filename for human readability. */
  filename?: string;
}

// ---------------------------------------------------------------------------
// Range & Region Types
// ---------------------------------------------------------------------------

/** Text character range for coordinate anchors. */
export interface TextRange {
  /** Start character offset (inclusive). */
  start: number;
  /** End character offset (exclusive). */
  end: number;
}

/** Rectangular image region. */
export interface ImageRegionRect {
  /** Top-left corner x coordinate. */
  x: number;
  /** Top-left corner y coordinate. */
  y: number;
  /** Width of the region. */
  width: number;
  /** Height of the region. */
  height: number;
}

/** Polygon image region. Array of [x, y] coordinate pairs. Minimum 3 points. */
export interface ImageRegionPolygon {
  points: [number, number][];
}

/** Image region — either a rectangle or a polygon. */
export type ImageRegion = ImageRegionRect | ImageRegionPolygon;

/** Video time range with optional spatial region. */
export interface VideoRange {
  /** Start time in seconds. */
  start: number;
  /** End time in seconds. */
  end: number;
  /** Optional spatial region within the video frame. */
  region?: ImageRegion;
}

/** Audio time range. */
export interface AudioRange {
  /** Start time in seconds. */
  start: number;
  /** End time in seconds. */
  end: number;
}

// ---------------------------------------------------------------------------
// Anchor (6 scope variants via oneOf)
// ---------------------------------------------------------------------------

/** Global anchor — applies to the entire source content. */
export interface AnchorGlobal {
  scope: "global";
}

/** Coordinate anchor — position-based attachment. Exactly one of text/image/video/audio must be present. */
export interface AnchorCoordinate {
  scope: "coordinate";
  text?: TextRange;
  image?: ImageRegion;
  video?: VideoRange;
  audio?: AudioRange;
}

/** Marker anchor — attaches to a named marker or bookmark. */
export interface AnchorMarker {
  scope: "marker";
  /** Name of the marker or bookmark. */
  name: string;
}

/** Feature anchor — attaches to a detected feature (e.g., face, object). */
export interface AnchorFeature {
  scope: "feature";
  /** Kind of feature, e.g. "face", "object". */
  kind: string;
  /** Feature value or label. */
  value: string;
  /** Optional sample or example of the feature. */
  sample?: string;
}

/** Pattern anchor — attaches to content matching a pattern (e.g., regex). */
export interface AnchorPattern {
  scope: "pattern";
  /** Pattern type, e.g. "regex", "css-selector", "xpath". */
  rule: string;
  /** The pattern expression. */
  expression: string;
}

/** Annotation anchor — references another annotation for meta-annotations. */
export interface AnchorAnnotation {
  scope: "annotation";
  /** ID of the target annotation. */
  ref: string;
}

/** Defines where an annotation attaches to the source content. Uses scope as discriminator. */
export type Anchor =
  | AnchorGlobal
  | AnchorCoordinate
  | AnchorMarker
  | AnchorFeature
  | AnchorPattern
  | AnchorAnnotation;

// ---------------------------------------------------------------------------
// Context, ContextValue, Reaction, Participant
// ---------------------------------------------------------------------------

/** A context value — either a text description / URL (string) or an anchor reference. */
export type ContextValue = string | Anchor;

/** A reaction triggered when the annotation is displayed. */
export interface Reaction {
  /** Reaction type. */
  type: ReactionType;
  /** Reaction-type-specific parameters. */
  params: Record<string, unknown>;
}

/** Contextual sub-structure. All fields except reactions are arrays of ContextValue. */
export interface Context {
  /** Participants in the interaction. */
  participants?: ContextValue[];
  /** What memory the annotation is based on. */
  memory?: ContextValue[];
  /** Under what situation the annotation applies. */
  situation?: ContextValue[];
  /** Subtext, implication, or hidden meaning. */
  subtext?: ContextValue[];
  /** Cultural context. */
  culture?: ContextValue[];
  /** Related reference materials. */
  references?: ContextValue[];
  /** Reactions triggered when the annotation is displayed. */
  reactions?: Reaction[];
}

/** Structured participant data. */
export interface Participant {
  /** Participant identifier. */
  id: string;
  /** Participant role. */
  role: string;
  /** Participant display name. */
  name?: string;
}

// ---------------------------------------------------------------------------
// Annotation
// ---------------------------------------------------------------------------

/** A single semantic annotation on the source content. */
export interface Annotation {
  /** Annotation name (similar to CSS id). Used for cross-referencing. */
  id?: string;
  /** Marker qualities. Built-in: highlight, warning, question, secret. Custom: vendor:signname. */
  signs?: string[];
  /** Object type of the annotated content. Built-in: person, organization, event, time, place, term, object, skill, emotion. */
  whatis?: string;
  /** Where the annotation attaches to the source content. */
  anchor: Anchor;
  /** Contextual sub-structure for this annotation. */
  context?: Context;
}

// ---------------------------------------------------------------------------
// Root Document
// ---------------------------------------------------------------------------

/** ICP Contextual Annotation File (root object). */
export interface CTXFile {
  /** Metadata block. */
  meta: Meta;
  /** Describes the original content being annotated. */
  source: Source;
  /** Ordered list of annotations on the source content. */
  annotations: Annotation[];
}
