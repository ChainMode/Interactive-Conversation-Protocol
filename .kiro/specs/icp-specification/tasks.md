# 实施计划：ICP 语境注解格式规范（.ctx 文件）

## 概述

本实施计划将 ICP 规范设计转化为可执行的编写任务。核心工作是：从零重写 schema.json 以匹配新的 .ctx 文件格式（CTX_File 根对象 + meta/source/annotations，注解结构：id/signs[]/whatis/anchor/context，context 字段除 reactions 外均为 contextValue 数组），编写 12 章 + 3 附录的中文规范文档，生成衍生文件，最后翻译英文版本。

任务顺序：Schema 重写 → 规范章节 1-4 → 规范章节 5-8 → 规范章节 9-12 + 附录 → 质量审查 → 衍生文件生成 → 英文版本 → 最终检查。

## 任务

- [ ] 1. 从零重写 schema.json：定义 .ctx 文件格式的完整数据模型
  - [ ] 1.1 重写 `schema/2025-10-25/schema.json` 根结构和核心 $defs
    - 删除旧的 message-based 结构（version/id/messages 根对象、message、annotationTarget 等）
    - 定义新的 CTX_File 根对象：三个必填顶层节 meta、source、annotations
    - 在 `$defs` 中定义 Meta（version, id, created_at, locale?, schema_ref?）
    - 在 `$defs` 中定义 Source（mode, media_type, checksum?, content?, filename?）和 Source_Mode 枚举（inline/sidecar/bundled）
    - 在 `$defs` 中定义 Annotation（id?, signs?[], whatis?, anchor, context?）
    - 在 `$defs` 中定义 Signs 内置关键词枚举（highlight, warning, question, secret）
    - 在 `$defs` 中定义 Whatis 内置关键词枚举（person, organization, event, time, place, term, object, skill, emotion）
    - 在 `$defs` 中定义 Context（participants?[], memory?[], situation?[], subtext?[], culture?[], references?[], reactions?[]）— 除 reactions 外所有字段为 contextValue 数组
    - 在 `$defs` 中定义 ContextValue 联合类型（string | anchor）
    - 在 `$defs` 中定义 Reaction（type: render/function/app/command, params）
    - 移除旧的 Visibility_Level 枚举（不再需要）
    - 移除旧的 Action 定义（由 Reaction 替代，位于 context.reactions 中）
    - 使用 JSON Schema 2020-12 语法，$id 更新为 `icp://schemas/ctx-file/2025-10-25`
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 13.4, 13.5_

  - [ ] 1.2 定义锚点系统 $defs：Anchor 六种 scope 变体
    - 定义 Anchor 包含 scope 字段，六种变体：global、coordinate、marker、feature、pattern、annotation
    - 定义 global（全局锚点）
    - 定义 coordinate scope 的位置信息：text_range（start ≥ 0, end ≥ 0, start < end）、image_region（rect 或 polygon）、video（time_start/time_end + 可选 region）、audio（time_start/time_end）
    - 定义 marker（标记锚点，含标记名）
    - 定义 feature（特征锚点，含特征描述）
    - 定义 pattern（模式锚点，含匹配模式）
    - 定义 annotation（注解引用锚点，ref 字段指向目标注解 id）
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ] 1.3 定义反应系统 $defs：Reaction 结构和四种反应类型
    - 定义 Reaction（type: enum render/function/app/command, params: object）— 位于 context.reactions[] 中
    - 定义 render.params（component: string + 开放对象）
    - 定义 function.params（function_name, target_device?, args?）
    - 定义 app.params（app_id, action_name, payload?）
    - 定义 command.params（command, env?）
    - _需求: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 1.4 定义语境子结构 $defs
    - 定义 Context（participants?[], memory?[], situation?[], subtext?[], culture?[], references?[], reactions?[]）— 除 reactions 外所有字段为 contextValue 数组
    - 定义 ContextValue 联合类型：oneOf [string, anchor]（文本描述/URL 或锚点引用）
    - 移除旧的 Participant 结构（participants 现在是 contextValue 数组）
    - 移除旧的 memory（short_term/long_term MemoryItem 结构）、concept、situation 复杂对象、environment、culture 复杂对象
    - memory、situation、subtext、culture、references 现在都是 contextValue 数组，不再是复杂对象或单一字符串
    - 清理旧的 message、annotationTarget、session、skill、modalityChannel、renderingHint、fallbackStrategy、modalityMetadata、errorObject、errorLocation、memoryItem、concept、environment 等不再需要的 $defs
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 1.5 编写属性测试：Schema 自包含性（Property 11）
    - **Property 11：Schema 自包含性**
    - 验证 schema.json 中所有 `$ref` 引用均指向同文件 `$defs` 中存在的定义，无悬空引用或外部引用
    - **验证需求: 需求 13.5**

  - [ ]* 1.6 编写属性测试：CTX_File JSON 序列化往返一致性（Property 1）
    - **Property 1：CTX_File JSON 序列化往返一致性**
    - 生成符合 schema 的随机 CTX_File JSON，验证 JSON.stringify → JSON.parse 后深度等价
    - **验证需求: 需求 1.8**

