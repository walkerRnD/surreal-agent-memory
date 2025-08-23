focus on publishing two things as pages right now:

Roadmap
Researches (RAG reference, GraphRAG variations, and related material)
Below is a focused plan for just those, covering information hierarchy, marketing angle, and UX.

Information Architecture for Roadmap and Research
Global nav
Roadmap
Research
RAG Reference
GraphRAG Variants
(Optional) Agent Memory Overview
File/route structure
/docs/roadmap/index.md
/docs/research/index.md
/docs/research/rag-reference.md
/docs/research/graphrag-variants.md
(Optional) /docs/research/agent-memory-overview.md
Source mapping from current files
objective.md
Roadmap: MCP modes, Retrieval Architecture, DBs support/state
rag-reference.md → Research: RAG Reference
study-graphrag-variations.md → Research: GraphRAG Variants
(The “AI Agent Memory: Comparative Overview” section inside rag-reference.md can be promoted to an “Agent Memory Overview” page under Research, or moved to Concepts later—confirm preference)
Roadmap Page: Content and UX
Purpose (marketing + trust)
Show vision and progress at a glance; reduce uncertainty; invite collaboration
Sections (drawn from objective.md)
Current Stage
“Direct Memory Management – current”
“Simple RAG – in development”
Short one-liners on what each stage means
Milestones
MCP modes checklist:
Direct Memory Management [complete]
Memory Manager Agent MCP [planned]
Workspace Librarian Agent [planned]
Aggregator [planned]
Retrieval Architecture checklist:
Raw Read/Write [complete]
Simple RAG [in dev]
Graph RAG [planned]
Hyper Graph RAG [planned]
Lazy Graph RAG [planned]
DBs support:
SurrealDB [current]
Milvus/Qdrant [planned]
Timeline (near-term and next)
“Now / Next / Later” with 3–5 bullets each
Links to activity
GitHub issues/milestones (when ready)
“Contribute” CTA
UX details
Progress badges (Complete/In dev/Planned)
Shareable anchor links for each section
Last updated stamp
CTA buttons to Demos and Quickstart for conversion
Research Hub: Structure and UX
Research landing (/docs/research)
Intro: “We explore RAG architectures and agent memory models to inform design”
Cards for:
RAG Reference (curated links + eval)
GraphRAG Variants (comparative analysis)
(Optional) Agent Memory Overview (components/types table)
Tag filters (e.g., RAG, Multi-Agent, Hierarchical, Evaluation)
Last updated stamp
RAG Reference (/docs/research/rag-reference.md)
Purpose
Curated, annotated links to papers, repos, videos, and posts
Structure
Categories:
Core RAG Papers/Repos
Multi-Agent and Optimization (MMOA-RAG)
Graph/Hiearchical (GraphRAG/HiRAG)
Evaluation (benchmarks, methodologies)
Each item: title, one-line takeaway, link
“Eval” section grouped with links
UX
Sticky table of contents
Quick filters by tag
“Related reading” links to GraphRAG Variants
“Last reviewed” notes for freshness
GraphRAG Variants (/docs/research/graphrag-variants.md)
Purpose
Clear, non-duplicated comparative analysis
Structure
Overview: what differentiates GraphRAG, HiRAG (Knowledge/Thought), MMOA-RAG, LazyGraphRAG
Normalized comparison table (one clean table; remove duplicates)
Mini-sections per variant:
Indexing/Preprocessing
Retrieval/Querying
Differentiators
Trade-offs and best-fit scenarios
Optional diagram (Mermaid) summarizing flows
UX
“Copy table” and “Download as CSV” options (future)
“Related demos” placeholder (for future RAG Sandbox)
Optional: Agent Memory Overview (/docs/research/agent-memory-overview.md)
Source
Use the “AI Agent Memory: A Comparative Overview” section currently inside rag-reference.md
Structure
Components (Short-term, Long-term, Memory Module)
Types (Episodic, Semantic, Procedural, Consensus)
Architectural models & protocols (Reactive/Deliberative/Hybrid, MCP, Super Memory MCP)
Rationale
Helps readers contextualize why graph-native memory matters
If you prefer, we can move this later into “Concepts”
Copy and Presentation Guidelines
Frontmatter on every page
title, description, tags, stage, lastUpdated
Scannability
Intro summary boxes (“What this page covers”)
Clear tables and bullets; no dense walls of text
Cross-linking
Roadmap → Research (for “what’s next and why”)
Research → Roadmap (for “planned integration paths”)
Marketing hooks
Roadmap: highlights progression toward Simple RAG → Graph RAG
Research: demonstrates thought leadership and careful design
Minimal Implementation Steps (when you’re ready to proceed)
Create:
/docs/roadmap/index.md (extract from objective.md)
/docs/research/index.md (hub)
/docs/research/rag-reference.md (clean and annotate existing links)
/docs/research/graphrag-variants.md (deduplicate/normalize)
(Optional) /docs/research/agent-memory-overview.md (promote section)
Add nav entries (Roadmap, Research)
Ensure “last updated” and tags render in your docs system
Questions to confirm
Should “AI Agent Memory: Comparative Overview” live under Research now, or should we move it to Concepts later?
Do you want llm-model-management.md included under Research as a “Technical Note,” or keep it in Guides?
