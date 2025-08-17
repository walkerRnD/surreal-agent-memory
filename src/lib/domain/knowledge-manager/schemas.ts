import { z } from 'zod';

// Core entity schema for SurrealDB + Zod validation
export const EntitySchema = z.object({
  id: z.string().optional(), // SurrealDB record ID (e.g., "entity:abc123")
  name: z.string().min(1, "Entity name cannot be empty"),
  entityType: z.string().min(1, "Entity type cannot be empty"),
  observations: z.array(z.string()),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Core relation schema for SurrealDB graph edges
export const RelationSchema = z.object({
  id: z.string().optional(), // SurrealDB record ID for the relation edge
  in: z.string().min(1, "Relation 'in' field cannot be empty"), // SurrealDB uses 'in' for source
  out: z.string().min(1, "Relation 'out' field cannot be empty"), // SurrealDB uses 'out' for target
  relationType: z.string().min(1, "Relation type cannot be empty"),
  metadata: z.record(z.any()).optional(), // Additional relation properties
  created_at: z.date().optional(),
});

// Knowledge graph container schema
export const KnowledgeGraphSchema = z.object({
  entities: z.array(EntitySchema),
  relations: z.array(RelationSchema),
});

// Input schemas for backward compatibility with existing interface
export const EntityInputSchema = z.object({
  name: z.string().min(1, "Entity name cannot be empty"),
  entityType: z.string().min(1, "Entity type cannot be empty"),
  observations: z.array(z.string()),
});

export const RelationInputSchema = z.object({
  from: z.string().min(1, "Relation 'from' field cannot be empty"),
  to: z.string().min(1, "Relation 'to' field cannot be empty"),
  relationType: z.string().min(1, "Relation type cannot be empty"),
});

// Observation input schema
export const ObservationInputSchema = z.object({
  entityName: z.string().min(1, "Entity name cannot be empty"),
  contents: z.array(z.string().min(1, "Observation content cannot be empty")),
});

// Deletion schemas
export const EntityDeletionSchema = z.array(z.string().min(1, "Entity name cannot be empty"));

export const ObservationDeletionSchema = z.array(z.object({
  entityName: z.string().min(1, "Entity name cannot be empty"),
  observations: z.array(z.string().min(1, "Observation content cannot be empty")),
}));

export const RelationDeletionSchema = z.array(RelationInputSchema);

// Search and query schemas
export const SearchQuerySchema = z.string().min(1, "Search query cannot be empty");
export const NodeNamesSchema = z.array(z.string().min(1, "Node name cannot be empty"));

// Infer TypeScript types from Zod schemas
export type Entity = z.infer<typeof EntitySchema>;
export type Relation = z.infer<typeof RelationSchema>;
export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;

// Input types for backward compatibility
export type EntityInput = z.infer<typeof EntityInputSchema>;
export type RelationInput = z.infer<typeof RelationInputSchema>;
export type ObservationInput = z.infer<typeof ObservationInputSchema>;

// Utility function to convert legacy relation format to SurrealDB format
export function convertLegacyRelation(legacyRelation: RelationInput): Omit<Relation, 'id' | 'created_at'> {
  return {
    in: `entity:⟨${legacyRelation.from}⟩`,
    out: `entity:⟨${legacyRelation.to}⟩`,
    relationType: legacyRelation.relationType,
  };
}

// Utility function to convert SurrealDB relation back to legacy format
export function convertToLegacyRelation(surrealRelation: Relation): RelationInput {
  // Extract entity names from SurrealDB record IDs
  const fromMatch = surrealRelation.in.match(/entity:⟨(.+)⟩/) || surrealRelation.in.match(/entity:(.+)/);
  const toMatch = surrealRelation.out.match(/entity:⟨(.+)⟩/) || surrealRelation.out.match(/entity:(.+)/);
  
  return {
    from: fromMatch ? fromMatch[1] : surrealRelation.in,
    to: toMatch ? toMatch[1] : surrealRelation.out,
    relationType: surrealRelation.relationType,
  };
}

// Utility function to create entity record ID
export function createEntityId(name: string): string {
  return `entity:⟨${name}⟩`;
}

// Utility function to extract entity name from record ID
export function extractEntityName(recordId: string): string {
  const match = recordId.match(/entity:⟨(.+)⟩/) || recordId.match(/entity:(.+)/);
  return match ? match[1] : recordId;
}
