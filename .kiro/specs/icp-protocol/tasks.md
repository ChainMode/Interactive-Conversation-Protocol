# 实施计划：ICP 协议

## 概述

基于 ICP 协议的四层架构（输入层、处理层、适配层、输出层），按照从核心数据模型到外围组件的顺序逐步实现。每个任务构建在前一个任务的基础上，确保代码始终可集成运行。实现语言为 TypeScript，属性测试使用 fast-check。

## 任务

- [ ] 1. 搭建项目结构与核心类型定义
  - [ ] 1.1 创建项目目录结构和 TypeScript 配置
    - 创建 `src/` 目录，包含 `models/`、`parsers/`、`adapters/`、`managers/`、`utils/` 子目录
    - 创建 `tests/` 目录，包含 `unit/`、`property/` 子目录
    - 配置 `tsconfig.json`、`package.json`（依赖 fast-check、vitest 等）
    - _需求: 全局_

  - [ ] 1.2 定义核心数据模型类型
    - 在 `src/models/` 中创建以下类型定义文件：
      - `annotation.ts` — `Annotation`、`AnnotationType`、`AnnotationTarget`、`AnnotatedText`、`VisibilityLevel`
      - `context.ts` — `ContextInformation`、`Participant`、`Situation`、`Environment`
      - `document.ts` — `ICPDocument`、`Message`、`MessageBody`、`ModalityChannel`
      - `rendering.ts` — `RenderingHint`、`ComponentType`、`FallbackStrategy`、`ModalityMetadata`
      - `error.ts` — `ErrorObject`、`ErrorType`、`ErrorLocation`
      - `session.ts` — `Session`、`SessionScope`、`SessionState`
      - `version.ts` — `SemanticVersion`、`VersionRegistryEntry`、`VersionCompatibility`
    - 创建 `src/models/index.ts` 统一导出
    - _需求: 1.3, 2.1, 3.2, 4.4, 4.7, 5.7, 5.8, 6.1, 6.7, 6.8, 7.7, 8.1, 10.1_

  - [ ] 1.3 定义组件接口
    - 在 `src/interfaces/` 中创建以下接口文件：
      - `annotation-parser.ts` — `AnnotationParser`、`AnnotationPrettyPrinter`、`ParseResult`、`ValidationResult`
      - `context-manager.ts` — `ContextManager`、`ContextSerializer`
      - `il-converter.ts` — `IntermediateLanguageConverter`、`IntermediateLanguageParser`、`IntermediateLanguagePrinter`
      - `terminal-adapter.ts` — `TerminalAdapter`、`MessageInterfaceBuilder`、`TerminalCapabilities`
      - `session-manager.ts` — `SessionManager`
      - `version-manager.ts` — `VersionManager`
      - `cross-terminal.ts` — `CrossTerminalCoordinator`、`TerminalInfo`、`CollaborationScenario`
      - `visibility-controller.ts` — `VisibilityController`、`AuthResult`
      - `error-handler.ts` — `ErrorHandler`
      - `extension-registry.ts` — `ExtensionRegistry`、`AnnotationTypeDefinition`
    - _需求: 全局_

- [ ] 2. 实现错误处理器
  - [ ] 2.1 实现 ErrorHandler
    - 在 `src/utils/error-handler.ts` 中实现 `ErrorHandler` 接口
    - 实现 `createError` 方法：根据 error_type、error_code、message、location 和自动生成的 timestamp 创建 ErrorObject
    - 实现 `collectErrors` 方法：收集多个 ErrorObject 并以有序数组返回
    - 实现错误码范围验证（parse_error: 1000-1999, validation_error: 2000-2999 等）
    - _需求: 6.1, 6.2, 6.7, 6.8, 6.9_

  - [ ]* 2.2 编写 ErrorHandler 属性测试
    - **Property 17: 错误对象结构完整性**
    - **验证需求: 6.1, 6.2**

  - [ ]* 2.3 编写 ErrorHandler 属性测试
    - **Property 21: 错误码类型内唯一性**
    - **验证需求: 6.8**

  - [ ]* 2.4 编写 ErrorHandler 属性测试
    - **Property 22: 多错误收集与有序返回**
    - **验证需求: 6.9**

