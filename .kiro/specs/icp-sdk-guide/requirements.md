# 需求文档

## 简介

本需求文档定义 ICP（Interactive Conversation Protocol）SDK 指南文档的编写需求。SDK 指南是面向 SDK 开发者和使用者的技术文档，位于 `docs/{lang}/sdk/`。

ICP SDK 的核心职责：
1. 给定语言文本、语境、用户意图等上下文因素，将其组装为 ICP 中间语言文档（ICP_Document）
2. 读取 ICP 文档，解析并渲染对应的交互界面

SDK 的实际代码库位于独立仓库，本指南定义接口规范和使用文档。SDK 指南涵盖设计原则与架构规范、核心接口规范、多语言实现指引、使用教程、以及测试与发布规范。

## 术语表

- **SDK_Guide**: SDK 指南文档，位于 `docs/{lang}/sdk/` 的技术文档集合
- **ICP_SDK**: ICP 软件开发工具包，提供 ICP 文档组装、解析和渲染能力的程序库
- **Parser**: 解析器，负责将注解标记文本解析为结构化 Annotation 数据，以及将 ICP JSON 文档反序列化为内存对象
- **Serializer**: 序列化器，负责将内存中的 ICP 数据结构序列化为 JSON 格式的 ICP_Document
- **Context_Manager**: 语境管理器，负责捕获、验证、合并和传递 Context 语境信息的模块
- **Adapter**: 适配器，负责将 ICP 中间语言转换为特定终端交互界面的模块
- **Pretty_Printer**: 美化打印器，将 Annotation 数据模型实例格式化回注解标记语法文本的模块
- **SDK_Core**: SDK 核心层，零依赖的最小功能集，包含 Parser、Serializer 和数据模型定义
- **SDK_Extension**: SDK 扩展层，基于核心层构建的可选功能模块（Context_Manager、Adapter、Skill_Bridge 等）

## 需求

### 需求 1：SDK 设计原则与架构规范

**用户故事：** 作为一个 SDK 开发者，我希望 SDK 指南定义清晰的设计原则和分层架构规范，以便我能够按照统一的架构理念实现各语言版本的 SDK。

#### 验收标准

1. THE SDK_Guide SHALL define the SDK layered architecture with two layers: SDK_Core (zero-dependency minimal set containing Parser, Serializer, and data model definitions) and SDK_Extension (optional modules including Context_Manager, Adapter, and Skill_Bridge)
2. THE SDK_Guide SHALL define the following design principles for all SDK implementations: lightweight (minimal memory and startup overhead), zero-dependency core (SDK_Core has no third-party dependencies), extensible (SDK_Extension modules can be added without modifying SDK_Core), and idiomatic (each language SDK follows the conventions of its target language)
3. THE SDK_Guide SHALL specify that all SDK implementations reference `schema/2025-10-25/schema.json` as the authoritative data model definition
4. THE SDK_Guide SHALL include a dependency diagram illustrating the relationships between SDK_Core, SDK_Extension modules, and external protocol bindings (MCP, A2A, OpenAPI)
5. THE SDK_Guide SHALL specify that SDK_Core exposes a stable public API surface, and breaking changes to SDK_Core require a major version increment following semantic versioning

### 需求 2：核心 SDK 接口规范 — Parser 与 Serializer

**用户故事：** 作为一个 SDK 开发者，我希望 SDK 指南定义 Parser 和 Serializer 的接口契约，以便我能够在任意语言中实现符合规范的 ICP 文档解析和序列化。

#### 验收标准

1. THE SDK_Guide SHALL define the Parser interface with a method that accepts raw annotated text and returns an array of Annotation objects with correct type, target range, and data payload
2. THE SDK_Guide SHALL define the Serializer interface with a method that accepts an ICP_Document in-memory object and returns a JSON string conforming to `schema.json`
3. THE SDK_Guide SHALL define a deserialization method on the Parser interface that accepts a JSON string and returns a validated ICP_Document in-memory object
4. THE SDK_Guide SHALL define the Pretty_Printer interface with a method that accepts an array of Annotation objects and returns valid annotation marker syntax text
5. THE SDK_Guide SHALL require that all Parser and Serializer implementations satisfy the round-trip property: for all valid ICP_Document objects, serializing then deserializing produces an equivalent object
6. THE SDK_Guide SHALL require that all Parser and Pretty_Printer implementations satisfy the round-trip property: for all valid annotated text, parsing then pretty-printing then parsing produces an equivalent Annotation structure
7. WHEN the Parser encounters malformed input, THE SDK_Guide SHALL specify that the Parser returns a structured error object with error_type, error_code, message, and location fields
8. THE SDK_Guide SHALL provide TypeScript interface definitions as the canonical reference for all Parser, Serializer, and Pretty_Printer method signatures

### 需求 3：核心 SDK 接口规范 — Context_Manager 与 Adapter

**用户故事：** 作为一个 SDK 开发者，我希望 SDK 指南定义 Context_Manager 和 Adapter 的接口契约，以便我能够实现语境管理和终端适配功能。

#### 验收标准

