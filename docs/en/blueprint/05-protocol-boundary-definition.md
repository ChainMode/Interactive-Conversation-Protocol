## 📐 5. Protocol Boundary Definition

Clearly defining what a protocol "does" and "doesn't do" is as important as defining what it "is." This chapter delineates ICP's scope of responsibility and its complementary relationship with the existing protocol ecosystem.

### What ICP Does

- Defines the semantic description format for human-machine interaction (Conception Annotation)
- Provides an annotation marking system that overlays structured semantics on natural language
- Manages context information, explicitly attaching environmental context that affects understanding
- Provides cross-terminal intermediate language conversion, transforming semantics into standard JSON structures
- Defines rendering hints and degradation strategies to guide terminals in choosing presentation methods

### What ICP Does Not Do

- Not responsible for AI model reasoning and decision-making — ICP describes semantics, not executes intelligence
- Not responsible for terminal UI framework implementation — ICP provides rendering hints, not draws interfaces
- Not responsible for network transport protocols — ICP defines data formats, not how to transmit (HTTP, WebSocket, etc. are chosen by implementers)
- Not responsible for user authentication implementation — ICP defines visibility levels (private/shared/public), but authentication mechanisms are implemented by the system
- Not responsible for data persistence storage — ICP defines session and context structures, but storage solutions are decided by implementers

### Relationship with Complementary Protocols

ICP is not meant to replace existing protocols, but to complement them at the semantic description layer of human-machine interaction. Here is ICP's relationship positioning with major protocols:

**MCP (Model Context Protocol)**

MCP is the communication protocol between AI models and external tools, defining how models discover and invoke tools. ICP bridges with MCP through the `protocol: "mcp"` binding in the `skills` registry. The division of labor: MCP handles AI-to-tool interaction, ICP handles human-to-AI interaction.

> For example, a user tells iFay through ICP "check tomorrow's weather in Beijing." After iFay parses the semantics and context in the ICP document, it invokes the weather query tool through MCP, then presents the results to the user through ICP in a format suitable for the current terminal.

**A2A (Agent-to-Agent Protocol)**

A2A is the communication protocol between AI agents, defining how agents discover each other, negotiate capabilities, and exchange information. ICP bridges with A2A through the `protocol: "google-a2a"` binding in the `skills` registry. The division of labor: A2A handles inter-agent collaboration, ICP handles agent-to-human communication.

> For example, a user's iFay needs to consult a coFay (medical assistant) for health advice. iFay communicates with the medical coFay through A2A, obtains advice, then presents the results to the user through ICP in a user-friendly format (such as health cards, medication reminder buttons).

**OpenAPI**

OpenAPI defines REST API interface specifications. ICP invokes OpenAPI-defined services through the `protocol: "openapi"` binding in the `skills` registry. The division of labor: OpenAPI defines service interfaces, ICP defines human-machine interaction semantics.

**JSON-LD**

JSON-LD is the linked data format for the semantic web, providing the ability to associate JSON data with semantic networks. ICP's `concepts` field can reference JSON-LD's `@context` and `@id`, enabling interoperability between semantic annotations and linked data models. The division of labor: JSON-LD provides semantic web data linking, ICP provides human-machine interaction semantic description.

### Complementary Positioning Summary

| Protocol | Responsibility | Relationship with ICP | Integration Mechanism |
|----------|---------------|----------------------|----------------------|
| MCP | AI ↔ Tools | ICP describes human-machine semantics, MCP executes tool calls | `skills.protocol: "mcp"` |
| A2A | AI ↔ AI | ICP describes human-machine semantics, A2A coordinates agent collaboration | `skills.protocol: "google-a2a"` |
| OpenAPI | Client ↔ Service | ICP describes human-machine semantics, OpenAPI defines service interfaces | `skills.protocol: "openapi"` |
| JSON-LD | Data ↔ Semantic Web | ICP describes interaction semantics, JSON-LD links domain knowledge | `concepts.uri` reference |

Core position: ICP is the semantic description layer for human-machine interaction, complementary to rather than replacing the above protocols. Each protocol plays its role in its area of expertise, and ICP provides a unified human-facing semantic interface among them.

