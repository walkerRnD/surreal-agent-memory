import { getDb } from '../../../server/infra/db';
import { EntityNodeRepo } from '../repository/entity-node.repo';
import { RelationRepo } from '../repository/relation.repo';
import { EntityDeletionSchema, EntityNodeInputSchema, EntityNodeSchema, type EntityInput } from '../types/entity-node.type';
import { type ObservationInput, ObservationInputSchema, ObservationDeletionSchema } from '../types/observation.type';
import { SearchQuerySchema, NodeNamesSchema } from '../types/query.type';
import { RelationDeletionSchema, RelationInputSchema, RelationSchema, type RelationInput } from '../types/relation.type';
import { createEntityId, convertToLegacyRelation } from '../utils/relation-utils';

// Import legacy types for backward compatibility
import type { KnowledgeGraphV0 } from './manager-v0';

// SurrealDB-based Knowledge Graph Manager with pure schemaless approach
class KnowledgeGraphManagerV1 {

  async createEntities(entities: EntityInput[]): Promise<EntityInput[]> {
    const validatedEntities = entities.map(e => EntityNodeInputSchema.parse(e));
    const db = await getDb();
    const entityRepo = new EntityNodeRepo(db);

    const results: EntityInput[] = [];
    for (const entity of validatedEntities) {
      try {
        const existing = await entityRepo.findByName(entity.name);
        if (existing !== null) continue;

        const created = await entityRepo.create(entity);
        results.push({
          name: created.name,
          entityType: created.entityType,
          observations: created.observations,
        });
      } catch (error) {
        console.error(`Failed to create entity ${entity.name}:`, error);
      }
    }

    return results;
  }

  async createRelations(relations: RelationInput[]): Promise<RelationInput[]> {
    const validatedRelations = relations.map(r => RelationInputSchema.parse(r));
    const db = await getDb();
    const relationRepo = new RelationRepo(db);

    const results: RelationInput[] = [];
    for (const relation of validatedRelations) {
      try {
        const exists = await relationRepo.exists(relation);
        if (exists) continue;

        const created = await relationRepo.create(relation);
        if (created) results.push(relation);

      } catch (error) {
        console.error(`Failed to create relation ${relation.from} -> ${relation.to}:`, error);
      }
    }

    return results;
  }

  async addObservations(observations: ObservationInput[]): Promise<{ entityName: string; addedObservations: string[] }[]> {
    const validatedObservations = observations.map(o => ObservationInputSchema.parse(o));
    const db = await getDb();
    const entityRepo = new EntityNodeRepo(db);

    const results: { entityName: string; addedObservations: string[] }[] = [];

    for (const observation of validatedObservations) {
      try {
        const currentEntity = await entityRepo.findByName(observation.entityName);
        if (!currentEntity) {
          throw new Error(`Entity with name ${observation.entityName} not found`);
        }

        // Filter out observations that already exist
        const newObservations = observation.contents.filter(
          content => !currentEntity.observations.includes(content)
        );

        if (newObservations.length > 0) {
          // Update entity with new observations using the repository
          const updatedObservations = [...currentEntity.observations, ...newObservations];
          const updated = await entityRepo.updateObservations(observation.entityName, updatedObservations);

          if (!updated) {
            throw new Error(`Failed to update observations for entity ${observation.entityName}`);
          }
        }

        results.push({
          entityName: observation.entityName,
          addedObservations: newObservations,
        });
      } catch (error) {
        console.error(`Failed to add observations to entity ${observation.entityName}:`, error);
        results.push({
          entityName: observation.entityName,
          addedObservations: [],
        });
      }
    }

    return results;
  }

  async deleteEntities(entityNames: string[]): Promise<string[]> {
    const validatedEntityNames = EntityDeletionSchema.parse(entityNames);
    const db = await getDb();
    const entityRepo = new EntityNodeRepo(db);
    const relationRepo = new RelationRepo(db);

    const results: string[] = [];

    for (const entityName of validatedEntityNames) {
      try {
        // Check if entity exists before attempting deletion
        const existing = await entityRepo.findByName(entityName);
        if (!existing) {
          console.warn(`Entity ${entityName} not found, skipping deletion`);
          continue;
        }

        // Delete all relations involving this entity first
        const relationsDeleted = await relationRepo.deleteByEntity(entityName);
        if (!relationsDeleted) {
          console.warn(`Failed to delete relations for entity ${entityName}, but continuing with entity deletion`);
        }

        // Delete the entity using the repository method
        const entityDeleted = await entityRepo.delete(entityName);
        if (!entityDeleted) {
          throw new Error(`Failed to delete entity ${entityName}`);
        }

        results.push(entityName);
      } catch (error) {
        console.error(`Failed to delete entity ${entityName}:`, error);
        // Continue with other entities
      }
    }

    return results;
  }

