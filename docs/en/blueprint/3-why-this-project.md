## 3. Why This Project Was Created

### ❓ Problems to Solve

We must face reality: for a considerable period, how to interact with users is determined by end-side developers (or companies). Under most existing business models, user participation in interaction is the foundation of product value and profitability, such as active user numbers and advertising revenue. No one can force end-sides to open sufficient permissions, allowing AI to execute operations completely without human intervention.

If AI is smart enough, humans indeed don't need to start from the homepage every time. Therefore, we can see that human-machine dialogue becoming the next generation's main interaction interface has almost become a consensus.

However, the natural defects of natural language expressiveness, originally hoped to be compensated by well-designed interactions, are now replaced by dialog boxes. The limitations of dialog boxes are immediately exposed:

#### (1) Loss of Cursor's Indicative Function

Interaction forms are shifting from "screen + focus operation" mode to natural language mode. Traditional focus operations are achieved through keyboards, mice, and touchscreens, providing precise indication. Natural language interaction brings the following impacts:

- **Loss of Indicative Precision**: The difficulty of expression and understanding increases, and ambiguity grows, which we call the "cursor loss effect."
  > For example, when a user says "delete this," the system has difficulty determining which specific object "this" refers to, while traditional interfaces can precisely locate through mouse clicks.

- **Limited Information Expression Efficiency**: Pure voice information expression is inefficient, and the advantage of voice input is mainly reflected in word-by-word expression scenarios.
  > For example, when you want to enlarge a thumbnail, you may need to say "enlarge" or type "enlarge," while traditional interaction only requires a single click.

- **High Requirements for Linguistic Expression**: Natural language interaction places high demands on users' linguistic expression abilities, creating difficulties in human-machine interaction.
  > For example, users who are not good at linguistic expression may be unable to accurately describe their needs, leading to system understanding deviations, while traditional interfaces lower the expression threshold through visual elements like buttons and menus.

- **Low Information Reading Efficiency**: Text stream reading and voice reading are less efficient than structured information reading.
  > For example, when the system uses voice to broadcast a long list of data, users need to listen to the entire list to find target information, while traditional interfaces allow users to quickly scan and locate through structured forms like tables and cards.

- **Constrained by Dialogue Turns**: Interactions constrained by dialogue turns are not friendly to rapid continuous operations.
  > For example, when users need to perform multiple operations continuously, they must wait for each dialogue turn to complete before proceeding to the next step, while traditional interfaces can quickly click multiple buttons in succession to complete batch operations.

#### (2) Information Fragmentation Overflow

The streaming information structure of conversations lacks organization, unlike traditional software that organizes information architecture in page units, building visually friendly information presentation hierarchies through visual graphical interfaces. This leads to the following derivative problems:

- **Difficulty Isolating Different Information**: Continuous information flows within a single conversation make it difficult to distinguish boundaries between different topics, and even multiple completely unrelated topics can be mixed together.
  > For example, a user first asks "help me check tomorrow's weather" in a conversation, then asks "how is that project progress," and then asks "recommend some good books." These completely unrelated topics are mixed together, making it difficult to quickly locate and review.

- **Zombie Session Explosion**: When information is artificially isolated through sessions, information within sessions is folded into black boxes with sessions as units, eventually becoming zombie sessions due to low visibility.
  > For example, users create multiple sessions like "work-related," "study notes," "shopping list," but each session only has scattered messages. Over time, these sessions are forgotten and become zombie sessions that cannot be effectively utilized.

- **Unable to Manage Multi-dimensionally**: Similar information scattered across countless sessions cannot be organized because information cannot be managed along a specific dimension.
  > For example, users have asked about "Python tutorial," "JavaScript tutorial," "React tutorial" and other learning resources in different sessions, but cannot view and manage them uniformly along the "learning resources" dimension, and can only search session by session.

- **Lack of Indicatable Objects**: Information dissolves in text information, and when we need to refer to something, there is no specific object to refer to.
  > For example, when a user says "optimize that proposal again," "that proposal" is just a paragraph in the text stream without independent identification and structure, making it difficult for the system to precisely locate and operate.

#### (3) Significant Differences in Human-Machine Interfaces Across Different Terminals

