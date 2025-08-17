import type { Relation, RelationInput } from '../types/relation.type';

// Utility function to convert legacy relation format to SurrealDB format
export function convertLegacyRelation(legacyRelation: RelationInput): Omit<Relation, 'id' | 'created_at'> {
  return {
    in: `entity:⟨${legacyRelation.from}⟩`,
    out: `entity:⟨${legacyRelation.to}⟩`,
    relationType: legacyRelation.relationType,
  };
}

// Utility function to convert SurrealDB relation back to legacy format
export function convertToLegacyRelation(surrealRelation: Relation): RelationInput {
  // Extract entity names from SurrealDB record IDs
  const fromMatch = surrealRelation.in.match(/entity:⟨(.+)⟩/) || surrealRelation.in.match(/entity:(.+)/);
  const toMatch = surrealRelation.out.match(/entity:⟨(.+)⟩/) || surrealRelation.out.match(/entity:(.+)/);

  return {
    from: fromMatch ? fromMatch[1] : surrealRelation.in,
    to: toMatch ? toMatch[1] : surrealRelation.out,
    relationType: surrealRelation.relationType,
  };
}

// Utility function to create entity record ID
export function createEntityId(name: string): string {
  return `entity:⟨${name}⟩`;
}

// Utility function to extract entity name from record ID
export function extractEntityName(recordId: string): string {
  const match = recordId.match(/entity:⟨(.+)⟩/) || recordId.match(/entity:(.+)/);
  return match ? match[1] : recordId;
}
