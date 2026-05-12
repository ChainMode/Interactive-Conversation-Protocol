# 需求文档

## 简介

本需求文档定义 ICP（Interactive Conversation Protocol）开发者指南文档的编写需求。开发者指南是面向协议实现者和系统集成者的技术文档，位于 `docs/{lang}/develop/`，应用场景案例位于 `docs/{lang}/develop/cases/`。

开发者指南的目标是教会开发者如何：
1. 基于 ICP 协议规范实现协议的核心组件（解析器、语境管理器、终端适配器）
2. 将 ICP 集成到现有系统中（聊天应用、语音助手、AR/VR 系统、AI Agent 框架）
3. 通过真实应用场景案例理解 ICP 的实际使用方式
4. 遵循最佳实践进行错误处理、性能优化和安全防护

本文档关注的是"开发者指南文档应覆盖哪些内容"，而非软件功能需求。每条需求对应指南中的一个章节或内容模块。

## 术语表

- **Developer_Guide**: 开发者指南，位于 `docs/{lang}/develop/` 的技术文档集合
- **Case_Document**: 应用场景案例文档，位于 `docs/{lang}/develop/cases/` 的独立案例文件
- **ICP_Parser**: ICP 解析器，负责将注解标记文本解析为结构化 Annotation 数据，以及将 ICP JSON 文档进行序列化/反序列化
- **Context_Manager**: 语境管理器，负责捕获、验证、合并和传递语境信息的组件
- **Terminal_Adapter**: 终端适配器，负责将 ICP 中间语言转换为特定终端交互界面的组件
- **Rendering_Engine**: 渲染引擎，终端适配器中负责组件选择和界面组装的子系统
- **Fallback_Handler**: 降级处理器，当终端不支持指定组件或模态通道时执行替代渲染策略的模块
- **Skill_Bridge**: 技能桥接器，通过 skills 注册表调用外部服务（MCP、A2A、OpenAPI 等）的集成模块
- **Cross_Terminal_Coordinator**: 跨终端协调器，在多终端场景中协调语境同步和渲染任务分发的组件
- **Visibility_Filter**: 可见性过滤器，根据参与者身份和权限控制信息可见范围的组件

## 需求

### 需求 1：协议实现指南 — 软件接口设计

**用户故事：** 作为一个协议实现者，我希望开发者指南提供基于 ICP 规范设计软件接口的指导，以便我能够正确规划协议实现的模块划分和接口契约。

#### 验收标准

1. THE Developer_Guide SHALL include a section that describes the recommended module architecture for an ICP implementation, covering the ICP_Parser, Context_Manager, Terminal_Adapter, and Skill_Bridge as core modules
2. THE Developer_Guide SHALL define the input/output interface contract for each core module, specifying the data types accepted and returned
3. THE Developer_Guide SHALL provide a data flow diagram illustrating the Human-to-Machine processing pipeline: raw text → annotation parsing → context merging → intermediate language output
4. THE Developer_Guide SHALL provide a data flow diagram illustrating the Machine-to-Human processing pipeline: ICP document → visibility filtering → terminal adaptation → interface assembly
5. THE Developer_Guide SHALL explain how the core modules interact with each other through well-defined interfaces, using code-level pseudocode or TypeScript interface definitions as examples
6. THE Developer_Guide SHALL reference the ICP JSON Schema (`schema/2025-10-25/schema.json`) as the authoritative data model definition for all interface contracts

### 需求 2：协议实现指南 — ICP 解析器实现

**用户故事：** 作为一个协议实现者，我希望开发者指南详细说明如何实现 ICP 解析器，以便我能够正确解析注解标记文本和序列化/反序列化 ICP JSON 文档。

#### 验收标准