More terminal devices in the future will be driven by Agents, corresponding to human perception through screens, cameras, microphones, speakers, and other devices to complete human-machine interaction. However, different terminals have inherent differences in their physical characteristics, and it's impossible to forcibly use the same interaction mode. This creates difficulties in AI integration:

- **Media Disconnection**: When the information structure fed back by AI is unfriendly to terminals, it will inevitably cause loss or confusion in information expression. Conversely, the information structure provided by terminals is not necessarily AI-friendly.
  > For example, a complex data visualization originally designed for a large-screen dashboard is directly "read out" by voice on a smart speaker, making it almost impossible for users to establish overall cognition; conversely, a single line of prompt information on a smartwatch can hardly fully carry the complex semantics that AI expects to express.

- **AI Lacks Mastery of Terminal Characteristics**: To enhance expressiveness, humans often use multiple software and terminals to demonstrate in complex contexts or when expressing complex logic. AI seems to only know how to "speak."
  > For example, when a product manager presents a proposal, they will show slides, draw structure diagrams on a whiteboard, and click operations on demo pages; while current AI often can only explain with a long text or a string of voice, making it difficult to use terminal capabilities like projection, annotation, and animation to enhance expression.

- **Gap Between Virtual and Reality**: The context currently used by AI is based on preset and memorized knowledge, while the context in real scenarios is often dynamic and related to the real environment.
  > For example, AI can "remember" users' personal profiles and historical conversations, but it's difficult to perceive in real-time that the user is sitting in a conference room, flipping through which page of a paper document, or pointing to which physical display board, thus unable to make natural instructions and supplements based on on-site situations like a real assistant.

### 💡 Improvement Ideas and Goals

Previously, product managers' main work was designing easy-to-learn and easy-to-use interfaces and operation flows. With AI support, users no longer need to learn software interaction interfaces and operation logic. AI has the ability to provide users with only necessary information based on user questions and instructions, and users only need minimal intervention operations.

However, as long as users themselves intervene, there are problems with interaction friendliness, accuracy, and efficiency. Interactive Conversation Protocol plays a role precisely at the point of human-machine contact:

#### Enhancing Natural Language's Expressive Power (Human → AI)

Enhancing expressive power here refers to enhancing natural language. To compensate for the problems mentioned above (loss of cursor indication, information fragmentation overflow, and differences in human-machine interfaces across different terminals). At least the following processing can be done on original natural language:

- **Marking Expressed Information**: Mark information that needs special processing. The special processing mentioned here includes using structured information, assembling interfaces, running auxiliary programs, etc. You can imagine it as making notes by circling points on a piece of text. In terms of marking form, we refer to Markdown, using special characters to represent specific meanings, while the explanation and triggering of auxiliary functions refer to the annotation principle in Java development. Through this method, we can supplement the tone of speech, point out what is important, what needs special presentation forms, and what needs pre-operations (such as authentication visible only to oneself) in the original expository content.
  > For example, when a user says "help me organize this week's to-dos," marking dates, priorities, and responsible persons lightly in the sentence, AI can directly generate a checkable to-do list instead of just returning a descriptive text.

- **Adding Context Information**: Supplement necessary virtual information and real-world environment into the narrative information to reproduce the speaker's real situation. Traditional interaction interfaces often preset optional context information in the interface to capture users' accurate intentions from simple clicks, while natural language requires organizing lengthy text to fully describe context. By supplementing context information such as time, location, device status, and participant identity in the protocol, AI can more accurately understand the real semantics of "here and now."
  > For example, when a user only says "book a restaurant Marry likes nearby," supplement location, budget preferences, and historical orders as context information.

- **Translating into Standard Intermediate Language**: After processing original information (adding annotations and context information), to enable complete and accurate interpretation, an agreed-upon data identification system is necessary. To adapt to the expressiveness of all terminals, this identification system can be built on JSON specifications, providing agreed-upon parameter tables and structures. In this way, AIs at various receiving ends can mobilize all available terminals to show maximum expressiveness and reproduce the complete meaning of the expresser.
  > For example, a sentence "send this passage to the project group and have everyone confirm before the end of work today" is ultimately translated into a standard JSON structure containing message body, recipient list, deadline, and confirmation button configuration. Chat tools, Web backends, or mobile Apps can all render their respective adapted interfaces accordingly.

#### On-Demand Customized Interface (AI → Human)

