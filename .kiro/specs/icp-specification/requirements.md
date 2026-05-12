# 需求文档

## 简介

本需求文档定义 ICP（Interactive Conversation Protocol）协议规范的编写需求。

ICP 是一种**语境注解格式规范**（Contextual Annotation Format Specification），定义如何为任意媒体内容（文本、图片、视频、音频）添加结构化语义注解。ICP 的核心产物是 `.ctx` 文件（语境注解文件，Contextual Annotation File），创建注解的过程称为"语境化注解"（Contextual Annotation）。

核心设计理念：
- **一切皆注解** — 语义、意图/动机、语境（参与者、记忆、环境、文化）、技能调用、消息引用均为注解
- **一个 .ctx 文件 = 一条消息** — 对话组织由应用层处理，不属于 ICP 范畴
- **两种注解模式** — 内联模式（嵌入内容中，类似 Markdown 语法）和 Sidecar 模式（外部注解层，类似字幕文件）
- **三种 .ctx 文件形态** — 独立 Sidecar（.md.ctx）、捆绑包（原始文件 + 注解打包）、内联（注解嵌入内容）
- **静态文档格式** — .ctx 文件以纯文本存储，通过任意通道传输；传输时的动态组装由 DTP 处理，不属于 ICP

本规范的交付物包括：
1. **协议规范文档**：位于 `docs/{lang}/specification/` 目录
2. **Schema 定义文件**：位于 `schema/` 目录，包含 `schema.json`（权威数据源）、`schema.ts`（TypeScript 类型）、`schema.mdx`（人类可读文档）

本规范从"格式定义"视角出发，关注 .ctx 文件格式定义了什么（WHAT），而非软件如何实现（HOW）。所有合规性关键词遵循 RFC 2119 语义。

## 术语表

- **CTX_File**: .ctx 文件，语境注解文件，ICP 的核心产物。一个 .ctx 文件对应一条消息的完整注解
- **Contextual_Annotation**: 语境化注解，为媒体内容添加结构化语义注解的过程
- **Meta**: 元数据块，.ctx 文件的头部信息，包含版本、ID、时间戳等
- **Source**: 原始内容描述块，描述被注解的原始媒体内容及其模式
- **Source_Mode**: 原始内容模式，枚举值：inline（内联）、sidecar（旁注）、bundled（捆绑）
- **Annotation**: 注解，.ctx 文件中的核心语义单元。一切皆注解 — 语义标记、意图、语境、技能调用、引用均为注解
- **Anchor**: 锚点，注解在原始内容上的附着位置。支持 6 种 scope：global（全局）、coordinate（坐标）、marker（标记）、feature（特征）、pattern（模式）、annotation（注解引用）
- **Signs**: 标记性质（signs），注解的标记性质数组，可组合使用。内置关键词（4 个）：highlight, warning, question, secret；自定义：vendor:signname
- **Whatis**: 对象类型（whatis），注解标注的对象类型。内置关键词（9 个）：person, organization, event, time, place, term, object, skill, emotion
- **Context**: 语境（context），注解的语境子结构，所有字段（除 reactions 外）均为数组，每个元素可以是文本描述（string）、锚点引用（anchor object）或 URL（string）。包含 participants[]、memory[]、situation[]、subtext[]、culture[]、references[]、reactions[]
- **Reaction**: 反应（reaction），注解在显示时触发的反应。类型：render（渲染为 UI 组件）、function（调用预设函数）、app（触发应用动作）、command（执行命令）
- **Inline_Syntax**: 内联注解语法，嵌入文本内容中的注解标记，类似 Markdown 的特殊字符语法
- **Sidecar_Format**: Sidecar 注解格式，独立于原始文件的 JSON 结构化注解层
- **Render_Reaction**: 渲染反应，将注解映射到 UI 组件的反应类型，包含组件名称和参数
- **Function_Reaction**: 函数反应，调用预设函数的反应类型（如设备上的闪烁按钮）
- **App_Reaction**: 应用反应，触发应用层行为的反应类型
- **Command_Reaction**: 命令反应，执行系统命令的反应类型
- **Participant**: 参与者，交互中的角色实体（context.participants[] 中的元素，可以是文本描述、锚点引用或 URL）
- **Memory**: 记忆，context.memory[] 数组，每个元素可以是文本描述、锚点引用或 URL，描述基于什么记忆
- **Situation**: 情境，context.situation[] 数组，每个元素可以是文本描述、锚点引用或 URL，描述在什么情境下
- **Subtext**: 潜台词，context.subtext[] 数组，每个元素可以是文本描述、锚点引用或 URL，描述言外之意或隐含信息
- **Culture**: 文化，context.culture[] 数组，每个元素可以是文本描述、锚点引用或 URL，描述在什么文化背景下
- **References**: 引用，context.references[] 数组，每个元素可以是文本描述、锚点引用或 URL，描述相关参考资料
- **Skill_Invoke**: 技能调用注解，通过注解触发外部服务调用
- **Message_Ref**: 消息引用注解，引用其他 .ctx 文件或消息