- [ ] 3. 实现注解标记系统
  - [ ] 3.1 实现 AnnotationParser
    - 在 `src/parsers/annotation-parser.ts` 中实现注解解析器
    - 支持 Markdown 风格标记语法解析：`**...**`(emphasis)、`!!...!!`(priority)、`@name`(person_ref)、`[date]`(datetime)、`{action:...}`(action_trigger)、`~visibility:...~`(visibility)
    - 解析失败时返回包含位置信息的 ErrorObject
    - 遇到未知注解类型时保留原始内容并记录警告
    - _需求: 1.1, 1.2, 1.3, 1.4, 6.3_

  - [ ] 3.2 实现 AnnotationPrettyPrinter
    - 在 `src/parsers/annotation-pretty-printer.ts` 中实现注解格式化器
    - 将结构化 AnnotatedText 转换回带标记的文本字符串
    - _需求: 1.5_

  - [ ]* 3.3 编写注解解析属性测试
    - **Property 1: 注解解析-打印往返一致性**
    - **验证需求: 1.2, 1.5, 1.6**

  - [ ]* 3.4 编写注解解析属性测试
    - **Property 2: 畸形注解标记产生带位置的错误**
    - **验证需求: 1.4**

  - [ ]* 3.5 编写注解解析属性测试
    - **Property 18: 未知注解类型保留原始内容**
    - **验证需求: 6.3**

- [ ] 4. 检查点 — 确保所有测试通过
  - 确保所有测试通过，如有疑问请询问用户。

- [ ] 5. 实现语境信息管理
  - [ ] 5.1 实现 ContextManager
    - 在 `src/managers/context-manager.ts` 中实现语境管理器
    - 实现 `validate` 方法：验证必填字段（timestamp、participants），缺失时返回指明字段名和期望格式的错误
    - 实现 `applyDefaults` 方法：为可选字段填充默认值
    - 实现 `merge` 方法：合并语境信息，冲突字段以新值优先
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 5.2 实现 ContextSerializer
    - 在 `src/managers/context-serializer.ts` 中实现语境序列化器
    - 实现 `serialize` 方法：将 ContextInformation 编码为 JSON 字符串
    - 实现 `deserialize` 方法：从 JSON 字符串解析为 ContextInformation，无效时返回错误
    - _需求: 2.6, 2.7_

  - [ ]* 5.3 编写语境管理属性测试
    - **Property 3: 语境验证与默认值填充**
    - **验证需求: 2.2, 2.3**

  - [ ]* 5.4 编写语境管理属性测试
    - **Property 4: 语境合并保留最新值**
    - **验证需求: 2.5**

  - [ ]* 5.5 编写语境序列化属性测试
    - **Property 5: 语境序列化往返一致性**
    - **验证需求: 2.7**

- [ ] 6. 实现中间语言转换
  - [ ] 6.1 实现 IntermediateLanguageConverter
    - 在 `src/parsers/il-converter.ts` 中实现中间语言转换器
    - 实现 `convert` 方法：将 AnnotatedText + ContextInformation 转换为 ICPDocument
    - 确保输出包含 message_body、annotations、context、metadata、rendering_hints 各节
    - 保留源文本中的所有注解和语境字段
    - _需求: 3.1, 3.2, 3.3_

  - [ ] 6.2 实现 IntermediateLanguageParser 和 IntermediateLanguagePrinter
    - 在 `src/parsers/il-parser.ts` 中实现 JSON 解析器
    - 在 `src/parsers/il-printer.ts` 中实现 JSON 序列化器
    - 无效 JSON 时返回描述性 ErrorObject
    - _需求: 3.4, 3.5, 3.6_

  - [ ]* 6.3 编写中间语言属性测试
    - **Property 6: 中间语言转换保留语义信息**
    - **验证需求: 3.2, 3.3**

  - [ ]* 6.4 编写中间语言属性测试
    - **Property 7: 中间语言打印-解析往返一致性**
    - **验证需求: 3.7**

  - [ ]* 6.5 编写中间语言属性测试
    - **Property 8: 无效 JSON 产生描述性错误**
    - **验证需求: 3.5**

