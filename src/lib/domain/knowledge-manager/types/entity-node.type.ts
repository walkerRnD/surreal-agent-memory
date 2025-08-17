import { RecordId } from 'surrealdb';
import { z } from 'zod';

// DB Entity Schema
export const EntityNodeEntitySchema = z.object({
  id: z.instanceof(RecordId<'entity_node'>).optional(),
  name: z.string().min(1, "Entity name cannot be empty"),
  entityType: z.string().min(1, "Entity type cannot be empty"),
  observations: z.array(z.string()),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
export type EntityNodeEntity = z.infer<typeof EntityNodeEntitySchema>;

// Presentation Layer Schema
export const EntityNodeSchema = EntityNodeEntitySchema.omit({ id: true }).extend({
  id: z.string().optional(),
});
export type EntityNode = z.infer<typeof EntityNodeSchema>;

// Input Schema
export const EntityNodeInputSchema = z.object({
  name: z.string().min(1, "Entity name cannot be empty"),
  entityType: z.string().min(1, "Entity type cannot be empty"),
  observations: z.array(z.string()),
});
export type EntityInput = z.infer<typeof EntityNodeInputSchema>;

// Entity deletion schema - Array of entity names to delete
export const EntityDeletionSchema = z.array(z.string().min(1, "Entity name cannot be empty"));
export type EntityDeletion = z.infer<typeof EntityDeletionSchema>;