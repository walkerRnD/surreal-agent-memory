import { z } from 'zod';
import { EntityNodeEntitySchema, EntityNodeSchema } from './entity-node.type';
import { RelationEntitySchema, RelationSchema } from './relation.type';

// Knowledge graph DB container schema
export const KnowledgeGraphEntitySchema = z.object({
  entities: z.array(EntityNodeEntitySchema),
  relations: z.array(RelationEntitySchema),
});
export type KnowledgeGraphEntity = z.infer<typeof KnowledgeGraphEntitySchema>;

// Knowledge graph presentation schema
export const KnowledgeGraphSchema = z.object({
  entities: z.array(EntityNodeSchema),
  relations: z.array(RelationSchema),
});
export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;