  async deleteObservations(deletions: { entityName: string; observations: string[] }[]): Promise<{ entityName: string; deletedObservations: string[] }[]> {
    const validatedDeletions = ObservationDeletionSchema.parse(deletions);
    const db = await getDb();
    const entityRepo = new EntityNodeRepo(db);

    const results: { entityName: string; deletedObservations: string[] }[] = [];

    for (const deletion of validatedDeletions) {
      try {
        // Get current entity using repository
        const currentEntity = await entityRepo.findByName(deletion.entityName);
        if (!currentEntity) {
          console.warn(`Entity ${deletion.entityName} not found, skipping observation deletion`);
          results.push({
            entityName: deletion.entityName,
            deletedObservations: [],
          });
          continue;
        }

        // Filter out observations to delete and track what was actually deleted
        const observationsToDelete = deletion.observations.filter(
          obs => currentEntity.observations.includes(obs)
        );

        if (observationsToDelete.length === 0) {
          results.push({
            entityName: deletion.entityName,
            deletedObservations: [],
          });
          continue;
        }

        const updatedObservations = currentEntity.observations.filter(
          obs => !deletion.observations.includes(obs)
        );

        // Update entity with filtered observations using repository method
        const updated = await entityRepo.updateObservations(deletion.entityName, updatedObservations);
        if (!updated) {
          throw new Error(`Failed to update observations for entity ${deletion.entityName}`);
        }

        results.push({
          entityName: deletion.entityName,
          deletedObservations: observationsToDelete,
        });

      } catch (error) {
        console.error(`Failed to delete observations from entity ${deletion.entityName}:`, error);
        results.push({
          entityName: deletion.entityName,
          deletedObservations: [],
        });
      }
    }

    return results;
  }

  async deleteRelations(relations: RelationInput[]): Promise<RelationInput[]> {
    const validatedRelations = RelationDeletionSchema.parse(relations);
    const db = await getDb();
    const relationRepo = new RelationRepo(db);

    const results: RelationInput[] = [];

    for (const relation of validatedRelations) {
      try {
        // Check if relation exists before attempting deletion
        const exists = await relationRepo.exists(relation);
        if (!exists) {
          console.warn(`Relation ${relation.from} -> ${relation.to} (${relation.relationType}) not found, skipping deletion`);
          continue;
        }

        // Delete specific relation using repository method
        const deleted = await relationRepo.delete(relation);
        if (!deleted) {
          throw new Error(`Failed to delete relation ${relation.from} -> ${relation.to}`);
        }

        results.push(relation);

      } catch (error) {
        console.error(`Failed to delete relation ${relation.from} -> ${relation.to}:`, error);
        // Continue with other relations
      }
    }

    return results;
  }

  async readGraph(): Promise<KnowledgeGraphV0> {
    const db = await getDb();
    const entityRepo = new EntityNodeRepo(db);
    const relationRepo = new RelationRepo(db);

    try {
      // Use repository methods to get all data
      const entities = await entityRepo.findAll();
      const relations = await relationRepo.findAll();

      // Convert to legacy format for backward compatibility
      const legacyGraph: KnowledgeGraphV0 = {
        entities: entities.map(e => ({
          name: e.name,
          entityType: e.entityType,
          observations: e.observations,
        })),
        relations: relations.map(r => convertToLegacyRelation(r)),
      };

      return legacyGraph;
    } catch (error) {
      console.error('Failed to read graph:', error);
      return { entities: [], relations: [] };
    }
  }

  async searchNodes(query: string): Promise<KnowledgeGraphV0> {
    const validatedQuery = SearchQuerySchema.parse(query);
    const db = await getDb();
    const entityRepo = new EntityNodeRepo(db);
    const relationRepo = new RelationRepo(db);

    try {
      // Search entities using repository method
      const entities = await entityRepo.search(validatedQuery);

      if (entities.length === 0) {
        return { entities: [], relations: [] };
      }

      // Get entity IDs for relation filtering
      const entityIds = entities.map(e => e.id).filter(id => id !== undefined);

      // Get relations between found entities using repository method
      const relations = await relationRepo.findByEntities(entityIds);

      // Convert to legacy format for backward compatibility
      const legacyGraph: KnowledgeGraphV0 = {
        entities: entities.map(e => ({
          name: e.name,
          entityType: e.entityType,
          observations: e.observations,
        })),
        relations: relations.map(r => convertToLegacyRelation(r)),
      };

      return legacyGraph;
    } catch (error) {
      console.error('Failed to search nodes:', error);
      return { entities: [], relations: [] };
    }
  }

  async openNodes(names: string[]): Promise<KnowledgeGraphV0> {
    const db = await getDb();

    // Validate input with Zod
    const validatedNames = NodeNamesSchema.parse(names);

    try {
      // Get specific entities by name
      const entityIds = validatedNames.map(name => createEntityId(name));

      const entitiesResult = await db.query(`
        SELECT * FROM entity WHERE id IN $entityIds
      `, { entityIds });

      const entities = entitiesResult || [];

      if (entities.length === 0) {
        return { entities: [], relations: [] };
      }

      // Get relations between the specified entities
      const relationsResult = await db.query(`
        SELECT * FROM knows
        WHERE in IN $entityIds AND out IN $entityIds
      `, { entityIds });

      const relations = relationsResult || [];

      // Validate and transform the data
      const validatedEntities = entities.map(e => EntityNodeSchema.parse(e));
      const validatedRelations = relations.map(r => RelationSchema.parse(r));

      // Convert to legacy format for backward compatibility
      const legacyGraph = {
        entities: validatedEntities.map(e => ({
          name: e.name,
          entityType: e.entityType,
          observations: e.observations,
        })),
        relations: validatedRelations.map(r => convertToLegacyRelation(r)),
      };

      return legacyGraph;
    } catch (error) {
      console.error('Failed to open nodes:', error);
      return { entities: [], relations: [] };
    }
  }
}

// Export the new manager instance
export const knowledgeGraphManagerV1 = new KnowledgeGraphManagerV1();

// Export types for backward compatibility
export type { EntityNode as Entity, RelationV0 as Relation, KnowledgeGraphV0 as KnowledgeGraph } from './manager-v0.js';