- [ ] 7. 实现输入安全验证
  - [ ] 7.1 实现输入验证工具
    - 在 `src/utils/input-validator.ts` 中实现输入数据安全验证
    - 在所有解析器和管理器的入口处调用验证，拒绝或清理包含注入攻击模式的内容
    - _需求: 6.6_

  - [ ]* 7.2 编写输入验证属性测试
    - **Property 20: 输入数据安全验证**
    - **验证需求: 6.6**

- [ ] 8. 检查点 — 确保所有测试通过
  - 确保所有测试通过，如有疑问请询问用户。

- [ ] 9. 实现会话管理器
  - [ ] 9.1 实现 SessionManager
    - 在 `src/managers/session-manager.ts` 中实现会话管理器
    - 实现 `create` 方法：创建新会话，分配唯一 ID，支持 session/document/request 三种作用域
    - 实现 `resume` 方法：恢复会话前验证完整性（integrity_hash），失败时返回错误
    - 实现 `update` 方法：更新会话语境和 last_active_at
    - 实现 `deactivate` 方法：将超时会话转为 inactive 状态并持久化
    - 实现 `validateIntegrity` 方法：校验会话完整性哈希
    - _需求: 5.5, 5.6, 5.7, 5.8, 5.9, 5.10_

  - [ ]* 9.2 编写会话管理属性测试
    - **Property 13: 会话标识符唯一性**
    - **验证需求: 5.7**

  - [ ]* 9.3 编写会话管理属性测试
    - **Property 14: 会话停用-恢复往返一致性**
    - **验证需求: 5.5, 5.6**

  - [ ]* 9.4 编写会话管理属性测试
    - **Property 15: 会话空闲超时状态转换**
    - **验证需求: 5.9**

  - [ ]* 9.5 编写会话管理属性测试
    - **Property 16: 非活跃会话恢复前完整性验证**
    - **验证需求: 5.10**

- [ ] 10. 实现版本管理器
  - [ ] 10.1 实现 VersionManager
    - 在 `src/managers/version-manager.ts` 中实现版本管理器
    - 实现 `register` 方法：注册版本与 schema 定义的映射
    - 实现 `parseVersion` 方法：解析语义版本字符串（major.minor.patch）
    - 实现 `findClosestVersion` 方法：查找最接近的已知版本
    - 实现 `checkCompatibility` 方法：major 不同返回 incompatible，仅 minor 不同返回 backward_compatible
    - _需求: 7.5, 7.6, 7.7, 7.8, 7.9, 7.10_

  - [ ]* 10.2 编写版本管理属性测试
    - **Property 24: 版本兼容性处理**
    - **验证需求: 7.8, 7.9**

  - [ ]* 10.3 编写版本管理属性测试
    - **Property 25: 未知版本最近匹配**
    - **验证需求: 7.5, 7.6**

- [ ] 11. 实现扩展注册表
  - [ ] 11.1 实现 ExtensionRegistry
    - 在 `src/managers/extension-registry.ts` 中实现扩展注册表
    - 实现 `registerAnnotationType` 方法：验证类型定义 schema 合法性后注册
    - 实现 `registerAdapter` 方法：验证适配器实现了所有必需接口方法后注册
    - 实现 `getAnnotationType` 和 `getAdapter` 查询方法
    - _需求: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 11.2 编写扩展注册属性测试
    - **Property 23: 扩展注册验证**
    - **验证需求: 7.2, 7.4**

- [ ] 12. 检查点 — 确保所有测试通过
  - 确保所有测试通过，如有疑问请询问用户。

