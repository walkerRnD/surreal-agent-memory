import type { EntityInput, EntityNode, EntityNodeEntity } from "../types/entity-node.type";
import { surql, Surreal } from "surrealdb";

export class EntityNodeRepo {

  constructor(private db: Surreal) { }
  async create(entity: EntityInput): Promise<EntityNodeEntity> {
    const [created] = await this.db.query<[EntityNodeEntity[]]>(/* surql */`
      CREATE entity_node
      SET name = $name,
      entityType = $entityType,
      observations = $observations,
      created_at = time::now(),
      updated_at = time::now()
    `, entity);
    return created[0];
  }

  async findByName(name: string): Promise<EntityNodeEntity | null> {
    const [entityNodes] = await this.db.query<[EntityNodeEntity]>(
      'SELECT * FROM ONLY entity_node WHERE name = $name LIMIT 1', { name }
    );
    return entityNodes || null;
  }

  async findManyByName(name: string): Promise<EntityNodeEntity[] | null> {
    const [entityNodes] = await this.db.query<[EntityNodeEntity[]]>(
      'SELECT * FROM entity_node WHERE name = $name', { name }
    );
    return entityNodes;
  }

  async updateObservations(name: string, newObservations: string[]): Promise<EntityNodeEntity | null> {
    try {
      const [updated] = await this.db.query<[EntityNodeEntity[]]>(/* surql */`
        UPDATE entity_node
        SET observations = $observations,
            updated_at = time::now()
        WHERE name = $name
        RETURN AFTER
      `, { name, observations: newObservations });

      return updated.length > 0 ? updated[0] : null;
    } catch (error) {
      console.error(`Failed to update observations for entity ${name}:`, error);
      return null;
    }
  }

  async delete(name: string): Promise<boolean> {
    try {
      const [deleted] = await this.db.query<[EntityNodeEntity[]]>(/* surql */`
        DELETE entity_node WHERE name = $name
      `, { name });

      return deleted && deleted.length > 0;
    } catch (error) {
      console.error(`Failed to delete entity ${name}:`, error);
      return false;
    }
  }

  async findAll(): Promise<EntityNodeEntity[]> {
    try {
      const [entities] = await this.db.query<[EntityNodeEntity[]]>(/* surql */`
        SELECT * FROM entity_node
      `);
      return entities || [];
    } catch (error) {
      console.error('Failed to find all entities:', error);
      return [];
    }
  }

  async search(query: string): Promise<EntityNodeEntity[]> {
    try {
      const [entities] = await this.db.query<[EntityNodeEntity[]]>(/* surql */`
        SELECT * FROM entity_node
        WHERE name @@ $query
           OR entityType @@ $query
           OR array::any(observations, |$obs| $obs CONTAINS $query)
      `, { query });
      return entities || [];
    } catch (error) {
      console.error(`Failed to search entities with query "${query}":`, error);
      return [];
    }
  }

  async findByNames(names: string[]): Promise<EntityNodeEntity[]> {
    try {
      const [entities] = await this.db.query<[EntityNodeEntity[]]>(/* surql */`
        SELECT * FROM entity_node WHERE name IN $names
      `, { names });
      return entities || [];
    } catch (error) {
      console.error(`Failed to find entities by names:`, error);
      return [];
    }
  }
}