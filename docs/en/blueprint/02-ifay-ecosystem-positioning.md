## 2. Positioning within the iFay Ecosystem

ICP was born within the iFay ecosystem, but its value extends beyond iFay. This chapter clarifies ICP's architectural position within the iFay ecosystem, as well as its universal value as an independent protocol standard.

### iFay's Layered Architecture and ICP's Position

The iFay Framework adopts a five-layer architecture:

- **Context Layer** (top layer): Responsible for assembling Modular Multimodal Messages, Prompt translation, Local Device API, Data Transfer API, and Remote API integration
- **Protocol Layer**: Defines the set of protocols for iFay's interaction with the external world
- **iFay Core Layer**: Contains four capability modules — Credentials, Sense, Action, and Thought — driven by the Ego Model at its foundation
- **Virtual Runtime Environment Layer**: iFay's runtime environment, supporting multiple carriers including computers, embodied robots, containers, terminal devices, servers/cloud, and in-app seats, managed by the FayGer runtime
- **Global Merit Chain** (vertical layer): A reputation and value system spanning the entire framework

ICP (Interactive Conversation Protocol) resides in the Protocol Layer, as one member of iFay's protocol suite, alongside five other protocols:

| Protocol | Responsibility |
|----------|---------------|
| Faying Protocol | Social and identity protocol between iFay instances |
| **Interactive Conversation Protocol (ICP)** | **Semantic description protocol for human-machine interactive conversations** |
| Telepathy Protocol | Intent and mental state transmission protocol |
| Control Authority Protocol | Permission control and authorization protocol |
| Data Tunnel Protocol | Data channel and transmission protocol |
| Skill Sharing Protocol | Skill sharing and invocation protocol |

ICP focuses specifically on "interactive conversation" scenarios in human-machine interaction — when iFay needs to engage in structured conversational interaction with users, ICP is responsible for dynamically assembling semantic content into user-friendly interactive interfaces based on the current terminal's objective context. ICP's upstream consumer is the Context Layer's Modular Multimodal Messages, which consumes the structured semantics produced by ICP and assembles them into the final modular multimodal messages presented to users.

> For example, iFay needs to remind the user "there's a project review meeting tomorrow at 3 PM." The Thought module in iFay's core layer decides a reminder is needed, and the Action module encodes this information as structured semantics through ICP — including time annotations, participant references, and calendar action buttons. After the Context Layer receives the ICP document, it assembles it into multimodal messages based on the current terminal's capabilities: on a phone, it appears as a card with an "Add to Calendar" button; on a smart speaker, it's read aloud and awaits voice confirmation; on AR glasses, it appears as a floating notification in the user's field of view.

### Definition of iFay

iFay is a Personal AI Agent attached to a natural person. Each iFay is bound one-to-one with a natural person, deeply understanding the user's preferences, habits, social relationships, and life context. iFay's core responsibility is to process information, manage interactions, and coordinate communication with the external world on behalf of the individual.

You can think of iFay as a digital assistant that truly knows you — it not only remembers what you've said, but understands your expression habits, decision preferences, and current situation.

### Definition of coFay

coFay is a Public Role AI Agent that performs social public functions. Unlike iFay's personal nature, coFay plays defined public roles such as police officer, doctor, teacher, civil servant, customer service representative, etc.

The core difference between iFay and coFay lies in their service targets and responsibility boundaries:

- iFay serves a specific individual, understands that individual's full context, and represents personal interests
- coFay serves public functions, follows role specifications and professional guidelines, and represents public interests

Within the iFay ecosystem, communication between iFay and coFay can occur through multiple protocols. When interactive conversation scenarios are involved, ICP handles the semantic description; identity verification goes through the Faying Protocol, permission control through the Control Authority Protocol, and data transmission through the Data Tunnel Protocol — each protocol serves its own purpose.

### ICP's Independent Value

Although ICP was born within the iFay ecosystem, it is designed as an independent semantic description protocol that can be used without iFay.

Any system that needs to structurally describe human-machine interaction semantics can adopt ICP: chat applications, voice assistants, AR/VR platforms, enterprise collaboration tools, IoT device control panels — wherever there's a scenario of "structured information with context that needs to be conveyed between humans and machines," ICP has a role to play.

ICP therefore has a dual identity:

- Within the iFay ecosystem, it is the semantic description protocol for interactive conversations in the Protocol Layer
- Outside the iFay ecosystem, it is a universal semantic description protocol with context, applicable to any human-machine interaction scenario

> For example, an independent intelligent customer service system (not using iFay) can equally adopt ICP to describe structured information in customer service conversations: marking user questions with different semantic types (complaints, inquiries, suggestions), attaching user session history and device information as context, then dynamically assembling response interfaces based on the customer service terminal's capabilities.