1. THE Developer_Guide SHALL include a section that explains the annotation marker syntax rules for each semantic type: emphasis (`**text**`), priority (`!!text!!`), datetime (`[date]`), person_ref (`@name`), action_trigger (`{action: text}`), and visibility (`~level: text~`)
2. THE Developer_Guide SHALL describe the parsing algorithm for annotation markers, including precedence rules, nesting handling, and escape character processing
3. THE Developer_Guide SHALL provide step-by-step code examples demonstrating how to parse annotated text into an array of Annotation objects with correct type, target range, and data payload
4. THE Developer_Guide SHALL describe how to implement JSON serialization of ICP_Document objects, including required fields validation and optional fields handling
5. THE Developer_Guide SHALL describe how to implement JSON deserialization of ICP_Document objects, including schema validation against `schema.json`
6. THE Developer_Guide SHALL describe how to implement a pretty-printer that formats Annotation data model instances back into valid annotation marker syntax
7. THE Developer_Guide SHALL explain the round-trip property requirement: for all valid annotated text, parsing then pretty-printing then parsing produces an equivalent Annotation structure
8. THE Developer_Guide SHALL describe error handling for malformed annotation markers, specifying that the parser returns an Error_Object with error_type `parse_error` and a location pointing to the malformed marker position

### 需求 3：协议实现指南 — 语境管理器实现

**用户故事：** 作为一个协议实现者，我希望开发者指南详细说明如何实现语境管理器，以便我能够正确捕获、验证、合并和传递语境信息。

#### 验收标准

1. THE Developer_Guide SHALL include a section that describes the Context data model structure, covering participants, memory, concepts, situation, environment, and culture sub-objects
2. THE Developer_Guide SHALL explain how to implement context validation, including required field checks and scope enum validation (session, document, request)
3. THE Developer_Guide SHALL explain how to implement context merging logic, specifying that the most recent values take precedence for conflicting fields
4. THE Developer_Guide SHALL describe how to manage context lifecycle across session, document, and request scopes
5. THE Developer_Guide SHALL provide code examples demonstrating context creation, validation, merging, and serialization/deserialization with round-trip correctness
6. THE Developer_Guide SHALL explain how the `public` flag on Context controls cross-session and external visibility of context data

### 需求 4：协议实现指南 — 终端适配器实现

**用户故事：** 作为一个终端开发者，我希望开发者指南详细说明如何实现终端适配器，以便我能够将 ICP 中间语言正确渲染为特定终端的交互界面。

#### 验收标准

1. THE Developer_Guide SHALL include a section that describes the Terminal_Adapter architecture, covering component selection, rendering, and fallback handling
2. THE Developer_Guide SHALL explain how to implement component rendering for each Component_Type: text_block, form_card, action_button, data_table, and media_preview
3. THE Developer_Guide SHALL explain how to implement the graceful degradation strategy, specifying that when a terminal does not support a requested Component_Type, the Fallback_Strategy is used, and when no Fallback_Strategy is provided, the terminal degrades to text_block
4. THE Developer_Guide SHALL explain how Rendering_Hint.priority_level (critical, high, normal, low) affects the ordering and prominence of rendered components
5. THE Developer_Guide SHALL explain how Modality_Channel (text, audio, vision, tactile, multi) affects component selection, and that terminals degrade to the text channel when the specified channel is unsupported
6. THE Developer_Guide SHALL provide code examples demonstrating a minimal Terminal_Adapter implementation that handles component rendering, fallback, and multi-channel message interpretation
7. THE Developer_Guide SHALL explain how to register custom terminal adapters through the plugin interface, specifying the required interface methods

### 需求 5：集成指南 — 聊天应用集成

**用户故事：** 作为一个聊天应用开发者，我希望开发者指南说明如何将 ICP 集成到聊天应用中，以便我能够在聊天界面中渲染动态表单卡片、操作按钮和结构化信息。

#### 验收标准

