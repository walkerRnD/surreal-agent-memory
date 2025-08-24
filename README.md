# Surreal Agent Memory
Obs.: this project is under development and not ready to use

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/walkerRnD/surreal-agent-memory&project-name=surreal-agent-memory)

A flexible **Model Context Protocol (MCP) server** for AI agent memory management, built with SvelteKit and SurrealDB. Designed to be **easy to use** (local, cloud, edge), **flexible**, and **bench/spec oriented** for testing the latest memory and RAG architectures from research papers.

## 🚀 Quick Start

### As MCP Server (Recommended)

Use directly with Claude Desktop or other MCP-compatible AI assistants:

```json
{
  "mcpServers": {
    "surreal-agent-memory": {
      "command": "npx",
      "args": ["-y", "surreal-agent-memory"],
      "env": {
        "DB_HOST": "surrealkv://data.db",
        "DB_NAMESPACE": "local",
        "DB_DATABASE": "persisted",
        "DB_USERNAME": "root",
        "DB_PASSWORD": "root"
      },
      "alwaysAllow": [
        "create_entities",
        "create_relations",
        "delete_entities",
        "add_observations",
        "delete_observations",
        "delete_relations",
        "read_graph",
        "search_nodes",
        "open_nodes"
      ]
    }
  }
}
```

### As HTTP Server

```bash
npx surreal-agent-memory --mode server --port 3000 --host surreal://data.db --namespace local --database persisted --username root --password root
```

Then configure as streamable HTTP MCP server:

```json
{
  "mcpServers": {
    "surreal-agent-memory": {
      "type": "streamable-http",
      "url": "http://localhost:3000",
      "alwaysAllow": ["create_entities", "create_relations", "delete_entities", "add_observations", "delete_observations", "delete_relations", "read_graph", "search_nodes", "open_nodes"]
    }
  }
}
```

### MCP Quick Connect (Streamable HTTP with Headers)

For fastest setup in tools like Claude Desktop, use the MCP HTTP endpoint with DB headers (as shown in [`.gemini/settings.json`](.gemini/settings.json:1)):

```json
{
  "mcpServers": {
    "memory": {
      "type": "streamable-http",
      "url": "http://localhost:5173/mcp",
      "headers": {
        "X-DB-Host": "surrealkv://data.db",
        "X-DB-Namespace": "local",
        "X-DB-Database": "persisted",
        "X-DB-Token": "YOUR_SURREALDB_JWT"
      }
    }
  }
}
```

Notes:
- Do not commit secrets. Store X-DB-Token securely (e.g., OS keychain or environment-specific secure storage).
- Required headers: X-DB-Host, X-DB-Namespace, X-DB-Database, X-DB-Token.
- Point `url` to your running server MCP endpoint (dev UI serves it at `http://localhost:5173/mcp`).

### With Configuration File

```bash
npx surreal-agent-memory --config ./config.json
```

## 🎯 Features

### Core Capabilities
- **Knowledge Graph Management**: Entity-Relation-Observation model for structured memory
- **Dual Storage Backends**: File-based (V0) and SurrealDB (V1) with automatic migration
- **MCP Protocol Integration**: Native support for AI assistant integration
- **Type Safety**: Full TypeScript support with Zod schema validation
- **Multi-Platform**: Local, cloud, and edge deployment options

### Deployment Modes
- **MCP Server**: Direct integration with AI assistants
- **HTTP Server**: RESTful API with MCP over HTTP
- **Web UI**: Cytoscape-based graph visualization interface
- **CLI**: Command-line interface for scripting
- **Electron**: Desktop application (planned)

### Memory Architecture Roadmap
- ✅ **Direct Memory Management** (Current)
- 🔄 **Simple RAG** (In Development)
- 📋 **Graph RAG** (Planned)
- 📋 **Hyper Graph RAG** (Planned)
- 📋 **Lazy Graph RAG** (Planned)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm/pnpm/yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/walkerRnD/surreal-agent-memory.git
cd surreal-agent-memory

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build Modes

```bash
# Web application (Vercel adapter)
npm run build

# Web application (Node adapter)
npm run build:local

# MCP server with UI
npm run build:server

# CLI tool
npm run build:cli

# Electron app
npm run build:electron
```

## 📊 Knowledge Graph Structure

The system uses an Entity-Relation-Observation model:

### Entities
Represent nodes in the knowledge graph with:
- **name**: Unique identifier
- **entityType**: Category (person, concept, etc.)
- **observations**: Array of descriptive strings

### Relations
Connect entities with:
- **from/to**: Entity names
- **relationType**: Relationship type (active voice)

### Observations
Descriptive information attached to entities, enabling rich context and searchability.

## 🔧 Configuration

### Environment Variables

```bash
# Storage backend selection
KNOWLEDGE_GRAPH_VERSION=v1  # Use SurrealDB (default)

# SurrealDB Configuration
DB_HOST=surrealkv://data.db
DB_NAMESPACE=local
DB_DATABASE=persisted
DB_USERNAME=root
DB_PASSWORD=root
```

### Database Support
- ✅ **SurrealDB** (Current) - Embedded and network modes
- 📋 **Milvus DB** (Planned) - Vector database integration
- 📋 **Qdrant** (Planned) - Vector similarity search

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Run all tests
npm run test
```

## 📚 API Reference

### MCP Tools

The server exposes 9 core MCP tools:

- `create_entities_shared-memory` - Create new entities
- `create_relations_shared-memory` - Create relationships between entities
- `add_observations_shared-memory` - Add observations to existing entities
- `delete_entities_shared-memory` - Remove entities and their relations
- `delete_observations_shared-memory` - Remove specific observations
- `delete_relations_shared-memory` - Remove relationships
- `read_graph_shared-memory` - Retrieve the complete knowledge graph
- `search_nodes_shared-memory` - Search entities by query
- `open_nodes_shared-memory` - Retrieve specific entities by name

## 🎨 Web UI

Access the web interface at `http://localhost:5173` (development) or your deployed URL. Features:

- **Interactive Graph Visualization** powered by Cytoscape.js
- **Entity Management** - Create, edit, and delete entities
- **Relationship Mapping** - Visualize and manage connections
- **Search & Filter** - Find entities and relations quickly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [SurrealDB Documentation](https://surrealdb.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [SvelteKit Documentation](https://kit.svelte.dev/)

---

