# 需求文档

## 简介

本需求文档定义 ICP（Interactive Conversation Protocol）快速入门指南的编写需求。快速入门指南是面向初次接触 ICP 的读者的入门文档，位于 `docs/{lang}/start.md`。

快速入门指南的目标是让读者在 5 分钟内：
1. 理解 ICP 是什么、为什么需要它
2. 动手创建一个最小的 ICP 文档（JSON），理解每个字段的含义
3. 了解常见问题的答案
4. 知道下一步去哪里深入学习

本文档关注的是"快速入门指南应覆盖哪些内容"，而非软件功能需求。每条需求对应指南中的一个章节。

## 术语表

- **Quickstart_Guide**: 快速入门指南，位于 `docs/{lang}/start.md` 的单文件入门文档
- **ICP_Document**: ICP 文档，协议的顶层 JSON 数据结构，包含 version、id、messages 等字段
- **Message**: 消息，ICP 文档中的基本通信单元，包含 role、body 等字段
- **Annotation**: 注解，附加在消息体上的结构化语义标记
- **Context**: 语境，跨消息共享的上下文信息

## 需求

### 需求 1：5 分钟了解 ICP

**用户故事：** 作为一个初次接触 ICP 的读者，我希望快速入门指南用通俗易懂的语言解释 ICP 是什么以及为什么需要它，以便我能在几分钟内建立对协议的基本认知。

#### 验收标准

1. THE Quickstart_Guide SHALL include an introductory section that defines ICP as an interactive conversation protocol for structured human-machine communication
2. THE Quickstart_Guide SHALL explain the core problem ICP solves: natural language lacks structured semantic markers, causing ambiguity in human-machine interaction
3. THE Quickstart_Guide SHALL introduce the three core concepts of ICP in plain language: Annotation (structured semantic markers on natural language), Context (shared environmental information), and Message (the basic communication unit)
4. THE Quickstart_Guide SHALL use at least one everyday analogy to explain how ICP enhances natural language, making the explanation accessible to readers without protocol design background
5. THE Quickstart_Guide SHALL limit the introductory section to a length readable within 2 minutes

### 需求 2：第一个 ICP 文档

**用户故事：** 作为一个初次接触 ICP 的读者，我希望快速入门指南通过一个最小的 ICP JSON 文档示例，逐字段讲解每个字段的含义，以便我能动手理解 ICP 文档的实际结构。

#### 验收标准

1. THE Quickstart_Guide SHALL include a hands-on section that presents a complete, minimal ICP_Document JSON example containing the three required fields: version, id, and messages (with at least one user message and one assistant message)
2. THE Quickstart_Guide SHALL provide field-by-field explanation for every field in the minimal example, describing the purpose and expected value of each field
3. THE Quickstart_Guide SHALL extend the minimal example by adding one Annotation to a message, explaining how annotations attach structured semantics to natural language text
4. THE Quickstart_Guide SHALL state that the example JSON conforms to the ICP JSON Schema located at `schema/2025-10-25/schema.json`
5. WHEN presenting JSON examples, THE Quickstart_Guide SHALL use syntax-highlighted code blocks with inline comments or immediately following explanations for each field

### 需求 3：常见问题（FAQ）

**用户故事：** 作为一个初次接触 ICP 的读者，我希望快速入门指南回答常见问题，以便我能快速消除对协议的疑虑和误解。

#### 验收标准

1. THE Quickstart_Guide SHALL include a FAQ section that answers at least 4 common questions about ICP
2. THE Quickstart_Guide SHALL include a FAQ entry explaining the relationship between ICP and existing protocols (such as MCP and A2A), clarifying that ICP is complementary rather than a replacement
3. THE Quickstart_Guide SHALL include a FAQ entry explaining whether ICP depends on a specific AI model or platform, clarifying that ICP is model-agnostic and platform-agnostic
4. THE Quickstart_Guide SHALL include a FAQ entry explaining the minimum effort required to adopt ICP, clarifying the progressive enhancement design (the simplest ICP document is plain text with minimal required fields)
5. THE Quickstart_Guide SHALL present each FAQ entry in a question-and-answer format with concise answers of no more than 3 sentences each

### 需求 4：下一步学习路径

**用户故事：** 作为一个完成快速入门的读者，我希望快速入门指南提供清晰的下一步学习路径，以便我能根据自己的角色（协议学习者、开发者、SDK 使用者）找到对应的深入文档。

#### 验收标准

1. THE Quickstart_Guide SHALL include a "next steps" section that provides links to at least three deeper learning resources: the protocol specification, the developer guide, and the SDK guide
2. THE Quickstart_Guide SHALL describe each linked resource in one sentence, explaining what the reader will learn from it
3. THE Quickstart_Guide SHALL organize the learning path by reader role: protocol learners (specification), implementers (developer guide), and SDK users (SDK guide)
4. THE Quickstart_Guide SHALL include a link to the project blueprint for readers interested in the project vision and design principles
