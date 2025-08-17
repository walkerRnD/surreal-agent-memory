import type { RelationInput, Relation, RelationEntity } from "../types/relation.type";
import { RecordId, Surreal } from "surrealdb";
import { EntityNodeRepo } from "./entity-node.repo";
import type { EntityNodeEntity } from "../types/entity-node.type";


export class RelationRepo {
  private entityRepo: EntityNodeRepo;
  constructor(private db: Surreal) {
    this.entityRepo = new EntityNodeRepo(this.db);
  }

  private async getNodeEntity(entityName: string): Promise<EntityNodeEntity> {
    const result = await this.entityRepo.findByName(entityName);
    if (!result) {
      throw new Error(`Entity not found ${entityName}`);
    }
    return result;
  }

  async getFromToEntities(relation: RelationInput): Promise<[EntityNodeEntity, EntityNodeEntity]> {
    const [from, to] = await Promise.all([
      this.getNodeEntity(relation.from),
      this.getNodeEntity(relation.to),
    ]);
    return [from, to];
  }

  async create(relation: RelationInput): Promise<RelationEntity | null> {
    try {
      const [from, to] = await this.getFromToEntities(relation);
      const fromId = from.id;
      const toId = to.id;

      const [created] = await this.db.query<[RelationEntity]>(/* surql */`
        RELATE $from->relation->$to 
        SET relationType = $relationType, 
            created_at = time::now()
      `, {
        from: fromId,
        to: toId,
        relationType: relation.relationType,
      });

      return created;
    } catch (error) {
      console.error(`Failed to create relation ${relation.from} -> ${relation.to}:`, error);
      return null;
    }
  }

  async exists(relation: RelationInput): Promise<boolean> {
    try {
      const [from, to] = await this.getFromToEntities(relation);
      const fromId = from.id;
      const toId = to.id;

      const [existing] = await this.db.query<[RelationEntity[]]>(/* surql */`
        SELECT * FROM relation 
        WHERE in = $from AND out = $to AND relationType = $relationType
      `, {
        from: fromId,
        to: toId,
        relationType: relation.relationType,
      });

      return existing && existing.length > 0;
    } catch (error) {
      console.error(`Failed to check if relation exists ${relation.from} -> ${relation.to}:`, error);
      return false;
    }
  }

  async delete(relation: RelationInput): Promise<boolean> {
    try {
      const [from, to] = await this.getFromToEntities(relation);
      const fromId = from.id;
      const toId = to.id;

      const [deleted] = await this.db.query<[Relation[]]>(/* surql */`
        DELETE relation
        WHERE in = $from AND out = $to AND relationType = $relationType
      `, {
        from: fromId,
        to: toId,
        relationType: relation.relationType,
      });

      return deleted && deleted.length > 0;
    } catch (error) {
      console.error(`Failed to delete relation ${relation.from} -> ${relation.to}:`, error);
      return false;
    }
  }

  async deleteByEntity(entityName: string): Promise<boolean> {
    try {
      const entityId = `entity:⟨${entityName}⟩`;

      const [deleted] = await this.db.query<[Relation[]]>(/* surql */`
        DELETE relation WHERE in = $entityId OR out = $entityId
      `, { entityId });

      return true; // SurrealDB doesn't return error if no relations found
    } catch (error) {
      console.error(`Failed to delete relations for entity ${entityName}:`, error);
      return false;
    }
  }

  async findByEntities(entityIds: RecordId<'entity_node'>[]): Promise<RelationEntity[]> {
    try {
      const [relations] = await this.db.query<[RelationEntity[]]>(/* surql */`
        SELECT * FROM relation
        WHERE in IN $entityIds AND out IN $entityIds
      `, { entityIds });

      return relations || [];
    } catch (error) {
      console.error('Failed to find relations by entities:', error);
      return [];
    }
  }

  async findAll(): Promise<RelationEntity[]> {
    try {
      const [relations] = await this.db.query<[RelationEntity[]]>(/* surql */`
        SELECT * FROM relation
      `);
      return relations || [];
    } catch (error) {
      console.error('Failed to find all relations:', error);
      return [];
    }
  }
}
