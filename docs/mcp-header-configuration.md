# MCP Header-Based Database Configuration

This document explains how to configure database connections for MCP tools using HTTP headers.

## Overview

The MCP server now supports dynamic database configuration through HTTP headers. This allows clients to specify different database configurations per request without modifying server code.

## Supported Headers

The following custom headers are supported for database configuration:

- `X-DB-Host` or `x-db-host`: Database host URL (e.g., `surreal://localhost:8000`)
- `X-DB-Namespace` or `x-db-namespace`: Database namespace
- `X-DB-Database` or `x-db-database`: Database name
- `X-DB-Username` or `x-db-username`: Database username
- `X-DB-Password` or `x-db-password`: Database password

## How It Works

1. **Header Extraction**: Tool handlers extract database configuration from request headers
2. **Fallback**: If headers are not provided, the server falls back to default `SERVER_CONFIG.db`
3. **Connection**: A new database connection is created for each request using the specified configuration

## Example Usage

### Using curl with Custom Headers

```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-DB-Host: surreal://custom-db:8000" \
  -H "X-DB-Namespace: custom_namespace" \
  -H "X-DB-Database: custom_database" \
  -H "X-DB-Username: custom_user" \
  -H "X-DB-Password: custom_password" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "create_entities_to_memory",
      "arguments": {
        "entities": [
          {
            "name": "Test Entity",
            "entityType": "test",
            "observations": ["This is a test observation"]
          }
        ]
      }
    }
  }'
```

### Using JavaScript/TypeScript Client

```typescript
import { McpClient } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const client = new McpClient({
  name: "test-client",
  version: "1.0.0"
});

const transport = new StreamableHTTPClientTransport(
  new URL("http://localhost:3000/api/mcp"),
  {
    headers: {
      "X-DB-Host": "surreal://custom-db:8000",
      "X-DB-Namespace": "custom_namespace", 
      "X-DB-Database": "custom_database",
      "X-DB-Username": "custom_user",
      "X-DB-Password": "custom_password"
    }
  }
);

await client.connect(transport);

// Now all tool calls will use the custom database configuration
const result = await client.callTool({
  name: "create_entities_to_memory",
  arguments: {
    entities: [
      {
        name: "Test Entity",
        entityType: "test", 
        observations: ["This is a test observation"]
      }
    ]
  }
});
```

## Security Considerations

1. **Sensitive Headers**: Database credentials are passed in headers, ensure HTTPS is used in production
2. **Header Validation**: Consider implementing header validation and sanitization
3. **Access Control**: Implement proper authentication and authorization for database access
4. **Connection Pooling**: Consider implementing connection pooling for performance

## Implementation Details

The header-based configuration is implemented in the tool handlers through:

1. **McpRequestContext Type**: Defines the structure for request context including headers
2. **getDbConfigFromHeaders Function**: Extracts database configuration from headers with fallback
3. **Updated Tool Handlers**: All tool handlers now accept an optional `extra` parameter containing request context

## Backward Compatibility

- **Default Behavior**: If no headers are provided, the server uses the default `SERVER_CONFIG.db`
- **CLI Support**: The CLI tools continue to use the default configuration
- **Existing Clients**: Existing clients without custom headers will continue to work unchanged

## Testing

You can test the header-based configuration using the provided web interface or by making direct HTTP requests with the custom headers as shown in the examples above.