- [ ] 2. 检查点 — Schema 重写验证
  - 确保 schema.json 语法正确，CTX_File 根对象包含 meta/source/annotations，所有 $defs 存在且 $ref 引用无悬空
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. 编写规范文档章节 1-4（概述、文件结构、注解模型、锚点系统）
  - [ ] 3.1 重写 `docs/zh-CN/specification/2025-10-25/index.md`，编写第 1 章：协议概述
    - 1.1 协议目的与范围：ICP 全称、语境注解格式规范定位、.ctx 文件核心产物、问题域
    - 1.2 合规性框架：RFC 2119 关键词定义（MUST/MUST NOT/SHOULD/SHOULD NOT/MAY）、大写格式约定
    - 1.3 术语表：CTX_File、Annotation、Anchor、Source_Mode、Signs、Whatis、Context、Reaction 等核心术语，中英双语
    - 1.4 文档约定：章节编号规则、JSON 示例格式、技术术语首次出现附英文原文
    - _需求: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [ ] 3.2 编写第 2 章：.ctx 文件结构（CTX File Structure）
    - 2.1 CTX_File 根对象：三个必填顶层节 meta、source、annotations
    - 2.2 Meta 元数据块：version, id, created_at（必填）；locale, schema_ref（可选）
    - 2.3 Source 原始内容描述块：mode, media_type（必填）；checksum, content, filename（条件/可选）
    - 2.4 Source 模式约束规则表：sidecar → checksum MUST 存在；inline/bundled → content MUST 存在
    - 2.5 Annotations 注解数组定义
    - 2.6 各模式下的最小合法 CTX_File JSON 示例
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ] 3.3 编写第 3 章：注解模型（Annotation Model）
    - 3.1 Annotation 核心结构：anchor（必填）；id, signs[], whatis, context（可选）
    - 3.2 Signs 标记性质：内置关键词（highlight/warning/question/secret），自定义 vendor:signname，可组合
    - 3.3 Whatis 对象类型：内置关键词（person/organization/event/time/place/term/object/skill/emotion）
    - 3.4 Context 语境子结构：participants[]（contextValue 数组）, memory[]（contextValue 数组）, situation[]（contextValue 数组）, subtext[]（contextValue 数组）, culture[]（contextValue 数组）, references[]（contextValue 数组）, reactions[]
    - 3.5 验证规则：缺少 anchor → MUST 拒绝
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 3.4 编写第 4 章：锚点系统（Anchor System）
    - 4.1 Anchor 六种 scope 变体概述：global, coordinate, marker, feature, pattern, annotation
    - 4.2 global 全局锚点
    - 4.3 coordinate 坐标锚点（文本范围 start < end、图片区域 rect/polygon、视频时间+区域、音频时间）
    - 4.4 marker 标记锚点
    - 4.5 feature 特征锚点
    - 4.6 pattern 模式锚点
    - 4.7 annotation 注解引用锚点（ref 字段指向目标注解 id，实现元注解）
    - 4.8 锚点-媒体类型兼容性矩阵表
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11_

  - [ ]* 3.5 编写属性测试：Source 模式字段约束（Property 2）
    - **Property 2：Source 模式字段约束**
    - 生成随机 Source 对象，验证 sidecar 模式 checksum 必须存在且 content 不存在；inline/bundled 模式 content 必须存在
    - **验证需求: 需求 1.5, 1.6, 9.3, 9.4**

  - [ ]* 3.6 编写属性测试：锚点范围不变量（Property 3）
    - **Property 3：锚点范围不变量**
    - 生成随机 coordinate 文本范围/视频/音频锚点，验证 start < end 和 time_start ≤ time_end 约束
    - **验证需求: 需求 3.3, 3.5, 3.6**

  - [ ]* 3.7 编写属性测试：锚点-媒体类型兼容性（Property 4）
    - **Property 4：锚点-媒体类型兼容性**
    - 生成随机 CTX_File（各种 media_type + anchor scope 组合），验证兼容性矩阵约束（6 种 scope）
    - **验证需求: 需求 3.8, 3.9, 3.10, 3.11**

  - [ ]* 3.8 编写属性测试：缺失锚点拒绝（Property 18）
    - **Property 18：缺失锚点拒绝**
    - 生成缺少 anchor 字段的 Annotation，验证解析器拒绝并返回验证错误
    - **验证需求: 需求 2.6**

