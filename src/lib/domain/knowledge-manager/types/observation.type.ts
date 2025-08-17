import { z } from 'zod';

// Input Schema - For adding observations to entities
export const ObservationInputSchema = z.object({
  entityName: z.string().min(1, "Entity name cannot be empty"),
  contents: z.array(z.string().min(1, "Observation content cannot be empty")),
});
export type ObservationInput = z.infer<typeof ObservationInputSchema>;
// Observation deletion schema - Array of entities with specific observations to delete
export const ObservationDeletionSchema = z.array(z.object({
  entityName: z.string().min(1, "Entity name cannot be empty"),
  observations: z.array(z.string().min(1, "Observation content cannot be empty")),
}));
export type ObservationDeletion = z.infer<typeof ObservationDeletionSchema>;