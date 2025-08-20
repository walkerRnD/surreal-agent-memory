import { knowledgeGraphManager, knowledgeGraphManager as knowledgeGraphManagerV0 } from './manager-v0';

// Feature flag to switch between file-based (V0) and SurrealDB-based (V1) managers
// Set via environment variable: KNOWLEDGE_GRAPH_VERSION=v1 to use SurrealDB
const KNOWLEDGE_GRAPH_VERSION = process.env.KNOWLEDGE_GRAPH_VERSION || 'v1';

// Export types for backward compatibility
export type { RelationV0 as Relation, KnowledgeGraphV0 as KnowledgeGraph } from './manager-v0';

// Export both managers for testing and migration purposes
export { knowledgeGraphManager as knowledgeGraphManagerV0 } from './manager-v0';

// Utility function to check which version is currently active
export function getActiveManagerVersion(): 'v0' | 'v1' {
  return KNOWLEDGE_GRAPH_VERSION === 'v0' ? 'v0' : 'v1';
}

// Migration utility function (for future use)
export async function migrateFromV0ToV1(): Promise<void> {
  console.log('Starting migration from V0 (file-based) to V1 (SurrealDB)...');

  try {
    // Read all data from V0 manager
    const v0Data = await knowledgeGraphManagerV0.readGraph();

    console.log(`Found ${v0Data.entities.length} entities and ${v0Data.relations.length} relations to migrate`);

    // Create entities in V1 manager
    if (v0Data.entities.length > 0) {
      const createdEntities = await knowledgeGraphManagerV1.createEntities(v0Data.entities);
      console.log(`Migrated ${createdEntities.length} entities`);
    }

    // Create relations in V1 manager
    if (v0Data.relations.length > 0) {
      const createdRelations = await knowledgeGraphManagerV1.createRelations(v0Data.relations);
      console.log(`Migrated ${createdRelations.length} relations`);
    }

    console.log('Migration completed successfully!');
    console.log('To use the SurrealDB version, set KNOWLEDGE_GRAPH_VERSION=v1 in your environment');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Migration from file content utility function
export async function migrateFromFileContent(fileContent: string, fileName: string): Promise<void> {
  console.log(`Starting import from file "${fileName}" to V1 (SurrealDB)...`);

  try {
    // Always parse as JSONL format regardless of file extension
    const parsedData = parseJSONLContent(fileContent);

    console.log(`Found ${parsedData.entities.length} entities and ${parsedData.relations.length} relations to import`);

    // Create entities in V1 manager
    if (parsedData.entities.length > 0) {
      const createdEntities = await knowledgeGraphManagerV1.createEntities(parsedData.entities);
      console.log(`Imported ${createdEntities.length} entities`);
    }

    // Create relations in V1 manager
    if (parsedData.relations.length > 0) {
      const createdRelations = await knowledgeGraphManagerV1.createRelations(parsedData.relations);
      console.log(`Imported ${createdRelations.length} relations`);
    }

    console.log(`Import from "${fileName}" completed successfully!`);
  } catch (error) {
    console.error(`Import from "${fileName}" failed:`, error);
    throw error;
  }
}

// Helper function to parse JSONL content
function parseJSONLContent(content: string): { entities: any[], relations: any[] } {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const entities: any[] = [];
  const relations: any[] = [];

  for (const line of lines) {
    try {
      const item = JSON.parse(line);
      if (item.type === 'entity') {
        const { type, ...entity } = item;
        entities.push(entity);
      } else if (item.type === 'relation') {
        const { type, ...relation } = item;
        relations.push(relation);
      }
    } catch (error) {
      console.warn(`Failed to parse line: ${line}`, error);
    }
  }

  return { entities, relations };
}



// Health check function to verify the active manager is working
export async function healthCheck(): Promise<{ version: string; status: 'healthy' | 'error'; error?: string }> {
  const version = getActiveManagerVersion();

  try {
    // Try to read the graph to verify the manager is working
    await knowledgeGraphManager.readGraph();

    return {
      version,
      status: 'healthy',
    };
  } catch (error) {
    return {
      version,
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