1. THE Developer_Guide SHALL include a section that describes the integration architecture for chat applications, covering message interception, ICP parsing, and dynamic UI rendering
2. THE Developer_Guide SHALL explain how to intercept chat messages and detect ICP-annotated content for parsing
3. THE Developer_Guide SHALL explain how to render ICP Component_Type elements (form_card, action_button, data_table) within a chat message bubble or card layout
4. THE Developer_Guide SHALL explain how to handle user interactions with rendered ICP components (form submission, button clicks) and convert them back into ICP-formatted responses
5. THE Developer_Guide SHALL provide a code example demonstrating end-to-end ICP integration in a chat application, from message reception to component rendering to user interaction handling

### 需求 6：集成指南 — 语音助手集成

**用户故事：** 作为一个语音助手开发者，我希望开发者指南说明如何将 ICP 集成到语音助手中，以便我能够通过音频模态通道呈现 ICP 内容并在无屏幕设备上实现优雅降级。

#### 验收标准

1. THE Developer_Guide SHALL include a section that describes the integration architecture for voice assistants, covering audio channel rendering and text fallback strategies
2. THE Developer_Guide SHALL explain how to implement audio-channel rendering for ICP content, including text-to-speech conversion of message body and annotation-aware speech synthesis
3. THE Developer_Guide SHALL explain how to implement graceful degradation for visual components (form_card, data_table, media_preview) on audio-only devices, converting them to spoken descriptions or simplified interactions
4. THE Developer_Guide SHALL explain how to handle action_trigger annotations in voice-only mode, converting them to voice-confirmable actions
5. THE Developer_Guide SHALL provide a code example demonstrating ICP integration with a voice assistant, including audio rendering and fallback handling

### 需求 7：集成指南 — AR/VR 系统集成

**用户故事：** 作为一个 AR/VR 开发者，我希望开发者指南说明如何将 ICP 集成到 AR/VR 系统中，以便我能够在增强现实或虚拟现实环境中呈现 ICP 内容并实现跨终端协调。

#### 验收标准

1. THE Developer_Guide SHALL include a section that describes the integration architecture for AR/VR systems, covering vision-channel rendering, spatial anchoring, and cross-terminal coordination
2. THE Developer_Guide SHALL explain how to implement vision-channel rendering for ICP content, including spatial overlay of annotations on real-world or virtual objects
3. THE Developer_Guide SHALL explain how to use the environment.hardware capabilities in Context to detect AR/VR device features and adapt rendering accordingly
4. THE Developer_Guide SHALL explain how to implement cross-terminal coordination using the Cross_Terminal_Coordinator, distributing rendering tasks between AR headset, companion screen, and other devices
5. THE Developer_Guide SHALL provide a code example demonstrating ICP integration with an AR system, including spatial annotation rendering and cross-device context synchronization

### 需求 8：集成指南 — AI Agent 框架集成

**用户故事：** 作为一个 AI Agent 框架开发者，我希望开发者指南说明如何将 ICP 集成到现有 AI Agent 框架中，以便 Agent 能够通过 ICP 与用户进行结构化的人机交互。

#### 验收标准

1. THE Developer_Guide SHALL include a section that describes the integration architecture for AI Agent frameworks, covering the Skill_Bridge mechanism for protocol binding (MCP, A2A, OpenAPI)
2. THE Developer_Guide SHALL explain how to configure skills in the ICP document's skills registry, specifying protocol type and binding payload for each supported protocol
3. THE Developer_Guide SHALL explain how an AI Agent generates ICP-formatted responses with appropriate annotations, rendering hints, and context information
4. THE Developer_Guide SHALL explain how to bridge ICP with MCP (Model Context Protocol) for tool invocation, including the `protocol: "mcp"` binding configuration
5. THE Developer_Guide SHALL explain how to bridge ICP with A2A (Agent-to-Agent Protocol) for inter-agent communication, including the `protocol: "google-a2a"` binding configuration
6. THE Developer_Guide SHALL provide a code example demonstrating an AI Agent that receives user input, processes it through ICP, invokes skills, and returns an ICP-formatted response

