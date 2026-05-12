# 需求文档

## 简介

Interactive Conversation Protocol（交互式对话协议，简称 ICP）是一种用于描述指示性含义的结构化协议。本规范定义了 ICP 协议的核心功能需求，包括意识注解（Conception Annotation）的结构化表示、人机双向通信的语义转换、以及跨终端的动态界面组装能力。

## 术语表

- **ICP**: Interactive Conversation Protocol，交互式对话协议
- **Conception_Annotation**: 意识注解，概念图的结构化文本表示
- **Context_Information**: 语境信息，包括时间、地点、设备状态、参与者身份等环境信息
- **Intermediate_Language**: 中间语言，基于 JSON 规范的标准化数据结构
- **Annotation_Marker**: 注解标记，用于在自然语言中标识需要特殊处理的信息
- **Terminal_Adapter**: 终端适配器，负责将中间语言转换为特定终端的交互界面
- **Message_Interface**: 消息界面，动态组装的可交互界面组件
- **Modality_Channel**: 模态通道，信息呈现的感知通道类型（文本、语音、视觉、触觉等）
- **Cross_Terminal_Coordinator**: 跨终端协调器，负责在多个终端设备之间协调语境重现和信息同步
- **Visibility_Controller**: 可见性控制器，负责根据参与者身份和权限控制信息的可见范围
- **Session_Manager**: 会话管理器，负责管理通信会话的生命周期、状态持久化和恢复
- **Rendering_Hint**: 渲染提示，中间语言中用于指导终端选择呈现方式的元数据
- **Error_Object**: 错误对象，结构化的错误信息表示，包含错误类型、错误码、消息和位置信息
- **Version_Manager**: 版本管理器，负责协议版本的注册、协商和兼容性管理

## 需求

### 需求 1：注解标记系统

**用户故事：** 作为一个开发者，我希望能够在自然语言文本中添加结构化注解标记，以便系统能够识别并特殊处理标记的内容。

#### 验收标准

1. THE Annotation_Parser SHALL support Markdown-style special character markers for indicating semantic meaning
2. WHEN a text contains annotation markers, THE Annotation_Parser SHALL extract and parse all markers into structured data
3. THE Annotation_Marker SHALL support marking the following semantic types: emphasis, priority, date/time, person reference, action trigger, and visibility control
4. WHEN an annotation marker is malformed, THE Annotation_Parser SHALL return a descriptive error with the marker position
5. THE Annotation_Pretty_Printer SHALL format structured annotation data back into valid annotated text
6. FOR ALL valid annotated text, parsing then printing then parsing SHALL produce an equivalent annotation structure (round-trip property)

### 需求 2：语境信息管理

**用户故事：** 作为一个系统集成者，我希望能够捕获和管理用户的语境信息，以便 AI 能够更准确地理解用户意图。

#### 验收标准

1. THE Context_Manager SHALL capture and store context information including: timestamp, location, device_state, participant_identity, and session_history
2. WHEN context information is provided, THE Context_Manager SHALL validate all required fields are present
3. WHEN context information is incomplete, THE Context_Manager SHALL use default values for optional fields
4. THE Context_Manager SHALL merge new context information with existing session context
5. WHEN merging context information, THE Context_Manager SHALL preserve the most recent values for conflicting fields
6. THE Context_Serializer SHALL encode context information into JSON format
7. FOR ALL valid Context_Information objects, serializing then deserializing SHALL produce an equivalent object (round-trip property)

### 需求 3：中间语言转换

**用户故事：** 作为一个协议实现者，我希望能够将加工后的自然语言（含注解和语境）转换为标准的 JSON 中间语言格式，以便不同终端能够统一解读。

#### 验收标准

1. THE Intermediate_Language_Converter SHALL transform annotated text with context into a standardized JSON structure
2. THE Intermediate_Language structure SHALL include: message_body, annotations, context, metadata, and rendering_hints
3. WHEN converting to intermediate language, THE Converter SHALL preserve all semantic information from the source
4. THE Intermediate_Language_Parser SHALL parse JSON intermediate language into internal data structures
5. WHEN the JSON structure is invalid, THE Parser SHALL return a descriptive error indicating the validation failure
6. THE Intermediate_Language_Printer SHALL format internal data structures back into valid JSON
7. FOR ALL valid Intermediate_Language objects, printing then parsing SHALL produce an equivalent object (round-trip property)

