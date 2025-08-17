# Knowledge Graph Manager

A flexible knowledge graph management system with support for both file-based storage (V0) and SurrealDB (V1) backends.

## Overview

This system provides a unified interface for managing entities, relations, and observations in a knowledge graph structure. It supports two implementations:

- **V0 (File-based)**: Uses JSONL files for storage (default)
- **V1 (SurrealDB)**: Uses SurrealDB with pure schemaless approach + Zod validation

## Architecture

### Core Components

- **Schemas** (`schemas.ts`): Zod schemas for type safety and validation
- **Manager V0** (`managers/manager-v0.ts`): File-based implementation
- **Manager V1** (`managers/manager-v1.ts`): SurrealDB implementation
- **Index** (`managers/index.ts`): Feature flag system and manager selection
- **Tools** (`tools/`): MCP tool definitions and handlers

### Key Features

- **Type Safety**: Full TypeScript support with Zod schema validation
- **Backward Compatibility**: Same interface across both implementations
- **Feature Flags**: Easy switching between implementations
- **Pure Schemaless**: SurrealDB version uses no DEFINE statements
- **Automatic Migration**: Built-in migration from V0 to V1

## Usage

### Environment Configuration

```bash
# Use file-based manager (default)
KNOWLEDGE_GRAPH_VERSION=v0

# Use SurrealDB manager
KNOWLEDGE_GRAPH_VERSION=v1
```

### Basic Operations

```typescript
import { knowledgeGraphManager } from './managers/index.js';

// Create entities
const entities = await knowledgeGraphManager.createEntities([
  {
    name: 'Alice',
    entityType: 'person',
    observations: ['likes coffee', 'works remotely']
  }
]);

// Create relations
const relations = await knowledgeGraphManager.createRelations([
  {
    from: 'Alice',
    to: 'Bob',
    relationType: 'knows'
  }
]);

// Search the graph
const results = await knowledgeGraphManager.searchNodes('coffee');

// Read full graph
const graph = await knowledgeGraphManager.readGraph();
```

## SurrealDB Implementation Details

### Pure Schemaless Approach

The V1 implementation uses SurrealDB's schemaless nature:

- **No DEFINE TABLE statements**: Tables are created automatically
- **No DEFINE INDEX statements**: SurrealDB handles optimization
- **No schema constraints**: Structure enforced by Zod validation
- **Automatic table creation**: Tables appear on first INSERT/CREATE

### Database Structure

```
entity:⟨name⟩ {
  name: string,
  entityType: string,
  observations: string[],
  created_at: datetime,
  updated_at: datetime
}

knows (relation table) {
  in: entity:⟨from⟩,
  out: entity:⟨to⟩,
  relationType: string,
  created_at: datetime
}
```

### Zod Validation

All data is validated using Zod schemas:

```typescript
const EntitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  entityType: z.string().min(1),
  observations: z.array(z.string()),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
```

## Migration

### From V0 to V1

```typescript
import { migrateFromV0ToV1 } from './managers/index.js';

// Migrate all data from file-based to SurrealDB
await migrateFromV0ToV1();

// Then set environment variable
// KNOWLEDGE_GRAPH_VERSION=v1
```

## Testing

### Run Tests

```bash
# Test file-based manager
node src/lib/domain/knowledge-manager/test-surrealdb.ts

# Test SurrealDB manager
KNOWLEDGE_GRAPH_VERSION=v1 node src/lib/domain/knowledge-manager/test-surrealdb.ts
```

### Health Check

```typescript
import { healthCheck } from './managers/index.js';

const health = await healthCheck();
console.log(health); // { version: 'v1', status: 'healthy' }
```

## MCP Integration

The knowledge graph is exposed via MCP (Model Context Protocol) tools:

- `create_entities_shared-memory`
- `create_relations_shared-memory`
- `add_observations_shared-memory`
- `delete_entities_shared-memory`
- `delete_observations_shared-memory`
- `delete_relations_shared-memory`
- `read_graph_shared-memory`
- `search_nodes_shared-memory`
- `open_nodes_shared-memory`

### Web Route

Available at `/mcp` endpoint using Vercel MCP adapter.

### CLI

Available via CLI MCP server in `src/cli/cli.ts`.

## Best Practices

### SurrealDB

1. **No Schema Definitions**: Let SurrealDB be schemaless, use Zod for validation
2. **Record IDs**: Use descriptive record IDs like `entity:⟨name⟩`
3. **Graph Relations**: Use `RELATE` statements for graph edges
4. **Error Handling**: Validate all inputs with Zod schemas
5. **Connection Management**: Use existing `getDb()` infrastructure

### Development

1. **Feature Flags**: Use environment variables for implementation switching
2. **Backward Compatibility**: Maintain same interface across versions
3. **Type Safety**: Leverage Zod for both types and validation
4. **Testing**: Test both implementations with the same test suite

## Dependencies

- `surrealdb`: SurrealDB JavaScript SDK
- `@surrealdb/node`: Node.js engines for embedded databases
- `zod`: Schema validation and TypeScript type inference
- `@vercel/mcp-adapter`: MCP web integration
- `@modelcontextprotocol/sdk`: MCP CLI integration

## Configuration

The system uses the existing database configuration from `src/lib/server/infra/db.ts`:

- **Host**: Defaults to `surrealkv://data.db` for local development
- **Namespace/Database**: Configured via `SERVER_CONFIG.db`
- **Authentication**: Optional for embedded engines, required for network engines