### 需求 9：应用场景案例 — 智能聊天应用

**用户故事：** 作为一个开发者，我希望开发者指南提供一个智能聊天应用的完整案例，以便我能够理解 ICP 在聊天场景中如何实现动态表单卡片和操作按钮。

#### 验收标准

1. THE Case_Document SHALL be located at `docs/{lang}/develop/cases/` as an independent document file
2. THE Case_Document SHALL describe a chat application scenario where the AI dynamically generates form_card and action_button components within the chat interface
3. THE Case_Document SHALL include a complete ICP_Document JSON example demonstrating a multi-turn conversation with annotations, rendering hints, and context
4. THE Case_Document SHALL include step-by-step explanation of how the chat client parses the ICP document, selects components, and renders the dynamic interface
5. THE Case_Document SHALL demonstrate how user interactions with form_card (form submission) and action_button (button click) are captured and converted back into ICP-formatted messages

### 需求 10：应用场景案例 — 智能音箱

**用户故事：** 作为一个开发者，我希望开发者指南提供一个智能音箱的完整案例，以便我能够理解 ICP 在语音场景中如何实现音频模态呈现和文本降级。

#### 验收标准

1. THE Case_Document SHALL be located at `docs/{lang}/develop/cases/` as an independent document file
2. THE Case_Document SHALL describe a smart speaker scenario where the AI delivers ICP content through the audio Modality_Channel with text fallback for companion screen devices
3. THE Case_Document SHALL include a complete ICP_Document JSON example with `channel: "audio"` messages, Modality_Metadata for audio configuration (voice_id, speed, language), and fallback strategies
4. THE Case_Document SHALL include step-by-step explanation of how the smart speaker renders audio content and how a companion screen device renders the text fallback simultaneously
5. THE Case_Document SHALL demonstrate graceful degradation when visual components (form_card, data_table) are encountered on an audio-only device

### 需求 11：应用场景案例 — AR 辅助维修

**用户故事：** 作为一个开发者，我希望开发者指南提供一个 AR 辅助远程维修的完整案例，以便我能够理解 ICP 在跨终端协调场景中如何实现多设备协同交互。

#### 验收标准

1. THE Case_Document SHALL be located at `docs/{lang}/develop/cases/` as an independent document file
2. THE Case_Document SHALL describe an AR-assisted remote maintenance scenario involving at least two terminal devices: an AR headset for the on-site technician and a screen for the remote expert
3. THE Case_Document SHALL include a complete ICP_Document JSON example with cross-terminal context (environment.hardware entries for multiple devices), vision-channel annotations with spatial anchoring, and situation context describing the maintenance scenario
4. THE Case_Document SHALL include step-by-step explanation of how the Cross_Terminal_Coordinator distributes rendering tasks between the AR headset (spatial overlay) and the remote screen (circuit diagram and step instructions)
5. THE Case_Document SHALL demonstrate how context synchronization works when a new device joins or an existing device disconnects during the session

### 需求 12：应用场景案例 — 企业审批流

**用户故事：** 作为一个开发者，我希望开发者指南提供一个企业审批流的完整案例，以便我能够理解 ICP 在可见性控制场景中如何实现基于参与者身份的信息访问控制。

#### 验收标准

1. THE Case_Document SHALL be located at `docs/{lang}/develop/cases/` as an independent document file
2. THE Case_Document SHALL describe an enterprise approval workflow scenario involving multiple participants with different visibility levels (private, shared, public)
3. THE Case_Document SHALL include a complete ICP_Document JSON example with visibility annotations (`~level: text~`), participant definitions with different visibility settings, and mixed-visibility content within a single message
4. THE Case_Document SHALL include step-by-step explanation of how the Visibility_Filter processes mixed-visibility content, filtering the message to include only content authorized for each requesting participant
5. THE Case_Document SHALL demonstrate how the approval workflow uses action_trigger annotations for approve/reject actions and form_card for approval form rendering

