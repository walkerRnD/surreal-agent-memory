import { getDb } from '../../../server/infra/db';
import {
  EntitySchema,
  RelationSchema,
  EntityInputSchema,
  RelationInputSchema,
  ObservationInputSchema,
  EntityDeletionSchema,
  ObservationDeletionSchema,
  RelationDeletionSchema,
  SearchQuerySchema,
  NodeNamesSchema,
  type EntityInput,
  type RelationInput,
  type ObservationInput,
  convertToLegacyRelation,
  createEntityId,
} from '../schemas';

// Import legacy types for backward compatibility
import type { KnowledgeGraph } from './manager-v0';

// SurrealDB-based Knowledge Graph Manager with pure schemaless approach
class KnowledgeGraphManagerV1 {
  
  async createEntities(entities: EntityInput[]): Promise<EntityInput[]> {
    const db = await getDb();
    
    // Validate input with Zod
    const validatedEntities = entities.map(e => EntityInputSchema.parse(e));
    
    const results: EntityInput[] = [];
    
    for (const entity of validatedEntities) {
      try {
        // Check if entity already exists
        const existing = await db.select(createEntityId(entity.name));
        if (existing && existing.length > 0) {
          // Entity already exists, skip it
          continue;
        }
        
        // Pure CREATE - no schema, SurrealDB creates table automatically
        const created = await db.create(createEntityId(entity.name), {
          name: entity.name,
          entityType: entity.entityType,
          observations: entity.observations,
          created_at: new Date(),
          updated_at: new Date(),
        });
        
        if (created) {
          // Validate the created entity and convert back to input format
          const validatedCreated = EntitySchema.parse(created);
          results.push({
            name: validatedCreated.name,
            entityType: validatedCreated.entityType,
            observations: validatedCreated.observations,
          });
        }
      } catch (error) {
        console.error(`Failed to create entity ${entity.name}:`, error);
        // Continue with other entities
      }
    }
    
    return results;
  }

  async createRelations(relations: RelationInput[]): Promise<RelationInput[]> {
    const db = await getDb();
    
    // Validate input with Zod
    const validatedRelations = relations.map(r => RelationInputSchema.parse(r));
    
    const results: RelationInput[] = [];
    
    for (const relation of validatedRelations) {
      try {
        // Check if relation already exists
        const existingQuery = `
          SELECT * FROM knows 
          WHERE in = $from AND out = $to AND relationType = $relationType
        `;
        const existing = await db.query(existingQuery, {
          from: createEntityId(relation.from),
          to: createEntityId(relation.to),
          relationType: relation.relationType,
        });
        
        if (existing && existing.length > 0) {
          // Relation already exists, skip it
          continue;
        }
        
        // Pure RELATE - no table definitions needed, creates 'knows' table automatically
        const relateQuery = `
          RELATE $from->knows->$to 
          SET relationType = $relationType, created_at = time::now()
        `;
        
        const created = await db.query(relateQuery, {
          from: createEntityId(relation.from),
          to: createEntityId(relation.to),
          relationType: relation.relationType,
        });
        
        if (created && created.length > 0) {
          // Validate the created relation and convert back to input format
          const validatedCreated = RelationSchema.parse(created[0]);
          results.push(convertToLegacyRelation(validatedCreated));
        }
      } catch (error) {
        console.error(`Failed to create relation ${relation.from} -> ${relation.to}:`, error);
        // Continue with other relations
      }
    }
    
    return results;
  }

