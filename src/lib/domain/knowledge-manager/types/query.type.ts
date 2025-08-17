import { z } from 'zod';

// Search query schema - For searching entities and relations
export const SearchQuerySchema = z.string().min(1, "Search query cannot be empty");
export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// Node names schema - Array of node names for batch operations
export const NodeNamesSchema = z.array(z.string().min(1, "Node name cannot be empty"));
export type NodeNames = z.infer<typeof NodeNamesSchema>;