- [ ] 4. 检查点 — 章节 1-4 与 Schema 一致性审查
  - 验证第 1-4 章内容完整，章节编号连续
  - 验证 RFC 2119 关键词使用大写格式
  - 验证第 2-4 章中的数据模型与 schema.json 的 $defs 结构等价（Annotation: id/signs/whatis/anchor/context, Anchor: 6 scopes）
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. 编写规范文档章节 5-8（Signs/Whatis 关键词、反应系统、内联语法、打包模式）
  - [ ] 5.1 编写第 5 章：内置 Signs 与 Whatis 关键词（Built-in Signs and Whatis Keywords）
    - 5.1 内置 Signs 关键词：highlight, warning, question, secret 及各自语义描述
    - 5.2 Signs 组合规则：可组合使用，自定义 vendor:signname
    - 5.3 内置 Whatis 关键词：person, organization, event, time, place, term, object, skill, emotion 及各自语义描述
    - 5.4 Signs 和 Whatis 的可选性：均为 OPTIONAL
    - 5.5 Secret sign 敏感内容处理说明
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5, 8.1_

  - [ ] 5.2 编写第 6 章：反应系统（Reaction System）
    - 6.1 Reaction 结构：位于 context.reactions[] 中，type（render/function/app/command）+ params
    - 6.2 render 反应：component 名 + 内置组件列表（checkbox_list, form, highlight_marker, circle_overlay, timeline_card, action_button, data_table, media_preview, text_block）
    - 6.3 function 反应：function_name, target_device?, args?
    - 6.4 app 反应：app_id, action_name, payload?
    - 6.5 command 反应：command, env?
    - 6.6 执行规则：按数组顺序执行、不支持则跳过、未知组件降级到 text_block
    - 6.7 具体示例：signs:["todo"]→checkbox_list, collect→form, 视频→circle_overlay, 音频→function
    - _需求: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 5.3 编写第 7 章：内联注解语法（Inline Annotation Syntax）
    - 7.1 语法定义：嵌入 source 文本内容中的标记语言
    - 7.2 内置标记语法：highlight `**text**`, important `!!text!!`, todo `[todo: text]`, question `?text?`, mask `~text~`, whatis=person `@name`, whatis=time `[datetime]`
    - 7.3 反应附加语法：`[content]->render(component, params)`
    - 7.4 解析规则：优先级、嵌套、转义
    - 7.5 标记到数据模型的映射（signs/whatis/anchor/context.reactions）
    - 7.6 Pretty-Printer 规范
    - 7.7 往返一致性要求：parse → pretty-print → parse 等价
    - 7.8 错误处理：畸形标记视为字面文本并发出警告
    - _需求: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ] 5.4 编写第 8 章：Sidecar 与打包模式（Sidecar and Packaging Modes）
    - 8.1 三种打包模式概述：inline/sidecar/bundled
    - 8.2 Inline 模式约束：media_type MUST 为 text/*，content 含内联标记
    - 8.3 Sidecar 模式约束：checksum MUST 存在，content MUST 不存在，文件命名约定（原始文件名.ctx）
    - 8.4 Bundled 模式约束：content MUST 存在（二进制 base64），checksum SHOULD 存在
    - 8.5 模式选择指南
    - 8.6 模式转换规则：inline ↔ sidecar 转换
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 5.5 编写属性测试：语境注解必须使用全局锚点（Property 5）
    - **Property 5：语境注解必须使用全局锚点**
    - 生成包含 context.participants/memory/situation/culture 的全局语境注解，验证 anchor scope MUST 为 global
    - **验证需求: 需求 4.5, 8.1**

  - [ ]* 5.6 编写属性测试：内联注解语法往返一致性（Property 6）
    - **Property 6：内联注解语法往返一致性**
    - 生成随机内联注解文本，验证 parse → pretty-print → parse 产生等价 Annotation 结构集合
    - **验证需求: 需求 6.7**

  - [ ]* 5.7 编写属性测试：畸形标记优雅降级（Property 7）
    - **Property 7：畸形标记优雅降级**
    - 生成包含畸形/未闭合标记的随机文本，验证解析器将标记字符视为字面文本并发出警告
    - **验证需求: 需求 6.8**

  - [ ]* 5.8 编写属性测试：反应降级行为（Property 10）
    - **Property 10：反应降级行为**
    - 验证不支持的 reaction type 被跳过、未知 render component 降级到 text_block、未知 signs 关键词保留不中断
    - **验证需求: 需求 5.7, 10.6, 11.4**

  - [ ]* 5.9 编写属性测试：Sidecar 文件命名约定（Property 14）
    - **Property 14：Sidecar 文件命名约定**
    - 生成随机文件名，验证 sidecar .ctx 文件名为原始文件名 + ".ctx" 后缀
    - **验证需求: 需求 7.2**

  - [ ]* 5.10 编写属性测试：Sidecar Checksum 完整性验证（Property 8）
    - **Property 8：Sidecar Checksum 完整性验证**
    - 验证 sidecar 模式加载时 checksum 与原始文件 MD5 匹配，不匹配则发出警告
    - **验证需求: 需求 7.6**

  - [ ]* 5.11 编写属性测试：Inline-Sidecar 模式转换往返（Property 15）
    - **Property 15：Inline-Sidecar 模式转换往返**
    - 生成合法 inline 模式 CTX_File（text/*），验证 inline → sidecar → inline 转换后 annotations 等价
    - **验证需求: 需求 9.6**

- [ ] 6. 检查点 — 章节 5-8 完整性审查
  - 验证第 5-8 章内容完整，章节编号连续
  - 验证内置 signs/whatis 关键词与 schema.json 一致
  - 验证反应系统的 params 结构与 schema.json 一致
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. 编写规范文档章节 9-12 + 附录 A/B/C
  - [ ] 7.1 编写第 9 章：扩展机制（Extension Mechanisms）
    - 9.1 命名空间约定：自定义 signs vendor:signname，自定义反应类型，自定义 render 组件名
    - 9.2 版本兼容性规则：未知 signs → 保留；未知反应类型 → 跳过；未知字段 → 忽略
    - 9.3 语义版本：meta.version 使用 major.minor.patch
    - 9.4 向后兼容保证：版本 N.x 产生的 CTX_File MUST 可被 N.y（y ≥ x）解析
    - _需求: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ] 7.2 编写第 10 章：安全与隐私（Security and Privacy）
    - 10.1 Secret Sign 敏感内容处理：signs 含 "secret" 的注解 SHOULD 特殊处理
    - 10.2 输入验证：schema 验证、reaction params 清理、command 白名单
    - 10.4 Checksum 安全说明：仅完整性验证，非安全机制
    - 10.5 命令执行同意：command 反应 MUST 要求用户明确同意
    - _需求: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ] 7.3 编写第 11 章：合规性要求（Conformance Requirements）
    - 11.1 合规级别汇总表：按章节汇总所有 MUST/SHOULD/MAY 要求
    - 区分必须实现、推荐实现、可选实现
    - _需求: 15.2, 15.5, 15.6_

  - [ ] 7.4 编写第 12 章：示例文档（Examples）
    - 12.1 文本文档 Sidecar 示例：coordinate 锚点 + signs 标记 + render 反应
    - 12.2 图片文件 Sidecar 示例：coordinate 锚点 + circle_overlay
    - 12.3 视频文件 Sidecar 示例：coordinate 锚点 + 时间注解 + 区域覆盖
    - 12.4 音频文件 Sidecar 示例：coordinate 锚点 + function 反应
    - 12.5 内联模式示例：内联语法嵌入文本 + 等价 annotations 数组
    - 12.6 捆绑模式示例：原始内容与注解打包
    - 12.7 语境子结构示例：注解包含 context.participants/memory/situation/subtext/culture/references 字段，演示 contextValue 三种形式
    - 12.8 Secret Sign 与 Annotation 锚点示例：secret sign 敏感内容 + annotation scope 元注解
    - 12.9 所有 JSON 示例 MUST 通过 schema.json 验证
    - _需求: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9_

  - [ ] 7.5 编写附录 A：Schema 文件策略
    - A.1 权威数据源：schema.json 为唯一权威来源
    - A.2 生成规则：schema.ts 和 schema.mdx 从 schema.json 生成，不得偏离
    - A.3 Schema 格式要求：JSON Schema 2020-12、$ref/$defs、自包含
    - A.4 规范-Schema 结构等价要求
    - _需求: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ] 7.6 编写附录 B：默认 UI 组件映射
    - B.1 内置 render 组件列表及语义描述
    - B.2 通用降级规则：text_block 为降级组件
    - B.3 各组件 params schema（checkbox_list→items, form→fields, circle_overlay→cx/cy/radius 等）— 用于 context.reactions[] 中的 render 反应
    - B.4 自定义组件命名：命名空间前缀
    - B.5 React 参考实现指南（非规范性）
    - _需求: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 7.7 编写附录 C：语境子结构
    - C.1 Context 对象结构（participants[], memory[], situation[], subtext[], culture[], references[], reactions[] — 除 reactions 外所有字段为 contextValue 数组，所有字段可选）
    - C.2 ContextValue 联合类型（文本描述 string | 锚点引用 anchor | URL string）
    - C.3 Participants 字段（contextValue 数组）
    - C.4 Memory 字段（contextValue 数组）
    - C.5 Situation 字段（contextValue 数组）
    - C.6 Subtext 字段（contextValue 数组）
    - C.7 Culture 字段（contextValue 数组）
    - C.8 References 字段（contextValue 数组）
    - C.9 Reactions 子结构（Reaction 数组，type + params）
    - _需求: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 7.8 编写属性测试：Secret Sign 敏感内容处理正确性（Property 9）
    - **Property 9：Secret Sign 敏感内容处理正确性**
    - 生成包含 secret signs 的注解，验证实现对 secret 内容特殊处理
    - **验证需求: 需求 12.3**

  - [ ]* 7.9 编写属性测试：版本兼容性语义（Property 16）
    - **Property 16：版本兼容性语义**
    - 生成随机语义版本对，验证 major 不同则不兼容、N.x 可被 N.y（y ≥ x）解析
    - **验证需求: 需求 11.5, 11.6**

  - [ ]* 7.10 编写属性测试：语境注解处理顺序（Property 17）
    - **Property 17：语境注解处理顺序**
    - 验证 anchor scope 为 global 的语境注解 MUST 在内容特定注解之前被处理
    - **验证需求: 需求 8.7**

  - [ ]* 7.11 编写属性测试：示例文档 Schema 验证（Property 13）
    - **Property 13：示例文档 Schema 验证**
    - 提取第 12 章中的所有 JSON 示例，逐一通过 ajv 验证 schema.json
    - **验证需求: 需求 14.9**

- [ ] 8. 质量审查 — 规范文档与 Schema 全面一致性检查
  - [ ] 8.1 结构审查
    - 验证全部 12 个主章节 + 附录 A/B/C 是否存在，章节编号连续
    - 验证 RFC 2119 关键词全部使用大写格式
    - 验证技术术语首次出现时附英文原文
    - _需求: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [ ] 8.2 数据模型审查
    - 逐一对照需求 1-5 的验收标准，验证每个数据模型是否完整定义（Annotation: id/signs/whatis/anchor/context, Anchor: 6 scopes, Context: participants/memory/situation/culture/reactions, Reaction: type/params）
    - 对比规范文档中的数据模型与 schema.json 的 $defs，验证结构等价
    - 修正任何不一致之处（以规范文档为准修正 schema，或以 schema 为准修正文档）
    - _需求: 13.6_

  - [ ] 8.3 示例验证
    - 提取第 12 章中所有 JSON 示例，逐一验证是否符合 schema.json
    - 修正不通过验证的示例或 schema 定义
    - _需求: 14.9_

  - [ ]* 8.4 编写属性测试：规范-Schema 结构等价性（Property 12）
    - **Property 12：规范-Schema 结构等价性**
    - 验证规范文档中定义的每个数据模型在 schema.json 的 $defs 中有结构等价的定义
    - **验证需求: 需求 13.6**

- [ ] 9. 检查点 — 质量审查通过
  - 确认全部 12 章 + 3 附录内容完整且编号连续
  - 确认所有 JSON 示例通过 schema.json 验证
  - 确认规范文档与 schema.json 结构等价
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. 生成衍生文件：schema.ts 和 schema.mdx
  - [ ] 10.1 从 `schema/2025-10-25/schema.json` 生成 `schema/2025-10-25/schema.ts`
    - 生成 TypeScript 类型定义，覆盖所有 $defs 中的类型：CTX_File, Meta, Source, Source_Mode, Annotation, Signs, Whatis, Anchor (6 scopes), Context, Participant, Reaction, coordinate_text_range, coordinate_image_region, coordinate_video, coordinate_audio 等
    - 确保与 schema.json 结构一致，不得偏离
    - _需求: 13.2_

  - [ ] 10.2 从 `schema/2025-10-25/schema.json` 生成 `schema/2025-10-25/schema.mdx`
    - 生成人类可读的 MDX 文档，覆盖所有数据模型定义
    - 包含每个类型的字段表格、约束说明、示例片段
    - 确保与 schema.json 结构一致，不得偏离
    - _需求: 13.3_

- [ ] 11. 编写英文版本规范文档
  - [ ] 11.1 将中文规范文档翻译为英文，输出到 `docs/en/specification/2025-10-25/index.md`
    - 保持章节结构、编号和内容完全一致
    - RFC 2119 关键词保持大写英文
    - JSON 示例保持不变
    - 技术术语使用英文原文（无需括号标注）
    - _需求: 15.4_

- [ ] 12. 最终检查点 — 全部交付物验证
  - 验证全部 5 个交付物存在且内容完整：
    1. `docs/zh-CN/specification/2025-10-25/index.md`（中文规范文档，12 章 + 3 附录）
    2. `schema/2025-10-25/schema.json`（重写后的 .ctx 文件格式 Schema）
    3. `schema/2025-10-25/schema.ts`（生成的 TypeScript 类型）
    4. `schema/2025-10-25/schema.mdx`（生成的 MDX 文档）
    5. `docs/en/specification/2025-10-25/index.md`（英文规范文档）
  - Ensure all tests pass, ask the user if questions arise.

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 交付
- 每个任务引用具体需求编号以确保可追溯性
- 检查点确保增量验证，及时发现问题
- 属性测试验证 18 个正确性属性（Property 1-18），使用 TypeScript + fast-check + ajv
- Schema 从零重写优先于规范文档编写，因为规范文档引用 Schema 定义
- 旧的 message-based 结构将被完全替换为 CTX_File（meta/source/annotations）结构
- 注解结构已更新：id（可选）/ signs[]（可选，4 个内置）/ whatis（可选，9 个内置）/ anchor / context（含 participants[]/memory[]/situation[]/subtext[]/culture[]/references[]/reactions[]，除 reactions 外均为 contextValue 数组）
- 旧的 tags→signs, data→context, actions→reactions, visibility→removed, environment→merged into situation, concepts→removed
- context 字段统一为 contextValue 数组类型（string | anchor），不再有独立的 Participant 结构
