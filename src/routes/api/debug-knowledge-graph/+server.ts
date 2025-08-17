import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { knowledgeGraphManager } from '../../../lib/domain/knowledge-manager/managers/index';
import { getDb } from '../../../lib/server/infra/db';

export const GET: RequestHandler = async () => {
  try {
    console.log('🔍 Loading debug data for Knowledge Graph');
    console.log('🔍 Environment KNOWLEDGE_GRAPH_VERSION:', process.env.KNOWLEDGE_GRAPH_VERSION);


    let debugData: any = {
      dbStatus: 'unknown',
      entityCount: 0,
      relationCount: 0,
      rawEntities: [],
      rawRelations: [],
      allTables: [],
      processedGraph: null,
      debugInfo: {
        timestamp: new Date().toISOString(),
        environment: process.env.KNOWLEDGE_GRAPH_VERSION || 'not set',
      }
    };

    try {
      const db = await getDb();
      debugData.dbStatus = 'connected';

      console.log('🔍 Debug: Querying raw entities from SurrealDB...');

      // Get raw entities directly from SurrealDB with explicit query
      try {
        const entityQueryResult = await db.query('SELECT * FROM entity');
        console.log('🔍 Debug: Raw entity query result:', entityQueryResult);
        debugData.rawEntities = entityQueryResult?.[0] || [];
        debugData.entityCount = debugData.rawEntities.length;
        console.log(`🔍 Debug: Found ${debugData.entityCount} raw entities`);
      } catch (entityError) {
        console.error('🔍 Debug: Entity query failed:', entityError);
        debugData.rawEntities = [];
        debugData.entityCount = 0;
      }

      // Get raw relations directly from SurrealDB with explicit query
      try {
        const relationQueryResult = await db.query('SELECT * FROM knows');
        console.log('🔍 Debug: Raw relation query result:', relationQueryResult);
        debugData.rawRelations = relationQueryResult?.[0] || [];
        debugData.relationCount = debugData.rawRelations.length;
        console.log(`🔍 Debug: Found ${debugData.relationCount} raw relations`);
      } catch (relationError) {
        console.error('🔍 Debug: Relation query failed:', relationError);
        debugData.rawRelations = [];
        debugData.relationCount = 0;
      }

      // Get database info
      try {
        const infoResult = await db.query('INFO FOR DB');
        console.log('🔍 Debug: Database info result:', infoResult);
        debugData.allTables = infoResult || [];
      } catch (infoError) {
        console.warn('🔍 Debug: Could not get database info:', infoError);
        // Try to get all records from known tables
        try {
          const allRecordsResult = await db.query(`
              LET $entities = (SELECT * FROM entity);
              LET $relations = (SELECT * FROM knows);
              RETURN { entities: $entities, relations: $relations };
            `);
          console.log('🔍 Debug: All records result:', allRecordsResult);
          debugData.allTables = allRecordsResult || [];
        } catch (altError) {
          console.warn('🔍 Debug: Alternative query failed:', altError);
          debugData.allTables = [];
        }
      }

      // Get processed graph using the manager (for comparison)
      try {
        debugData.processedGraph = await knowledgeGraphManager.readGraph();
        console.log('🔍 Debug: Processed graph:', debugData.processedGraph);
      } catch (processError) {
        console.error('🔍 Debug: Failed to get processed graph:', processError);
        debugData.processedGraph = { entities: [], relations: [] };
      }

    } catch (dbError) {
      console.error('🔍 Debug: Database connection error:', dbError);
      debugData.dbStatus = `error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`;
    }

    return json({
      success: true,
      data: debugData
    });

  } catch (error) {
    console.error('Debug data loading failed:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action } = await request.json();

    if (action === 'clear') {
      const db = await getDb();

      await db.query('DELETE entity');
      await db.query('DELETE knows');

      return json({
        success: true,
        message: 'SurrealDB data cleared successfully'
      });
    }

    return json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 });

  } catch (error) {
    console.error('Debug operation failed:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};