## 需求

### 需求 1：.ctx 文件顶层结构定义

**用户故事：** 作为协议实现者，我希望规范文档定义 .ctx 文件的完整顶层结构，以便我能够正确创建和解析语境注解文件。

#### 验收标准

1. THE Specification_Document SHALL define the CTX_File as a JSON document with three required top-level sections: meta, source, and annotations
2. THE Specification_Document SHALL define the meta section with required fields: version (string), id (string, unique identifier), and created_at (RFC 3339 datetime), and optional fields: locale (BCP-47 string), schema_ref (string URI)
3. THE Specification_Document SHALL define the source section with required fields: mode (Source_Mode enum: inline, sidecar, bundled) and media_type (MIME type string, e.g. text/markdown, image/png, video/mp4, audio/mp3)
4. THE Specification_Document SHALL define the source section optional fields: checksum (string, MD5 hash of original file), content (string or binary, original content for inline/bundled mode), and filename (string, original filename for human readability)
5. WHEN source.mode is sidecar, THE Specification_Document SHALL require the checksum field to be present for integrity verification of the referenced original file
6. WHEN source.mode is inline or bundled, THE Specification_Document SHALL require the content field to be present containing the original content
7. THE Specification_Document SHALL define the annotations section as an array of Annotation objects, where each element represents one annotation on the source content
8. FOR ALL valid CTX_File JSON instances, serializing then deserializing SHALL produce an equivalent object (round-trip property)

### 需求 2：注解模型核心定义

**用户故事：** 作为协议实现者，我希望规范文档完整定义注解的核心数据模型，以便我能够正确实现注解的创建、解析和处理。

#### 验收标准

1. THE Specification_Document SHALL define the Annotation structure with required field: anchor (Anchor object defining where the annotation attaches), and optional fields: id (string, annotation name, like CSS id), signs (array of sign keywords), whatis (string, object type), and context (Context object)
2. THE Specification_Document SHALL define the signs field as an optional array of marker nature keywords that are combinable. Built-in signs (4): highlight, warning, question, secret. Custom signs use vendor:signname format
3. THE Specification_Document SHALL define the whatis field as an optional string indicating the object type of the annotated content. Built-in whatis values (9): person, organization, event, time, place, term, object, skill, emotion
4. THE Specification_Document SHALL define the context sub-structure with optional fields: participants (array of contextValue), memory (array of contextValue), situation (array of contextValue), subtext (array of contextValue), culture (array of contextValue), references (array of contextValue), and reactions (array of Reaction objects). Each contextValue is one of: text description (string), anchor reference (anchor object), or URL (string)
5. THE Specification_Document SHALL specify that reactions are defined inside the context sub-structure, with each Reaction having a type (render / function / app / command) and params (object)
6. IF an Annotation contains no anchor field, THEN THE Parser SHALL reject the CTX_File with a validation error indicating the missing anchor

