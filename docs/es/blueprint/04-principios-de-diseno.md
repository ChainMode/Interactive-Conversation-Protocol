## 🧭 4. Principios de Diseño del Protocolo

Todo protocolo exitoso tiene un conjunto de creencias fundamentales que guían sus decisiones técnicas — la "ausencia de estado" de HTTP permite que la Web escale infinitamente, la "legibilidad primero" de Markdown hace que el texto fuente sea legible incluso sin renderizar. ICP sigue igualmente 6 principios de diseño fundamentales que definen colectivamente la filosofía técnica del protocolo.

### Principio 1: Enriquecimiento basado en anotaciones, no reemplazo

ICP no reemplaza el lenguaje natural, sino que superpone anotaciones estructuradas sobre él. Al eliminar todas las anotaciones, el texto original permanece completamente legible.

### Principio 2: Agnosticismo de terminal

El protocolo en sí no asume ninguna capacidad de terminal específica. ICP solo describe "qué" (contenido semántico), no "cómo mostrar" (método de renderizado).

### Principio 3: Contexto explícito

Toda la información contextual que afecta la comprensión debe adjuntarse explícitamente a los mensajes. El protocolo no depende de la capacidad de la IA para "leer entre líneas".

### Principio 4: Enriquecimiento progresivo

El documento ICP más simple es un mensaje de texto plano. Las anotaciones, el contexto y las pistas de renderizado son capas de enriquecimiento opcionales.

### Principio 5: Compatibilidad hacia atrás

Las nuevas versiones del protocolo deben poder procesar documentos de versiones anteriores. Los tipos de anotaciones desconocidos deben ignorarse de forma segura en lugar de causar errores.

### Principio 6: Interoperabilidad abierta

ICP no está vinculado a ningún modelo de IA, plataforma o proveedor específico. A través del mecanismo skills, ICP se conecta con protocolos existentes como MCP (Model Context Protocol), A2A (Agent-to-Agent) y OpenAPI.
