## 📐 5. Definición de Límites del Protocolo

Definir claramente lo que un protocolo "hace" y "no hace" es tan importante como definir lo que "es". Este capítulo delimita el alcance de responsabilidad de ICP y su relación complementaria con el ecosistema de protocolos existente.

### Lo que ICP hace

- **Define el formato de descripción semántica para la interacción humano-máquina** — proporciona formatos de anotación contextual estructurada (.ctx) para cualquier contenido multimedia
- **Proporciona un sistema de marcado por anotaciones** — superpone semántica estructurada sobre el contenido original sin modificarlo
- **Gestiona información contextual** — adjunta explícitamente el contexto ambiental que afecta la comprensión
- **Proporciona conversión de lenguaje intermedio cross-terminal** — transforma la semántica en estructuras JSON estándar
- **Define un sistema de reacción** — guía a los terminales sobre qué reacciones tomar al mostrar contenido anotado

### Lo que ICP no hace

- **No es responsable de la inferencia y toma de decisiones del modelo de IA**
- **No es responsable de la implementación concreta de frameworks UI de terminal**
- **No es responsable de protocolos de transporte de red**
- **No es responsable de la implementación concreta de autenticación de usuario**
- **No es responsable del almacenamiento persistente de datos**

### Posicionamiento complementario

| Protocolo | Responsabilidad | Relación con ICP | Mecanismo de integración |
|-----------|----------------|-----------------|-------------------------|
| MCP | IA ↔ Herramientas | ICP describe semántica humano-máquina, MCP ejecuta llamadas a herramientas | `skills.protocol: "mcp"` |
| A2A | IA ↔ IA | ICP describe semántica humano-máquina, A2A coordina colaboración entre agentes | `skills.protocol: "google-a2a"` |
| OpenAPI | Cliente ↔ Servicio | ICP describe semántica humano-máquina, OpenAPI define interfaces de servicio | `skills.protocol: "openapi"` |
| JSON-LD | Datos ↔ Web semántica | ICP describe semántica de interacción, JSON-LD enlaza conocimiento de dominio | `concepts.uri` referencia |