1. THE SDK_Guide SHALL define the Context_Manager interface with methods for context creation, validation, merging, and scope management (session, document, request)
2. THE SDK_Guide SHALL specify that the Context_Manager merge method uses the most recent values for conflicting fields when merging context objects
3. THE SDK_Guide SHALL define the Adapter interface with methods for component rendering, fallback handling, and modality channel selection
4. THE SDK_Guide SHALL specify that the Adapter interface includes a capability reporting method that returns the list of supported Component_Type values and Modality_Channel values
5. THE SDK_Guide SHALL specify that when a terminal does not support the requested Component_Type, the Adapter uses the Fallback_Strategy, and when no Fallback_Strategy is provided, the Adapter degrades to text_block
6. THE SDK_Guide SHALL specify that when a terminal does not support the specified Modality_Channel, the Adapter degrades to the text channel as the default fallback

### 需求 4：多语言 SDK 实现指引

**用户故事：** 作为一个多语言 SDK 贡献者，我希望 SDK 指南提供各目标语言的实现指引，以便我能够按照各语言的惯用风格实现 ICP SDK。

#### 验收标准

1. THE SDK_Guide SHALL include language-specific implementation guidelines for the following languages: TypeScript/JavaScript, Python, Java, Go, and Rust
2. THE SDK_Guide SHALL specify for each target language: the recommended project structure, package naming convention, and idiomatic error handling pattern
3. THE SDK_Guide SHALL specify for each target language: the recommended approach for representing ICP data model types (e.g., TypeScript interfaces, Python dataclasses, Java records, Go structs, Rust structs with serde)
4. THE SDK_Guide SHALL designate the TypeScript/JavaScript SDK as the reference implementation, and specify that other language SDKs achieve functional equivalence with the reference implementation
5. THE SDK_Guide SHALL specify that each language SDK publishes to its ecosystem's standard package registry (npm, PyPI, Maven Central, pkg.go.dev, crates.io)

### 需求 5：SDK 使用教程 — ICP 文档组装

**用户故事：** 作为一个 SDK 使用者，我希望 SDK 指南提供如何使用 SDK 组装 ICP 文档的教程，以便我能够将语言文本、语境和用户意图组装为完整的 ICP_Document。

#### 验收标准

1. THE SDK_Guide SHALL include a tutorial section that demonstrates the end-to-end workflow of assembling an ICP_Document from raw text input, context information, and user intent
2. THE SDK_Guide SHALL provide step-by-step code examples showing: creating a message with annotation markers, attaching context (participants, situation, environment), adding rendering hints, registering skills, and serializing the complete ICP_Document to JSON
3. THE SDK_Guide SHALL provide at least one complete code example in TypeScript demonstrating the assembly of an ICP_Document containing messages with annotations, context, rendering hints, and skills
4. THE SDK_Guide SHALL explain how to validate the assembled ICP_Document against `schema.json` before serialization

### 需求 6：SDK 使用教程 — ICP 文档解析与渲染

**用户故事：** 作为一个 SDK 使用者，我希望 SDK 指南提供如何使用 SDK 解析 ICP 文档并渲染交互界面的教程，以便我能够读取 ICP 文档并在终端上呈现对应的界面。

#### 验收标准

1. THE SDK_Guide SHALL include a tutorial section that demonstrates the end-to-end workflow of parsing an ICP_Document JSON and rendering the corresponding interactive interface
2. THE SDK_Guide SHALL provide step-by-step code examples showing: deserializing JSON into an ICP_Document object, extracting annotations and rendering hints, selecting components based on terminal capabilities, applying fallback strategies, and assembling the final interface
3. THE SDK_Guide SHALL provide at least one complete code example in TypeScript demonstrating the parsing of an ICP_Document and rendering of components including text_block, form_card, and action_button
4. THE SDK_Guide SHALL explain how to handle unknown annotation types during parsing, specifying that unknown types are preserved as raw content without interrupting processing

### 需求 7：SDK 测试与发布规范

**用户故事：** 作为一个 SDK 开发者，我希望 SDK 指南定义测试和发布规范，以便我能够确保 SDK 实现的正确性并按照统一流程发布。

#### 验收标准

1. THE SDK_Guide SHALL define a conformance test suite specification that all language SDK implementations are required to pass
2. THE SDK_Guide SHALL specify that the conformance test suite includes round-trip property tests for Parser/Serializer (serialize then deserialize produces equivalent object) and Parser/Pretty_Printer (parse then print then parse produces equivalent structure)
3. THE SDK_Guide SHALL specify that the conformance test suite includes error handling tests verifying that malformed input produces structured error objects with correct error_type and location
4. THE SDK_Guide SHALL define the release versioning strategy: SDK versions follow semantic versioning, and SDK major version increments correspond to ICP protocol major version changes
5. THE SDK_Guide SHALL specify that each SDK release includes a compatibility matrix documenting the supported ICP protocol versions and schema versions
6. THE SDK_Guide SHALL define the release checklist: all conformance tests pass, API documentation is generated, changelog is updated, and the package is published to the target registry
