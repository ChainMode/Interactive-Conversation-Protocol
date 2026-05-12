## 📐 5. Définition des limites du protocole

Définir clairement ce qu'un protocole « fait » et « ne fait pas » est aussi important que définir ce qu'il « est ». Ce chapitre délimite le périmètre de responsabilité d'ICP et sa relation complémentaire avec l'écosystème de protocoles existant.

### Ce que fait ICP

- **Définit le format de description sémantique pour l'interaction homme-machine** — fournit des formats d'annotation contextuelle structurée (.ctx) pour tout contenu média
- **Fournit un système de marquage par annotations** — superpose une sémantique structurée sur le contenu original sans le modifier
- **Gère les informations contextuelles** — attache explicitement le contexte environnemental affectant la compréhension
- **Fournit une conversion en langage intermédiaire cross-terminal** — transforme la sémantique en structures JSON standard
- **Définit un système de réaction** — guide les terminaux sur les réactions à adopter lors de l'affichage du contenu annoté

### Ce que ICP ne fait pas

- **Non responsable de l'inférence et de la prise de décision du modèle IA**
- **Non responsable de l'implémentation concrète des frameworks UI terminaux**
- **Non responsable des protocoles de transport réseau**
- **Non responsable de l'implémentation concrète de l'authentification utilisateur**
- **Non responsable du stockage persistant des données**

### Positionnement complémentaire

| Protocole | Responsabilité | Relation avec ICP | Mécanisme d'intégration |
|-----------|---------------|-------------------|------------------------|
| MCP | IA ↔ Outils | ICP décrit la sémantique homme-machine, MCP exécute les appels d'outils | `skills.protocol: "mcp"` |
| A2A | IA ↔ IA | ICP décrit la sémantique homme-machine, A2A coordonne la collaboration entre agents | `skills.protocol: "google-a2a"` |
| OpenAPI | Client ↔ Service | ICP décrit la sémantique homme-machine, OpenAPI définit les interfaces de service | `skills.protocol: "openapi"` |
| JSON-LD | Données ↔ Web sémantique | ICP décrit la sémantique d'interaction, JSON-LD lie les connaissances du domaine | `concepts.uri` référence |