### 需求 3：锚点系统定义（多媒体附着位置）

**用户故事：** 作为协议实现者，我希望规范文档定义注解在不同媒体类型上的锚点系统，以便我能够正确实现文本、图片、视频、音频内容的注解定位。

#### 验收标准

1. THE Specification_Document SHALL define the Anchor with six scope variants: global (全局), coordinate (坐标), marker (标记), feature (特征), pattern (模式), and annotation (注解引用)
2. THE Specification_Document SHALL define the global anchor scope as applying to the entire source content, used for context-level annotations
3. THE Specification_Document SHALL define the coordinate anchor scope for position-based attachment, supporting text ranges (start/end character offsets where start MUST be less than end), image regions (rectangular or polygon), video time ranges (time_start/time_end where time_start MUST ≤ time_end, with optional spatial region), and audio time ranges (time_start/time_end where time_start MUST ≤ time_end)
4. THE Specification_Document SHALL define the marker anchor scope for attaching annotations to named markers or bookmarks within the content
5. THE Specification_Document SHALL define the feature anchor scope for attaching annotations to detected features (e.g., faces, objects) within the content
6. THE Specification_Document SHALL define the pattern anchor scope for attaching annotations to content matching a specified pattern (e.g., regex, selector)
7. THE Specification_Document SHALL define the annotation anchor scope for annotating other annotations, with a ref field pointing to the target annotation's id, enabling meta-annotations (annotations about annotations)
8. WHEN the source.media_type is a text type, THE Specification_Document SHALL specify that annotations MUST use compatible anchor scopes (global, coordinate with text range, marker, pattern, or annotation)
9. WHEN the source.media_type is an image type, THE Specification_Document SHALL specify that annotations MUST use compatible anchor scopes (global, coordinate with image region, feature, or annotation)
10. WHEN the source.media_type is a video type, THE Specification_Document SHALL specify that annotations MUST use compatible anchor scopes (global, coordinate with video/image region, feature, or annotation)
11. WHEN the source.media_type is an audio type, THE Specification_Document SHALL specify that annotations MUST use compatible anchor scopes (global, coordinate with audio range, or annotation)

### 需求 4：内置 Signs 和 Whatis 关键词定义

**用户故事：** 作为协议实现者，我希望规范文档定义所有内置的 signs 标记关键词和 whatis 对象类型关键词，以便我能够正确实现注解的语义标记和对象分类。

#### 验收标准

1. THE Specification_Document SHALL define the built-in signs keywords (4): highlight (高亮), warning (警告), question (问题), secret (秘密)
2. THE Specification_Document SHALL specify that signs are combinable — a single annotation MAY have multiple signs simultaneously (e.g., signs: ["warning", "secret"])
3. THE Specification_Document SHALL specify that custom signs use the vendor:signname format (e.g., myapp:approved, acme:reviewed)
4. THE Specification_Document SHALL define the built-in whatis keywords (9): person (人物), organization (组织), event (事件), time (时间), place (地点), term (术语), object (物体), skill (技能), emotion (情感)
5. THE Specification_Document SHALL specify that both signs and whatis fields are OPTIONAL and MAY be omitted from an annotation
6. THE Specification_Document SHALL specify that the secret sign indicates sensitive content that SHOULD be handled with additional care by implementations (e.g., not logged, not cached in plaintext)

### 需求 5：反应系统定义（Reactions）

**用户故事：** 作为协议实现者，我希望规范文档定义注解的反应系统，以便我能够正确实现注解在显示时触发的终端行为（渲染、函数调用、应用动作、命令执行）。

#### 验收标准

