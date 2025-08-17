import type { EntityInput, EntityNode } from "../types/entity-node.type";
import { surql, Surreal } from "surrealdb";

export class EntityNodeRepo {

  constructor(private db: Surreal) { }
  async create(entity: EntityInput): Promise<EntityNode> {
    // TODO: Implement
    const [created] = await this.db.query<[EntityNode[]]>(/* surql */`
      CREATE entity_node
      SET name = $name,
      entityType = $entityType,
      observations = $observations,
      created_at = time::now(),
      updated_at = time::now()
    `, entity);
    return created[0];
  }

  async findByName(name: string): Promise<EntityNode[] | null> {
    const [entityNodes] = await this.db.query<[EntityNode[]]>(
      'SELECT * FROM entity_node WHERE name = $name', { name }
    );
    return entityNodes.length > 0 ? entityNodes : null;
  }
}