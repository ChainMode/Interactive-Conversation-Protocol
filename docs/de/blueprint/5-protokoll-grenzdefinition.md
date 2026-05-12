## 📐 5. Protokoll-Grenzdefinition

Klar zu definieren, was ein Protokoll „tut" und „nicht tut", ist ebenso wichtig wie zu definieren, „was es ist". Dieses Kapitel grenzt ICPs Verantwortungsbereich ab und seine komplementäre Beziehung zum bestehenden Protokoll-Ökosystem.

### Was ICP tut

- **Definiert das semantische Beschreibungsformat für Mensch-Maschine-Interaktion** — bietet strukturierte Kontext-Annotationsformate (.ctx-Dateien) für beliebige Medieninhalte
- **Bietet ein Annotations-Markierungssystem** — überlagert strukturierte Semantik auf Originalinhalte, ohne diese zu verändern
- **Verwaltet Kontextinformationen** — hängt explizit umgebungsbezogenen Kontext an (Teilnehmer, Erinnerungen, Situation, Subtext, kultureller Hintergrund)
- **Bietet endgeräteübergreifende Zwischensprachen-Konvertierung** — wandelt Semantik in Standard-JSON-Strukturen um
- **Definiert ein Reaktionssystem** — leitet Endgeräte an, welche Reaktionen beim Anzeigen annotierter Inhalte erfolgen sollen

### Was ICP nicht tut

- **Nicht verantwortlich für KI-Modell-Inferenz und Entscheidungsfindung**
- **Nicht verantwortlich für die konkrete Implementierung von Endgeräte-UI-Frameworks**
- **Nicht verantwortlich für Netzwerk-Transportprotokolle**
- **Nicht verantwortlich für die konkrete Implementierung der Benutzerauthentifizierung**
- **Nicht verantwortlich für persistente Datenspeicherung**

### Komplementäre Positionierung

| Protokoll | Verantwortung | Beziehung zu ICP | Integrationsmechanismus |
|-----------|--------------|-----------------|------------------------|
| MCP | KI ↔ Werkzeuge | ICP beschreibt Mensch-Maschine-Semantik, MCP führt Werkzeugaufrufe aus | `skills.protocol: "mcp"` |
| A2A | KI ↔ KI | ICP beschreibt Mensch-Maschine-Semantik, A2A koordiniert Agenten-Zusammenarbeit | `skills.protocol: "google-a2a"` |
| OpenAPI | Client ↔ Service | ICP beschreibt Mensch-Maschine-Semantik, OpenAPI definiert Service-Schnittstellen | `skills.protocol: "openapi"` |
| JSON-LD | Daten ↔ Semantisches Web | ICP beschreibt Interaktionssemantik, JSON-LD verknüpft Domänenwissen | `concepts.uri` Referenz |
