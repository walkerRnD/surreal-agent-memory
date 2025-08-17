import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { mcpToolDefinitions, mcpToolHandlers } from "../lib/domain/knowledge-manager/tools";

const server = new Server({
  name: "memory-server",
  version: "0.6.3",
},    {
    capabilities: {
      tools: {},
    },
  },);
// The server instance and tools exposed to Claude


server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: mcpToolDefinitions,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "read_graph") {
    return mcpToolHandlers.read_graph();
  }

  if (!args) {
    throw new Error(`No arguments provided for tool: ${name}`);
  }

  const handler = mcpToolHandlers[name as keyof typeof mcpToolHandlers];
  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }

  return handler(args);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Knowledge Graph MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});