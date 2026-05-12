# 实施计划：ICP SDK 指南

## 概述

基于需求文档和设计文档，将 SDK 指南拆分为增量式文档编写任务。所有文档先以中文（zh-CN）编写，最后翻译为英文（en）。每个任务产出 `docs/zh-CN/sdk/` 下的一个或多个 Markdown 文件，内容需覆盖设计文档中定义的章节和接口规范。

## Tasks

- [ ] 1. 创建 SDK 指南目录结构与首页
  - [ ] 1.1 创建 `docs/zh-CN/sdk/` 目录结构（含 core/、languages/、tutorials/、testing/ 子目录）及 `index.md` 首页
    - 首页包含 SDK 指南简介、文档导航目录、与其他文档的关系说明
    - 引用设计文档中的文档目录结构和关系图
    - _需求: 1.1, 1.3_

- [ ] 2. 编写架构规范文档
  - [ ] 2.1 编写 `docs/zh-CN/sdk/architecture.md`
    - 设计原则章节：轻量级、零依赖核心、可扩展、惯用风格
    - 分层架构章节：SDK_Core（Parser + Serializer + 数据模型）与 SDK_Extension（Context_Manager + Adapter + Skill_Bridge）
    - 依赖关系图：SDK_Core → SDK_Extension → 外部协议绑定（MCP, A2A, OpenAPI）的 Mermaid 图
    - Schema 引用：所有实现引用 `schema/2025-10-25/schema.json` 作为权威数据模型
    - 版本策略：SDK_Core 公开 API 稳定，破坏性变更需主版本号递增
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 3. 编写核心接口规范文档
  - [ ] 3.1 编写 `docs/zh-CN/sdk/core/parser-serializer.md`
    - Parser.parseAnnotations 接口：接受注解标记文本，返回 Annotation[]
    - Serializer.serialize 接口：接受 CTXFile 内存对象，返回符合 schema.json 的 JSON
    - Parser.deserialize 接口：接受 JSON 字符串，返回经验证的 CTXFile 对象
    - PrettyPrinter.print 接口：接受 Annotation[]，返回注解标记语法文本
    - 往返属性说明：serialize → deserialize 等价性、parse → print → parse 等价性
    - 错误处理规范：ErrorObject 结构（error_type, error_code, message, location）
    - TypeScript 规范接口定义（作为各语言实现的参考）
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 3.2 编写 `docs/zh-CN/sdk/core/context-adapter.md`
    - Context_Manager 接口：create / validate / merge / setScope 方法
    - 合并策略：冲突字段取最新值
    - Adapter 接口：render / fallback / getCapabilities 方法
    - 能力报告：返回支持的 ComponentType 和 ModalityChannel 列表
    - 组件降级：不支持时使用 FallbackStrategy，无策略时降级到 text_block
    - 通道降级：不支持指定 ModalityChannel 时降级到 text 通道
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 4. 检查点 — 核心文档审查
  - 确保 architecture.md、parser-serializer.md、context-adapter.md 内容完整且相互一致，如有疑问请询问用户。

- [ ] 5. 编写多语言实现指引
  - [ ] 5.1 编写 `docs/zh-CN/sdk/languages/typescript.md`
    - TypeScript/JavaScript 作为参考实现的定位说明
    - 项目结构、包命名（npm）、数据模型映射（interface + 联合类型）、错误处理（Result 模式）、序列化方案（原生 JSON.parse/stringify）
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 5.2 编写 `docs/zh-CN/sdk/languages/python.md`
    - 项目结构、包命名（PyPI）、数据模型映射（dataclass + Enum）、错误处理（异常层次）、序列化方案（json 模块 + 自定义 encoder）
    - _需求: 4.1, 4.2, 4.3, 4.5_

  - [ ] 5.3 编写 `docs/zh-CN/sdk/languages/java.md`
    - 项目结构、包命名（Maven Central）、数据模型映射（record + sealed interface）、错误处理（checked exception）、序列化方案（Jackson / Gson）
    - _需求: 4.1, 4.2, 4.3, 4.5_

  - [ ] 5.4 编写 `docs/zh-CN/sdk/languages/go.md`
    - 项目结构、包命名（pkg.go.dev）、数据模型映射（struct + json tag）、错误处理（error 返回值）、序列化方案（encoding/json）
    - _需求: 4.1, 4.2, 4.3, 4.5_

  - [ ] 5.5 编写 `docs/zh-CN/sdk/languages/rust.md`
    - 项目结构、包命名（crates.io）、数据模型映射（struct + #[derive(Serialize)]）、错误处理（Result + thiserror）、序列化方案（serde + serde_json）
    - _需求: 4.1, 4.2, 4.3, 4.5_

