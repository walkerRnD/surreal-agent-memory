import { SERVER_CONFIG } from '../../../server/config';
import { createDbConnection, getDb, type SERVER_DB_CONF } from '../../../server/infra/db';
import { type Relation } from '../managers/index';
import { KnowledgeGraphManagerV1 } from '../managers/manager-v1';
console.log('NODE_ENV:', process.env.NODE_ENV)
const ALLOW_MEMORY = process.env.NODE_ENV !== 'production';
const ALLOW_FILE_MODE = process.env.NODE_ENV !== 'production';
const USE_SERVER_DB = process.env.USE_SERVER_DB === 'true';
const ALLOW_PROXY = process.env.ALLOW_DB_PROXY === 'true';

// Type definitions for tool inputs
export type CreateEntitiesInput = {
  entities: Array<{
    name: string;
    entityType: string;
    observations: string[];
  }>;
};

export type CreateRelationsInput = {
  relations: Array<{
    from: string;
    to: string;
    relationType: string;
  }>;
};

export type AddObservationsInput = {
  observations: Array<{
    entityName: string;
    contents: string[];
  }>;
};

export type DeleteEntitiesInput = {
  entityNames: string[];
};

export type DeleteObservationsInput = {
  deletions: Array<{
    entityName: string;
    observations: string[];
  }>;
};

export type DeleteRelationsInput = {
  relations: Array<{
    from: string;
    to: string;
    relationType: string;
  }>;
};

export type ReadGraphInput = {};

export type SearchNodesInput = {
  query: string;
};

export type OpenNodesInput = {
  names: string[];
};

// Type for MCP request context that includes headers
export type McpRequestContext = {
  headers?: Record<string, string>;
  authInfo?: any;
  request?: Request;
};

export function getDbConfigFromRequest(context?: McpRequestContext): SERVER_DB_CONF {
  const headers = context?.headers || {};
  let queryParams: URLSearchParams | undefined;
  if (context?.request?.url) {
    try {
      const url = new URL(context.request.url);
      queryParams = url.searchParams;
    } catch (error) {
      console.warn('Failed to parse request URL for query parameters:', error);
    }
  }

  const getParam = (queryKey: string, headerKeys: string[]): string | undefined => {
    if (queryParams?.has(queryKey)) {
      return queryParams.get(queryKey) || undefined;
    }
    for (const headerKey of headerKeys) {
      if (headers[headerKey]) {
        return headers[headerKey];
      }
    }
    return undefined;
  };

  const host = getParam('db-host', ['x-db-host', 'X-DB-Host']);
  const namespace = getParam('db-namespace', ['x-db-namespace', 'X-DB-Namespace']);
  const database = getParam('db-database', ['x-db-database', 'X-DB-Database']);
  const username = getParam('db-username', ['x-db-username', 'X-DB-Username']);
  const password = getParam('db-password', ['x-db-password', 'X-DB-Password']);
  const token = getParam('db-token', ['x-db-token', 'X-DB-Token']);

  const isMemory = host?.startsWith('mem://');
  if (!ALLOW_MEMORY && isMemory) {
    throw new Error('Memory database is not allowed');
  }
  const isFile = host?.startsWith('surrealkv://');
  if (!ALLOW_FILE_MODE && isFile) {
    throw new Error('File database is not allowed');
  }
  if (!host) {
    throw new Error('Database host is required');
  }

  return {
    host: host,
    namespace: namespace,
    database: database,
    username: username,
    password: password,
    token,
  };
}


// Tool handlers for Vercel MCP adapter format
export const createEntitiesHandler = async (input: CreateEntitiesInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  const result = await knowledgeGraphManager.createEntities(input.entities);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const createRelationsHandler = async (input: CreateRelationsInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  const result = await knowledgeGraphManager.createRelations(input.relations as Relation[]);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const addObservationsHandler = async (input: AddObservationsInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  const result = await knowledgeGraphManager.addObservations(input.observations);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const deleteEntitiesHandler = async (input: DeleteEntitiesInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  await knowledgeGraphManager.deleteEntities(input.entityNames);
  return {
    content: [{ type: 'text' as const, text: 'Entities deleted successfully' }],
  };
};

export const deleteObservationsHandler = async (input: DeleteObservationsInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  await knowledgeGraphManager.deleteObservations(input.deletions);
  return {
    content: [{ type: 'text' as const, text: 'Observations deleted successfully' }],
  };
};

export const deleteRelationsHandler = async (input: DeleteRelationsInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  await knowledgeGraphManager.deleteRelations(input.relations as Relation[]);
  return {
    content: [{ type: 'text' as const, text: 'Relations deleted successfully' }],
  };
};

export const readGraphHandler = async (_input: ReadGraphInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  const result = await knowledgeGraphManager.readGraph();
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const searchNodesHandler = async (input: SearchNodesInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  const result = await knowledgeGraphManager.searchNodes(input.query);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const openNodesHandler = async (input: OpenNodesInput, extra?: McpRequestContext) => {
  const db = await (USE_SERVER_DB ? getDb() : createDbConnection(getDbConfigFromRequest(extra)));
  const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
  const result = await knowledgeGraphManager.openNodes(input.names);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

// Tool handlers for MCP SDK format (used in CLI)
export const mcpToolHandlers = {
  create_entities: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.createEntities(args.entities), null, 2) }] };
  },
  create_relations: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.createRelations(args.relations as Relation[]), null, 2) }] };
  },
  add_observations: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.addObservations(args.observations as { entityName: string; contents: string[] }[]), null, 2) }] };
  },
  delete_entities: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    await knowledgeGraphManager.deleteEntities(args.entityNames as string[]);
    return { content: [{ type: "text", text: "Entities deleted successfully" }] };
  },
  delete_observations: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    await knowledgeGraphManager.deleteObservations(args.deletions as { entityName: string; observations: string[] }[]);
    return { content: [{ type: "text", text: "Observations deleted successfully" }] };
  },
  delete_relations: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    await knowledgeGraphManager.deleteRelations(args.relations as Relation[]);
    return { content: [{ type: "text", text: "Relations deleted successfully" }] };
  },
  read_graph: async () => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.readGraph(), null, 2) }] };
  },
  search_nodes: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.searchNodes(args.query as string), null, 2) }] };
  },
  open_nodes: async (args: any) => {
    const db = await createDbConnection(SERVER_CONFIG.db);
    const knowledgeGraphManager = new KnowledgeGraphManagerV1(db);
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.openNodes(args.names as string[]), null, 2) }] };
  },
};
