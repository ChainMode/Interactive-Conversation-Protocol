# ICP 协议规范 — 语境注解格式

**Interactive Conversation Protocol — Contextual Annotation Format Specification**

- 协议版本：`icp-ctx-file/2025-10-25`
- 文档状态：正式版（Normative）
- 主语言：zh-CN

---

## 目录

- [1. 协议概述](#1-协议概述)
  - [1.1 协议目的与范围](#11-协议目的与范围)
  - [1.2 合规性框架](#12-合规性框架)
  - [1.3 术语表](#13-术语表)
  - [1.4 文档约定](#14-文档约定)
- [2. .ctx 文件结构](#2-ctx-文件结构)
  - [2.1 CTX_File 根对象](#21-ctx_file-根对象)
  - [2.2 Meta 元数据块](#22-meta-元数据块)
  - [2.3 Source 原始内容描述块](#23-source-原始内容描述块)
  - [2.4 Annotations 注解数组](#24-annotations-注解数组)
  - [2.5 最小示例](#25-最小示例)
- [3. 注解模型](#3-注解模型)
  - [3.1 Annotation 核心结构](#31-annotation-核心结构)
  - [3.2 Signs 标记性质](#32-signs-标记性质)
  - [3.3 Whatis 对象类型](#33-whatis-对象类型)
  - [3.4 Context 语境子结构](#34-context-语境子结构)
  - [3.5 验证规则](#35-验证规则)
- [4. 锚点系统](#4-锚点系统)
  - [4.1 六种 scope 概述](#41-六种-scope-概述)
  - [4.2 global — 全局锚点](#42-global--全局锚点)
  - [4.3 coordinate — 坐标锚点](#43-coordinate--坐标锚点)
  - [4.4 marker — 标记锚点](#44-marker--标记锚点)
  - [4.5 feature — 特征锚点](#45-feature--特征锚点)
  - [4.6 pattern — 模式锚点](#46-pattern--模式锚点)
  - [4.7 annotation — 注解引用锚点](#47-annotation--注解引用锚点)
  - [4.8 锚点-媒体类型兼容性矩阵](#48-锚点-媒体类型兼容性矩阵)
- [5. 内置 Signs 与 Whatis 关键词](#5-内置-signs-与-whatis-关键词)
  - [5.1 内置 Signs 关键词](#51-内置-signs-关键词)
  - [5.2 Signs 组合规则](#52-signs-组合规则)
  - [5.3 内置 Whatis 关键词](#53-内置-whatis-关键词)
  - [5.4 Signs 和 Whatis 的可选性](#54-signs-和-whatis-的可选性)
- [6. 反应系统](#6-反应系统)
  - [6.1 Reaction 结构](#61-reaction-结构)
  - [6.2 render 反应](#62-render-反应)
  - [6.3 function 反应](#63-function-反应)
  - [6.4 app 反应](#64-app-反应)
  - [6.5 command 反应](#65-command-反应)
  - [6.6 执行规则](#66-执行规则)
  - [6.7 具体示例](#67-具体示例)
- [7. 内联注解语法](#7-内联注解语法)
  - [7.1 语法概述](#71-语法概述)
  - [7.2 内置标记语法](#72-内置标记语法)
  - [7.3 反应附加语法](#73-反应附加语法)
  - [7.4 嵌套规则](#74-嵌套规则)
  - [7.5 转义规则](#75-转义规则)
  - [7.6 标记到数据模型的映射](#76-标记到数据模型的映射)
  - [7.7 Pretty-Printer 规范](#77-pretty-printer-规范)
  - [7.8 往返一致性](#78-往返一致性)
  - [7.9 错误处理](#79-错误处理)
- [8. Sidecar 与打包模式](#8-sidecar-与打包模式)
  - [8.1 三种模式概述](#81-三种模式概述)
  - [8.2 Inline 模式](#82-inline-模式)
  - [8.3 Sidecar 模式](#83-sidecar-模式)
  - [8.4 Bundled 模式](#84-bundled-模式)
  - [8.5 模式选择指南](#85-模式选择指南)
  - [8.6 模式转换规则](#86-模式转换规则)
- [9. 扩展机制](#9-扩展机制)
  - [9.1 命名空间约定](#91-命名空间约定)
  - [9.2 版本兼容性规则](#92-版本兼容性规则)
  - [9.3 语义版本](#93-语义版本)
  - [9.4 向后兼容保证](#94-向后兼容保证)
- [10. 安全与隐私](#10-安全与隐私)
  - [10.1 Secret Sign 处理](#101-secret-sign-处理)
  - [10.2 输入验证](#102-输入验证)
  - [10.3 Checksum 安全说明](#103-checksum-安全说明)
  - [10.4 命令执行同意](#104-命令执行同意)
- [11. 合规性要求](#11-合规性要求)
  - [11.1 合规级别汇总表](#111-合规级别汇总表)
- [12. 示例文档](#12-示例文档)
  - [12.1 文本文档 Sidecar 示例](#121-文本文档-sidecar-示例)
  - [12.2 图片文件 Sidecar 示例](#122-图片文件-sidecar-示例)
  - [12.3 视频文件 Sidecar 示例](#123-视频文件-sidecar-示例)
  - [12.4 音频文件 Sidecar 示例](#124-音频文件-sidecar-示例)
  - [12.5 内联模式示例](#125-内联模式示例)
  - [12.6 捆绑模式示例](#126-捆绑模式示例)
  - [12.7 语境子结构示例](#127-语境子结构示例)
  - [12.8 元注解示例](#128-元注解示例)
- [附录 A：Schema 文件策略](#附录-a-schema-文件策略)
  - [A.1 权威数据源](#a1-权威数据源)
  - [A.2 生成规则](#a2-生成规则)
  - [A.3 Schema 格式要求](#a3-schema-格式要求)
- [附录 B：默认 UI 组件映射](#附录-b-默认-ui-组件映射)
  - [B.1 内置 render 组件列表](#b1-内置-render-组件列表)
  - [B.2 通用降级规则](#b2-通用降级规则)
  - [B.3 各组件 params 定义](#b3-各组件-params-定义)
  - [B.4 自定义组件命名](#b4-自定义组件命名)
  - [B.5 React 参考实现指南](#b5-react-参考实现指南)
- [附录 C：语境子结构](#附录-c-语境子结构)
  - [C.1 Context 对象结构](#c1-context-对象结构)
  - [C.2 Participants 字段](#c2-participants-字段)
  - [C.3 Memory 字段](#c3-memory-字段)
  - [C.4 Situation 字段](#c4-situation-字段)
  - [C.5 Subtext 字段](#c5-subtext-字段)
  - [C.6 Culture 字段](#c6-culture-字段)
  - [C.7 References 字段](#c7-references-字段)
  - [C.8 Reactions 子结构](#c8-reactions-子结构)

---

## 1. 协议概述

### 1.1 协议目的与范围

ICP（Interactive Conversation Protocol，交互式对话协议）是一种语境注解格式规范（Contextual Annotation Format Specification），定义如何为任意媒体内容添加结构化语义注解（Structured Semantic Annotation）。

ICP 的核心产物是 `.ctx` 文件（语境注解文件，Contextual Annotation File）。创建注解的过程称为语境化注解（Contextual Annotation）。

本协议解决以下问题域：为任意媒体内容——包括文本（text）、图片（image）、视频（video）、音频（audio）——添加结构化语义注解，使内容的语义信息、意图、语境和反应能够以机器可读的格式被描述、传输和处理。

本规范的版本标识为 `icp-ctx-file/2025-10-25`。

核心设计理念：

- **一切皆注解** — 语义标记、意图、语境（参与者、记忆、情境、文化）、技能调用、消息引用均为注解（Annotation）
- **一个 .ctx 文件 = 一条消息的注解** — 对话组织由应用层处理，不属于 ICP 范畴
- **三种打包形态** — 内联（inline）、旁注（sidecar）、捆绑（bundled）
- **静态文档格式** — .ctx 文件以 JSON 格式存储，通过任意通道传输

本规范定义的范围限于 .ctx 文件格式的数据模型和合规性要求，不涉及传输协议或运行时实现。

### 1.2 合规性框架

本规范中的关键词遵循 [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) 中的定义。当这些关键词用于表达规范性要求时，MUST 使用全大写（UPPERCASE）格式书写。小写形式仅用于一般性描述，不具有规范性含义。

| 关键词 | 中文释义 | 合规级别 |
|---|---|---|
| MUST / REQUIRED / SHALL | 该要求是规范的绝对要求，实现者必须遵守 | 必须实现 |
| MUST NOT / SHALL NOT | 该行为是规范绝对禁止的，实现者必须避免 | 必须实现 |
| SHOULD / RECOMMENDED | 在特定情况下可能存在合理理由忽略该要求，但实现者在忽略前必须充分理解并权衡其影响 | 推荐实现 |
| SHOULD NOT / NOT RECOMMENDED | 在特定情况下可能存在合理理由采取该行为，但实现者在采取前必须充分理解并权衡其影响 | 推荐实现 |
| MAY / OPTIONAL | 该要求是完全可选的，实现者可以自由选择是否实现 | 可选实现 |

### 1.3 术语表

本节定义本规范中使用的核心术语。技术术语在首次出现时同时提供中文名称和英文原文。

| 术语 | 定义 |
|---|---|
| CTX_File | .ctx 文件，语境注解文件（Contextual Annotation File）。ICP 的核心产物，一个 .ctx 文件对应一条消息的完整注解。 |
| Annotation | 注解。.ctx 文件中的核心语义单元。一切皆注解——语义标记、意图、语境、技能调用、引用均为注解。 |
| Anchor | 锚点。注解在原始内容上的附着位置。支持 6 种 scope（作用域）：global（全局）、coordinate（坐标）、marker（标记）、feature（特征）、pattern（模式）、annotation（注解引用）。 |
| Signs | 标记性质。注解的标记性质数组，可组合使用。内置关键词（4 个）：highlight、warning、question、secret。自定义格式：`vendor:signname`。 |
| Whatis | 对象类型。注解标注的对象类型。内置关键词（9 个）：person、organization、event、time、place、term、object、skill、emotion。 |
| Context | 语境。注解的语境子结构，包含 participants[]、memory[]、situation[]、subtext[]、culture[]、references[]、reactions[]。除 reactions 外所有字段为 contextValue 数组。 |
| Reaction | 反应。注解在显示时触发的反应，位于 context.reactions[] 中。类型：render（渲染）、function（函数调用）、app（应用动作）、command（命令执行）。 |
| Source_Mode | 原始内容模式。枚举值：inline（内联）、sidecar（旁注）、bundled（捆绑）。 |
| contextValue | 语境值。联合类型（Union Type），每个元素可以是文本描述（string）、锚点引用（Anchor object）或 URL（string）。 |

### 1.4 文档约定

#### 1.4.1 章节编号

本规范采用层级编号系统。顶层章节使用连续整数编号（1、2、3……），子章节使用父章节编号加连续子编号（1.1、1.2、2.1……）。章节编号 MUST 连续递增，不得存在编号跳跃或重复。

#### 1.4.2 技术术语

技术术语在首次出现时 MUST 同时提供中文名称和英文原文（置于括号内）。后续出现时可仅使用中文名称。数据模型名称在规范文本中使用 `代码格式` 标记。

#### 1.4.3 JSON 示例格式

本规范中的 JSON 示例遵循以下约定：

- 示例代码块使用 `json` 语言标记
- 注释以 `//` 开头，仅用于说明目的，不属于合法 JSON 语法
- 所有 JSON 示例 MUST 符合本规范定义的数据模型

---

## 2. .ctx 文件结构

本章定义 .ctx 文件的顶层结构。.ctx 文件是一个 JSON 文档，包含三个必填的顶层节（Section）：元数据（meta）、原始内容描述（source）和注解数组（annotations）。

### 2.1 CTX_File 根对象

`CTX_File` 是 .ctx 文件的根对象（Root Object）。每个合法的 .ctx 文件 MUST 是一个包含以下三个必填顶层节的 JSON 对象：

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `meta` | `Meta` | MUST | 元数据块，包含版本、标识符、时间戳等文件级信息。 |
| `source` | `Source` | MUST | 原始内容描述块，描述被注解的原始媒体内容及其模式。 |
| `annotations` | `array<Annotation>` | MUST | 注解数组，包含零个或多个 `Annotation` 对象。 |

对于任意合法的 CTX_File JSON 实例，执行序列化（serialize）再反序列化（deserialize）MUST 产生与原始对象深度等价（deep equal）的结果。

### 2.2 Meta 元数据块

`Meta` 包含 .ctx 文件的元数据信息。

#### 必填字段

| 字段名 | 类型 | 描述 |
|---|---|---|
| `version` | `string` | 协议版本标识符。MUST 为有效的版本字符串，例如 `"icp-ctx-file/2025-10-25"`。 |
| `id` | `string` | CTX_File 唯一标识符（Unique Identifier）。在同一系统内 MUST 唯一。 |
| `created` | `string (date-time)` | 文件创建时间戳。MUST 使用 RFC 3339 格式，例如 `"2025-10-25T10:00:00Z"`。 |

#### 可选字段

| 字段名 | 类型 | 描述 |
|---|---|---|
| `locale` | `string` | 文档主语言的 BCP-47 语言标签（Language Tag），例如 `"zh-CN"`、`"en-US"`。 |
| `schema` | `string` | Schema 版本的 URI 引用，例如 `"icp://schemas/ctx-file/2025-10-25"`。 |

#### 示例

```json
{
  "version": "icp-ctx-file/2025-10-25",
  "id": "ctx-a1b2c3d4",
  "created": "2025-10-25T10:00:00Z",
  "locale": "zh-CN",
  "schema": "icp://schemas/ctx-file/2025-10-25"
}
```

### 2.3 Source 原始内容描述块

`Source` 描述被注解的原始媒体内容及其打包模式。

#### 必填字段

| 字段名 | 类型 | 描述 |
|---|---|---|
| `mode` | `string (enum)` | 原始内容模式（Source Mode）。枚举值：`"inline"`（内联）、`"sidecar"`（旁注）、`"bundled"`（捆绑）。 |
| `type` | `string` | 原始内容的 MIME 类型（Media Type），例如 `"text/markdown"`、`"image/png"`、`"video/mp4"`、`"audio/mp3"`。 |

#### 可选字段

| 字段名 | 类型 | 描述 |
|---|---|---|
| `checksum` | `string` | 原始文件的 MD5 哈希值，用于完整性验证（Integrity Verification）。 |
| `content` | `string` | 原始内容。文本内容直接存储为字符串；二进制内容（图片、视频、音频）MUST 使用 Base64 编码。 |
| `filename` | `string` | 原始文件名，用于人类可读性（Human Readability）。 |

#### 模式约束

不同的 `source.mode` 对 `checksum` 和 `content` 字段施加不同的约束：

| source.mode | checksum | content | 说明 |
|---|---|---|---|
| `sidecar` | MUST 存在 | MUST NOT 存在 | 旁注模式引用外部原始文件，通过 checksum 验证完整性。 |
| `inline` | MAY 存在 | MUST 存在 | 内联模式将带注解标记的文本内容嵌入 content 字段。 |
| `bundled` | SHOULD 存在 | MUST 存在 | 捆绑模式将原始内容打包在 content 字段中。二进制内容使用 Base64 编码。 |

### 2.4 Annotations 注解数组

`annotations` 是 `Annotation` 对象的数组。每个元素代表原始内容上的一个注解。数组 MAY 为空（即 `[]`），表示该 .ctx 文件尚未包含任何注解。

注解数组中的每个 `Annotation` 对象的详细结构定义见[第 3 章：注解模型](#3-注解模型)。

### 2.5 最小示例

以下为三种模式下的最小合法 CTX_File 示例。

#### 2.5.1 Sidecar 模式最小示例

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-sidecar-001",
    "created": "2025-10-25T10:00:00Z"
  },
  "source": {
    "mode": "sidecar",
    "type": "text/markdown",
    "checksum": "d41d8cd98f00b204e9800998ecf8427e",
    "filename": "README.md"
  },
  "annotations": []
}
```

#### 2.5.2 Inline 模式最小示例

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-inline-001",
    "created": "2025-10-25T10:00:00Z"
  },
  "source": {
    "mode": "inline",
    "type": "text/markdown",
    "content": "这是一段示例文本。"
  },
  "annotations": []
}
```

#### 2.5.3 Bundled 模式最小示例

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-bundled-001",
    "created": "2025-10-25T10:00:00Z"
  },
  "source": {
    "mode": "bundled",
    "type": "image/png",
    "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "checksum": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"
  },
  "annotations": []
}
```

---

## 3. 注解模型

本章定义注解（Annotation）的核心数据模型。注解是 .ctx 文件中的核心语义单元，附着在原始内容的特定位置上，携带标记性质、对象类型和语境信息。

### 3.1 Annotation 核心结构

每个 `Annotation` 对象表示原始内容上的一个语义注解。

#### 必填字段

| 字段名 | 类型 | 描述 |
|---|---|---|
| `anchor` | `Anchor` | 锚点对象，定义注解在原始内容上的附着位置。支持 6 种 scope 变体，详见[第 4 章：锚点系统](#4-锚点系统)。 |

#### 可选字段

| 字段名 | 类型 | 描述 |
|---|---|---|
| `id` | `string` | 注解名称，类似 CSS 中的 id 选择器。在同一 CTX_File 内 SHOULD 唯一。可被其他注解通过 annotation 锚点引用。 |
| `signs` | `array<string>` | 标记性质数组，可组合使用。详见 [3.2 Signs](#32-signs-标记性质)。 |
| `whatis` | `string` | 对象类型，标识被注解内容的语义类别。详见 [3.3 Whatis](#33-whatis-对象类型)。 |
| `context` | `Context` | 语境子结构，承载参与者、记忆、情境、文化等语境数据和反应。详见 [3.4 Context](#34-context-语境子结构)。 |

#### 示例

```json
{
  "id": "ann-greeting",
  "signs": ["highlight"],
  "whatis": "person",
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 0, "end": 3 }
  },
  "context": {
    "participants": ["张三"],
    "situation": ["团队站会期间"]
  }
}
```

### 3.2 Signs 标记性质

`signs` 是一个可选的字符串数组，表示注解的标记性质。signs 可组合使用——单个注解 MAY 同时携带多个 signs。

#### 内置 Signs 关键词

本规范定义 4 个内置 signs 关键词：

| 关键词 | 中文名称 | 语义描述 |
|---|---|---|
| `highlight` | 高亮 | 标记需要突出显示的内容。 |
| `warning` | 警告 | 标记需要警告注意的内容。 |
| `question` | 问题 | 标记问题或疑问。 |
| `secret` | 秘密 | 标记敏感或秘密内容。实现 SHOULD 对此类内容进行特殊处理（如不记录日志、不明文缓存）。 |

#### 自定义 Signs

自定义 signs MUST 使用 `vendor:signname` 命名空间格式，例如 `"myapp:approved"`、`"acme:reviewed"`。内置 signs 不使用命名空间前缀。

#### 组合示例

```json
{
  "signs": ["warning", "secret"]
}
```

上述示例表示该注解同时具有"警告"和"秘密"两种标记性质。

### 3.3 Whatis 对象类型

`whatis` 是一个可选的字符串字段，标识被注解内容的对象类型。

#### 内置 Whatis 关键词

本规范定义 9 个内置 whatis 关键词：

| 关键词 | 中文名称 | 语义描述 |
|---|---|---|
| `person` | 人物 | 被注解的对象是人物。 |
| `organization` | 组织 | 被注解的对象是组织。 |
| `event` | 事件 | 被注解的对象是事件。 |
| `time` | 时间 | 被注解的对象是时间。 |
| `place` | 地点 | 被注解的对象是地点。 |
| `term` | 术语 | 被注解的对象是术语或概念。 |
| `object` | 物体 | 被注解的对象是物体。 |
| `skill` | 技能 | 被注解的对象是技能。 |
| `emotion` | 情感 | 被注解的对象是情感。 |

`whatis` 为 OPTIONAL 字段。一个注解 MAY 仅包含 `anchor`，不携带 `signs` 和 `whatis`。

### 3.4 Context 语境子结构

`context` 是一个可选的语境对象，承载注解的语境数据和反应。所有字段（除 `reactions` 外）均为 `contextValue` 数组。

#### contextValue 联合类型

`contextValue` 是一个联合类型（Union Type），每个元素可以是以下三种形式之一：

| 形式 | 类型 | 描述 |
|---|---|---|
| 文本描述 | `string` | 自由文本描述。 |
| 锚点引用 | `Anchor` | 与注解锚点相同类型的锚点对象，用于引用文件内位置。 |
| URL | `string` | 外部资源链接（以 `http://` 或 `https://` 开头的字符串）。 |

#### Context 字段定义

| 字段名 | 类型 | 描述 |
|---|---|---|
| `participants` | `array<contextValue>` | 参与者数组。每个元素描述一个参与者。 |
| `memory` | `array<contextValue>` | 记忆数组。每个元素描述注解基于什么记忆。 |
| `situation` | `array<contextValue>` | 情境数组。每个元素描述在什么情境下。 |
| `subtext` | `array<contextValue>` | 潜台词数组。每个元素描述言外之意或隐含信息。 |
| `culture` | `array<contextValue>` | 文化数组。每个元素描述在什么文化背景下。 |
| `references` | `array<contextValue>` | 引用数组。每个元素提供相关参考资料。 |
| `reactions` | `array<Reaction>` | 反应数组。每个元素是一个 Reaction 对象，在注解显示时触发。 |

所有 context 子字段均为 OPTIONAL。一个注解 MAY 拥有仅包含 `participants` 的 context，或仅包含 `reactions` 的 context，或任意组合。

#### Reaction 结构

每个 `Reaction` 对象包含以下字段：

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `type` | `string (enum)` | MUST | 反应类型。枚举值：`"render"`（渲染为 UI 组件）、`"function"`（调用预设函数）、`"app"`（触发应用动作）、`"command"`（执行命令）。 |
| `params` | `object` | MUST | 反应类型特定的参数对象。 |

#### Context 示例

```json
{
  "participants": ["张三", "李四"],
  "memory": ["基于上周二关于项目截止日期的讨论"],
  "situation": ["团队站会期间，讨论冲刺阻碍"],
  "subtext": ["暗示项目可能延期"],
  "culture": ["在日本商务文化中，间接拒绝是常见的"],
  "references": [
    "https://example.com/project-plan",
    { "scope": "annotation", "ref": "ann-deadline" }
  ],
  "reactions": [
    {
      "type": "render",
      "params": {
        "component": "highlight_marker",
        "color": "#FFD700"
      }
    }
  ]
}
```

### 3.5 验证规则

解析器（Parser）在处理 `annotations` 数组中的每个 `Annotation` 对象时，MUST 执行以下验证：

1. 若 `Annotation` 缺少 `anchor` 字段，解析器 MUST 拒绝该 CTX_File 并返回验证错误（Validation Error），错误信息 MUST 指示缺失的锚点字段。
2. 若 `anchor.scope` 的值不是本规范定义的 6 种 scope 之一，解析器 MUST 拒绝该 CTX_File。
3. 若 `signs` 数组中包含未知的 signs 关键词（非内置且非 `vendor:signname` 格式），解析器 MUST 保留该 sign 而不中断处理。

---

## 4. 锚点系统

本章定义锚点（Anchor）系统。锚点决定注解在原始内容上的附着位置，是注解模型中唯一的必填字段。

### 4.1 六种 scope 概述

每个 `Anchor` 对象 MUST 包含一个 `scope` 字段，标识锚点的作用域类型。本规范定义 6 种 scope 变体：

| scope | 中文名称 | 描述 |
|---|---|---|
| `global` | 全局锚点 | 应用于整个原始内容。 |
| `coordinate` | 坐标锚点 | 基于位置的附着，支持文本范围、图片区域、视频时间范围、音频时间范围。 |
| `marker` | 标记锚点 | 附着到内容中的命名标记。 |
| `feature` | 特征锚点 | 附着到内容中检测到的特征（如人脸、声纹、关键词）。 |
| `pattern` | 模式锚点 | 附着到匹配指定模式的内容（如正则表达式、URL 模式）。 |
| `annotation` | 注解引用锚点 | 引用另一个注解，实现元注解（Meta-Annotation）。 |

### 4.2 global — 全局锚点

全局锚点（Global Anchor）应用于整个原始内容，用于文件级或消息级的语境注解。全局锚点不包含额外字段。

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `scope` | `string` | MUST | 固定值 `"global"`。 |

#### 示例

```json
{
  "anchor": { "scope": "global" },
  "context": {
    "participants": ["张三", "李四"],
    "situation": ["项目评审会议"]
  }
}
```

### 4.3 coordinate — 坐标锚点

坐标锚点（Coordinate Anchor）基于位置附着到原始内容的特定区域。根据媒体类型不同，坐标锚点 MUST 包含以下四种定位子对象中的恰好一个：`text`、`image`、`video`、`audio`。

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `scope` | `string` | MUST | 固定值 `"coordinate"`。 |
| `text` | `TextRange` | 条件必填 | 文本范围定位。与 `image`、`video`、`audio` 互斥。 |
| `image` | `ImageRegion` | 条件必填 | 图片区域定位。与 `text`、`video`、`audio` 互斥。 |
| `video` | `VideoRange` | 条件必填 | 视频时间范围定位。与 `text`、`image`、`audio` 互斥。 |
| `audio` | `AudioRange` | 条件必填 | 音频时间范围定位。与 `text`、`image`、`video` 互斥。 |

#### 4.3.1 TextRange — 文本范围

文本范围使用字符偏移量（Character Offset）定位。

| 字段名 | 类型 | 约束 | 描述 |
|---|---|---|---|
| `start` | `integer` | `>= 0` | 范围起始位置（含），以字符偏移量表示。 |
| `end` | `integer` | `>= 0` | 范围结束位置（不含），以字符偏移量表示。 |

约束：`start` MUST 小于 `end`（即 `start < end`），且两者 MUST 均为非负整数。

```json
{
  "scope": "coordinate",
  "text": { "start": 5, "end": 12 }
}
```

#### 4.3.2 ImageRegion — 图片区域

图片区域支持两种形式：矩形（rect）和多边形（polygon）。

##### 矩形（rect）

| 字段名 | 类型 | 约束 | 描述 |
|---|---|---|---|
| `x` | `number` | `>= 0` | 矩形左上角 x 坐标。 |
| `y` | `number` | `>= 0` | 矩形左上角 y 坐标。 |
| `width` | `number` | `> 0` | 矩形宽度。 |
| `height` | `number` | `> 0` | 矩形高度。 |

```json
{
  "scope": "coordinate",
  "image": {
    "rect": { "x": 100, "y": 50, "width": 200, "height": 150 }
  }
}
```

##### 多边形（polygon）

| 字段名 | 类型 | 约束 | 描述 |
|---|---|---|---|
| `points` | `array<[number, number]>` | 最少 3 个点 | 坐标对数组，每个元素为 `[x, y]`。 |

```json
{
  "scope": "coordinate",
  "image": {
    "polygon": {
      "points": [[100, 50], [300, 50], [200, 200]]
    }
  }
}
```

#### 4.3.3 VideoRange — 视频时间范围

| 字段名 | 类型 | 约束 | 描述 |
|---|---|---|---|
| `start` | `number` | `>= 0` | 时间起点，单位为秒。 |
| `end` | `number` | `>= 0` | 时间终点，单位为秒。 |
| `region` | `ImageRegion` | OPTIONAL | 帧内空间区域，用于视频帧中的空间注解。 |

约束：`start` MUST 小于或等于 `end`（即 `start <= end`），且两者 MUST 均为非负数。

```json
{
  "scope": "coordinate",
  "video": {
    "start": 30.5,
    "end": 45.0,
    "region": {
      "rect": { "x": 100, "y": 100, "width": 50, "height": 50 }
    }
  }
}
```

#### 4.3.4 AudioRange — 音频时间范围

| 字段名 | 类型 | 约束 | 描述 |
|---|---|---|---|
| `start` | `number` | `>= 0` | 时间起点，单位为秒。 |
| `end` | `number` | `>= 0` | 时间终点，单位为秒。 |

约束：`start` MUST 小于或等于 `end`（即 `start <= end`），且两者 MUST 均为非负数。

```json
{
  "scope": "coordinate",
  "audio": { "start": 10.0, "end": 25.5 }
}
```

### 4.4 marker — 标记锚点

标记锚点（Marker Anchor）附着到内容中的命名标记（Named Marker）。命名标记类似于 CSS 中的 id 和 class 概念：唯一名称相当于 id，重复名称相当于 class。

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `scope` | `string` | MUST | 固定值 `"marker"`。 |
| `name` | `string` | MUST | 标记名称。引用内容中预定义的命名标记。 |

#### 示例

```json
{
  "scope": "marker",
  "name": "chapter-3-title"
}
```

### 4.5 feature — 特征锚点

特征锚点（Feature Anchor）附着到内容中检测到的特征。适用于人脸识别（Face Recognition）、声纹识别（Voiceprint）、关键词检测等场景。

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `scope` | `string` | MUST | 固定值 `"feature"`。 |
| `kind` | `string` | MUST | 特征类型，例如 `"face"`、`"voiceprint"`、`"keyword"`。 |
| `value` | `string` | MUST | 特征值，例如人物名称、声纹 ID、关键词文本。 |
| `sample` | `string` | MAY | 特征样本引用，例如参考图片的 URL 或 Base64 编码。 |

#### 示例

```json
{
  "scope": "feature",
  "kind": "face",
  "value": "张三",
  "sample": "https://example.com/faces/zhangsan.jpg"
}
```

### 4.6 pattern — 模式锚点

模式锚点（Pattern Anchor）附着到匹配指定模式的内容。适用于正则表达式匹配、URL 模式、电话号码模式等场景。

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `scope` | `string` | MUST | 固定值 `"pattern"`。 |
| `rule` | `string` | MUST | 模式规则类型，例如 `"regex"`、`"glob"`、`"xpath"`。 |
| `expression` | `string` | MUST | 模式表达式。 |

#### 示例

```json
{
  "scope": "pattern",
  "rule": "regex",
  "expression": "\\b1[3-9]\\d{9}\\b"
}
```

上述示例匹配中国大陆手机号码模式。

### 4.7 annotation — 注解引用锚点

注解引用锚点（Annotation Anchor）引用另一个注解的 `id`，实现元注解（Meta-Annotation）——即对注解的注解。

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `scope` | `string` | MUST | 固定值 `"annotation"`。 |
| `ref` | `string` | MUST | 目标注解的 `id`。MUST 引用同一 CTX_File 内存在的 Annotation.id。 |

#### 示例

以下示例展示一个元注解：对 id 为 `"ann-deadline"` 的注解添加"问题"标记。

```json
{
  "id": "ann-question-about-deadline",
  "signs": ["question"],
  "anchor": {
    "scope": "annotation",
    "ref": "ann-deadline"
  },
  "context": {
    "subtext": ["对截止日期的可行性表示怀疑"]
  }
}
```

### 4.8 锚点-媒体类型兼容性矩阵

不同的锚点 scope 与不同的媒体类型（Media Type）之间存在兼容性约束。解析器 MUST 验证注解的锚点 scope 与 `source.type` 的兼容性。

| source.type | global | coordinate (text) | coordinate (image) | coordinate (video) | coordinate (audio) | marker | feature | pattern | annotation |
|---|---|---|---|---|---|---|---|---|---|
| `text/*` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `image/*` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `video/*` | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| `audio/*` | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

兼容性规则说明：

- `global` 和 `annotation` scope 与所有媒体类型兼容。
- `text/*` 类型 MUST 使用 `global`、`coordinate`（text 子类型）、`marker`、`pattern` 或 `annotation` scope。
- `image/*` 类型 MUST 使用 `global`、`coordinate`（image 子类型）、`feature` 或 `annotation` scope。
- `video/*` 类型 MUST 使用 `global`、`coordinate`（video 或 image 子类型）、`feature` 或 `annotation` scope。
- `audio/*` 类型 MUST 使用 `global`、`coordinate`（audio 子类型）或 `annotation` scope。

当注解的锚点 scope 与 `source.type` 不兼容时，解析器 MUST 拒绝该 CTX_File 并返回兼容性错误。


---

## 5. 内置 Signs 与 Whatis 关键词

本章详细定义内置的 signs 标记性质关键词和 whatis 对象类型关键词。第 3 章已概述了 `signs` 和 `whatis` 的基本结构，本章进一步规定每个内置关键词的完整语义、使用场景和组合规则。

### 5.1 内置 Signs 关键词

本规范定义 4 个内置 signs 关键词。每个关键词代表一种标记性质（Sign），用于描述注解内容的性质或需要引起的注意类型。

#### 5.1.1 highlight — 高亮

`highlight` 表示高亮/突出显示（Highlight），标记需要引起注意的内容。

- **语义**：被标记的内容是重要的、值得关注的，终端 SHOULD 以视觉突出的方式呈现（如背景色、加粗、边框等）。
- **适用场景**：关键结论、重要数据、核心论点、需要读者特别注意的段落或片段。
- **处理要求**：终端 SHOULD 提供视觉区分，使 highlight 内容与普通内容明显不同。具体的视觉样式由终端实现决定。

**示例**：标记文本中的关键结论。

```json
{
  "id": "ann-key-finding",
  "signs": ["highlight"],
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 120, "end": 185 }
  }
}
```

#### 5.1.2 warning — 警告

`warning` 表示警告/风险提示（Warning），标记需要警惕的内容。

- **语义**：被标记的内容包含风险、注意事项或潜在问题，终端 SHOULD 以警示性的方式呈现（如红色/橙色标记、警告图标等）。
- **适用场景**：安全风险、已知缺陷、过期信息、操作注意事项、可能导致数据丢失的操作。
- **处理要求**：终端 SHOULD 以明显的警示样式呈现 warning 内容。终端 MAY 在用户首次查看时主动提示。

**示例**：标记一段包含安全风险的配置说明。

```json
{
  "id": "ann-security-risk",
  "signs": ["warning"],
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 45, "end": 98 }
  },
  "context": {
    "situation": ["生产环境配置审查"]
  }
}
```

#### 5.1.3 question — 问题

`question` 表示问题/疑问（Question），标记需要回答或存疑的内容。

- **语义**：被标记的内容是一个问题、疑问或需要进一步确认的事项。终端 SHOULD 以提问性的方式呈现（如问号图标、不同颜色标记等）。
- **适用场景**：待确认的事项、审阅中的疑问、需要讨论的问题、对内容准确性的质疑。
- **处理要求**：终端 SHOULD 提供视觉标记以区分 question 内容。终端 MAY 提供交互机制（如回复、标记已解决）。

**示例**：对一段技术方案提出疑问。

```json
{
  "id": "ann-design-question",
  "signs": ["question"],
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 200, "end": 280 }
  },
  "context": {
    "subtext": ["对该方案的可扩展性存疑"]
  }
}
```

#### 5.1.4 secret — 敏感/机密

`secret` 表示敏感/机密（Secret），标记需要特殊处理的内容。

- **语义**：被标记的内容包含敏感信息（如密码、密钥、个人隐私数据、商业机密），终端 MUST 对此类内容进行特殊保护处理。
- **适用场景**：密码、API 密钥、个人身份信息（PII）、财务数据、医疗记录、商业机密。
- **处理要求**：
  - 终端 SHOULD NOT 将 secret 内容记录到日志（Log）中。
  - 终端 SHOULD NOT 以明文形式缓存（Cache）secret 内容。
  - 终端 SHOULD 默认以遮罩（Mask）形式显示 secret 内容（如 `••••••••`）。
  - 终端 MAY 提供用户交互机制以临时揭示（Reveal）被遮罩的内容。
  - 当 secret 内容需要传输时，实现 SHOULD 使用加密通道。

**示例**：标记文本中的 API 密钥。

```json
{
  "id": "ann-api-key",
  "signs": ["secret"],
  "whatis": "object",
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 55, "end": 91 }
  }
}
```

### 5.2 Signs 组合规则

`signs` 是一个数组（Array），支持组合使用。单个注解 MAY 同时携带多个 signs，表示该注解同时具有多种标记性质。

#### 5.2.1 组合语义

当一个注解包含多个 signs 时，所有 signs 的语义同时生效。终端 SHOULD 同时满足所有 signs 的处理要求。

**示例**：同时标记为警告和机密的内容。

```json
{
  "signs": ["warning", "secret"],
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 10, "end": 50 }
  }
}
```

上述注解表示该内容既是需要警惕的，又是敏感的。终端 SHOULD 同时以警示样式呈现并默认遮罩内容。

#### 5.2.2 自定义 Signs

自定义 signs MUST 使用 `vendor:signname` 命名空间格式（Namespace Format）。命名空间前缀（vendor）标识 signs 的来源或所属系统。

格式规则：
- 内置 signs（`highlight`、`warning`、`question`、`secret`）不使用命名空间前缀。
- 自定义 signs MUST 包含恰好一个冒号（`:`）分隔符。
- 冒号前为命名空间前缀（vendor），冒号后为 sign 名称（signname）。

**示例**：

```json
{
  "signs": ["highlight", "acme:approved", "acme:reviewed"]
}
```

#### 5.2.3 未知 Signs 处理

解析器遇到未知的 signs 关键词时，MUST 保留该 sign 而不中断处理。这确保了向前兼容性（Forward Compatibility）——旧版本解析器能够处理包含新版本 signs 的 CTX_File，即使无法理解新 signs 的语义。

### 5.3 内置 Whatis 关键词

本规范定义 9 个内置 whatis 关键词。`whatis` 标识被注解内容的对象类型（Object Type），帮助终端和下游系统理解注解所指向的语义类别。

#### 5.3.1 person — 人物

`person` 表示被注解的对象是人物（Person）。

- **语义**：注解指向的内容代表一个人物——可以是真实人物、虚构角色或匿名个体。
- **适用场景**：人名标注、人物引用、发言者标识、人脸标注。

#### 5.3.2 organization — 组织

`organization` 表示被注解的对象是组织（Organization）。

- **语义**：注解指向的内容代表一个组织——包括公司、政府机构、非营利组织、团队等。
- **适用场景**：公司名称标注、机构引用、团队标识。

#### 5.3.3 event — 事件

`event` 表示被注解的对象是事件（Event）。

- **语义**：注解指向的内容代表一个事件——包括已发生的、正在发生的或计划中的事件。
- **适用场景**：会议标注、历史事件引用、日程安排、里程碑标记。

#### 5.3.4 time — 时间

`time` 表示被注解的对象是时间（Time）。

- **语义**：注解指向的内容代表一个时间点或时间段——包括日期、时刻、时间范围、相对时间表达。
- **适用场景**：日期标注、截止日期标记、时间线节点、相对时间引用（如"上周二"）。

#### 5.3.5 place — 地点

`place` 表示被注解的对象是地点（Place）。

- **语义**：注解指向的内容代表一个地理位置或场所——包括具体地址、城市、国家、虚拟空间。
- **适用场景**：地址标注、会议地点标记、地理位置引用。

#### 5.3.6 term — 术语

`term` 表示被注解的对象是术语（Term）。

- **语义**：注解指向的内容代表一个专业术语或概念——包括技术术语、行业用语、缩写词、专有名词。
- **适用场景**：术语定义标注、缩写词解释、概念引用、词汇表条目。

#### 5.3.7 object — 物体

`object` 表示被注解的对象是物体（Object）。

- **语义**：注解指向的内容代表一个物理或虚拟物体——包括设备、产品、文件、数据实体。
- **适用场景**：产品标注、设备标识、文件引用、数据对象标记。

#### 5.3.8 skill — 技能

`skill` 表示被注解的对象是技能（Skill）。

- **语义**：注解指向的内容代表一种技能或能力——包括专业技能、工具使用能力、可调用的服务。
- **适用场景**：技能标注、能力描述、可调用服务标识、工具引用。

#### 5.3.9 emotion — 情感

`emotion` 表示被注解的对象是情感（Emotion）。

- **语义**：注解指向的内容代表一种情感或情绪状态——包括显式表达的情感和隐含的情绪。
- **适用场景**：情感标注、语气分析、情绪状态标记、情感倾向标识。

### 5.4 Signs 和 Whatis 的可选性

`signs` 和 `whatis` 均为 OPTIONAL 字段。一个注解 MAY 仅包含 `anchor`，不携带 `signs` 和 `whatis`。

以下均为合法的 `Annotation` 结构：

**仅有锚点**：

```json
{
  "anchor": { "scope": "global" }
}
```

**仅有 signs**：

```json
{
  "signs": ["highlight"],
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 0, "end": 10 }
  }
}
```

**仅有 whatis**：

```json
{
  "whatis": "person",
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 5, "end": 8 }
  }
}
```

**同时包含 signs、whatis 和 context**：

```json
{
  "id": "ann-full",
  "signs": ["highlight", "warning"],
  "whatis": "event",
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 0, "end": 25 }
  },
  "context": {
    "situation": ["项目评审会议"],
    "reactions": [
      {
        "type": "render",
        "params": { "component": "highlight_marker", "color": "#FF6600" }
      }
    ]
  }
}
```


---

## 6. 反应系统

本章定义反应系统（Reaction System）。反应是注解在被终端（Terminal）显示或处理时触发的动作，位于注解的 `context.reactions[]` 数组中。反应系统使注解不仅能描述语义，还能驱动 UI 渲染、函数调用、应用交互和命令执行。

### 6.1 Reaction 结构

每个 `Reaction` 对象位于 `context.reactions[]` 数组中，包含以下必填字段：

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `type` | `string (enum)` | MUST | 反应类型。枚举值：`"render"`、`"function"`、`"app"`、`"command"`。 |
| `params` | `object` | MUST | 反应类型特定的参数对象。不同 type 对应不同的 params 结构。 |

`type` 字段 MUST 为以下四种枚举值之一：

| type 值 | 中文名称 | 描述 |
|---|---|---|
| `render` | 渲染反应 | 将注解内容渲染为指定的 UI 组件。 |
| `function` | 函数反应 | 调用预设函数或设备功能。 |
| `app` | 应用反应 | 触发外部应用的特定动作。 |
| `command` | 命令反应 | 执行系统命令。 |

### 6.2 render 反应

`render` 反应将注解内容渲染为指定的 UI 组件（UI Component）。

#### params 结构

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | UI 组件名称。可以是内置组件名或自定义组件名（使用 `vendor:component_name` 格式）。 |
| *（其他字段）* | *（各类型）* | MAY | 组件特定的配置字段，为开放对象（Open Object），由具体组件定义。 |

#### 内置 render 组件

本规范定义 9 个内置 render 组件：

| 组件名 | 中文名称 | 描述 | 必填 params |
|---|---|---|---|
| `checkbox_list` | 可勾选列表 | 渲染为可交互的勾选列表。 | `items: array<string>` |
| `form` | 交互式表单 | 渲染为包含输入字段的表单。 | `fields: array<object>` |
| `highlight_marker` | 高亮标记 | 在内容上渲染高亮标记。 | — |
| `circle_overlay` | 圆形覆盖层 | 在图片或视频帧上渲染圆形覆盖层。 | `cx: number, cy: number, radius: number` |
| `timeline_card` | 时间线卡片 | 渲染为时间线上的卡片。 | `title: string, time: string` |
| `action_button` | 操作按钮 | 渲染为可点击的操作按钮。 | `label: string, action: string` |
| `data_table` | 数据表格 | 渲染为结构化数据表格。 | `columns: array<string>, rows: array<array>` |
| `media_preview` | 媒体预览 | 渲染为媒体内容的预览。 | `src: string` |
| `text_block` | 文本块 | 渲染为纯文本块。通用降级组件（Universal Fallback Component）。 | `text: string` |

`text_block` 是通用降级组件。当终端遇到不支持的 render 组件名时，MUST 降级到 `text_block` 进行渲染。

#### 示例

```json
{
  "type": "render",
  "params": {
    "component": "checkbox_list",
    "items": ["完成设计文档", "代码审查", "部署到测试环境"]
  }
}
```

### 6.3 function 反应

`function` 反应调用预设函数（Preset Function）或设备功能。

#### params 结构

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `name` | `string` | MUST | 预设函数标识符（Function Identifier）。 |
| `device` | `string` | MAY | 目标设备标识符（Device Identifier）。指定在哪个设备上执行函数。 |
| `args` | `object` | MAY | 函数参数对象。 |

#### 示例

```json
{
  "type": "function",
  "params": {
    "name": "flash_button",
    "device": "smart-speaker-001",
    "args": {
      "color": "blue",
      "duration_ms": 3000
    }
  }
}
```

### 6.4 app 反应

`app` 反应触发外部应用（External Application）的特定动作。

#### params 结构

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `id` | `string` | MUST | 目标应用标识符（Application Identifier）。 |
| `action` | `string` | MUST | 触发的动作名称（Action Name）。 |
| `payload` | `object` | MAY | 动作特定的数据载荷（Payload）。 |

#### 示例

```json
{
  "type": "app",
  "params": {
    "id": "com.example.calendar",
    "action": "create_event",
    "payload": {
      "title": "项目评审会议",
      "date": "2025-11-01T14:00:00Z",
      "duration_minutes": 60
    }
  }
}
```

### 6.5 command 反应

`command` 反应执行系统命令（System Command）。由于命令执行涉及安全风险，本规范对此类反应施加严格的安全约束。

#### params 结构

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `cmd` | `string` | MUST | 要执行的命令字符串。 |
| `env` | `object` | MAY | 环境变量（Environment Variables）对象，键值对形式。 |

#### 安全约束

- 终端在执行 `command` 反应前，MUST 要求用户明确同意（Explicit User Consent）。
- 终端 SHOULD NOT 自动执行 `command` 反应。
- 在生产环境中，终端 SHOULD 将可执行命令限制为预批准的命令白名单（Allowlist）。

#### 示例

```json
{
  "type": "command",
  "params": {
    "cmd": "open https://example.com/report",
    "env": {
      "LANG": "zh_CN.UTF-8"
    }
  }
}
```

### 6.6 执行规则

#### 6.6.1 多反应执行

单个 `Annotation` MAY 在 `context.reactions[]` 中包含多个 `Reaction` 对象。终端 SHOULD 按数组顺序（Array Order）依次执行这些反应。

```json
{
  "reactions": [
    { "type": "render", "params": { "component": "highlight_marker", "color": "#FFD700" } },
    { "type": "function", "params": { "name": "log_view", "args": { "event": "highlight_viewed" } } }
  ]
}
```

上述示例中，终端 SHOULD 先渲染高亮标记，再调用日志记录函数。

#### 6.6.2 未知反应类型处理

当终端遇到不支持或未知的 `reaction.type` 时，MUST 跳过该反应并继续处理 `reactions[]` 数组中的后续反应。终端 SHOULD 记录一条警告日志，指示跳过了未知的反应类型。

#### 6.6.3 未知 render 组件处理

当终端遇到不支持或未知的 `render` 组件名（`params.component`）时，MUST 降级到 `text_block` 组件进行渲染。终端 SHOULD 记录一条警告日志，指示发生了组件降级。

降级时，终端 SHOULD 尝试从 `params` 中提取可用的文本信息作为 `text_block` 的内容。

#### 6.6.4 command 反应用户同意

`command` 类型的反应 MUST 在执行前要求用户明确同意。终端 MUST NOT 自动执行命令反应。详见 [6.5 command 反应](#65-command-反应) 中的安全约束。

### 6.7 具体示例

#### 6.7.1 待办事项 → checkbox_list

将一段待办事项列表注解渲染为可勾选列表。

```json
{
  "id": "ann-todo-list",
  "signs": ["highlight"],
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 0, "end": 85 }
  },
  "context": {
    "reactions": [
      {
        "type": "render",
        "params": {
          "component": "checkbox_list",
          "items": [
            "完成 API 文档编写",
            "提交代码审查",
            "更新部署脚本",
            "通知测试团队"
          ]
        }
      }
    ]
  }
}
```

#### 6.7.2 信息收集 → form

将一段需要收集信息的注解渲染为交互式表单。

```json
{
  "id": "ann-collect-feedback",
  "anchor": {
    "scope": "coordinate",
    "text": { "start": 100, "end": 150 }
  },
  "context": {
    "reactions": [
      {
        "type": "render",
        "params": {
          "component": "form",
          "fields": [
            { "name": "rating", "type": "number", "label": "满意度评分（1-5）" },
            { "name": "comment", "type": "text", "label": "补充意见" }
          ]
        }
      }
    ]
  }
}
```

#### 6.7.3 视频帧标注 → circle_overlay

在视频的特定时间帧上渲染圆形覆盖层，标注检测到的人脸。

```json
{
  "id": "ann-face-marker",
  "whatis": "person",
  "anchor": {
    "scope": "coordinate",
    "video": {
      "start": 12.5,
      "end": 15.0,
      "region": {
        "rect": { "x": 200, "y": 100, "width": 80, "height": 80 }
      }
    }
  },
  "context": {
    "participants": ["张三"],
    "reactions": [
      {
        "type": "render",
        "params": {
          "component": "circle_overlay",
          "cx": 240,
          "cy": 140,
          "radius": 45,
          "color": "#00FF00",
          "stroke_width": 2
        }
      }
    ]
  }
}
```

#### 6.7.4 音频片段 → 设备按钮闪烁

在音频的特定时间段触发智能设备的按钮闪烁功能。

```json
{
  "id": "ann-audio-alert",
  "signs": ["warning"],
  "anchor": {
    "scope": "coordinate",
    "audio": { "start": 30.0, "end": 35.5 }
  },
  "context": {
    "situation": ["检测到异常音频片段"],
    "reactions": [
      {
        "type": "function",
        "params": {
          "name": "flash_button",
          "device": "smart-speaker-001",
          "args": {
            "color": "red",
            "pattern": "pulse",
            "duration_ms": 5000
          }
        }
      }
    ]
  }
}
```


---

## 7. 内联注解语法

本章定义内联注解语法（Inline Annotation Syntax）。内联注解语法是一种嵌入在原始文本内容中的标记语言（Markup Language），允许用户直接在文本中使用特殊字符序列标记注解，而无需手动编写 JSON 结构。

### 7.1 语法概述

内联注解语法是一种基于文本的标记系统（Text-based Markup System），嵌入在 `source.content` 字段的文本内容中。

**适用范围**：内联注解语法仅适用于 `source.type` 为 `text/*` 的媒体类型（如 `text/markdown`、`text/plain`、`text/html`）。对于二进制媒体类型（`image/*`、`video/*`、`audio/*`），MUST NOT 使用内联注解语法。

**设计原则**：
- 语法尽量简洁，减少对原始文本可读性的干扰。
- 标记字符选择避免与常见 Markdown 语法冲突。
- 每种内联标记 MUST 有明确的开始标记和结束标记（配对标记），或使用前缀标记（单标记）。

### 7.2 内置标记语法

本规范定义以下内置标记语法，每种标记对应一个 signs 或 whatis 关键词。

#### 7.2.1 highlight — 高亮标记

使用双星号（`**`）或双下划线（`__`）包裹文本，表示高亮。

| 语法 | 示例 | 对应 signs |
|---|---|---|
| `**text**` | `**重要结论**` | `["highlight"]` |
| `__text__` | `__重要结论__` | `["highlight"]` |

两种语法等价，生成相同的 `Annotation` 结构。

#### 7.2.2 warning — 警告标记

使用双感叹号（`!!`）包裹文本，表示警告。

| 语法 | 示例 | 对应 signs |
|---|---|---|
| `!!text!!` | `!!此操作不可逆!!` | `["warning"]` |

#### 7.2.3 question — 问题标记

使用单问号（`?`）包裹文本，表示问题。

| 语法 | 示例 | 对应 signs |
|---|---|---|
| `?text?` | `?这个方案可行吗?` | `["question"]` |

#### 7.2.4 secret — 遮罩标记

使用波浪号（`~`）包裹文本，表示敏感/机密内容。

| 语法 | 示例 | 对应 signs |
|---|---|---|
| `~text~` | `~sk-a1b2c3d4~` | `["secret"]` |

#### 7.2.5 whatis=person — 人物标记

使用 `@` 前缀标记人物名称。

| 语法 | 示例 | 对应 whatis |
|---|---|---|
| `@name` | `@张三` | `"person"` |

人物标记为前缀标记（Prefix Marker），名称范围从 `@` 后的第一个非空白字符开始，到下一个空白字符或标点符号结束。

#### 7.2.6 whatis=time — 时间标记

使用方括号（`[]`）包裹时间表达式。

| 语法 | 示例 | 对应 whatis |
|---|---|---|
| `[datetime]` | `[2025-10-25]`、`[下周三]` | `"time"` |

#### 7.2.7 命名标记

使用花括号加井号（`{#}`）定义命名标记（Named Marker），对应 marker 锚点。

| 语法 | 示例 | 对应 anchor |
|---|---|---|
| `{#marker-name}` | `{#chapter-3}` | `{ "scope": "marker", "name": "chapter-3" }` |

命名标记不产生可见内容，仅在文本中插入一个锚点位置。

### 7.3 反应附加语法

内联注解支持尾随反应块（Trailing Reaction Block），用于为标记内容附加反应。

#### 语法格式

```
[annotated content]->reaction_type(component_or_name, param1=value1, param2=value2)
```

- `[annotated content]`：被注解的内容，使用方括号包裹。
- `->`：反应附加操作符（Reaction Attach Operator）。
- `reaction_type`：反应类型，对应 `Reaction.type`（`render`、`function`、`app`、`command`）。
- `(component_or_name, params...)`：反应参数，第一个参数为组件名或函数名，后续为键值对参数。

#### 示例

```
[完成设计文档, 代码审查, 部署测试]->render(checkbox_list)
```

上述语法生成一个包含 `render` 反应的注解，渲染为 `checkbox_list` 组件。

```
[项目评审会议]->app(com.example.calendar, action=create_event)
```

上述语法生成一个包含 `app` 反应的注解，触发日历应用创建事件。

### 7.4 嵌套规则

内联标记支持嵌套（Nesting）。当多个标记嵌套使用时，生成的 `Annotation` 的 `signs` 数组包含所有嵌套标记对应的 signs。

#### 嵌套语法

```
**!!重要警告!!**
```

上述嵌套标记生成的 `Annotation` 包含 `signs: ["highlight", "warning"]`，表示该内容同时具有高亮和警告两种标记性质。

#### 嵌套规则

- 外层标记的 signs 与内层标记的 signs 合并为一个数组。
- 嵌套顺序不影响语义——`**!!text!!**` 与 `!!**text**!!` 生成等价的 `signs` 数组。
- 同类型标记 MUST NOT 嵌套自身（如 `****text****` 是非法的）。
- `~` 标记（secret）MAY 与其他标记嵌套，例如 `**~敏感且重要~**` 生成 `signs: ["highlight", "secret"]`。

### 7.5 转义规则

当标记字符需要作为字面文本（Literal Text）出现时，使用反斜杠（`\`）进行转义（Escape）。

#### 转义语法

| 转义序列 | 字面输出 |
|---|---|
| `\**` | `**`（字面双星号，不触发高亮标记） |
| `\__` | `__`（字面双下划线，不触发高亮标记） |
| `\!!` | `!!`（字面双感叹号，不触发警告标记） |
| `\?` | `?`（字面问号，不触发问题标记） |
| `\~` | `~`（字面波浪号，不触发遮罩标记） |
| `\@` | `@`（字面 at 符号，不触发人物标记） |
| `\[` | `[`（字面左方括号，不触发时间标记） |
| `\{` | `{`（字面左花括号，不触发命名标记） |
| `\\` | `\`（字面反斜杠） |

#### 示例

```
价格为 \**100\** 元（字面显示 **100**，不触发高亮）
```

### 7.6 标记到数据模型的映射

本节定义每种内联标记如何映射到 `Annotation` 数据模型的字段。

#### 7.6.1 Signs 标记映射

| 内联标记 | Annotation 字段 |
|---|---|
| `**text**` / `__text__` | `signs: ["highlight"]`，`anchor.scope: "coordinate"`，`anchor.text: { start, end }` |
| `!!text!!` | `signs: ["warning"]`，`anchor.scope: "coordinate"`，`anchor.text: { start, end }` |
| `?text?` | `signs: ["question"]`，`anchor.scope: "coordinate"`，`anchor.text: { start, end }` |
| `~text~` | `signs: ["secret"]`，`anchor.scope: "coordinate"`，`anchor.text: { start, end }` |

其中 `start` 和 `end` 为标记内容在去除标记字符后的纯文本中的字符偏移量。

#### 7.6.2 Whatis 标记映射

| 内联标记 | Annotation 字段 |
|---|---|
| `@name` | `whatis: "person"`，`anchor.scope: "coordinate"`，`anchor.text: { start, end }` |
| `[datetime]` | `whatis: "time"`，`anchor.scope: "coordinate"`，`anchor.text: { start, end }` |

#### 7.6.3 命名标记映射

| 内联标记 | Annotation 字段 |
|---|---|
| `{#marker-name}` | `anchor.scope: "marker"`，`anchor.name: "marker-name"` |

命名标记不生成 `signs` 或 `whatis` 字段。

#### 7.6.4 反应附加映射

| 内联标记 | Annotation 字段 |
|---|---|
| `[content]->render(comp, ...)` | `context.reactions: [{ type: "render", params: { component: "comp", ... } }]` |
| `[content]->function(name, ...)` | `context.reactions: [{ type: "function", params: { name: "name", ... } }]` |
| `[content]->app(id, ...)` | `context.reactions: [{ type: "app", params: { id: "id", ... } }]` |
| `[content]->command(cmd, ...)` | `context.reactions: [{ type: "command", params: { cmd: "cmd", ... } }]` |

### 7.7 Pretty-Printer 规范

Pretty-Printer（格式化输出器）负责将 `Annotation` 数据模型实例格式化回内联注解语法。

#### 7.7.1 格式化规则

1. 对于包含 `signs` 的注解，Pretty-Printer MUST 选择对应的内联标记语法包裹锚点指向的文本。
2. 当 `signs` 包含多个值时，Pretty-Printer SHOULD 使用嵌套标记，外层为数组中的第一个 sign，内层为后续 signs。
3. 对于包含 `whatis` 的注解，Pretty-Printer MUST 使用对应的 whatis 标记语法。
4. 对于包含 `context.reactions` 的注解，Pretty-Printer MUST 附加尾随反应块。
5. 对于 `anchor.scope` 为 `"marker"` 的注解，Pretty-Printer MUST 生成 `{#marker-name}` 语法。

#### 7.7.2 优先级

当一个注解同时包含 `signs`、`whatis` 和 `context.reactions` 时，Pretty-Printer SHOULD 按以下优先级生成标记：

1. `signs` 标记（最内层）
2. `whatis` 标记（如适用）
3. 反应附加块（最外层）

### 7.8 往返一致性

内联注解语法 MUST 满足往返一致性（Round-trip Consistency）要求：

对于任意合法的内联注解文本，执行以下操作序列：

1. **解析（Parse）**：将内联注解文本解析为 `Annotation` 结构集合。
2. **格式化（Pretty-Print）**：将 `Annotation` 结构集合格式化回内联注解文本。
3. **再解析（Re-Parse）**：将格式化后的文本再次解析为 `Annotation` 结构集合。

步骤 1 和步骤 3 产生的 `Annotation` 结构集合 MUST 等价（Equivalent）。等价的定义为：两个 `Annotation` 集合包含相同数量的注解，且每个注解的 `signs`、`whatis`、`anchor` 和 `context.reactions` 字段在语义上相同。

> **注意**：往返一致性不要求格式化后的文本与原始文本字符级相同（Character-identical）。例如，`__text__` 格式化后 MAY 变为 `**text**`，只要解析结果等价即可。

### 7.9 错误处理

#### 7.9.1 畸形标记

当解析器遇到畸形（Malformed）或未闭合（Unclosed）的标记时，MUST 将标记字符视为字面文本（Literal Text），不生成对应的 `Annotation`。

**示例**：

```
这是一段 **未闭合的高亮标记
```

上述文本中 `**` 未闭合，解析器 MUST 将 `**` 视为字面字符，不生成 highlight 注解。

#### 7.9.2 警告发出

解析器在遇到畸形标记时，SHOULD 发出警告（Warning），指示标记的位置和类型。警告 MUST NOT 中断解析过程——解析器 MUST 继续处理后续内容。

#### 7.9.3 内容保留

畸形标记的处理 MUST 保留原始内容不变。解析器 MUST NOT 删除、修改或重新排列畸形标记字符。解析后的纯文本输出 MUST 包含原始的标记字符。


---

## 8. Sidecar 与打包模式

本章定义 .ctx 文件的三种打包模式（Packaging Mode）：内联（inline）、旁注（sidecar）和捆绑（bundled）。打包模式决定了原始内容与注解之间的物理关系——内容是嵌入在 .ctx 文件中，还是作为外部文件被引用。

### 8.1 三种模式概述

`source.mode` 字段定义 .ctx 文件的打包模式。本规范定义三种模式：

| 模式 | 中文名称 | 描述 |
|---|---|---|
| `inline` | 内联模式 | 原始文本内容嵌入 `source.content`，内容中包含内联注解标记。 |
| `sidecar` | 旁注模式 | .ctx 文件作为独立文件存在，引用外部原始文件，通过 checksum 验证完整性。 |
| `bundled` | 捆绑模式 | 原始内容（含二进制）与注解打包在同一个 .ctx 文件中。 |

### 8.2 Inline 模式

Inline 模式将带有内联注解标记的文本内容直接嵌入 `source.content` 字段。

#### 约束规则

- `source.type` MUST 为 `text/*` 类型（如 `text/markdown`、`text/plain`）。Inline 模式不适用于二进制媒体类型。
- `source.content` MUST 存在，包含带内联标记的注解文本。
- `annotations[]` 数组 MUST 包含与内联标记等价的结构化注解（Structured Annotation）。即内联标记和 `annotations[]` 数组描述相同的注解集合。

#### 双重表示

Inline 模式下，注解同时以两种形式存在：

1. **内联标记**：嵌入在 `source.content` 文本中的标记语法（详见[第 7 章](#7-内联注解语法)）。
2. **结构化注解**：`annotations[]` 数组中的 `Annotation` 对象。

两种表示 MUST 语义等价。当两者存在冲突时，`annotations[]` 数组中的结构化注解为权威来源（Authoritative Source）。

#### 示例

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-inline-example",
    "created": "2025-10-25T10:00:00Z"
  },
  "source": {
    "mode": "inline",
    "type": "text/markdown",
    "content": "项目进展：**第一阶段已完成**，!!第二阶段存在风险!!。"
  },
  "annotations": [
    {
      "signs": ["highlight"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 5, "end": 12 }
      }
    },
    {
      "signs": ["warning"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 13, "end": 21 }
      }
    }
  ]
}
```

### 8.3 Sidecar 模式

Sidecar 模式下，.ctx 文件作为独立文件存在于原始文件旁边，通过 checksum 引用原始文件。

#### 约束规则

- `source.checksum` MUST 存在，值为原始文件的 MD5 哈希值。
- `source.content` MUST NOT 存在。Sidecar 模式不嵌入原始内容。
- `source.filename` SHOULD 存在，指示原始文件名。

#### 文件命名约定

Sidecar .ctx 文件的命名规则为：原始文件名 + `.ctx` 后缀。

| 原始文件 | Sidecar 文件 |
|---|---|
| `README.md` | `README.md.ctx` |
| `photo.png` | `photo.png.ctx` |
| `meeting.mp4` | `meeting.mp4.ctx` |
| `podcast.mp3` | `podcast.mp3.ctx` |

Sidecar 文件 SHOULD 与原始文件位于同一目录下。

#### Checksum 验证

终端在加载 Sidecar 模式的 .ctx 文件时，MUST 执行以下验证流程：

1. 读取 `source.checksum` 值。
2. 计算原始文件的 MD5 哈希值。
3. 比较两个哈希值。
4. 若哈希值匹配，正常加载注解。
5. 若哈希值不匹配，终端 MUST 发出警告（Warning），指示原始文件可能已被修改。终端 MAY 继续加载注解，但 MUST 向用户明确提示 checksum 不匹配。

> **注意**：checksum 仅提供完整性验证（Integrity Verification），不构成安全机制（Security Mechanism）。加密签名超出本规范范围。

#### 推荐用途

Sidecar 模式 RECOMMENDED 用于以下场景：
- 二进制媒体文件（图片、视频、音频）的注解。
- 原始文件不可修改或不应修改的场景。
- 需要独立管理注解生命周期的场景。

#### 示例

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-sidecar-photo",
    "created": "2025-10-25T10:00:00Z"
  },
  "source": {
    "mode": "sidecar",
    "type": "image/png",
    "checksum": "e99a18c428cb38d5f260853678922e03",
    "filename": "team-photo.png"
  },
  "annotations": [
    {
      "id": "ann-face-zhangsan",
      "whatis": "person",
      "anchor": {
        "scope": "feature",
        "kind": "face",
        "value": "张三"
      },
      "context": {
        "participants": ["张三"]
      }
    }
  ]
}
```

### 8.4 Bundled 模式

Bundled 模式将原始内容与注解打包在同一个 .ctx 文件中，形成自包含（Self-contained）的注解文档。

#### 约束规则

- `source.content` MUST 存在。对于二进制内容（图片、视频、音频），MUST 使用 Base64 编码。
- `source.checksum` SHOULD 存在，用于验证 `content` 字段的完整性。
- 文件使用 `.ctx` 扩展名（不附加原始文件扩展名）。

#### 推荐用途

Bundled 模式 RECOMMENDED 用于以下场景：
- 自包含分发（Self-contained Distribution）——接收方无需访问原始文件。
- 归档（Archiving）——将内容和注解作为单一文件长期保存。
- 跨系统传输——确保内容和注解的一致性。

#### 示例

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-bundled-audio",
    "created": "2025-10-25T10:00:00Z"
  },
  "source": {
    "mode": "bundled",
    "type": "audio/mp3",
    "content": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2...",
    "checksum": "b1946ac92492d2347c6235b4d2611184",
    "filename": "interview.mp3"
  },
  "annotations": [
    {
      "id": "ann-speaker-intro",
      "whatis": "person",
      "anchor": {
        "scope": "coordinate",
        "audio": { "start": 0.0, "end": 5.5 }
      },
      "context": {
        "participants": ["主持人"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "timeline_card",
              "title": "主持人开场",
              "time": "00:00 - 00:05"
            }
          }
        ]
      }
    }
  ]
}
```

### 8.5 模式选择指南

以下表格提供不同场景下的模式选择建议：

| 场景 | 推荐模式 | 理由 |
|---|---|---|
| 文本文档注解，需要人类可读性 | `inline` | 内联标记直接嵌入文本，人类可直接阅读和编辑。 |
| 图片/视频/音频注解 | `sidecar` | 二进制文件不支持内联标记，Sidecar 模式保持原始文件不变。 |
| 原始文件不可修改 | `sidecar` | 注解独立存储，不影响原始文件。 |
| 自包含分发或归档 | `bundled` | 单一文件包含所有内容，便于传输和存储。 |
| 版本控制友好 | `sidecar` | 注解文件独立变更，不影响原始文件的版本历史。 |
| 离线环境使用 | `bundled` | 无需访问外部文件，完全自包含。 |
| 协作编辑文本文档 | `inline` | 编辑者可直接在文本中查看和修改注解标记。 |
| 大型二进制文件 | `sidecar` | 避免将大型二进制内容嵌入 JSON，减少文件体积。 |

### 8.6 模式转换规则

本节定义不同打包模式之间的转换规则。

#### 8.6.1 Inline → Sidecar 转换

将 inline 模式的 .ctx 文件转换为 sidecar 模式：

1. **提取纯文本**：从 `source.content` 中移除所有内联注解标记，得到纯文本内容。
2. **保留结构化注解**：`annotations[]` 数组保持不变（或从内联标记重新解析生成）。
3. **计算 Checksum**：对纯文本内容计算 MD5 哈希值，写入 `source.checksum`。
4. **移除 Content**：删除 `source.content` 字段。
5. **更新 Mode**：将 `source.mode` 设置为 `"sidecar"`。
6. **保存纯文本**：将纯文本内容保存为独立文件。
7. **重命名 .ctx 文件**：按 Sidecar 命名约定重命名（如 `document.md.ctx`）。

#### 8.6.2 Sidecar → Inline 转换

将 sidecar 模式的 .ctx 文件转换为 inline 模式。此转换仅适用于 `source.type` 为 `text/*` 的媒体类型。

1. **读取原始文件**：加载 Sidecar 引用的原始文本文件。
2. **验证 Checksum**：验证原始文件的 MD5 哈希值与 `source.checksum` 匹配。
3. **嵌入标记**：根据 `annotations[]` 数组中的结构化注解，在原始文本的对应位置插入内联注解标记（按 Pretty-Printer 规范，详见 [7.7](#77-pretty-printer-规范)）。
4. **写入 Content**：将带标记的文本写入 `source.content`。
5. **更新 Mode**：将 `source.mode` 设置为 `"inline"`。
6. **移除 Checksum**：删除 `source.checksum` 字段（inline 模式下为可选）。

> **限制**：Sidecar → Inline 转换仅对 `text/*` 媒体类型有效。对于二进制媒体类型（`image/*`、`video/*`、`audio/*`），此转换不可执行，终端 MUST 拒绝并报告错误。

#### 8.6.3 转换往返一致性

对于 `source.type` 为 `text/*` 的 .ctx 文件，执行 Inline → Sidecar → Inline 转换后，`annotations[]` 数组 SHOULD 与原始等价。由于内联标记的格式化可能存在规范化差异（如 `__text__` 转换为 `**text**`），`source.content` 的字符级内容 MAY 不同，但解析后的注解集合 MUST 等价。


---

## 9. 扩展机制

本章定义 ICP 的扩展机制（Extension Mechanism）。扩展机制允许第三方在不修改核心规范的前提下，添加自定义的 signs 关键词、反应类型和 render 组件，同时确保不同版本之间的兼容性。

### 9.1 命名空间约定

ICP 使用命名空间前缀（Namespace Prefix）区分内置关键词和第三方扩展。所有自定义扩展 MUST 使用 `vendor:name` 格式，其中 `vendor` 为扩展提供者的标识符，`name` 为扩展名称。冒号（`:`）为命名空间分隔符。

#### 9.1.1 自定义 Signs

自定义 signs 关键词 MUST 使用 `vendor:signname` 格式。

| 类别 | 格式 | 示例 |
|---|---|---|
| 内置 signs | 无前缀 | `highlight`、`warning`、`question`、`secret` |
| 自定义 signs | `vendor:signname` | `acme:approved`、`myapp:reviewed`、`github:stale` |

内置 signs 关键词（`highlight`、`warning`、`question`、`secret`）MUST NOT 使用命名空间前缀。

#### 9.1.2 自定义反应类型

自定义反应类型 MUST 使用 `vendor:typename` 格式。

| 类别 | 格式 | 示例 |
|---|---|---|
| 内置反应类型 | 无前缀 | `render`、`function`、`app`、`command` |
| 自定义反应类型 | `vendor:typename` | `acme:webhook`、`myapp:notification` |

内置反应类型（`render`、`function`、`app`、`command`）MUST NOT 使用命名空间前缀。

#### 9.1.3 自定义 Render 组件

自定义 render 组件名 MUST 使用 `vendor:componentname` 格式。

| 类别 | 格式 | 示例 |
|---|---|---|
| 内置组件 | 无前缀 | `checkbox_list`、`form`、`text_block` 等 |
| 自定义组件 | `vendor:componentname` | `acme:kanban_board`、`myapp:chart_widget` |

内置 render 组件名 MUST NOT 使用命名空间前缀。

#### 9.1.4 命名空间格式规则

- 命名空间前缀（vendor）MUST 仅包含小写字母（`a-z`）、数字（`0-9`）和连字符（`-`）。
- 扩展名称（name）MUST 仅包含小写字母（`a-z`）、数字（`0-9`）和下划线（`_`）。
- 命名空间前缀和扩展名称之间 MUST 恰好包含一个冒号（`:`）分隔符。
- 命名空间前缀 MUST NOT 为空字符串。

### 9.2 版本兼容性规则

为确保不同版本的解析器能够处理包含扩展内容的 CTX_File，本规范定义以下兼容性规则：

#### 9.2.1 未知 Signs 处理

当解析器遇到未知的 signs 关键词（既非内置关键词，也非已注册的自定义关键词）时，MUST 保留该 sign 而不中断处理。解析器 MUST NOT 因遇到未知 signs 而拒绝 CTX_File 或终止解析。

```json
{
  "signs": ["highlight", "futureapp:new_feature"],
  "anchor": { "scope": "global" }
}
```

上述示例中，即使解析器不认识 `futureapp:new_feature`，也 MUST 保留该 sign 并正常处理注解。

#### 9.2.2 未知反应类型处理

当终端遇到未知的反应类型（`reaction.type` 值既非内置类型，也非已注册的自定义类型）时，MUST 跳过该反应并继续处理 `reactions[]` 数组中的后续反应。终端 SHOULD 记录一条警告日志。

#### 9.2.3 未知字段处理

当解析器遇到 CTX_File 中未在本规范或 schema.json 中定义的字段时，MUST 忽略该字段并继续处理。解析器 MUST NOT 因遇到未知字段而拒绝 CTX_File。

此规则确保旧版本解析器能够处理包含新版本字段的 CTX_File，实现向前兼容性（Forward Compatibility）。

### 9.3 语义版本

`meta.version` 字段使用语义版本（Semantic Versioning）格式标识协议版本。

#### 9.3.1 版本格式

版本字符串遵循 `major.minor.patch` 格式：

| 组成部分 | 类型 | 描述 |
|---|---|---|
| `major` | `integer` | 主版本号。变更表示破坏性格式变更（Breaking Change），不同主版本之间不保证兼容。 |
| `minor` | `integer` | 次版本号。变更表示向后兼容的功能添加（Backward-compatible Addition）。 |
| `patch` | `integer` | 修订号。变更表示向后兼容的修正（Correction），如文档勘误、示例修正。 |

#### 9.3.2 版本变更规则

| 变更类型 | 版本号变更 | 示例 |
|---|---|---|
| 新增必填字段、删除字段、修改字段类型 | major 递增 | `1.0.0` → `2.0.0` |
| 新增可选字段、新增内置 signs/whatis 关键词 | minor 递增 | `1.0.0` → `1.1.0` |
| 文档勘误、示例修正、描述文本修改 | patch 递增 | `1.0.0` → `1.0.1` |

### 9.4 向后兼容保证

版本 N.x 产生的 CTX_File MUST 可被任何支持版本 N.y（y ≥ x）的解析器正确解析。即在同一主版本号内，较新的解析器 MUST 能够处理较旧版本产生的 CTX_File。

具体而言：

- 支持版本 `1.2.0` 的解析器 MUST 能够解析版本 `1.0.0` 和 `1.1.0` 产生的 CTX_File。
- 支持版本 `1.0.0` 的解析器在遇到版本 `1.1.0` 新增的可选字段时，MUST 忽略未知字段并继续处理（依据 [9.2.3](#923-未知字段处理) 规则）。
- 不同主版本号（如 `1.x` 和 `2.x`）之间不保证兼容性。解析器遇到不支持的主版本号时，SHOULD 拒绝并报告版本不兼容错误。


---

## 10. 安全与隐私

本章定义 ICP 的安全与隐私（Security and Privacy）要求。.ctx 文件可能包含敏感信息，实现者 MUST 遵循本章规定的安全措施以保护用户数据。

### 10.1 Secret Sign 处理

当注解的 `signs` 数组中包含 `"secret"` 关键词时，该注解标记的内容被视为敏感内容（Sensitive Content）。实现者 SHOULD 对此类内容执行以下保护措施：

#### 10.1.1 日志限制

实现 SHOULD NOT 将 secret 注解标记的内容记录到日志（Log）中。若日志系统需要记录注解的存在，SHOULD 仅记录注解的 `id` 和 `signs`，MUST NOT 记录锚点指向的原始内容。

#### 10.1.2 缓存限制

实现 SHOULD NOT 以明文形式缓存（Cache）secret 注解标记的内容。若需要缓存，SHOULD 使用加密存储（Encrypted Storage）。

#### 10.1.3 默认遮罩

终端 SHOULD 默认以遮罩（Mask）形式显示 secret 内容（如 `••••••••`）。终端 MAY 提供用户交互机制以临时揭示（Reveal）被遮罩的内容。揭示操作 SHOULD 要求用户明确确认。

#### 10.1.4 传输保护

当 secret 内容需要通过网络传输时，实现 SHOULD 使用加密通道（如 TLS）。

### 10.2 输入验证

#### 10.2.1 CTX_File 验证

所有 CTX_File MUST 在处理前进行验证（Validation）。验证 MUST 包括：

- JSON 语法正确性验证。
- 必填字段（`meta`、`source`、`annotations`）存在性验证。
- `source.mode` 与 `checksum`/`content` 字段的模式约束验证（详见 [2.3](#23-source-原始内容描述块)）。
- `annotations[]` 中每个 `Annotation` 的 `anchor` 字段存在性验证。
- `anchor.scope` 与 `source.type` 的兼容性验证（详见 [4.8](#48-锚点-媒体类型兼容性矩阵)）。

验证失败时，解析器 MUST 拒绝该 CTX_File 并返回结构化的错误信息。

#### 10.2.2 Reaction Params 清理

`reaction.params` 中的所有值 MUST 在使用前进行清理（Sanitization），以防止注入攻击（Injection Attack）。

- `render` 反应的 `params` 中的字符串值 MUST 进行 HTML/JavaScript 转义。
- `function` 反应的 `params.args` MUST 验证参数类型和范围。
- `app` 反应的 `params.payload` MUST 验证数据结构。
- `command` 反应的 `params.cmd` MUST 使用命令白名单验证（详见 [10.2.3](#1023-命令白名单)）。

#### 10.2.3 命令白名单

在生产环境中，`command` 反应 MUST 将可执行命令限制为预批准的命令白名单（Allowlist）。白名单之外的命令 MUST 被拒绝执行。

白名单的管理方式由实现者决定，但 MUST 满足以下要求：

- 白名单 MUST 可配置（Configurable）。
- 默认白名单 SHOULD 为空（即默认不允许执行任何命令）。
- 白名单变更 SHOULD 记录审计日志（Audit Log）。

### 10.3 Checksum 安全说明

Sidecar 模式中的 `source.checksum`（MD5 哈希）仅提供完整性验证（Integrity Verification），用于检测原始文件是否被意外修改。

checksum MUST NOT 被视为安全机制（Security Mechanism）。MD5 算法存在已知的碰撞攻击（Collision Attack）漏洞，不适用于对抗恶意篡改。

加密签名（Cryptographic Signing）和内容认证（Content Authentication）超出本规范范围。需要安全保证的实现 MAY 在 ICP 之上叠加额外的安全层（如数字签名、内容哈希链）。

### 10.4 命令执行同意

当 CTX_File 包含 `command` 类型的反应时，终端 MUST 在执行前要求用户明确同意（Explicit User Consent）。

#### 10.4.1 同意要求

- 终端 MUST 向用户显示即将执行的命令内容。
- 终端 MUST 等待用户明确确认（如点击"允许执行"按钮）后才执行命令。
- 终端 MUST NOT 自动执行 `command` 反应，即使用户之前已同意过类似命令。
- 终端 SHOULD 提供"始终拒绝"选项，允许用户禁用所有命令反应。

#### 10.4.2 批量同意

当 CTX_File 包含多个 `command` 反应时，终端 MAY 提供批量同意机制，允许用户一次性审查并同意或拒绝所有命令。但终端 MUST 在批量同意界面中显示每个命令的完整内容。


---

## 11. 合规性要求

本章汇总本规范中所有使用 RFC 2119 关键词表达的规范性要求（Normative Requirement），按章节分类整理为合规级别汇总表。

### 11.1 合规级别汇总表

以下表格列出本规范中所有 MUST、SHOULD 和 MAY 级别的要求。实现者可根据此表评估合规性。

#### 第 2 章：.ctx 文件结构

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 2-1 | MUST | CTX_File 根对象 MUST 包含 `meta`、`source`、`annotations` 三个必填顶层节。 |
| 2-2 | MUST | `meta.version` MUST 为有效的版本字符串。 |
| 2-3 | MUST | `meta.id` 在同一系统内 MUST 唯一。 |
| 2-4 | MUST | `meta.created` MUST 使用 RFC 3339 格式。 |
| 2-5 | MUST | 当 `source.mode` 为 `sidecar` 时，`source.checksum` MUST 存在。 |
| 2-6 | MUST NOT | 当 `source.mode` 为 `sidecar` 时，`source.content` MUST NOT 存在。 |
| 2-7 | MUST | 当 `source.mode` 为 `inline` 或 `bundled` 时，`source.content` MUST 存在。 |
| 2-8 | SHOULD | 当 `source.mode` 为 `bundled` 时，`source.checksum` SHOULD 存在。 |

#### 第 3 章：注解模型

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 3-1 | MUST | 每个 `Annotation` MUST 包含 `anchor` 字段。 |
| 3-2 | MUST | 若 `Annotation` 缺少 `anchor` 字段，解析器 MUST 拒绝该 CTX_File。 |
| 3-3 | MUST | 若 `anchor.scope` 不是 6 种定义值之一，解析器 MUST 拒绝该 CTX_File。 |
| 3-4 | MUST | 遇到未知 signs 关键词时，解析器 MUST 保留该 sign 而不中断处理。 |

#### 第 4 章：锚点系统

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 4-1 | MUST | 每个 `Anchor` MUST 包含 `scope` 字段。 |
| 4-2 | MUST | `TextRange.start` MUST 小于 `TextRange.end`，且两者 MUST 为非负整数。 |
| 4-3 | MUST | `VideoRange.start` MUST 小于或等于 `VideoRange.end`，且两者 MUST 为非负数。 |
| 4-4 | MUST | `AudioRange.start` MUST 小于或等于 `AudioRange.end`，且两者 MUST 为非负数。 |
| 4-5 | MUST | `annotation` 锚点的 `ref` MUST 引用同一 CTX_File 内存在的 Annotation.id。 |
| 4-6 | MUST | 解析器 MUST 验证 `anchor.scope` 与 `source.type` 的兼容性。 |
| 4-7 | MUST | 锚点与媒体类型不兼容时，解析器 MUST 拒绝该 CTX_File。 |

#### 第 5 章：内置 Signs 与 Whatis 关键词

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 5-1 | MUST | 自定义 signs MUST 使用 `vendor:signname` 命名空间格式。 |
| 5-2 | SHOULD | 终端 SHOULD 对 `highlight` 内容提供视觉区分。 |
| 5-3 | SHOULD | 终端 SHOULD 以警示样式呈现 `warning` 内容。 |
| 5-4 | MUST | 终端 MUST 对 `secret` 内容进行特殊保护处理。 |
| 5-5 | SHOULD NOT | 终端 SHOULD NOT 将 `secret` 内容记录到日志。 |
| 5-6 | SHOULD NOT | 终端 SHOULD NOT 以明文缓存 `secret` 内容。 |
| 5-7 | SHOULD | 终端 SHOULD 默认以遮罩形式显示 `secret` 内容。 |

#### 第 6 章：反应系统

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 6-1 | MUST | `Reaction.type` MUST 为 `render`、`function`、`app`、`command` 之一或自定义类型。 |
| 6-2 | MUST | `render` 反应的 `params` MUST 包含 `component` 字段。 |
| 6-3 | SHOULD | 终端 SHOULD 按数组顺序执行多个反应。 |
| 6-4 | MUST | 遇到未知反应类型时，终端 MUST 跳过并继续处理后续反应。 |
| 6-5 | MUST | 遇到未知 render 组件时，终端 MUST 降级到 `text_block`。 |
| 6-6 | MUST | `command` 反应执行前 MUST 要求用户明确同意。 |
| 6-7 | MUST NOT | 终端 MUST NOT 自动执行 `command` 反应。 |

#### 第 7 章：内联注解语法

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 7-1 | MUST NOT | 二进制媒体类型 MUST NOT 使用内联注解语法。 |
| 7-2 | MUST | 每种内联标记 MUST 有明确的开始和结束标记。 |
| 7-3 | MUST NOT | 同类型标记 MUST NOT 嵌套自身。 |
| 7-4 | MUST | 内联注解语法 MUST 满足往返一致性。 |
| 7-5 | MUST | 畸形标记 MUST 视为字面文本。 |
| 7-6 | MUST NOT | 畸形标记处理 MUST NOT 中断解析过程。 |
| 7-7 | MUST | 畸形标记处理 MUST 保留原始内容不变。 |

#### 第 8 章：Sidecar 与打包模式

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 8-1 | MUST | Inline 模式的 `source.type` MUST 为 `text/*` 类型。 |
| 8-2 | MUST | Inline 模式的 `annotations[]` MUST 包含与内联标记等价的结构化注解。 |
| 8-3 | MUST | Sidecar 模式加载时 MUST 验证 checksum。 |
| 8-4 | MUST | Checksum 不匹配时终端 MUST 发出警告。 |
| 8-5 | MUST | Sidecar → Inline 转换仅对 `text/*` 有效，其他类型 MUST 拒绝。 |
| 8-6 | SHOULD | 转换往返后 `annotations[]` SHOULD 与原始等价。 |

#### 第 9 章：扩展机制

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 9-1 | MUST | 自定义扩展 MUST 使用 `vendor:name` 命名空间格式。 |
| 9-2 | MUST NOT | 内置关键词 MUST NOT 使用命名空间前缀。 |
| 9-3 | MUST | 遇到未知 signs 时解析器 MUST 保留并继续处理。 |
| 9-4 | MUST | 遇到未知反应类型时终端 MUST 跳过并继续。 |
| 9-5 | MUST | 遇到未知字段时解析器 MUST 忽略并继续。 |
| 9-6 | MUST | 版本 N.x 的 CTX_File MUST 可被支持 N.y（y ≥ x）的解析器解析。 |

#### 第 10 章：安全与隐私

| 编号 | 级别 | 要求描述 |
|---|---|---|
| 10-1 | SHOULD NOT | 实现 SHOULD NOT 将 secret 内容记录到日志。 |
| 10-2 | SHOULD NOT | 实现 SHOULD NOT 以明文缓存 secret 内容。 |
| 10-3 | SHOULD | 终端 SHOULD 默认遮罩 secret 内容。 |
| 10-4 | MUST | 所有 CTX_File MUST 在处理前验证。 |
| 10-5 | MUST | `reaction.params` MUST 在使用前清理。 |
| 10-6 | MUST | 生产环境中 `command` 反应 MUST 使用命令白名单。 |
| 10-7 | MUST | `command` 反应执行前 MUST 要求用户明确同意。 |
| 10-8 | MUST NOT | 终端 MUST NOT 自动执行 `command` 反应。 |


---

## 12. 示例文档

本章提供完整的 .ctx 文件示例，覆盖不同媒体类型、打包模式和注解特性。所有 JSON 示例 MUST 符合 `schema.json` 定义的数据模型。

### 12.1 文本文档 Sidecar 示例

以下示例为一个 Markdown 文档的 Sidecar .ctx 文件，演示 `coordinate` 锚点（文本范围）、`signs` 标记和 `render` 反应。

原始文件：`project-report.md`

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-text-sidecar-001",
    "created": "2025-10-25T10:00:00Z",
    "locale": "zh-CN",
    "schema": "icp://schemas/ctx-file/2025-10-25"
  },
  "source": {
    "mode": "sidecar",
    "type": "text/markdown",
    "checksum": "7d793037a0760186574b0282f2f435e7",
    "filename": "project-report.md"
  },
  "annotations": [
    {
      "id": "ann-title-highlight",
      "signs": ["highlight"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 0, "end": 18 }
      },
      "context": {
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "highlight_marker",
              "color": "#FFD700"
            }
          }
        ]
      }
    },
    {
      "id": "ann-deadline",
      "whatis": "time",
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 120, "end": 135 }
      },
      "context": {
        "situation": ["季度项目评审"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "timeline_card",
              "title": "项目截止日期",
              "time": "2025-12-31"
            }
          }
        ]
      }
    },
    {
      "id": "ann-todo-items",
      "signs": ["highlight"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 200, "end": 350 }
      },
      "context": {
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "checkbox_list",
              "items": [
                "完成 API 文档编写",
                "提交代码审查",
                "更新部署脚本"
              ]
            }
          }
        ]
      }
    },
    {
      "id": "ann-risk-warning",
      "signs": ["warning"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 400, "end": 480 }
      },
      "context": {
        "situation": ["第二阶段进度落后"],
        "subtext": ["项目可能延期"]
      }
    }
  ]
}
```

### 12.2 图片文件 Sidecar 示例

以下示例为一张团队合照的 Sidecar .ctx 文件，演示 `coordinate` 锚点（图片区域）和 `circle_overlay` render 反应。

原始文件：`team-photo.png`

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-image-sidecar-001",
    "created": "2025-10-25T14:30:00Z",
    "locale": "zh-CN"
  },
  "source": {
    "mode": "sidecar",
    "type": "image/png",
    "checksum": "e99a18c428cb38d5f260853678922e03",
    "filename": "team-photo.png"
  },
  "annotations": [
    {
      "id": "ann-face-zhangsan",
      "whatis": "person",
      "anchor": {
        "scope": "coordinate",
        "image": {
          "rect": { "x": 150, "y": 80, "width": 100, "height": 120 }
        }
      },
      "context": {
        "participants": ["张三"],
        "situation": ["2025 年度团队合影"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "circle_overlay",
              "cx": 200,
              "cy": 140,
              "radius": 60,
              "color": "#00FF00",
              "stroke_width": 3
            }
          }
        ]
      }
    },
    {
      "id": "ann-face-lisi",
      "whatis": "person",
      "anchor": {
        "scope": "coordinate",
        "image": {
          "rect": { "x": 320, "y": 75, "width": 95, "height": 115 }
        }
      },
      "context": {
        "participants": ["李四"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "circle_overlay",
              "cx": 367,
              "cy": 132,
              "radius": 57,
              "color": "#0088FF",
              "stroke_width": 3
            }
          }
        ]
      }
    },
    {
      "id": "ann-logo",
      "whatis": "organization",
      "anchor": {
        "scope": "coordinate",
        "image": {
          "polygon": {
            "points": [[500, 20], [600, 20], [600, 80], [500, 80]]
          }
        }
      },
      "context": {
        "references": ["https://example.com/brand-guidelines"]
      }
    }
  ]
}
```

### 12.3 视频文件 Sidecar 示例

以下示例为一段会议录像的 Sidecar .ctx 文件，演示 `coordinate` 锚点（视频时间范围 + 帧内区域）和人物检测注解。

原始文件：`meeting-recording.mp4`

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-video-sidecar-001",
    "created": "2025-10-25T16:00:00Z",
    "locale": "zh-CN"
  },
  "source": {
    "mode": "sidecar",
    "type": "video/mp4",
    "checksum": "a3f2b8c9d1e4f5a6b7c8d9e0f1a2b3c4",
    "filename": "meeting-recording.mp4"
  },
  "annotations": [
    {
      "id": "ann-speaker-intro",
      "whatis": "person",
      "anchor": {
        "scope": "coordinate",
        "video": {
          "start": 0.0,
          "end": 15.0,
          "region": {
            "rect": { "x": 200, "y": 100, "width": 240, "height": 300 }
          }
        }
      },
      "context": {
        "participants": ["主持人 王五"],
        "situation": ["会议开场介绍"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "circle_overlay",
              "cx": 320,
              "cy": 250,
              "radius": 120,
              "color": "#FF6600"
            }
          },
          {
            "type": "render",
            "params": {
              "component": "timeline_card",
              "title": "主持人开场",
              "time": "00:00 - 00:15",
              "description": "王五介绍会议议程"
            }
          }
        ]
      }
    },
    {
      "id": "ann-key-discussion",
      "signs": ["highlight"],
      "whatis": "event",
      "anchor": {
        "scope": "coordinate",
        "video": {
          "start": 120.0,
          "end": 300.0
        }
      },
      "context": {
        "participants": ["张三", "李四"],
        "situation": ["技术方案讨论"],
        "memory": ["基于上次评审的反馈"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "timeline_card",
              "title": "核心技术讨论",
              "time": "02:00 - 05:00",
              "description": "张三和李四讨论架构方案"
            }
          }
        ]
      }
    },
    {
      "id": "ann-face-detection",
      "whatis": "person",
      "anchor": {
        "scope": "feature",
        "kind": "face",
        "value": "张三",
        "sample": "https://example.com/faces/zhangsan-ref.jpg"
      },
      "context": {
        "participants": ["张三"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "text_block",
              "text": "检测到参与者：张三"
            }
          }
        ]
      }
    }
  ]
}
```

### 12.4 音频文件 Sidecar 示例

以下示例为一段播客音频的 Sidecar .ctx 文件，演示 `coordinate` 锚点（音频时间范围）和 `function` 反应触发设备闪烁。

原始文件：`podcast-episode.mp3`

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-audio-sidecar-001",
    "created": "2025-10-25T18:00:00Z",
    "locale": "zh-CN"
  },
  "source": {
    "mode": "sidecar",
    "type": "audio/mp3",
    "checksum": "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    "filename": "podcast-episode.mp3"
  },
  "annotations": [
    {
      "id": "ann-intro-segment",
      "whatis": "event",
      "anchor": {
        "scope": "coordinate",
        "audio": { "start": 0.0, "end": 30.0 }
      },
      "context": {
        "participants": ["主播"],
        "situation": ["播客开场白"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "timeline_card",
              "title": "开场白",
              "time": "00:00 - 00:30"
            }
          }
        ]
      }
    },
    {
      "id": "ann-key-quote",
      "signs": ["highlight"],
      "anchor": {
        "scope": "coordinate",
        "audio": { "start": 180.0, "end": 210.0 }
      },
      "context": {
        "participants": ["嘉宾 赵六"],
        "memory": ["引用了上期节目的讨论"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "text_block",
              "text": "嘉宾赵六分享了关于 AI 发展趋势的核心观点"
            }
          }
        ]
      }
    },
    {
      "id": "ann-alert-segment",
      "signs": ["warning"],
      "anchor": {
        "scope": "coordinate",
        "audio": { "start": 600.0, "end": 615.0 }
      },
      "context": {
        "situation": ["检测到异常音频片段"],
        "reactions": [
          {
            "type": "function",
            "params": {
              "name": "flash_button",
              "device": "smart-speaker-001",
              "args": {
                "color": "red",
                "pattern": "pulse",
                "duration_ms": 5000
              }
            }
          }
        ]
      }
    }
  ]
}
```


### 12.5 内联模式示例

以下示例为一个 Inline 模式的 .ctx 文件，演示内联注解标记嵌入文本以及等价的 `annotations` 数组。

`source.content` 中的原始文本（含内联标记）：

```
项目进展：**第一阶段已完成**，!!第二阶段存在风险!!。联系 @张三 确认 [2025-12-31] 截止日期。~API密钥: sk-abc123~
```

完整 .ctx 文件：

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-inline-full-001",
    "created": "2025-10-25T09:00:00Z",
    "locale": "zh-CN"
  },
  "source": {
    "mode": "inline",
    "type": "text/markdown",
    "content": "项目进展：**第一阶段已完成**，!!第二阶段存在风险!!。联系 @张三 确认 [2025-12-31] 截止日期。~API密钥: sk-abc123~"
  },
  "annotations": [
    {
      "id": "ann-phase1",
      "signs": ["highlight"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 5, "end": 12 }
      }
    },
    {
      "id": "ann-phase2-risk",
      "signs": ["warning"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 13, "end": 21 }
      }
    },
    {
      "id": "ann-contact-person",
      "whatis": "person",
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 25, "end": 27 }
      },
      "context": {
        "participants": ["张三"]
      }
    },
    {
      "id": "ann-deadline-date",
      "whatis": "time",
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 30, "end": 40 }
      }
    },
    {
      "id": "ann-api-secret",
      "signs": ["secret"],
      "whatis": "object",
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 46, "end": 65 }
      }
    }
  ]
}
```

### 12.6 捆绑模式示例

以下示例为一个 Bundled 模式的 .ctx 文件，演示将 Base64 编码的图片内容与注解打包在一起。

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-bundled-image-001",
    "created": "2025-10-25T11:00:00Z",
    "locale": "zh-CN"
  },
  "source": {
    "mode": "bundled",
    "type": "image/png",
    "content": "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVQYV2P8z8BQz0AEYBxVOHIUAgBGWAkFdPgHzwAAAABJRU5ErkJggg==",
    "checksum": "f1d2d2f924e986ac86fdf7b36c94bcdf",
    "filename": "diagram.png"
  },
  "annotations": [
    {
      "id": "ann-diagram-title",
      "signs": ["highlight"],
      "anchor": { "scope": "global" },
      "context": {
        "situation": ["架构设计评审"],
        "references": ["https://example.com/architecture-docs"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "text_block",
              "text": "系统架构图 — 第三版"
            }
          }
        ]
      }
    },
    {
      "id": "ann-component-a",
      "whatis": "object",
      "anchor": {
        "scope": "coordinate",
        "image": {
          "rect": { "x": 2, "y": 2, "width": 3, "height": 3 }
        }
      },
      "context": {
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "circle_overlay",
              "cx": 3,
              "cy": 3,
              "radius": 2,
              "color": "#FF0000"
            }
          }
        ]
      }
    }
  ]
}
```

### 12.7 语境子结构示例

以下示例演示 `context` 子结构的完整用法，包含 `participants`、`memory`、`situation`、`subtext`、`culture`、`references` 字段，以及 `contextValue` 的三种形式（文本描述、锚点引用、URL）。

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-context-full-001",
    "created": "2025-10-25T15:00:00Z",
    "locale": "zh-CN"
  },
  "source": {
    "mode": "sidecar",
    "type": "text/markdown",
    "checksum": "c4ca4238a0b923820dcc509a6f75849b",
    "filename": "meeting-notes.md"
  },
  "annotations": [
    {
      "id": "ann-global-context",
      "anchor": { "scope": "global" },
      "context": {
        "participants": [
          "张三 — 项目经理",
          "李四 — 技术负责人",
          "王五 — 产品经理"
        ],
        "memory": [
          "基于上周二关于项目截止日期的讨论",
          { "scope": "annotation", "ref": "ann-prev-decision" },
          "https://example.com/meeting-notes/2025-10-18"
        ],
        "situation": [
          "季度项目评审会议",
          "讨论第二阶段冲刺阻碍"
        ],
        "subtext": [
          "团队对截止日期的可行性存在分歧",
          "暗示可能需要调整项目范围"
        ],
        "culture": [
          "团队偏好直接沟通风格",
          "在中国企业文化中，间接表达异议是常见的"
        ],
        "references": [
          "https://example.com/project-plan-v3",
          "https://example.com/sprint-board",
          { "scope": "annotation", "ref": "ann-architecture-doc" }
        ],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "text_block",
              "text": "全局语境：季度项目评审会议，3 位参与者"
            }
          }
        ]
      }
    },
    {
      "id": "ann-prev-decision",
      "signs": ["highlight"],
      "whatis": "event",
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 50, "end": 120 }
      },
      "context": {
        "situation": ["上次会议的决策记录"]
      }
    },
    {
      "id": "ann-architecture-doc",
      "whatis": "object",
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 200, "end": 230 }
      },
      "context": {
        "references": ["https://example.com/architecture-v3.pdf"]
      }
    }
  ]
}
```

### 12.8 元注解示例

以下示例演示 `annotation` 锚点 scope（元注解）和 `secret` sign 的组合使用。一个注解引用另一个注解，对其添加额外的标记和语境。

```json
{
  "meta": {
    "version": "icp-ctx-file/2025-10-25",
    "id": "ctx-meta-annotation-001",
    "created": "2025-10-25T20:00:00Z",
    "locale": "zh-CN"
  },
  "source": {
    "mode": "sidecar",
    "type": "text/markdown",
    "checksum": "b14a7b8059d9c055954c92674ce60032",
    "filename": "config-review.md"
  },
  "annotations": [
    {
      "id": "ann-db-config",
      "whatis": "object",
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 45, "end": 120 }
      },
      "context": {
        "situation": ["数据库配置审查"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "highlight_marker",
              "color": "#FFCC00"
            }
          }
        ]
      }
    },
    {
      "id": "ann-db-password",
      "signs": ["secret", "warning"],
      "anchor": {
        "scope": "coordinate",
        "text": { "start": 80, "end": 110 }
      },
      "context": {
        "subtext": ["数据库密码不应出现在配置文件中"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "text_block",
              "text": "••••••••（敏感内容已遮罩）"
            }
          }
        ]
      }
    },
    {
      "id": "ann-meta-security-review",
      "signs": ["question"],
      "anchor": {
        "scope": "annotation",
        "ref": "ann-db-password"
      },
      "context": {
        "participants": ["安全审查员"],
        "subtext": ["质疑为何敏感凭据出现在代码仓库中"],
        "references": [
          "https://example.com/security-policy#credential-management"
        ],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "action_button",
              "label": "创建安全工单",
              "action": "create_security_ticket"
            }
          }
        ]
      }
    },
    {
      "id": "ann-meta-approval",
      "anchor": {
        "scope": "annotation",
        "ref": "ann-db-config"
      },
      "context": {
        "participants": ["技术负责人"],
        "situation": ["配置审查已完成"],
        "reactions": [
          {
            "type": "render",
            "params": {
              "component": "text_block",
              "text": "审查状态：需要修改 — 请移除硬编码凭据"
            }
          }
        ]
      }
    }
  ]
}
```


---

## 附录 A：Schema 文件策略

本附录定义 ICP 的 Schema 文件管理策略。`schema.json` 是所有 CTX_File 数据模型定义的唯一权威来源（Single Source of Truth）。

### A.1 权威数据源

`schema.json` 是 ICP 数据模型的唯一权威来源。所有数据类型定义、字段约束、枚举值和验证规则均以 `schema.json` 为准。

当规范文档的文字描述与 `schema.json` 的定义存在冲突时，以 `schema.json` 为权威来源。规范文档 SHOULD 及时更新以消除不一致。

`schema.json` 文件位于 `schema/{version}/schema.json` 路径下，其中 `{version}` 为协议版本标识（如 `2025-10-25`）。

### A.2 生成规则

以下文件 MUST 从 `schema.json` 自动生成，不得手动编辑或偏离：

| 生成文件 | 格式 | 用途 |
|---|---|---|
| `schema.ts` | TypeScript | TypeScript 类型定义，供 SDK 和工具使用。 |
| `schema.mdx` | MDX | 人类可读的 Schema 文档，供开发者参考。 |

生成规则：

- `schema.ts` MUST 从 `schema.json` 生成，类型定义 MUST 与 JSON Schema 定义结构等价。
- `schema.mdx` MUST 从 `schema.json` 生成，文档内容 MUST 准确反映 JSON Schema 定义。
- 生成文件 MUST NOT 包含 `schema.json` 中不存在的类型或字段。
- 生成文件 MUST NOT 遗漏 `schema.json` 中定义的类型或字段。

### A.3 Schema 格式要求

`schema.json` MUST 满足以下格式要求：

- MUST 使用 [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/schema) 语法。
- 所有类型定义 MUST 通过 `$ref` 引用 `$defs` 中的定义。
- MUST 完整自包含（Self-contained），不存在外部引用（External Reference）。所有 `$ref` 引用 MUST 指向同一文件内的 `$defs` 定义。
- MUST 包含 `$schema` 字段，值为 `"https://json-schema.org/draft/2020-12/schema"`。
- MUST 包含 `$id` 字段，值为 Schema 的逻辑标识符。
- 每个 `$defs` 中的定义 SHOULD 包含 `description` 字段，提供人类可读的描述。

---

## 附录 B：默认 UI 组件映射

本附录定义 `render` 反应中内置 UI 组件的完整规格，包括各组件的 params 定义、通用降级规则和自定义组件命名约定。

### B.1 内置 render 组件列表

本规范定义 9 个内置 render 组件。终端实现 SHOULD 支持所有内置组件，MUST 至少支持 `text_block` 作为通用降级组件。

| 组件名 | 中文名称 | 描述 |
|---|---|---|
| `checkbox_list` | 可勾选列表 | 渲染为可交互的勾选列表，适用于待办事项、任务清单。 |
| `form` | 交互式表单 | 渲染为包含输入字段的表单，适用于信息收集。 |
| `highlight_marker` | 高亮标记 | 在内容上渲染视觉高亮效果。 |
| `circle_overlay` | 圆形覆盖层 | 在图片或视频帧上渲染圆形标注。 |
| `timeline_card` | 时间线卡片 | 渲染为时间线上的信息卡片。 |
| `action_button` | 操作按钮 | 渲染为可点击的操作按钮。 |
| `data_table` | 数据表格 | 渲染为结构化数据表格。 |
| `media_preview` | 媒体预览 | 渲染为媒体内容（图片、视频、音频）的预览。 |
| `text_block` | 文本块 | 渲染为纯文本块。通用降级组件。 |

### B.2 通用降级规则

`text_block` 是通用降级组件（Universal Fallback Component）。降级规则如下：

- 当终端遇到不支持或未知的 render 组件名时，MUST 降级到 `text_block` 进行渲染。
- 降级时，终端 SHOULD 尝试从原始 `params` 中提取可用的文本信息作为 `text_block` 的 `text` 内容。
- 终端 SHOULD 记录一条警告日志，指示发生了组件降级，包含原始组件名和降级原因。
- 降级 MUST NOT 导致注解被丢弃或忽略——注解的其他信息（`signs`、`whatis`、`context` 等）MUST 保留。

### B.3 各组件 params 定义

#### B.3.1 checkbox_list

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"checkbox_list"`。 |
| `items` | `array<string>` | MUST | 列表项数组，每个元素为一个可勾选项的文本。 |

#### B.3.2 form

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"form"`。 |
| `fields` | `array<object>` | MUST | 表单字段数组。每个字段对象 SHOULD 包含 `name`（字段名）、`type`（字段类型）和 `label`（显示标签）。 |

#### B.3.3 highlight_marker

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"highlight_marker"`。 |
| `color` | `string` | MAY | 高亮颜色，CSS 颜色值（如 `"#FFD700"`）。终端 MAY 使用默认颜色。 |

#### B.3.4 circle_overlay

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"circle_overlay"`。 |
| `cx` | `number` | MUST | 圆心 x 坐标。 |
| `cy` | `number` | MUST | 圆心 y 坐标。 |
| `radius` | `number` | MUST | 圆半径。 |
| `color` | `string` | MAY | 圆形颜色，CSS 颜色值。 |
| `stroke_width` | `number` | MAY | 描边宽度（像素）。 |

#### B.3.5 timeline_card

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"timeline_card"`。 |
| `title` | `string` | MUST | 卡片标题。 |
| `time` | `string` | MUST | 时间标签（自由格式字符串）。 |
| `description` | `string` | MAY | 卡片描述文本。 |

#### B.3.6 action_button

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"action_button"`。 |
| `label` | `string` | MUST | 按钮显示文本。 |
| `action` | `string` | MUST | 点击时触发的动作标识符。 |

#### B.3.7 data_table

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"data_table"`。 |
| `columns` | `array<string>` | MUST | 列标题数组。 |
| `rows` | `array<array>` | MUST | 行数据数组，每行为一个值数组，长度 SHOULD 与 `columns` 一致。 |

#### B.3.8 media_preview

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"media_preview"`。 |
| `src` | `string` | MUST | 媒体资源 URL 或 Base64 数据 URI。 |
| `alt` | `string` | MAY | 替代文本（Alternative Text），用于无障碍访问。 |

#### B.3.9 text_block

| 字段名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `component` | `string` | MUST | 固定值 `"text_block"`。 |
| `text` | `string` | MUST | 显示的文本内容。 |

### B.4 自定义组件命名

自定义 render 组件 MUST 使用 `vendor:componentname` 命名空间格式（详见 [9.1.3](#913-自定义-render-组件)）。

终端遇到自定义组件名时，若不支持该组件，MUST 降级到 `text_block`（依据 [B.2](#b2-通用降级规则) 规则）。

自定义组件的 `params` 结构由组件提供者定义，本规范不做约束。终端在处理自定义组件的 `params` 时，SHOULD 忽略不认识的字段。

### B.5 React 参考实现指南

> **注意**：本节为非规范性（Non-normative）内容，仅提供参考实现建议。

以下为各内置组件的 React 参考实现 props 接口：

```typescript
// checkbox_list
interface CheckboxListProps {
  items: string[];
  onChange?: (index: number, checked: boolean) => void;
}

// form
interface FormProps {
  fields: Array<{
    name: string;
    type: string;
    label: string;
    required?: boolean;
  }>;
  onSubmit?: (values: Record<string, unknown>) => void;
}

// highlight_marker
interface HighlightMarkerProps {
  color?: string;  // 默认值由实现决定
  children: React.ReactNode;
}

// circle_overlay
interface CircleOverlayProps {
  cx: number;
  cy: number;
  radius: number;
  color?: string;
  strokeWidth?: number;
}

// timeline_card
interface TimelineCardProps {
  title: string;
  time: string;
  description?: string;
}

// action_button
interface ActionButtonProps {
  label: string;
  action: string;
  onClick?: (action: string) => void;
}

// data_table
interface DataTableProps {
  columns: string[];
  rows: unknown[][];
}

// media_preview
interface MediaPreviewProps {
  src: string;
  alt?: string;
}

// text_block
interface TextBlockProps {
  text: string;
}
```

实现者 MAY 根据自身 UI 框架和设计系统调整 props 接口，但 SHOULD 保持与上述接口的语义兼容性。


---

## 附录 C：语境子结构

本附录详细定义注解的 `context` 语境子结构（Context Sub-structure）。`context` 是 `Annotation` 的可选字段，承载注解的语境数据——包括参与者、记忆、情境、潜台词、文化背景、引用资料和反应。

### C.1 Context 对象结构

`Context` 对象包含以下字段，所有字段均为 OPTIONAL：

| 字段名 | 类型 | 描述 |
|---|---|---|
| `participants` | `array<contextValue>` | 参与者数组。描述与注解相关的参与者。 |
| `memory` | `array<contextValue>` | 记忆数组。描述注解基于什么记忆或先前信息。 |
| `situation` | `array<contextValue>` | 情境数组。描述注解发生在什么情境下。 |
| `subtext` | `array<contextValue>` | 潜台词数组。描述言外之意或隐含信息。 |
| `culture` | `array<contextValue>` | 文化数组。描述在什么文化背景下。 |
| `references` | `array<contextValue>` | 引用数组。提供相关参考资料。 |
| `reactions` | `array<Reaction>` | 反应数组。注解显示时触发的反应。 |

除 `reactions` 外，所有字段的元素类型均为 `contextValue`。

#### contextValue 联合类型

`contextValue` 是一个联合类型（Union Type），每个元素可以是以下三种形式之一：

| 形式 | 类型 | 判断规则 | 示例 |
|---|---|---|---|
| 文本描述 | `string` | 不以 `http://` 或 `https://` 开头的字符串 | `"张三 — 项目经理"` |
| URL | `string` | 以 `http://` 或 `https://` 开头的字符串 | `"https://example.com/doc"` |
| 锚点引用 | `Anchor` | 包含 `scope` 字段的对象 | `{ "scope": "annotation", "ref": "ann-001" }` |

`reactions` 字段的元素类型为 `Reaction`（详见[第 6 章](#6-反应系统)），不使用 `contextValue` 类型。

### C.2 Participants 字段

`participants` 是 `contextValue` 数组，每个元素描述一个与注解相关的参与者。

用途：标识谁参与了注解所描述的交互、事件或讨论。

示例：

```json
{
  "participants": [
    "张三 — 项目经理",
    "李四 — 技术负责人",
    { "scope": "annotation", "ref": "ann-speaker-profile" },
    "https://example.com/team/wangwu"
  ]
}
```

上述示例中，前两个元素为文本描述，第三个为锚点引用（指向另一个注解），第四个为 URL（指向外部人员资料页）。

### C.3 Memory 字段

`memory` 是 `contextValue` 数组，每个元素描述注解基于什么记忆或先前信息。

用途：提供注解的记忆上下文——注解是基于什么先前知识、讨论或经验做出的。

示例：

```json
{
  "memory": [
    "基于上周二关于项目截止日期的讨论",
    { "scope": "annotation", "ref": "ann-prev-meeting-notes" },
    "https://example.com/meeting-notes/2025-10-18"
  ]
}
```

### C.4 Situation 字段

`situation` 是 `contextValue` 数组，每个元素描述注解发生在什么情境下。

用途：提供注解的情境上下文——注解是在什么场景、环境或条件下产生的。

示例：

```json
{
  "situation": [
    "季度项目评审会议",
    "讨论第二阶段冲刺阻碍",
    "远程视频会议环境"
  ]
}
```

### C.5 Subtext 字段

`subtext` 是 `contextValue` 数组，每个元素描述言外之意或隐含信息。

用途：捕捉注解内容的潜台词——表面文字之下的隐含含义、暗示或未明确表达的信息。

示例：

```json
{
  "subtext": [
    "团队对截止日期的可行性存在分歧",
    "暗示可能需要调整项目范围",
    "对技术方案的可扩展性表示怀疑"
  ]
}
```

### C.6 Culture 字段

`culture` 是 `contextValue` 数组，每个元素描述在什么文化背景下。

用途：提供注解的文化上下文——帮助理解注解内容在特定文化背景下的含义。

示例：

```json
{
  "culture": [
    "在日本商务文化中，间接拒绝是常见的",
    "团队偏好直接沟通风格",
    "https://example.com/cultural-guide/east-asia"
  ]
}
```

### C.7 References 字段

`references` 是 `contextValue` 数组，每个元素提供相关参考资料。

用途：为注解提供支撑材料——包括文档链接、相关注解引用和文本描述。

示例：

```json
{
  "references": [
    "https://example.com/project-plan-v3",
    "https://example.com/architecture-docs",
    { "scope": "annotation", "ref": "ann-related-finding" },
    "参见《系统设计文档》第 4.2 节"
  ]
}
```

### C.8 Reactions 子结构

`reactions` 是 `Reaction` 对象的数组，定义注解在被终端显示或处理时触发的反应。

与其他 context 字段不同，`reactions` 的元素类型为 `Reaction`（而非 `contextValue`）。每个 `Reaction` 包含 `type` 和 `params` 两个必填字段。

`Reaction` 的完整定义详见[第 6 章：反应系统](#6-反应系统)。

四种反应类型汇总：

| type | 描述 | params 关键字段 |
|---|---|---|
| `render` | 渲染为 UI 组件 | `component`（组件名） |
| `function` | 调用预设函数 | `name`（函数名）、`device`（可选）、`args`（可选） |
| `app` | 触发应用动作 | `id`（应用 ID）、`action`（动作名）、`payload`（可选） |
| `command` | 执行系统命令 | `cmd`（命令）、`env`（可选） |

示例：

```json
{
  "reactions": [
    {
      "type": "render",
      "params": {
        "component": "highlight_marker",
        "color": "#FFD700"
      }
    },
    {
      "type": "function",
      "params": {
        "name": "log_annotation_view",
        "args": { "event": "context_viewed" }
      }
    },
    {
      "type": "app",
      "params": {
        "id": "com.example.notes",
        "action": "bookmark",
        "payload": { "label": "重要语境" }
      }
    }
  ]
}
```

终端 SHOULD 按数组顺序依次执行 `reactions` 中的反应。当遇到不支持的反应类型时，MUST 跳过并继续处理后续反应（详见 [6.6.2](#662-未知反应类型处理)）。
