import { knowledgeGraphManager, type Relation } from '../managers/index';

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

// Tool handlers for Vercel MCP adapter format
export const createEntitiesHandler = async (input: CreateEntitiesInput) => {
  const result = await knowledgeGraphManager.createEntities(input.entities);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const createRelationsHandler = async (input: CreateRelationsInput) => {
  const result = await knowledgeGraphManager.createRelations(input.relations as Relation[]);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const addObservationsHandler = async (input: AddObservationsInput) => {
  const result = await knowledgeGraphManager.addObservations(input.observations);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const deleteEntitiesHandler = async (input: DeleteEntitiesInput) => {
  await knowledgeGraphManager.deleteEntities(input.entityNames);
  return {
    content: [{ type: 'text' as const, text: 'Entities deleted successfully' }],
  };
};

export const deleteObservationsHandler = async (input: DeleteObservationsInput) => {
  await knowledgeGraphManager.deleteObservations(input.deletions);
  return {
    content: [{ type: 'text' as const, text: 'Observations deleted successfully' }],
  };
};

export const deleteRelationsHandler = async (input: DeleteRelationsInput) => {
  await knowledgeGraphManager.deleteRelations(input.relations as Relation[]);
  return {
    content: [{ type: 'text' as const, text: 'Relations deleted successfully' }],
  };
};

export const readGraphHandler = async (_input: ReadGraphInput) => {
  const result = await knowledgeGraphManager.readGraph();
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const searchNodesHandler = async (input: SearchNodesInput) => {
  const result = await knowledgeGraphManager.searchNodes(input.query);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

export const openNodesHandler = async (input: OpenNodesInput) => {
  const result = await knowledgeGraphManager.openNodes(input.names);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
};

// Tool handlers for MCP SDK format (used in CLI)
export const mcpToolHandlers = {
  create_entities: async (args: any) => {
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.createEntities(args.entities), null, 2) }] };
  },
  create_relations: async (args: any) => {
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.createRelations(args.relations as Relation[]), null, 2) }] };
  },
  add_observations: async (args: any) => {
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.addObservations(args.observations as { entityName: string; contents: string[] }[]), null, 2) }] };
  },
  delete_entities: async (args: any) => {
    await knowledgeGraphManager.deleteEntities(args.entityNames as string[]);
    return { content: [{ type: "text", text: "Entities deleted successfully" }] };
  },
  delete_observations: async (args: any) => {
    await knowledgeGraphManager.deleteObservations(args.deletions as { entityName: string; observations: string[] }[]);
    return { content: [{ type: "text", text: "Observations deleted successfully" }] };
  },
  delete_relations: async (args: any) => {
    await knowledgeGraphManager.deleteRelations(args.relations as Relation[]);
    return { content: [{ type: "text", text: "Relations deleted successfully" }] };
  },
  read_graph: async () => {
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.readGraph(), null, 2) }] };
  },
  search_nodes: async (args: any) => {
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.searchNodes(args.query as string), null, 2) }] };
  },
  open_nodes: async (args: any) => {
    return { content: [{ type: "text", text: JSON.stringify(await knowledgeGraphManager.openNodes(args.names as string[]), null, 2) }] };
  },
};