1. THE Specification_Document SHALL define the Reaction structure with required fields: type (string enum: render, function, app, command) and params (object, reaction-type-specific parameters), located inside the context.reactions[] array
2. THE Specification_Document SHALL define the render reaction type with params containing: component (string, UI component name such as checkbox_list, form, highlight_marker, circle_overlay, timeline_card), and component-specific configuration fields as an open object
3. THE Specification_Document SHALL define the function reaction type with params containing: function_name (string, the preset function identifier), target_device (optional string, device identifier), and args (optional object, function arguments)
4. THE Specification_Document SHALL define the app reaction type with params containing: app_id (string, target application identifier), action_name (string, the action to trigger), and payload (optional object, action-specific data)
5. THE Specification_Document SHALL define the command reaction type with params containing: command (string, the command to execute) and env (optional object, environment variables)
6. THE Specification_Document SHALL specify that a single Annotation MAY contain multiple reactions in its context.reactions array, and the terminal SHOULD execute all reactions in array order
7. WHEN a terminal does not support a specific reaction type, THE Specification_Document SHALL specify that the terminal MUST skip the unsupported reaction and continue processing remaining reactions without error
8. THE Specification_Document SHALL provide concrete examples demonstrating: a ul list annotated with signs:["todo"] rendered as checkbox_list component, text fields annotated for collection rendered as a form component, a video frame with circle_overlay render reaction, and an audio segment with function reaction triggering device button flash

### 需求 6：内联注解语法定义

**用户故事：** 作为协议实现者，我希望规范文档定义嵌入文本内容中的内联注解语法规则，以便我能够正确实现类 Markdown 风格的注解解析和生成。

#### 验收标准

1. THE Specification_Document SHALL define the inline annotation syntax as a text-based markup language embedded within source content, using special character sequences to denote annotation boundaries and signs/whatis
2. THE Specification_Document SHALL define inline syntax markers for built-in signs: highlight (**text** or __text__), important (!!text!!), todo ([todo: text]), question (?text?), mask (~text~), and for whatis: person (@name), time ([datetime])
3. THE Specification_Document SHALL define inline syntax for attaching reactions to annotated content using a trailing reaction block syntax, e.g. [annotated content]->render(component_name, params)
4. THE Specification_Document SHALL define parsing rules including: marker precedence order, nesting rules (which markers may nest inside others), and escaping rules (backslash escaping for literal special characters)
5. THE Specification_Document SHALL define the mapping from inline annotation syntax to the Annotation data model, specifying how each inline marker produces an Annotation with the corresponding signs, whatis, anchor, and optional context.reactions
6. THE Specification_Document SHALL define a pretty-printer specification that formats Annotation data model instances back into valid inline annotation syntax
7. FOR ALL valid inline-annotated text, parsing then pretty-printing then parsing SHALL produce an equivalent set of Annotation structures (round-trip property)
8. WHEN an inline annotation marker is malformed or unclosed, THE Specification_Document SHALL specify that the parser MUST treat the marker characters as literal text and emit a warning, preserving the original content

### 需求 7：Sidecar 注解格式定义

**用户故事：** 作为协议实现者，我希望规范文档定义独立于原始文件的 Sidecar 注解格式，以便我能够为不可修改的媒体文件（图片、视频、音频）创建外部注解层。

#### 验收标准

1. THE Specification_Document SHALL define the sidecar format as a CTX_File where source.mode is sidecar, source.checksum contains the MD5 hash of the original file, and source.content is absent
2. THE Specification_Document SHALL define the sidecar file naming convention: the sidecar file MUST be named as the original filename with .ctx appended (e.g., overview.md.ctx for overview.md, photo.png.ctx for photo.png)
3. THE Specification_Document SHALL define the bundled format as a CTX_File where source.mode is bundled, source.content contains the original file content (base64-encoded for binary media), and the file is named with .ctx extension only
4. THE Specification_Document SHALL define the inline format as a CTX_File where source.mode is inline, source.content contains the original text with inline annotation markers embedded, and the annotations array contains the parsed structured annotations
5. THE Specification_Document SHALL specify that sidecar mode is the RECOMMENDED mode for annotating binary media files (images, video, audio) since their content cannot embed inline markers
6. WHEN a sidecar .ctx file is loaded, THE Specification_Document SHALL specify that the parser MUST verify the checksum against the original file to detect content drift, and emit a warning if the checksum does not match