- [ ] 6. 编写使用教程
  - [ ] 6.1 编写 `docs/zh-CN/sdk/tutorials/assembling.md`
    - 端到端工作流：原始文本 → 注解标记 → 附加上下文 → 添加 reactions → 序列化为 JSON
    - 分步代码示例：创建 Meta、Source、Annotation（含 anchor/signs/whatis/context）、序列化
    - 完整 TypeScript 示例：组装包含多个注解和上下文的完整 .ctx 文件
    - Schema 验证：组装后对照 schema.json 验证
    - _需求: 5.1, 5.2, 5.3, 5.4_

  - [ ] 6.2 编写 `docs/zh-CN/sdk/tutorials/parsing-rendering.md`
    - 端到端工作流：JSON → 反序列化 → 提取注解 → 选择组件 → 降级处理 → 组装界面
    - 分步代码示例：反序列化、遍历 annotations、根据 reactions 选择组件、应用降级
    - 完整 TypeScript 示例：解析 .ctx 文件并渲染 text_block、form_card、action_button
    - 未知类型处理：未知注解类型保留为原始内容，不中断处理
    - _需求: 6.1, 6.2, 6.3, 6.4_

- [ ] 7. 编写测试与发布规范
  - [ ] 7.1 编写 `docs/zh-CN/sdk/testing/conformance.md`
    - 一致性测试套件规范：所有语言 SDK 必须通过的测试清单
    - 往返属性测试：Parser/Serializer 和 Parser/PrettyPrinter 的往返测试规范
    - 错误处理测试：畸形输入产生正确的 ErrorObject
    - 属性测试配置：各语言推荐的属性测试库（fast-check, Hypothesis, jqwik, rapid, proptest）
    - 版本策略：语义版本，SDK 主版本对应 ICP 协议主版本
    - 兼容性矩阵：每次发布包含支持的协议版本和 schema 版本
    - 发布清单：一致性测试通过 → API 文档生成 → changelog 更新 → 发布到注册表
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 7.2 编写属性测试示例代码（Property 1: Serializer 往返一致性）
    - **Property 1: Serializer 序列化-反序列化往返一致性**
    - **验证需求: 2.5**

  - [ ]* 7.3 编写属性测试示例代码（Property 2: Parser/PrettyPrinter 往返一致性）
    - **Property 2: Parser/PrettyPrinter 解析-打印往返一致性**
    - **验证需求: 2.6**

  - [ ]* 7.4 编写属性测试示例代码（Property 3: 畸形输入产生结构化错误）
    - **Property 3: 畸形输入产生结构化错误**
    - **验证需求: 2.7**

  - [ ]* 7.5 编写属性测试示例代码（Property 4: Context 合并取最新值）
    - **Property 4: Context 合并取最新值**
    - **验证需求: 3.2**

  - [ ]* 7.6 编写属性测试示例代码（Property 5: 不支持的能力触发优雅降级）
    - **Property 5: 不支持的能力触发优雅降级**
    - **验证需求: 3.5, 3.6**

  - [ ]* 7.7 编写属性测试示例代码（Property 6: 未知注解类型保留原始内容）
    - **Property 6: 未知注解类型保留原始内容**
    - **验证需求: 6.4**

- [ ] 8. 检查点 — 中文版完整性审查
  - 确保 `docs/zh-CN/sdk/` 下所有文档内容完整、交叉引用正确、覆盖全部 7 项需求，如有疑问请询问用户。

- [ ] 9. 编写英文版 SDK 指南
  - [ ] 9.1 翻译并创建 `docs/en/sdk/index.md`
    - 基于 zh-CN 版本翻译为英文
    - _需求: 1.1, 1.3_

  - [ ] 9.2 翻译并创建 `docs/en/sdk/architecture.md`
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 9.3 翻译并创建 `docs/en/sdk/core/parser-serializer.md`
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 9.4 翻译并创建 `docs/en/sdk/core/context-adapter.md`
    - _需求: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 9.5 翻译并创建 `docs/en/sdk/languages/` 下 5 个语言文件（typescript.md, python.md, java.md, go.md, rust.md）
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 9.6 翻译并创建 `docs/en/sdk/tutorials/assembling.md`
    - _需求: 5.1, 5.2, 5.3, 5.4_

  - [ ] 9.7 翻译并创建 `docs/en/sdk/tutorials/parsing-rendering.md`
    - _需求: 6.1, 6.2, 6.3, 6.4_

  - [ ] 9.8 翻译并创建 `docs/en/sdk/testing/conformance.md`
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 10. 最终检查点 — 全语言版本审查
  - 确保 zh-CN 和 en 两个语言版本内容一致、链接正确、所有需求覆盖完整，如有疑问请询问用户。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP
- 每个任务引用具体需求编号以确保可追溯性
- 检查点任务确保增量验证
- 属性测试示例代码以 TypeScript (fast-check) 为主，嵌入 conformance.md 中
- 所有代码示例使用 TypeScript 作为规范参考语言
