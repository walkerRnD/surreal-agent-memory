import { z } from 'zod';

// Zod schemas for tool inputs (for Vercel MCP adapter - these are the shape objects)
export const createEntitiesSchema = {
  entities: z.array(z.object({
    name: z.string().describe("The name of the entity"),
    entityType: z.string().describe("The type of the entity"),
    observations: z.array(z.string()).describe("An array of observation contents associated with the entity"),
  })),
};

export const createRelationsSchema = {
  relations: z.array(z.object({
    from: z.string().describe("The name of the entity where the relation starts"),
    to: z.string().describe("The name of the entity where the relation ends"),
    relationType: z.string().describe("The type of the relation"),
  })),
};

export const addObservationsSchema = {
  observations: z.array(z.object({
    entityName: z.string().describe("The name of the entity to add the observations to"),
    contents: z.array(z.string()).describe("An array of observation contents to add"),
  })),
};

export const deleteEntitiesSchema = {
  entityNames: z.array(z.string()).describe("An array of entity names to delete"),
};

export const deleteObservationsSchema = {
  deletions: z.array(z.object({
    entityName: z.string().describe("The name of the entity containing the observations"),
    observations: z.array(z.string()).describe("An array of observations to delete"),
  })),
};

export const deleteRelationsSchema = {
  relations: z.array(z.object({
    from: z.string().describe("The name of the entity where the relation starts"),
    to: z.string().describe("The name of the entity where the relation ends"),
    relationType: z.string().describe("The type of the relation"),
  })),
};

export const readGraphSchema = {};

export const searchNodesSchema = {
  query: z.string().describe("The search query to match against entity names, types, and observation content"),
};

export const openNodesSchema = {
  names: z.array(z.string()).describe("An array of entity names to retrieve"),
};

// Tool definitions for MCP SDK format (used in CLI)
export const mcpToolDefinitions = [
  {
    name: "create_entities",
    description: "Create multiple new entities in the knowledge graph",
    inputSchema: {
      type: "object",
      properties: {
        entities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "The name of the entity" },
              entityType: { type: "string", description: "The type of the entity" },
              observations: { 
                type: "array", 
                items: { type: "string" },
                description: "An array of observation contents associated with the entity"
              },
            },
            required: ["name", "entityType", "observations"],
          },
        },
      },
      required: ["entities"],
    },
  },
  {
    name: "create_relations",
    description: "Create multiple new relations between entities in the knowledge graph. Relations should be in active voice",
    inputSchema: {
      type: "object",
      properties: {
        relations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              from: { type: "string", description: "The name of the entity where the relation starts" },
              to: { type: "string", description: "The name of the entity where the relation ends" },
              relationType: { type: "string", description: "The type of the relation" },
            },
            required: ["from", "to", "relationType"],
          },
        },
      },
      required: ["relations"],
    },
  },
  {
    name: "add_observations",
    description: "Add new observations to existing entities in the knowledge graph",
    inputSchema: {
      type: "object",
      properties: {
        observations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entityName: { type: "string", description: "The name of the entity to add the observations to" },
              contents: { 
                type: "array", 
                items: { type: "string" },
                description: "An array of observation contents to add"
              },
            },
            required: ["entityName", "contents"],
          },
        },
      },
      required: ["observations"],
    },
  },
  {
    name: "delete_entities",
    description: "Delete multiple entities and their associated relations from the knowledge graph",
    inputSchema: {
      type: "object",
      properties: {
        entityNames: { 
          type: "array", 
          items: { type: "string" },
          description: "An array of entity names to delete" 
        },
      },
      required: ["entityNames"],
    },
  },
  {
    name: "delete_observations",
    description: "Delete specific observations from entities in the knowledge graph",
    inputSchema: {
      type: "object",
      properties: {
        deletions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entityName: { type: "string", description: "The name of the entity containing the observations" },
              observations: { 
                type: "array", 
                items: { type: "string" },
                description: "An array of observations to delete"
              },
            },
            required: ["entityName", "observations"],
          },
        },
      },
      required: ["deletions"],
    },
  },
  {
    name: "delete_relations",
    description: "Delete multiple relations from the knowledge graph",
    inputSchema: {
      type: "object",
      properties: {
        relations: { 
          type: "array", 
          items: {
            type: "object",
            properties: {
              from: { type: "string", description: "The name of the entity where the relation starts" },
              to: { type: "string", description: "The name of the entity where the relation ends" },
              relationType: { type: "string", description: "The type of the relation" },
            },
            required: ["from", "to", "relationType"],
          },
          description: "An array of relations to delete" 
        },
      },
      required: ["relations"],
    },
  },
  {
    name: "read_graph",
    description: "Read the entire knowledge graph",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "search_nodes",
    description: "Search for nodes in the knowledge graph based on a query",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query to match against entity names, types, and observation content" },
      },
      required: ["query"],
    },
  },
  {
    name: "open_nodes",
    description: "Open specific nodes in the knowledge graph by their names",
    inputSchema: {
      type: "object",
      properties: {
        names: {
          type: "array",
          items: { type: "string" },
          description: "An array of entity names to retrieve",
        },
      },
      required: ["names"],
    },
  },
];