### 需求 8：语境子结构定义（Context Sub-structure）

**用户故事：** 作为协议实现者，我希望规范文档定义注解的语境子结构，以便我能够用统一的 context 对象承载参与者、记忆、情境、文化等语境数据和反应。

#### 验收标准

1. THE Specification_Document SHALL define the context sub-structure as an optional object within each Annotation, containing: participants (array of contextValue), memory (array of contextValue), situation (array of contextValue), subtext (array of contextValue), culture (array of contextValue), references (array of contextValue), and reactions (array of Reaction). All fields except reactions use the unified contextValue type
2. THE Specification_Document SHALL define contextValue as a union type where each element can be one of three forms: a text description (string), an anchor reference (anchor object, same types as annotation anchors), or a URL (string)
3. THE Specification_Document SHALL define context.participants as an optional array of contextValue, where each element describes a participant via text, anchor reference, or URL
4. THE Specification_Document SHALL define context.memory as an optional array of contextValue, where each element describes what memory the annotation is based on (e.g., text: "Based on our conversation last Tuesday about the project deadline", or an anchor referencing a prior annotation)
5. THE Specification_Document SHALL define context.situation as an optional array of contextValue, where each element describes under what situation the annotation applies (e.g., text: "During a team standup meeting, discussing sprint blockers")
6. THE Specification_Document SHALL define context.subtext as an optional array of contextValue, where each element describes the subtext, implication, or hidden meaning behind the annotated content
7. THE Specification_Document SHALL define context.culture as an optional array of contextValue, where each element describes under what cultural context the annotation applies (e.g., text: "In Japanese business culture, indirect refusal is common")
8. THE Specification_Document SHALL define context.references as an optional array of contextValue, where each element provides a reference to related materials via text description, anchor, or URL
9. THE Specification_Document SHALL define context.reactions as an optional array of Reaction objects, where each Reaction specifies a type (render/function/app/command) and params, triggered when the annotation is displayed
10. THE Specification_Document SHALL specify that all context sub-fields are OPTIONAL — an annotation MAY have a context with only participants, or only reactions, or any combination

### 需求 9：.ctx 文件打包模式定义

**用户故事：** 作为协议实现者，我希望规范文档定义三种 .ctx 文件打包模式的完整规则，以便我能够正确实现文件的创建、存储和分发。

#### 验收标准