### 需求 4：终端适配与界面组装

**用户故事：** 作为一个终端开发者，我希望能够根据中间语言动态组装适合当前终端的交互界面，以便用户获得最佳的交互体验。

#### 验收标准

1. THE Terminal_Adapter SHALL interpret intermediate language and select appropriate rendering components based on terminal capabilities
2. WHEN a terminal lacks capability for certain annotations, THE Terminal_Adapter SHALL gracefully degrade to alternative representations
3. THE Message_Interface_Builder SHALL dynamically construct interactive interface components from intermediate language
4. THE Message_Interface_Builder SHALL support the following component types: text_block, form_card, action_button, data_table, and media_preview
5. WHEN building an interface, THE Message_Interface_Builder SHALL respect the information hierarchy specified in the intermediate language
6. THE Terminal_Adapter SHALL report unsupported features without failing the entire rendering process
7. THE Intermediate_Language structure SHALL include a Rendering_Hint object containing: preferred_layout, component_type, priority_level, and fallback_strategy
8. WHEN a Rendering_Hint specifies a component_type, THE Terminal_Adapter SHALL validate the component_type against the supported component type registry before rendering
9. WHEN a Rendering_Hint specifies a fallback_strategy, THE Terminal_Adapter SHALL use the fallback_strategy when the preferred rendering is unavailable

### 需求 5：双向通信协议

**用户故事：** 作为一个系统架构师，我希望协议能够支持人到机器和机器到人的双向通信，以便实现完整的人机交互闭环。

#### 验收标准

1. THE Protocol SHALL support Human_to_Machine message flow for capturing user expressions and context
2. THE Protocol SHALL support Machine_to_Human message flow for delivering AI responses with rendering instructions
3. WHEN processing Human_to_Machine messages, THE Protocol SHALL extract meaning, annotations, and context
4. WHEN processing Machine_to_Human messages, THE Protocol SHALL include rendering hints for dynamic interface assembly
5. THE Session_Manager SHALL maintain session state across multiple message exchanges
6. WHEN a session is resumed, THE Session_Manager SHALL restore the previous context information
7. THE Session_Manager SHALL assign a unique session identifier to each communication session
8. THE Session_Manager SHALL support session scope levels: session, document, and request
9. WHEN a session exceeds the configured idle timeout, THE Session_Manager SHALL transition the session to an inactive state and persist the session state
10. WHEN an inactive session is resumed, THE Session_Manager SHALL validate the session integrity before restoring state

### 需求 6：错误处理与容错

**用户故事：** 作为一个系统运维人员，我希望协议能够优雅地处理各种错误情况，以便系统能够稳定运行。

#### 验收标准

1. WHEN parsing fails, THE System SHALL return a structured Error_Object containing: error_type, error_code, message, location, and timestamp
2. WHEN a required field is missing, THE System SHALL indicate which field is missing and provide the expected format
3. WHEN an unknown annotation type is encountered, THE System SHALL preserve the raw content and log a warning
4. IF network communication fails, THEN THE System SHALL retry with exponential backoff up to 3 times
5. WHEN all retries are exhausted, THE System SHALL return a timeout Error_Object with the last known state
6. THE System SHALL validate all input data before processing to prevent injection attacks
7. THE Error_Object SHALL categorize errors using the following error_type values: parse_error, validation_error, network_error, timeout_error, permission_error, and version_error
8. THE Error_Object SHALL include a numeric error_code that uniquely identifies the specific error condition within each error_type
9. WHEN multiple errors occur during a single operation, THE System SHALL collect all errors and return them as an ordered array of Error_Object instances

### 需求 7：扩展性支持

**用户故事：** 作为一个协议扩展开发者，我希望能够注册自定义的注解类型和终端适配器，以便协议能够适应新的使用场景。

#### 验收标准

