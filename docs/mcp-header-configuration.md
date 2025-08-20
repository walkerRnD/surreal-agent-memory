# MCP Database Configuration (Headers and Query String)

This document explains how to configure database connections for MCP tools using HTTP headers and query string parameters.

## Overview

The MCP server supports dynamic database configuration through both HTTP headers and query string parameters. Query string parameters have higher priority than headers, allowing clients to specify different database configurations per request without modifying server code. This is especially useful for MCP clients that cannot set custom headers.

## Configuration Methods

### Query String Parameters (Higher Priority)

The following query string parameters are supported for database configuration:

- `db-host`: Database host URL (e.g., `surreal://localhost:8000`)
- `db-namespace`: Database namespace
- `db-database`: Database name
- `db-username`: Database username
- `db-password`: Database password
- `db-token`: Database authentication token

### HTTP Headers (Fallback)

The following custom headers are supported for database configuration:

- `X-DB-Host` or `x-db-host`: Database host URL (e.g., `surreal://localhost:8000`)
- `X-DB-Namespace` or `x-db-namespace`: Database namespace
- `X-DB-Database` or `x-db-database`: Database name
- `X-DB-Username` or `x-db-username`: Database username
- `X-DB-Password` or `x-db-password`: Database password
- `X-DB-Token` or `x-db-token`: Database authentication token

### Priority Order

1. **Query String Parameters** (highest priority)
2. **HTTP Headers** (fallback)
3. **Server Default Configuration** (if neither query string nor headers provide a value)

## How It Works

1. **Configuration Extraction**: Tool handlers extract database configuration from:
   - Query string parameters (highest priority)
   - Request headers (fallback)
   - Server default configuration (for missing values)
2. **Connection**: A new database connection is created for each request using the extracted configuration
3. **Tool Execution**: The tool operation is performed using this connection

## Example Usage

### Using Query String Parameters

For MCP clients that cannot set custom headers, you can pass database configuration via query string:

```bash
curl -X POST "http://localhost:5173/mcp?db-host=surreal://custom-db:8000&db-namespace=custom_namespace&db-database=custom_database&db-username=custom_user&db-password=custom_password" \
  -H "Content-Type: application/json" \
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

### Mixed Configuration (Query String + Headers)

Query string parameters will override headers when both are present:

```bash
# URL with query string parameters
curl -X POST "http://localhost:5173/mcp?db-host=surreal://priority-host:8000&db-namespace=priority_namespace" \
  -H "Content-Type: application/json" \
  -H "X-DB-Host: surreal://fallback-host:8000" \
  -H "X-DB-Namespace: fallback_namespace" \
  -H "X-DB-Database: fallback_database" \
  -H "X-DB-Username: fallback_user" \
  -d '{ ... }'

# Result configuration:
# - host: surreal://priority-host:8000 (from query string)
# - namespace: priority_namespace (from query string)
# - database: fallback_database (from headers)
# - username: fallback_user (from headers)
```

## Security Considerations

1. **Sensitive Data**: Database credentials are passed in headers and query strings, ensure HTTPS is used in production
2. **Query String Exposure**: Query string parameters may be logged by web servers and proxies, consider using headers for sensitive data
3. **Header Validation**: Consider implementing header validation and sanitization
4. **Access Control**: Implement proper authentication and authorization for database access
5. **Connection Pooling**: Consider implementing connection pooling for performance

## Implementation Details

The request-based configuration is implemented in the tool handlers through:

1. **McpRequestContext Type**: Defines the structure for request context including headers and request object
2. **getDbConfigFromRequest Function**: Extracts database configuration from query string and headers with proper priority
3. **Updated Tool Handlers**: All tool handlers now accept an optional `extra` parameter containing request context
4. **Priority Logic**: Query string parameters override headers, which override server defaults

## Backward Compatibility

- **Default Behavior**: If no headers are provided, the server uses the default `SERVER_CONFIG.db`
- **CLI Support**: The CLI tools continue to use the default configuration
- **Existing Clients**: Existing clients without custom headers will continue to work unchanged

## Testing

You can test the header-based configuration using the provided web interface or by making direct HTTP requests with the custom headers as shown in the examples above.