- [ ] 13. 实现终端适配器
  - [ ] 13.1 实现 TerminalAdapter
    - 在 `src/adapters/terminal-adapter.ts` 中实现终端适配器
    - 实现 `getCapabilities` 方法：返回终端支持的能力列表
    - 实现 `adapt` 方法：根据 ICP 文档和终端能力选择渲染方案，不支持的特性降级处理
    - 实现 `validateComponentType` 方法：验证组件类型是否在注册表中
    - 实现 `reportUnsupported` 方法：报告不支持的特性列表（不中断渲染）
    - _需求: 4.1, 4.2, 4.6, 4.8, 4.9_

  - [ ] 13.2 实现 MessageInterfaceBuilder
    - 在 `src/adapters/message-interface-builder.ts` 中实现消息界面构建器
    - 实现 `build` 方法：从 ICP 文档动态构建界面组件树
    - 支持 text_block、form_card、action_button、data_table、media_preview 五种组件类型
    - 按 RenderingHint 的 priority_level 排列组件（critical > high > normal > low）
    - _需求: 4.3, 4.4, 4.5_

  - [ ]* 13.3 编写终端适配属性测试
    - **Property 9: 终端适配器选择兼容组件**
    - **验证需求: 4.1, 4.2, 4.6**

  - [ ]* 13.4 编写终端适配属性测试
    - **Property 10: 界面构建尊重信息层次**
    - **验证需求: 4.5**

  - [ ]* 13.5 编写终端适配属性测试
    - **Property 11: 渲染提示组件类型验证**
    - **验证需求: 4.8, 4.9**

- [ ] 14. 实现多模态通道路由
  - [ ] 14.1 实现模态通道路由逻辑
    - 在 `src/adapters/modality-router.ts` 中实现模态通道路由器
    - 根据消息的 ModalityChannel 选择兼容的渲染组件
    - 终端不支持指定通道时降级到 text 通道
    - 处理 multi 通道消息：根据每个注解的 channel_hint 分别路由
    - _需求: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 14.2 编写模态通道属性测试
    - **Property 26: 模态通道兼容性与降级**
    - **验证需求: 8.3, 8.4**

  - [ ]* 14.3 编写模态通道属性测试
    - **Property 27: 多通道消息逐注解渲染**
    - **验证需求: 8.5, 8.6**

- [ ] 15. 实现可见性控制器
  - [ ] 15.1 实现 VisibilityController
    - 在 `src/managers/visibility-controller.ts` 中实现可见性控制器
    - 实现 `filter` 方法：根据请求者身份过滤文档内容
      - private: 仅经过认证的本人可访问
      - shared: 同一会话内所有参与者可访问
      - public: 跨会话可访问
    - 实现 `checkAccess` 方法：验证请求者是否有权访问指定可见性级别的内容
    - 实现 `authenticate` 方法：验证请求者身份
    - 处理混合可见性内容：过滤后仅返回请求者有权访问的部分
    - _需求: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [ ]* 15.2 编写可见性控制属性测试
    - **Property 31: 可见性级别访问控制**
    - **验证需求: 10.2, 10.3, 10.4**

  - [ ]* 15.3 编写可见性控制属性测试
    - **Property 32: 混合可见性内容过滤**
    - **验证需求: 10.6, 10.8**

- [ ] 16. 检查点 — 确保所有测试通过
  - 确保所有测试通过，如有疑问请询问用户。

- [ ] 17. 实现双向通信协议
  - [ ] 17.1 实现 Human_to_Machine 消息处理流程
    - 在 `src/protocol/h2m-processor.ts` 中实现人→机器消息处理
    - 串联 AnnotationParser → ContextManager → IntermediateLanguageConverter 流程
    - 处理后提取 meaning、annotations、context 三个组成部分
    - _需求: 5.1, 5.3_

  - [ ] 17.2 实现 Machine_to_Human 消息处理流程
    - 在 `src/protocol/m2h-processor.ts` 中实现机器→人消息处理
    - 串联 IntermediateLanguageConverter → VisibilityController → TerminalAdapter 流程
    - 输出包含 rendering_hints 字段
    - _需求: 5.2, 5.4_

  - [ ]* 17.3 编写双向通信属性测试
    - **Property 12: 双向消息处理完整性**
    - **验证需求: 5.3, 5.4**

