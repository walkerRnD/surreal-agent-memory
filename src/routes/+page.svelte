<script lang="ts">
  import { onMount } from "svelte";

  let stats = {
    entities: 0,
    relations: 0,
    loading: true,
  };

  // Load basic stats on mount
  onMount(async () => {
    try {
      const response = await fetch("/api/knowledge-graph-forms/read-graph");
      if (response.ok) {
        const data = await response.json();
        stats.entities = data.entities?.length || 0;
        stats.relations = data.relations?.length || 0;
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      stats.loading = false;
    }
  });
</script>

<svelte:head>
  <title>Surreal Agent Memory - AI Agent Memory Management</title>
  <meta
    name="description"
    content="A flexible MCP server for AI agent memory management with SurrealDB and knowledge graph capabilities"
  />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
  <!-- Hero Section -->
  <div class="container mx-auto px-6 py-16">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        🧠 Surreal Agent Memory
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        A flexible <strong>Model Context Protocol (MCP) server</strong> for AI agent
        memory management. Built with SvelteKit and SurrealDB for testing the latest
        memory and RAG architectures.
      </p>

      <!-- Quick Stats -->
      <div class="flex justify-center gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-md p-4 min-w-[120px]">
          <div class="text-2xl font-bold text-blue-600">
            {stats.loading ? "..." : stats.entities}
          </div>
          <div class="text-sm text-gray-600">Entities</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 min-w-[120px]">
          <div class="text-2xl font-bold text-purple-600">
            {stats.loading ? "..." : stats.relations}
          </div>
          <div class="text-sm text-gray-600">Relations</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 min-w-[120px]">
          <div class="text-2xl font-bold text-green-600">9</div>
          <div class="text-sm text-gray-600">MCP Tools</div>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-wrap justify-center gap-4">
        <a
          href="/knowledge-graph-forms"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          🚀 Try Interactive Demo
        </a>
        <a
          href="/test-knowledge-graph"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          🧪 Run Tests
        </a>
        <a
          href="https://github.com/walkerRnD/surreal-agent-memory"
          target="_blank"
          class="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          📚 View on GitHub
        </a>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      <!-- MCP Integration -->
      <div
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="text-3xl mb-4">🔌</div>
        <h3 class="text-xl font-semibold mb-3">MCP Integration</h3>
        <p class="text-gray-600 mb-4">
          Native Model Context Protocol support for seamless AI assistant
          integration. Works with Claude Desktop and other MCP-compatible tools.
        </p>
        <div class="text-sm text-blue-600 font-medium">
          9 Core Tools • NPX Ready • HTTP Server
        </div>
      </div>

      <!-- Knowledge Graph -->
      <div
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="text-3xl mb-4">🕸️</div>
        <h3 class="text-xl font-semibold mb-3">Knowledge Graph</h3>
        <p class="text-gray-600 mb-4">
          Entity-Relation-Observation model for structured memory management.
          Full TypeScript support with Zod validation.
        </p>
        <div class="text-sm text-purple-600 font-medium">
          Entities • Relations • Observations
        </div>
      </div>

      <!-- Dual Storage -->
      <div
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="text-3xl mb-4">💾</div>
        <h3 class="text-xl font-semibold mb-3">Dual Storage</h3>
        <p class="text-gray-600 mb-4">
          Choose between file-based (V0) or SurrealDB (V1) backends. Automatic
          migration and feature flag switching.
        </p>
        <div class="text-sm text-green-600 font-medium">
          File-based • SurrealDB • Auto Migration
        </div>
      </div>

      <!-- Multi-Platform -->
      <div
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="text-3xl mb-4">🌐</div>
        <h3 class="text-xl font-semibold mb-3">Multi-Platform</h3>
        <p class="text-gray-600 mb-4">
          Deploy anywhere: local development, cloud servers, or edge
          environments. Multiple deployment modes available.
        </p>
        <div class="text-sm text-orange-600 font-medium">
          Local • Cloud • Edge • Electron
        </div>
      </div>

      <!-- Web UI -->
      <div
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="text-3xl mb-4">🎨</div>
        <h3 class="text-xl font-semibold mb-3">Interactive UI</h3>
        <p class="text-gray-600 mb-4">
          Cytoscape-powered graph visualization with interactive forms. Test and
          manage your knowledge graph visually.
        </p>
        <div class="text-sm text-pink-600 font-medium">
          Cytoscape • Forms • Real-time
        </div>
      </div>

      <!-- Research Ready -->
      <div
        class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="text-3xl mb-4">🔬</div>
        <h3 class="text-xl font-semibold mb-3">Research Ready</h3>
        <p class="text-gray-600 mb-4">
          Designed for testing latest memory and RAG architectures from research
          papers. Bench and spec oriented development.
        </p>
        <div class="text-sm text-indigo-600 font-medium">
          RAG • Graph RAG • Hyper Graph
        </div>
      </div>
    </div>

    <!-- Quick Start Section -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-16">
      <h2 class="text-3xl font-bold text-center mb-8">🚀 Quick Start</h2>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- MCP Server Setup -->
        <div>
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <span
              class="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"
              >1</span
            >
            MCP Server (Recommended)
          </h3>
          <p class="text-gray-600 mb-4">
            Add to your Claude Desktop configuration:
          </p>
          <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code
              >{`{
  "mcpServers": {
    "surreal-agent-memory": {
      "command": "npx",
      "args": ["-y", "surreal-agent-memory"],
      "env": {
        "DB_HOST": "surrealkv://data.db",
        "DB_NAMESPACE": "local",
        "DB_DATABASE": "persisted"
      }
    }
  }
}`}</code
            ></pre>
        </div>

        <!-- HTTP Server Setup -->
        <div>
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <span
              class="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"
              >2</span
            >
            HTTP Server
          </h3>
          <p class="text-gray-600 mb-4">Run as standalone server:</p>
          <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code
              >npx surreal-agent-memory --mode server --port 3000</code
            ></pre>
          <p class="text-gray-600 mt-4">Then configure as streamable HTTP:</p>
          <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code
              >{`{
  "mcpServers": {
    "surreal-agent-memory": {
      "type": "streamable-http",
      "url": "http://localhost:3000"
    }
  }
}`}</code
            ></pre>
        </div>
      </div>
    </div>

    <!-- MCP Quick Connect -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-16">
      <h2 class="text-3xl font-bold text-center mb-8">⚡ MCP Quick Connect</h2>
      <p class="text-gray-600 mb-6 text-center max-w-3xl mx-auto">
        Fastest way to connect from MCP-compatible apps (e.g., Claude Desktop)
        using the HTTP endpoint with DB headers. Ensure your local dev server is
        running so the MCP endpoint is available at <code
          >http://localhost:5173/mcp</code
        >.
      </p>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Headers-based MCP HTTP -->
        <div>
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <span
              class="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3"
              >3</span
            >
            Streamable HTTP with Headers
          </h3>
          <p class="text-gray-600 mb-4">
            Add this to your MCP client configuration:
          </p>
          <pre class="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code
              >{`{
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
}`}</code
            ></pre>
          <ul class="text-sm text-gray-600 list-disc pl-6 mt-4 space-y-1">
            <li>
              Required headers: X-DB-Host, X-DB-Namespace, X-DB-Database,
              X-DB-Token
            </li>
            <li>Store X-DB-Token securely; do not commit secrets</li>
            <li>Use your dev/prod MCP URL as appropriate</li>
          </ul>
        </div>

        <!-- Reference Links -->
        <div>
          <h3 class="text-xl font-semibold mb-4">References</h3>
          <ul class="space-y-3 text-blue-700">
            <li>
              <a
                class="hover:underline"
                href="https://modelcontextprotocol.io/"
                target="_blank"
              >
                Model Context Protocol Docs
              </a>
            </li>
            <li>
              <a
                class="hover:underline"
                href="https://surrealdb.com/docs"
                target="_blank"
              >
                SurrealDB Docs
              </a>
            </li>
            <li>
              <a
                class="hover:underline"
                href="https://github.com/walkerRnD/surreal-agent-memory"
                target="_blank"
              >
                Repository: Headers example and setup
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Navigation Section -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-16">
      <h2 class="text-3xl font-bold text-center mb-8">🧭 Explore Features</h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a
          href="/docs/roadmap"
          class="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
        >
          <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">
            🗺️
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Roadmap</h3>
          <p class="text-sm text-gray-600">
            Current status and upcoming milestones for the project
          </p>
        </a>

        <a
          href="/docs/research"
          class="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
        >
          <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">
            🔬
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Research</h3>
          <p class="text-sm text-gray-600">
            RAG references and GraphRAG variants informing the design
          </p>
        </a>

        <a
          href="/knowledge-graph-forms"
          class="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
        >
          <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">
            📝
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Interactive Forms</h3>
          <p class="text-sm text-gray-600">
            Create, manage, and test knowledge graph operations with intuitive
            forms
          </p>
        </a>

        <a
          href="/test-knowledge-graph"
          class="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
        >
          <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">
            🧪
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">Automated Tests</h3>
          <p class="text-sm text-gray-600">
            Run comprehensive tests to verify system functionality and
            performance
          </p>
        </a>
      </div>
    </div>

    <!-- Architecture Roadmap -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-16">
      <h2 class="text-3xl font-bold text-center mb-8">
        🗺️ Architecture Roadmap
      </h2>

      <div class="space-y-6">
        <!-- MCP Modes -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-800">MCP Modes</h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex items-center space-x-3 bg-green-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium">Direct Memory Management</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Memory Manager Agent</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Workspace Librarian</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Aggregator</span>
            </div>
          </div>
        </div>

        <!-- Retrieval Architecture -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-800">
            Retrieval Architecture
          </h3>
          <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="flex items-center space-x-3 bg-green-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium">Raw Read/Write</span>
            </div>
            <div
              class="flex items-center space-x-3 bg-yellow-50 p-3 rounded-lg"
            >
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm font-medium">Simple RAG</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Graph RAG</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Hyper Graph RAG</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Lazy Graph RAG</span>
            </div>
          </div>
        </div>

        <!-- Database Support -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-800">
            Database Support
          </h3>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="flex items-center space-x-3 bg-green-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium">SurrealDB</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Milvus DB</span>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm font-medium">Qdrant</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <div class="inline-flex items-center space-x-2 text-sm text-gray-600">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Completed</span>
          <div class="w-3 h-3 bg-yellow-500 rounded-full ml-4"></div>
          <span>In Progress</span>
          <div class="w-3 h-3 bg-gray-400 rounded-full ml-4"></div>
          <span>Planned</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center py-8 border-t border-gray-200">
      <p class="text-gray-600 mb-4">Built for the AI agent ecosystem with ❤️</p>
      <div class="flex justify-center space-x-6 text-sm">
        <a
          href="https://github.com/walkerRnD/surreal-agent-memory"
          target="_blank"
          class="text-blue-600 hover:text-blue-800"
        >
          GitHub Repository
        </a>
        <a
          href="https://surrealdb.com/docs"
          target="_blank"
          class="text-blue-600 hover:text-blue-800"
        >
          SurrealDB Docs
        </a>
        <a
          href="https://modelcontextprotocol.io/"
          target="_blank"
          class="text-blue-600 hover:text-blue-800"
        >
          MCP Protocol
        </a>
        <a
          href="https://kit.svelte.dev/"
          target="_blank"
          class="text-blue-600 hover:text-blue-800"
        >
          SvelteKit
        </a>
      </div>
    </div>
  </div>
</div>
