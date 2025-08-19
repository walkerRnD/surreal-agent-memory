export const INIT_DB_QUERY = /* surql */`
DEFINE ANALYZER IF NOT EXISTS word_analyzer TOKENIZERS class FILTERS ascii,lowercase,snowball(english);
DEFINE TABLE IF NOT EXISTS entity_node;

DEFINE INDEX OVERWRITE entity_node_name ON entity_node COLUMNS name
-- DEFINE INDEX IF NOT EXISTS entity_node_name ON entity_node COLUMNS name
SEARCH ANALYZER word_analyzer BM25 HIGHLIGHTS;
REBUILD INDEX entity_node_name ON entity_node;

DEFINE INDEX OVERWRITE entity_node_entityType ON entity_node COLUMNS entityType
-- DEFINE INDEX IF NOT EXISTS entity_node_entityType ON entity_node COLUMNS entityType
SEARCH ANALYZER word_analyzer BM25 HIGHLIGHTS;
REBUILD INDEX entity_node_entityType ON entity_node;


-- DEFINE INDEX IF NOT EXISTS entity_node_observations
--     ON entity_node FIELDS observations
-- FIELDS content SEARCH ANALYZER word_analyzer BM25 HIGHLIGHTS;
`;