- [ ] 18. 实现网络重试机制
  - [ ] 18.1 实现带指数退避的重试逻辑
    - 在 `src/utils/retry.ts` 中实现 `withRetry` 函数
    - 网络通信失败时以指数退避策略重试最多 3 次
    - 全部重试耗尽后返回 timeout_error 类型的 ErrorObject，包含最后已知状态
    - _需求: 6.4, 6.5_

  - [ ]* 18.2 编写网络重试属性测试
    - **Property 19: 网络重试与指数退避**
    - **验证需求: 6.4, 6.5**

- [ ] 19. 实现跨终端协调器
  - [ ] 19.1 实现 CrossTerminalCoordinator
    - 在 `src/adapters/cross-terminal-coordinator.ts` 中实现跨终端协调器
    - 实现 `getTerminals` 方法：获取会话中所有参与终端
    - 实现 `syncContext` 方法：将当前会话语境同步到新加入的终端
    - 实现 `distribute` 方法：根据终端能力分发渲染任务，每个终端仅接收匹配其能力的 RenderingHint 子集
    - 实现 `handleDisconnect` 方法：终端断开时将其渲染任务重新分配给剩余终端
    - 支持 ar_overlay、vr_immersion、screen_projection、multi_device_split 四种协作场景
    - _需求: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [ ]* 19.2 编写跨终端协调属性测试
    - **Property 28: 跨终端语境同步**
    - **验证需求: 9.1, 9.2**

  - [ ]* 19.3 编写跨终端协调属性测试
    - **Property 29: 跨终端渲染任务按能力分发**
    - **验证需求: 9.4, 9.6**

  - [ ]* 19.4 编写跨终端协调属性测试
    - **Property 30: 终端断开后任务重新分配**
    - **验证需求: 9.8**

- [ ] 20. 检查点 — 确保所有测试通过
  - 确保所有测试通过，如有疑问请询问用户。

- [ ] 21. 集成与端到端串联
  - [ ] 21.1 实现协议主入口
    - 在 `src/protocol/icp-protocol.ts` 中创建协议主入口类
    - 串联所有组件：输入层 → 处理层 → 适配层 → 输出层
    - 集成 SessionManager 管理会话生命周期
    - 集成 VersionManager 处理版本协商
    - 集成 ExtensionRegistry 支持自定义扩展
    - _需求: 全局_

  - [ ] 21.2 扩展 JSON Schema
    - 在 `schema/draft/` 中更新 schema.json，新增以下定义：
      - `RenderingHint` 对象定义
      - `ErrorObject` 对象定义
      - `Session` 对象定义
      - `SemanticVersion` 对象定义
      - `ModalityMetadata` 对象定义
      - 扩展 `AnnotationType` 枚举（新增 emphasis、priority、datetime、person_ref、action_trigger、visibility_marker）
      - 扩展 `ModalityChannel` 枚举（text、audio、vision、tactile、multi）
      - 新增 `schema_ref` 字段到文档根对象
    - _需求: 3.2, 4.7, 6.1, 7.10, 8.1_

  - [ ]* 21.3 编写端到端集成测试
    - 测试完整的 Human_to_Machine → Machine_to_Human 消息往返流程
    - 测试跨终端会话场景
    - 测试混合可见性内容过滤的端到端流程
    - _需求: 5.1, 5.2, 9.1, 10.8_

- [ ] 22. 最终检查点 — 确保所有测试通过
  - 确保所有测试通过，如有疑问请询问用户。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 交付
- 每个任务均引用了具体的需求编号，确保可追溯性
- 检查点任务用于阶段性验证，确保增量开发的正确性
- 属性测试验证设计文档中定义的 32 个正确性属性
- 单元测试验证具体示例和边界情况