Our premise is that people will prefer to interact with AI through "speaking," which is the closest way to human communication. Therefore, people will increasingly find it too troublesome to find the functional interfaces they need through clicking. The information and interfaces people need should be directly pushed to users' "eyes." To achieve this effect, receiving ends should have certain interpretation capabilities:

- **Interpreting Intermediate Language**: Since the intermediate language is in JSON format, all receiving ends can read complete semantics, at least avoiding disconnection in information reception.
  > For example, the same intermediate language data of "expense report review request" can be rendered as a large-screen interface with tables and attachment previews on desktop, only display key information and two buttons (approve/reject) on mobile, while smart speakers can read out summaries and wait for voice confirmation.

- **Dynamically Constructing Message Interfaces**: Based on complete context and annotations, choose the most interaction-friendly solution and dynamically assemble an interactive interface with information hierarchy (of course, annotations incompatible with terminals can also be ignored). This interface is not necessarily read-only multimodal information, but can also be an interactive mini-program body.
  > For example, when AI understands "this is an information collection," it can automatically insert a fillable small form card in the chat interface instead of having users answer questions one by one in plain text.

- **Reproducing Context**: Have the ability to indicate or control some elements in the context. This usually requires mobilizing multiple applications or terminal devices.
  > For example, in a remote device maintenance scenario, AI can highlight the position of screws that need to be disassembled in the engineer's AR field of view while simultaneously displaying circuit diagrams and step instructions on a large screen, allowing "context" to be jointly reproduced across multiple terminals.

#### ❗️❗️ Special Note: Is Intermediate Language Really Necessary?

Many people think that intermediate language is not actually needed, generally for two reasons:

(1) In the long run, AGI has the ability to "read between the lines" and understand users' implicit intentions. There is no need to artificially process natural language unnecessarily just to help AI understand better.

(2) Designing human-friendly interaction interfaces is also AGI's duty in the future, and AI may even design a runnable interaction interface specifically for each interaction. Therefore, it's even more unnecessary to translate AI's words into some intermediate language.

We still ultimately designed the ICP protocol in the iFay system. We have the following 3 concerns and believe they are difficult to solve in the short term, so we chose to design an annotation-style intermediate language:

(1) AI's Control Over the Environment Isn't That Great

Generally, people compare human-AI interaction to communication between a person and an assistant. They think a smart assistant will actively adjust environmental conditions to achieve good communication effects, such as turning on lights when there's insufficient light; making marks on important parts of documents. But assistants' permissions and abilities don't always allow them to do everything, such as when a building suddenly loses power and can't play presentation slides.

Therefore, a more prudent approach is to prepare all necessary materials, and adapt the presentation (or leave it to the property manager). This is like bringing all materials to meet a client. Whether the client has a conference room, whether presentation slides can be played, or whether paper reports need to be viewed is decided by the other party.

(2) AI and Humans May Not Be That Close

Because AI's control over the environment is limited, AI actually doesn't really understand human meaning in many cases. It's like pointing to a set of data on a slide and asking AI: "What does this data mean?" Actually, AI doesn't know where you're pointing. Ideally, motion capture equipment would be needed to tell AI this information.

Therefore, in many cases, the information explicitly provided by humans is not sufficient for judgment. At this time, context information needs to be supplemented, but this is not the authority of a specific AI.

(3) There May Not Be a Universal AGI at All

Future AI will definitely encounter the same division of labor problems as human society. There will be individual AIs (similar to iFay) and AIs with social public functions (similar to coFay). There will inevitably be permission boundaries between them.

So we choose a prudent approach. We assume that AI only processes known information. It's just that this information goes through a processing flow each time, and this processing action may be completed by some software, terminal device, or AI.

### 🌟 Vision

ICP (Interactive Conversation Protocol) aims to build an intermediate language form across humans and machines, achieving efficient, accurate, and rich bidirectional communication between humans and machines:

#### Human → Machine: Comprehensive Replication of Expressed Meaning and Context

- Capture the meaning and context expressed by humans as comprehensively as possible
- Transform natural language and interaction intentions into structured elements that machines can accurately understand
- Preserve interaction precision and contextual information

#### Machine → Human: Dynamic Assembly of Interactive Methods

- Integrate concept annotations with current context
- Dynamically assemble the most suitable interaction methods based on device capabilities and user preferences
- Support multi-perceptual information presentation (text, voice, vision, touch, smell, etc.)

