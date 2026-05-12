## 🧭 4. Protokoll-Designprinzipien

Jedes erfolgreiche Protokoll hat eine Reihe von Kernüberzeugungen, die seine technischen Entscheidungen leiten — HTTPs „Zustandslosigkeit" ermöglicht dem Web unendliche Skalierung, Markdowns „Lesbarkeit zuerst" macht Quelltext auch ohne Rendering lesbar. ICP folgt ebenfalls 6 Kern-Designprinzipien, die gemeinsam die technische Philosophie des Protokolls definieren.

### Prinzip 1: Annotationsbasierte Erweiterung, kein Ersatz

ICP ersetzt keine natürliche Sprache, sondern überlagert strukturierte Annotationen darüber. Nach Entfernung aller Annotationen bleibt der Originaltext vollständig lesbar.

### Prinzip 2: Endgeräte-Agnostizismus

Das Protokoll selbst setzt keine spezifischen Endgerätefähigkeiten voraus. ICP beschreibt nur „was" (semantischer Inhalt), nicht „wie anzeigen" (Rendering-Methode).

### Prinzip 3: Expliziter Kontext

Alle kontextuellen Informationen, die das Verständnis beeinflussen, sollten explizit an Nachrichten angehängt werden. Das Protokoll verlässt sich nicht auf die Fähigkeit der KI, „zwischen den Zeilen zu lesen".

### Prinzip 4: Progressive Erweiterung

Das einfachste ICP-Dokument ist eine reine Textnachricht. Annotationen, Kontext und Rendering-Hinweise sind optionale Erweiterungsschichten. Implementierer können mit der einfachsten Unterstützung beginnen und schrittweise Fähigkeiten hinzufügen.

### Prinzip 5: Abwärtskompatibilität

Neue Versionen des Protokolls müssen Dokumente älterer Versionen verarbeiten können. Unbekannte Annotationstypen sollten sicher ignoriert werden, anstatt Fehler zu verursachen.

### Prinzip 6: Offene Interoperabilität

ICP ist nicht an ein bestimmtes KI-Modell, eine Plattform oder einen Anbieter gebunden. Über den Skills-Mechanismus verbindet sich ICP mit bestehenden Protokollen wie MCP (Model Context Protocol), A2A (Agent-to-Agent) und OpenAPI.