### 需求 13：应用场景案例 — 多终端协作

**用户故事：** 作为一个开发者，我希望开发者指南提供一个多终端协作的完整案例，以便我能够理解 ICP 在多设备场景中如何实现语境同步和渲染任务分发。

#### 验收标准

1. THE Case_Document SHALL be located at `docs/{lang}/develop/cases/` as an independent document file
2. THE Case_Document SHALL describe a multi-device collaboration scenario involving at least three terminal types (such as desktop screen, mobile phone, and smart speaker) working together in a single session
3. THE Case_Document SHALL include a complete ICP_Document JSON example with multi-channel messages (`channel: "multi"`), per-annotation channel hints, environment context describing multiple hardware devices and their capabilities, and session management with shared context
4. THE Case_Document SHALL include step-by-step explanation of how the Cross_Terminal_Coordinator distributes rendering tasks to each terminal based on reported capabilities and channel compatibility
5. THE Case_Document SHALL demonstrate session lifecycle management including device join, context synchronization, device disconnect, and rendering task redistribution

### 需求 14：最佳实践 — 错误处理模式

**用户故事：** 作为一个协议实现者，我希望开发者指南提供错误处理的最佳实践，以便我能够在 ICP 实现中正确处理各类错误情况。

#### 验收标准

1. THE Developer_Guide SHALL include a best practices section that describes error handling patterns for ICP implementations
2. THE Developer_Guide SHALL describe error handling patterns for each processing stage: annotation parsing errors, context validation errors, schema validation errors, rendering errors, and network communication errors
3. THE Developer_Guide SHALL explain how to construct and return structured Error_Object instances with correct error_type, error_code, message, location, and timestamp fields
4. THE Developer_Guide SHALL explain the retry strategy for network communication failures: exponential backoff up to 3 attempts before returning a timeout Error_Object
5. THE Developer_Guide SHALL explain how to handle unknown annotation types gracefully: preserving raw content and logging a warning without interrupting processing
6. THE Developer_Guide SHALL provide code examples demonstrating error handling patterns for common failure scenarios

### 需求 15：最佳实践 — 性能优化

**用户故事：** 作为一个协议实现者，我希望开发者指南提供性能优化的最佳实践，以便我能够构建高效的 ICP 实现。

#### 验收标准

1. THE Developer_Guide SHALL include a best practices section that describes performance optimization strategies for ICP implementations
2. THE Developer_Guide SHALL describe optimization strategies for annotation parsing, including incremental parsing for large documents and lazy evaluation of annotation data payloads
3. THE Developer_Guide SHALL describe optimization strategies for context management, including context caching across requests within the same session scope and efficient context merging algorithms
4. THE Developer_Guide SHALL describe optimization strategies for terminal rendering, including component lazy loading, rendering priority based on Rendering_Hint.priority_level, and viewport-aware rendering
5. THE Developer_Guide SHALL describe optimization strategies for JSON serialization/deserialization, including streaming parsing for large ICP documents and schema validation caching

### 需求 16：最佳实践 — 安全考量

**用户故事：** 作为一个协议实现者，我希望开发者指南提供安全方面的最佳实践，以便我能够在 ICP 实现中正确处理输入验证、可见性控制和数据保护。

#### 验收标准

1. THE Developer_Guide SHALL include a best practices section that describes security considerations for ICP implementations
2. THE Developer_Guide SHALL describe input validation best practices: validating all input data before processing to prevent injection attacks, including annotation marker injection and JSON payload injection
3. THE Developer_Guide SHALL describe visibility control implementation best practices: enforcing Visibility_Level access control (private, shared, public) and verifying requester identity before granting access to restricted content
4. THE Developer_Guide SHALL describe context data protection best practices: sanitizing sensitive information in context objects, respecting the `public` flag for cross-session visibility, and encrypting context data in transit
5. THE Developer_Guide SHALL provide code examples demonstrating secure input validation and visibility filtering patterns
