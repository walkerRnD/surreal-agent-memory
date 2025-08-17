import { RecordId } from 'surrealdb';
import { z } from 'zod';

// DB Entity Schema - For database layer with SurrealDB RecordId
export const RelationEntitySchema = z.object({
  id: z.instanceof(RecordId<'relation'>).optional(),
  in: z.instanceof(RecordId<'entity_node'>).optional(), // SurrealDB uses 'in' for source
  out: z.instanceof(RecordId<'entity_node'>).optional(), // SurrealDB uses 'out' for target
  relationType: z.string().min(1, "Relation type cannot be empty"),
  metadata: z.record(z.any()).optional(), // Additional relation properties
  created_at: z.date().optional(),
});
export type RelationEntity = z.infer<typeof RelationEntitySchema>;

// Presentation Layer Schema - For presentation layer with string id
export const RelationSchema = RelationEntitySchema.omit({ id: true }).extend({
  id: z.string().optional(),
});
export type Relation = z.infer<typeof RelationSchema>;

// Input Schema - For creating relations (legacy format)
export const RelationInputSchema = z.object({
  from: z.string().min(1, "Relation 'from' field cannot be empty"),
  to: z.string().min(1, "Relation 'to' field cannot be empty"),
  relationType: z.string().min(1, "Relation type cannot be empty"),
});
export type RelationInput = z.infer<typeof RelationInputSchema>;

// Relation deletion schema - Array of relations to delete (using legacy format)
export const RelationDeletionSchema = z.array(RelationInputSchema);
export type RelationDeletion = z.infer<typeof RelationDeletionSchema>;