1. THE Specification_Document SHALL define three CTX_File packaging modes: inline (annotations embedded in text content), sidecar (separate .ctx file referencing original), and bundled (original content and annotations packaged together)
2. THE Specification_Document SHALL define the inline mode constraints: source.media_type MUST be a text type (text/*), source.content contains the annotated text with inline markers, and the annotations array contains the equivalent structured annotations parsed from inline markers
3. THE Specification_Document SHALL define the sidecar mode constraints: source.checksum MUST be present, source.content MUST be absent, and the .ctx file MUST be stored alongside the original file with the naming convention original_filename.ext.ctx
4. THE Specification_Document SHALL define the bundled mode constraints: source.content MUST be present (base64-encoded for binary content), source.checksum SHOULD be present for integrity verification, and the file uses .ctx extension only
5. THE Specification_Document SHALL specify mode selection guidance: inline mode is RECOMMENDED for text content where human readability of annotations is desired; sidecar mode is RECOMMENDED for binary media or when the original file must remain unmodified; bundled mode is RECOMMENDED for self-contained distribution
6. THE Specification_Document SHALL define conversion rules between modes: inline-to-sidecar conversion MUST extract inline markers into structured annotations and compute the checksum of the clean text; sidecar-to-inline conversion MUST embed structured annotations as inline markers into the text content (only valid for text media types)

### 需求 10：反应系统的默认 UI 组件映射

**用户故事：** 作为终端开发者，我希望规范文档定义 render 反应的默认 UI 组件映射规则，以便我能够正确实现注解到界面组件的渲染。

#### 验收标准

1. THE Specification_Document SHALL define a set of built-in render component names and their semantic descriptions: checkbox_list (可勾选列表), form (交互式表单), highlight_marker (高亮标记), circle_overlay (圆形覆盖层), timeline_card (时间线卡片), action_button (操作按钮), data_table (数据表格), media_preview (媒体预览), text_block (文本块)
2. THE Specification_Document SHALL specify that text_block is the universal fallback component: when a terminal does not support the requested render component, the terminal MUST degrade to text_block
3. THE Specification_Document SHALL define the render reaction params schema for each built-in component, specifying required and optional configuration fields (e.g., checkbox_list requires items array; form requires fields array; circle_overlay requires cx, cy, radius)
4. THE Specification_Document SHALL specify that render component names use an open naming system where custom components MAY be registered using a namespace prefix convention (e.g., myapp:custom_widget)
5. THE Specification_Document SHALL provide React reference implementation guidelines for each built-in component, specifying the expected props interface and rendering behavior as non-normative guidance
6. WHEN a terminal encounters an unknown render component name, THE Specification_Document SHALL specify that the terminal MUST fall back to text_block rendering and SHOULD log a warning

### 需求 11：扩展机制定义

**用户故事：** 作为协议扩展开发者，我希望规范文档定义扩展和版本管理机制，以便我能够注册自定义注解类型、自定义动作类型，并管理协议版本兼容性。

#### 验收标准

1. THE Specification_Document SHALL define a namespace convention for custom signs using the format vendor:signname (e.g., myapp:approved, acme:reviewed), where built-in signs use no namespace prefix
2. THE Specification_Document SHALL define a namespace convention for custom reaction types using the vendor:type_name format, allowing extensions to define new reaction types beyond render, function, app, and command
3. THE Specification_Document SHALL define a namespace convention for custom render component names using the same vendor:component_name format
4. THE Specification_Document SHALL define version compatibility rules: parsers encountering unknown signs MUST preserve them without interrupting processing; parsers encountering unknown reaction types MUST skip the reaction and continue; parsers encountering unknown fields MUST ignore them
5. THE Specification_Document SHALL define the meta.version field semantics using semantic versioning: major version changes indicate breaking format changes; minor version changes indicate backward-compatible additions; patch changes indicate corrections
6. THE Specification_Document SHALL specify backward compatibility guarantees: a CTX_File produced by version N.x MUST be parseable by any parser supporting version N.y where y >= x

### 需求 12：安全与隐私规范

**用户故事：** 作为安全工程师，我希望规范文档定义 .ctx 文件的安全和隐私控制要求，以便我能够正确实现注解的内容遮罩和输入验证。

#### 验收标准

1. THE Specification_Document SHALL specify that the mask sign (in the signs array) is the primary mechanism for content hiding — annotations with signs containing "mask" SHOULD have their annotated content hidden or obscured by default in rendering
2. THE Specification_Document SHALL specify that when rendering a CTX_File, the terminal SHOULD respect the mask sign by hiding or obscuring the annotated content, and MAY provide a user interaction to reveal masked content
3. THE Specification_Document SHALL specify that the secret sign indicates sensitive content that SHOULD be handled with additional care by implementations (e.g., not logged, not cached in plaintext)
4. THE Specification_Document SHALL specify input validation requirements: all CTX_File content MUST be validated against the schema before processing; reaction params MUST be sanitized to prevent injection attacks; command reaction types MUST be restricted to a pre-approved command allowlist in production environments
5. THE Specification_Document SHALL specify that the checksum field in sidecar mode provides integrity verification only and does not constitute a security mechanism; cryptographic signing of CTX_Files is outside the scope of this specification but MAY be layered on top
6. IF a CTX_File contains reaction type command, THEN THE Specification_Document SHALL specify that the terminal MUST require explicit user consent before execution

### 需求 13：Schema 文件策略

**用户故事：** 作为协议实现者，我希望规范文档定义 Schema 文件的管理策略和生成规则，以便我能够正确维护 schema.json 作为权威数据源。

#### 验收标准

1. THE Specification_Document SHALL designate schema.json as the single source of truth for all CTX_File data model definitions
2. THE Specification_Document SHALL specify that schema.ts MUST be generated from schema.json and MUST NOT contain definitions that diverge from schema.json
3. THE Specification_Document SHALL specify that schema.mdx MUST be generated from schema.json and MUST NOT contain definitions that diverge from schema.json
4. THE Schema (schema.json) SHALL use JSON Schema 2020-12 syntax and define the CTX_File root structure with meta, source, and annotations sections
5. THE Schema SHALL be a complete and self-contained definition, with all type definitions referenced via $ref within the $defs section
6. FOR ALL data model definitions in the Specification_Document, THE Schema SHALL contain a corresponding JSON Schema definition that is structurally equivalent

### 需求 14：示例文档

**用户故事：** 作为协议实现者，我希望规范文档包含完整的 .ctx 文件示例，以便我能够直观理解各种注解场景的实际使用方式。

#### 验收标准

1. THE Specification_Document SHALL include a complete sidecar .ctx file example for a Markdown text document, demonstrating coordinate anchors with signs and render reactions
2. THE Specification_Document SHALL include a complete sidecar .ctx file example for an image file, demonstrating coordinate anchors with circle_overlay render reaction
3. THE Specification_Document SHALL include a complete sidecar .ctx file example for a video file, demonstrating coordinate anchors with time-based annotations and region overlay
4. THE Specification_Document SHALL include a complete sidecar .ctx file example for an audio file, demonstrating coordinate anchors with function reaction triggering a device operation (e.g., button flash)
5. THE Specification_Document SHALL include a complete inline .ctx file example demonstrating inline annotation syntax embedded in text content with the equivalent structured annotations array
6. THE Specification_Document SHALL include a complete bundled .ctx file example demonstrating original content packaged with annotations
7. THE Specification_Document SHALL include an example demonstrating context sub-structure usage: annotations with context.participants, context.memory, context.situation, and context.culture fields
8. THE Specification_Document SHALL include an example demonstrating the mask sign for content hiding, and the annotation anchor scope for meta-annotations
9. FOR ALL JSON examples in the Specification_Document, THE example SHALL validate successfully against the schema.json definition

### 需求 15：规范文档结构与格式

**用户故事：** 作为协议规范的读者，我希望规范文档采用标准的协议规范格式，以便我能够高效地查阅和引用协议内容。

#### 验收标准

1. THE Specification_Document SHALL adopt a single-file chapter-numbered format similar to HTTP/2 (RFC 7540) or WebSocket (RFC 6455) specifications
2. THE Specification_Document SHALL include the following top-level chapters: 协议概述, .ctx 文件结构, 注解模型, 锚点系统, 内置 Signs 与 Whatis 关键词, 反应系统, 内联注解语法, Sidecar 与打包模式, 扩展机制, 安全与隐私, 合规性要求, and 示例文档
3. THE Specification_Document SHALL use sequential chapter numbering (1, 2, 3...) with sub-section numbering (1.1, 1.2, 2.1...)
4. THE Specification_Document SHALL be written in Chinese (zh-CN) as the primary language, with English terms provided in parentheses for technical terminology on first occurrence
5. THE Specification_Document SHALL use RFC 2119 keywords in uppercase when expressing normative requirements within the specification text
6. THE Specification_Document SHALL define conformance levels using RFC 2119 keywords: MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY, with their semantics explained in the protocol overview chapter
