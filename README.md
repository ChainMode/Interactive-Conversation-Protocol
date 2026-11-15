# Interactive Conversation Protocol (ICP)

**Interactive Conversation Protocol（交互式对话协议，ICP）** 是 iFay 协议族中面向**人类原型（Human Prime）↔ Fay（iFay + coFay）**交互层的开放语境注解规范，定义如何为文本、图片、视频与音频等多模态内容附加机器可读的结构化语义、语境、意图与交互反应。

## 规范冻结基线（`icp-ctx-file/1.0`，Edition `2025-10-25`）

- **协议线版本（Wire Version）**：两段式 `icp-ctx-file/1.0`（兼容简写 `"1.0"` 及同主版本 `"1.x"`；主版本 `!= 1` 返回 `E_ICP_VERSION_INCOMPATIBLE`）。
- **三种打包模式与规范别名**：
  - `inline` / `embedded`：将确定性内联标记嵌入 `text/*` 内容，支持 `parseInline` ↔ `PrettyPrinter` 抽象语法树（AST）无损往返；
  - `sidecar` / `detached`：外部媒体旁注文件，强制携带 `sha256:<64-hex>`（兼容历史 32 位十六进制摘要）完整性校验值且禁止内嵌 `source.content`；
  - `bundled` / `standalone`：原始内容与结构化注解自包含封装，支持跨三种模式的无损互转。
- **核心数据模型冻结**：
  - 必填顶层槽位 `meta`（锁定 `version`、`id`、`created`）、`source`（锁定 `mode`、`type`）、`annotations`；
  - 可选互补协议桥接槽位 `skills_bridge`（`mcp` / `google-a2a` / `openapi` / `ssp`）与语义概念槽位 `concepts`（JSON-LD `uri`）；
  - 6 类锚点作用域（`global`、`coordinate`、`marker`、`feature`、`pattern`、`annotation`），强制锚点-媒体类型兼容性矩阵与有向引用无环检测（`E_ICP_ANCHOR_CYCLE`）；
  - 冻结 4 个内置 `signs`（`highlight`、`warning`、`question`、`secret`）与 9 个内置 `whatis`（`person`、`organization`、`event`、`time`、`place`、`term`、`object`、`skill`、`emotion`），支持 `vendor:name` 命名空间扩展与无损透传。

## 反应安全门禁与终端降级

- **`secret` 默认遮罩与零泄漏审计**：携带 `secret` 标记的片段在展示与终端降级时默认遮罩为 `••••••••`，安全审计序列化器确保敏感明文零落盘。
- **默认拒绝（Default-Deny）反应门禁**：
  - 纯 UI 渲染反应（`render`）无外部副作用，未知或宿主（Host）不支持的组件强制降级至通用组件 `text_block`；
  - 所有带外部副作用或跨宿主派发的反应（`url`、`function`、`app`、`command` 及含 `target_device` 的反应）执行前 **MUST** 取得人类原型（Human Prime）显式同意（预设白名单绝不豁免同意义务）；
  - 来源真实性不可验证的 `.ctx` 默认拒绝（仅允许单次显式覆盖，禁止持久化免审）；
  - 涉及宿主系统能力调用或跨宿主设备动作的反应（`function`、`app`、`command`、`target_device`）统一生成 **CAP 1.0（`cap/1.0`）** 委托授权信封。

## 仓库目录结构

- `docs/{lang}/blueprint/`：9 语种协议蓝图（设计动机、定位、设计原则、协议边界与路线图）
- `docs/zh-CN/specification/2025-10-25/index.md`：`icp-ctx-file/1.0`（Edition `2025-10-25`）正式版规范正文
- `schemas/icp-1.0.json` 与 `schema/2025-10-25/`：权威 JSON Schema（Draft 2020-12，`icp://schemas/ctx-file/1.0`）、TypeScript 类型定义与参考文档
- `vectors/icp-1.0-conformance.json`：20 组正负向互操作一致性测试向量（覆盖模式校验、摘要漂移、引用环检测、`secret` 遮罩、反应门禁与 CAP 1.0 委托、内联往返及终端降级）
- `src/`：零外部依赖 Node.js ESM 参考实现（`validator`、`modes`、`inline`、`security`、`degrade`）
- `tests/`：单元、属性往返与一致性向量自动化测试套件

## 快速验证

```bash
npm test
```

## 许可证

Apache License 2.0，详见 [LICENSE](./LICENSE)。
