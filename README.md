# Interactive Conversation Protocol (ICP)

**Interactive Conversation Protocol（交互式对话协议，ICP）** 是 iFay 协议族中面向**人 ↔ Fay** 交互层的开放语境注解规范，定义如何为文本、图片、视频与音频等多模态内容附加机器可读的结构化语义、语境、意图与交互反应。

## 规范边界与演进分期

- **ICP 1.0 Core（静态语境注解基线，`icp-ctx-file`）**：以 `.ctx` 语境注解文件为核心产物，支持 `inline`（内联）、`sidecar`（旁注）、`bundled`（捆绑）三种打包模式，覆盖 6 类锚点作用域（`global` / `coordinate` / `marker` / `feature` / `pattern` / `annotation`）、内置标记性质（`Signs`）、对象类型（`Whatis`）与反应系统（`Reaction`）。
- **后续演进扩展（实时会话流式注解）**：面向多终端实时对话流的运行时动态注解引擎作为分层扩展演进，不改变 `.ctx` 1.0 核心数据契约。

## 反应系统安全与信任边界

`.ctx` 文件可经任意通道传输，`source.checksum` 仅用于内容完整性漂移检测而不提供来源防篡改保证：
- 纯 UI 渲染反应（`render`）无外部副作用，支持未知组件向 `text_block` 安全降级；
- 所有带外部副作用的反应（`function`、`app`、`command`）在执行前 **MUST** 取得人类原型（Human Prime）显式同意，来源不可验证时 **默认拒绝（Default-Deny）**；
- 跨设备函数派发与涉及硬件/终端状态变更的动作 **MUST** 取得目标设备侧独立同意，并委托 **CAP（Control Authority Protocol）** 执行分级控制权校验与破坏性操作确认。

## 仓库目录结构

- `docs/{lang}/blueprint/`：9 语种协议蓝图（设计动机、定位、设计原则、协议边界与路线图）
- `docs/zh-CN/specification/2025-10-25/index.md`：`icp-ctx-file/2025-10-25` 协议规范正文（含 §10.4–10.5 反应系统同意门禁与威胁模型）
- `schema/2025-10-25/`：权威 JSON Schema（Draft 2020-12）、TypeScript 类型定义与字段参考文档

## 许可证

Apache License 2.0，详见 [LICENSE](./LICENSE)。