1. THE Protocol SHALL provide a registry mechanism for custom annotation types
2. WHEN a custom annotation type is registered, THE System SHALL validate the type definition schema
3. THE Protocol SHALL provide a plugin interface for custom terminal adapters
4. WHEN a custom adapter is registered, THE System SHALL verify it implements the required interface
5. THE Version_Manager SHALL maintain a version registry that maps version identifiers to schema definitions
6. WHEN processing messages with unknown version, THE Version_Manager SHALL attempt to parse using the closest known version
7. THE Version_Manager SHALL support semantic versioning with major, minor, and patch components
8. WHEN a major version change is detected, THE Version_Manager SHALL reject incompatible messages and return a version_error Error_Object
9. WHEN a minor version change is detected, THE Version_Manager SHALL process the message using backward-compatible parsing rules
10. THE Protocol SHALL include a schema_ref field in each document to identify the schema version used


### 需求 8：多模态信息呈现

**用户故事：** 作为一个终端开发者，我希望协议能够支持多种感知通道的信息呈现，以便用户能够通过文本、语音、视觉、触觉等多种方式接收和理解信息。

#### 验收标准

1. THE Protocol SHALL define a Modality_Channel type that supports the following channel values: text, audio, vision, tactile, and multi
2. THE Message structure SHALL include a channel field that specifies the primary Modality_Channel for each message
3. WHEN a message specifies a Modality_Channel, THE Terminal_Adapter SHALL select rendering components compatible with the specified channel
4. WHEN a terminal does not support the specified Modality_Channel, THE Terminal_Adapter SHALL degrade to the text channel as the default fallback
5. THE Protocol SHALL allow a single message to reference multiple Modality_Channel values by setting the channel to multi and providing per-annotation channel hints
6. WHEN rendering a multi-channel message, THE Terminal_Adapter SHALL render each annotation using the annotation-specific channel hint
7. THE Intermediate_Language structure SHALL include modality-specific metadata within Rendering_Hint to guide channel-appropriate presentation

### 需求 9：跨终端语境重现

**用户故事：** 作为一个系统集成者，我希望协议能够支持在多个终端设备之间协调语境重现，以便在远程协作、AR/VR 辅助等场景中实现多终端协同交互。

#### 验收标准

1. THE Cross_Terminal_Coordinator SHALL maintain a shared context state that is accessible by all participating terminal devices within a session
2. WHEN a new terminal joins a session, THE Cross_Terminal_Coordinator SHALL synchronize the current context state to the joining terminal
3. THE Context_Information structure SHALL include an environment object that describes available hardware devices and their capabilities
4. WHEN context information includes multiple hardware entries, THE Cross_Terminal_Coordinator SHALL distribute rendering tasks to terminals based on each terminal's reported capabilities
5. THE Cross_Terminal_Coordinator SHALL support the following collaboration scenarios: AR overlay, VR immersion, screen projection, and multi-device split view
6. WHEN distributing a message across terminals, THE Cross_Terminal_Coordinator SHALL ensure each terminal receives the subset of Rendering_Hint relevant to its capabilities
7. THE Protocol SHALL include a situation object within context to describe the current interaction scenario including audience and participant roles
8. WHEN a terminal disconnects during a cross-terminal session, THE Cross_Terminal_Coordinator SHALL redistribute the disconnected terminal's rendering tasks to remaining terminals

### 需求 10：隐私与可见性控制

**用户故事：** 作为一个终端用户，我希望协议能够根据参与者身份和权限控制信息的可见范围，以便敏感信息仅对经过认证的本人可见。

#### 验收标准

1. THE Visibility_Controller SHALL enforce visibility levels on participant information using the following values: private, shared, and public
2. WHEN a participant's visibility is set to private, THE Visibility_Controller SHALL restrict that participant's information to the authenticated participant only
3. WHEN a participant's visibility is set to shared, THE Visibility_Controller SHALL expose that participant's information to all participants within the same session
4. WHEN a participant's visibility is set to public, THE Visibility_Controller SHALL allow that participant's information to be accessible across sessions
5. THE Annotation_Marker SHALL support a visibility annotation type that specifies access control for marked content
6. WHEN content is marked with a visibility annotation requiring authentication, THE Visibility_Controller SHALL verify the requester's identity before granting access
7. THE Context_Information structure SHALL include a public flag to indicate whether context data is intended for cross-session or external visibility
8. WHEN a message contains mixed-visibility content, THE Visibility_Controller SHALL filter the message to include only content authorized for the requesting participant
