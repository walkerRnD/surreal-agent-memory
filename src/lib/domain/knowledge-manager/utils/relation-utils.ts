import type { RelationEntity, Relation } from '../types/relation.type';
import type { RelationV0 } from '../managers/manager-v0';

// Utility function to create entity record ID
export function createEntityId(name: string): string {
  return `entity:⟨${name}⟩`;
}

// Utility function to extract entity name from record ID
export function extractEntityName(recordId: string): string {
  const match = recordId.match(/entity:⟨(.+)⟩/) || recordId.match(/entity:(.+)/);
  return match ? match[1] : recordId;
}

// Utility function to convert RelationEntity or Relation to legacy RelationV0 format
export function convertToLegacyRelation(relation: RelationEntity | Relation): RelationV0 {
  // Extract entity names from RecordId objects or string IDs
  const fromName = relation.in ? extractEntityName(relation.in.toString()) : '';
  const toName = relation.out ? extractEntityName(relation.out.toString()) : '';

  return {
    from: fromName,
    to: toName,
    relationType: relation.relationType,
  };
}