  async addObservations(observations: ObservationInput[]): Promise<{ entityName: string; addedObservations: string[] }[]> {
    const db = await getDb();
    
    // Validate input with Zod
    const validatedObservations = observations.map(o => ObservationInputSchema.parse(o));
    
    const results: { entityName: string; addedObservations: string[] }[] = [];
    
    for (const observation of validatedObservations) {
      try {
        const entityId = createEntityId(observation.entityName);
        
        // Get current entity
        const entity = await db.select(entityId);
        if (!entity) {
          throw new Error(`Entity with name ${observation.entityName} not found`);
        }
        
        const currentEntity = EntitySchema.parse(entity);
        
        // Filter out observations that already exist
        const newObservations = observation.contents.filter(
          content => !currentEntity.observations.includes(content)
        );
        
        if (newObservations.length > 0) {
          // Update entity with new observations
          const updatedObservations = [...currentEntity.observations, ...newObservations];
          
          await db.merge(entityId, {
            observations: updatedObservations,
            updated_at: new Date(),
          });
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

  async deleteEntities(entityNames: string[]): Promise<void> {
    const db = await getDb();
    
    // Validate input with Zod
    const validatedEntityNames = EntityDeletionSchema.parse(entityNames);
    
    for (const entityName of validatedEntityNames) {
      try {
        const entityId = createEntityId(entityName);
        
        // Delete the entity
        await db.delete(entityId);
        
        // Delete all relations involving this entity
        // SurrealDB automatically handles cascade deletion for graph relations
        await db.query(`
          DELETE knows WHERE in = $entityId OR out = $entityId
        `, { entityId });
        
      } catch (error) {
        console.error(`Failed to delete entity ${entityName}:`, error);
        // Continue with other entities
      }
    }
  }

  async deleteObservations(deletions: { entityName: string; observations: string[] }[]): Promise<void> {
    const db = await getDb();
    
    // Validate input with Zod
    const validatedDeletions = ObservationDeletionSchema.parse(deletions);
    
    for (const deletion of validatedDeletions) {
      try {
        const entityId = createEntityId(deletion.entityName);
        
        // Get current entity
        const entity = await db.select(entityId);
        if (!entity) {
          continue; // Entity doesn't exist, skip
        }
        
        const currentEntity = EntitySchema.parse(entity);
        
        // Filter out observations to delete
        const updatedObservations = currentEntity.observations.filter(
          obs => !deletion.observations.includes(obs)
        );
        
        // Update entity with filtered observations
        await db.merge(entityId, {
          observations: updatedObservations,
          updated_at: new Date(),
        });
        
      } catch (error) {
        console.error(`Failed to delete observations from entity ${deletion.entityName}:`, error);
        // Continue with other deletions
      }
    }
  }

  async deleteRelations(relations: RelationInput[]): Promise<void> {
    const db = await getDb();

    // Validate input with Zod
    const validatedRelations = RelationDeletionSchema.parse(relations);

    for (const relation of validatedRelations) {
      try {
        // Delete specific relation
        await db.query(`
          DELETE knows
          WHERE in = $from AND out = $to AND relationType = $relationType
        `, {
          from: createEntityId(relation.from),
          to: createEntityId(relation.to),
          relationType: relation.relationType,
        });

      } catch (error) {
        console.error(`Failed to delete relation ${relation.from} -> ${relation.to}:`, error);
        // Continue with other relations
      }
    }
  }

  async readGraph(): Promise<KnowledgeGraph> {
    const db = await getDb();

    try {
      // Simple SELECT ALL - no schema needed, SurrealDB handles everything
      const entities = await db.select('entity');
      const relations = await db.select('knows');

      // Validate and transform the data
      const validatedEntities = entities.map(e => EntitySchema.parse(e));
      const validatedRelations = relations.map(r => RelationSchema.parse(r));

      // Convert to legacy format for backward compatibility
      const legacyGraph: KnowledgeGraph = {
        entities: validatedEntities.map(e => ({
          name: e.name,
          entityType: e.entityType,
          observations: e.observations,
        })),
        relations: validatedRelations.map(r => convertToLegacyRelation(r)),
      };

      return legacyGraph;
    } catch (error) {
      console.error('Failed to read graph:', error);
      return { entities: [], relations: [] };
    }
  }

  async searchNodes(query: string): Promise<KnowledgeGraph> {
    const db = await getDb();

    // Validate input with Zod
    const validatedQuery = SearchQuerySchema.parse(query);

    try {
      // Pure queries - no indexes, SurrealDB handles optimization internally
      const entitiesResult = await db.query(`
        SELECT * FROM entity
        WHERE name CONTAINS $query
           OR entityType CONTAINS $query
           OR array::any(observations, |$obs| $obs CONTAINS $query)
      `, { query: validatedQuery });

      const entities = entitiesResult || [];

      if (entities.length === 0) {
        return { entities: [], relations: [] };
      }

      // Get entity IDs for relation filtering
      const entityIds = entities.map((e: any) => e.id);

      // Get relations between found entities
      const relationsResult = await db.query(`
        SELECT * FROM knows
        WHERE in IN $entityIds AND out IN $entityIds
      `, { entityIds });

      const relations = relationsResult || [];

      // Validate and transform the data
      const validatedEntities = entities.map(e => EntitySchema.parse(e));
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
      console.error('Failed to search nodes:', error);
      return { entities: [], relations: [] };
    }
  }

  async openNodes(names: string[]): Promise<KnowledgeGraph> {
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
      const validatedEntities = entities.map(e => EntitySchema.parse(e));
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
export type { Entity, Relation, KnowledgeGraph } from './manager-v0.js';
