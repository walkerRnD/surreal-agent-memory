
https://www.youtube.com/watch?v=EgXOaH-ZqfU
https://www.youtube.com/watch?v=EE4pvOEAjXc
https://github.com/OSU-NLP-Group/HippoRAG
https://github.com/campfirein/cipher
MMOA-RAG: optimization algorithm to improve RAG via Multi-Agent Reinforcement Learning
HiRage: https://www.youtube.com/watch?v=LV0jRVXtx80

https://medium.com/@techsachin/mmoa-rag-optimization-algorithm-to-improve-rag-via-multi-agent-reinforcement-learning-52b83e955f62

https://ajithp.com/2025/02/02/optimizing-rag-multi-agent-reinforcement-learning-mmoa-rag/

https://github.com/chenyiqun/MMOA-RAG

https://www.reddit.com/r/LocalLLaMA/comments/1dz1i9a/mycomind_daemon_advanced_mixtureofmemoryragagents/

https://www.linkedin.com/posts/techsachinkumar_mmoa-rag-optimization-algorithm-to-improve-activity-7290537276982370304-HTxG/



## Eval
https://www.youtube.com/watch?v=X0PwwfcGSHU


Core Components of AI Agent Memory
These are the fundamental building blocks that enable an AI agent to store and retrieve information.
Short-Term Memory: This is the agent's working memory, holding immediate context for the current interaction or task.[3][4] It allows the agent to maintain coherence within a single conversation or session. This is often implemented through a "context window" in large language models.[5]
Long-Term Memory: This component allows the agent to retain information across multiple sessions and interactions.[4][6] It is crucial for personalization, learning from past experiences, and maintaining a persistent understanding of the user and the world. Vector databases are a common technology used for long-term memory.[7]
Memory Module: This is a distinct component within an AI agent's architecture responsible for all memory-related operations, including storing and retrieving past experiences to improve over time.[8]
Types of Memory in AI Agents
Inspired by human cognition, different types of memory serve distinct functions within an AI agent.
Episodic Memory: This type of memory stores specific past events and experiences.[4][9] It allows an agent to recall particular interactions or sequences of events, which is crucial for learning from specific past scenarios.
Semantic Memory: This holds general knowledge and facts about the world.[4][6] It's the agent's repository of conceptual understanding, allowing it to provide informed responses based on a structured knowledge base.
Procedural Memory: This refers to the agent's ability to remember and recall skills and learned behaviors.[6] It enables the agent to perform tasks automatically without needing to reason through each step every time.
Consensus Memory: In multi-agent systems, this allows for the sharing of knowledge among different agents, creating a collective intelligence.[8][9]
Key Mechanisms and Architectures
These are the processes and frameworks that govern how memory is used and managed within an AI agent.
Retrieval-Augmented Generation (RAG): A powerful mechanism that combines the generative capabilities of large language models with the ability to retrieve relevant information from an external knowledge base.[5] This allows the agent to access up-to-date or domain-specific information.
Hierarchical Memory Systems: These systems use different tiers of storage to manage information effectively, inspired by traditional operating systems.[10]
Stateful vs. Stateless Agents: A stateful agent has memory and retains knowledge across sessions, while a stateless agent treats each interaction as a fresh start.[11] The presence of a memory system is what distinguishes a stateful agent.
Super Memory MCP: This is a concept for a centralized and user-owned memory store that can be accessed by various AI agents.[12] The goal is to create a unified and persistent memory for the user across different platforms and services, with the Model Context Protocol acting as a universal connector.[12]



### AI Agent Memory: A Comparative Overview 

The landscape of AI agent memory is rapidly evolving, moving beyond simple state retention to complex, human-like cognitive architectures. This comparison table provides an overview of the key components, types, and architectural models that define how AI agents remember, learn, and adapt. A significant recent development is the emergence of the Model Context Protocol (MCP), which standardizes how agents access and manage contextual information. 

| **Category** | **Term** | **Description** | **Primary Use Case** | **Strengths** | **Limitations** |
|---|---|---|---|---|---|
| **Core Components** | **Short-Term Memory** | Holds immediate, session-based context for ongoing interactions. Often referred to as working memory, it's volatile and resets frequently. | Maintaining coherence in a single conversation or task. | Enables fluid, context-aware conversations. | Limited capacity and duration; information is not retained across sessions. |
| | **Long-Term Memory** | Enables an agent to retain and recall information across multiple sessions and interactions. Often implemented using vector databases, knowledge graphs, or other persistent storage. | Personalization, learning from past experiences, and maintaining a consistent user profile. | Allows for continuous learning, adaptation, and personalization over time. | Can be computationally expensive to manage and retrieve information from large memory stores. |
| **Memory Types (Inspired by Human Cognition)** | **Episodic Memory** | Stores specific past events and experiences, tied to a particular time and context. | Learning from specific past interactions and recalling sequences of events. | Enables case-based reasoning and learning from concrete examples. | Can be challenging to generalize from individual episodes. |
| | **Semantic Memory** | A repository of general knowledge, facts, and conceptual understanding about the world. | Providing informed and factually accurate responses based on a structured knowledge base. | Allows the agent to draw on a vast and stable base of information. | Can become outdated if not continuously updated. |
| | **Procedural Memory** | The agent's ability to remember and recall skills and learned behaviors to perform tasks automatically. | Executing multi-step processes or tasks without needing to reason through each step every time. | Increases efficiency and speed by automating learned behaviors. | Can be rigid and less adaptable to novel situations. |
| | **Consensus Memory** | In multi-agent systems, this allows for the sharing of knowledge and information among different agents. | Collaborative problem-solving and creating a collective intelligence. | Enables agents to learn from each other's experiences and knowledge. | Requires robust protocols for communication and information synchronization. |
| **Architectural Models & Protocols** | **Reactive Agents** | The simplest form of AI agents that do not possess memory. They respond to immediate stimuli based on pre-defined rules. | Simple, repetitive tasks where historical context is not needed. | Fast and computationally inexpensive. | Unable to learn or adapt based on past interactions. |
| | **Deliberative Agents** | These agents build and maintain an internal model of the world and use it for planning their actions. Memory is crucial for this model. | Complex planning and decision-making tasks. | Can make more strategic and informed decisions. | Can be slower to respond due to the need for planning. |
| | **Hybrid Agents** | Combines the immediate responsiveness of reactive agents with the planning capabilities of deliberative agents. | Tasks that require both quick reactions and long-term planning. | Balances speed and strategic thinking. | Can be more complex to design and implement. |
| | **Model Context Protocol (MCP)** | A specification for how AI agents access, manage, and share context between different models and memory modules. It acts as a universal connector for contextual data. | Creating a centralized and persistent memory store that can be accessed by various AI agents and services. | Enables a more cohesive and personalized AI experience across different platforms by breaking down memory silos. | As an emerging standard, widespread adoption and interoperability are still in development. |
| | **Super Memory MCP** | A concept for a user-owned, centralized memory store that is accessible by multiple AI agents through the MCP. | Providing a unified and persistent memory for a user across different applications and services. | Gives users control over their own data and enables a highly personalized AI experience. | Dependent on the widespread adoption and support of the MCP standard. |