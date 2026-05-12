## 🧭 4. Principes de conception du protocole

Chaque protocole réussi possède un ensemble de convictions fondamentales guidant ses décisions techniques — le « sans état » de HTTP permet au Web de s'étendre à l'infini, la « lisibilité d'abord » de Markdown rend le texte source lisible même sans rendu. ICP suit également 6 principes de conception fondamentaux qui définissent collectivement la philosophie technique du protocole.

### Principe 1 : Enrichissement par annotation, pas remplacement

ICP ne remplace pas le langage naturel, mais superpose des annotations structurées par-dessus. Après suppression de toutes les annotations, le texte original reste entièrement lisible.

### Principe 2 : Agnosticisme terminal

Le protocole lui-même ne présuppose aucune capacité de terminal spécifique. ICP décrit uniquement « quoi » (contenu sémantique), pas « comment afficher » (méthode de rendu).

### Principe 3 : Contexte explicite

Toutes les informations contextuelles affectant la compréhension doivent être explicitement attachées aux messages. Le protocole ne s'appuie pas sur la capacité de l'IA à « lire entre les lignes ».

### Principe 4 : Enrichissement progressif

Le document ICP le plus simple est un message en texte brut. Les annotations, le contexte et les indices de rendu sont des couches d'enrichissement optionnelles.

### Principe 5 : Compatibilité ascendante

Les nouvelles versions du protocole doivent pouvoir traiter les documents des anciennes versions. Les types d'annotations inconnus doivent être ignorés en toute sécurité plutôt que de provoquer des erreurs.

### Principe 6 : Interopérabilité ouverte

ICP n'est lié à aucun modèle d'IA, plateforme ou fournisseur spécifique. Via le mécanisme skills, ICP se connecte aux protocoles existants comme MCP (Model Context Protocol), A2A (Agent-to-Agent) et OpenAPI.
