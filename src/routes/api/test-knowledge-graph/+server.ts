import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { knowledgeGraphManager, getActiveManagerVersion, healthCheck } from '../../../lib/domain/knowledge-manager/managers/index';

export const GET: RequestHandler = async () => {
  try {
    console.log('🧪 Testing Knowledge Graph Manager');
    console.log(`📊 Active version: ${getActiveManagerVersion()}`);

    const results: any = {
      version: getActiveManagerVersion(),
      tests: [],
      summary: {
        passed: 0,
        failed: 0,
        total: 0
      }
    };

    // Test 1: Health check
    try {
      console.log('🔍 Running health check...');
      const health = await healthCheck();
      results.tests.push({
        name: 'Health Check',
        status: health.status === 'healthy' ? 'passed' : 'failed',
        details: health
      });
      if (health.status === 'healthy') results.summary.passed++;
      else results.summary.failed++;
    } catch (error) {
      results.tests.push({
        name: 'Health Check',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
      results.summary.failed++;
    }
    results.summary.total++;

    // Test 2: Create entities
    try {
      console.log('🏗️  Test: Creating entities...');
      const testEntities = [
        {
          name: 'TestUser1',
          entityType: 'person',
          observations: ['likes testing', 'uses SvelteKit']
        },
        {
          name: 'TestUser2',
          entityType: 'person',
          observations: ['enjoys coding', 'loves SurrealDB']
        }
      ];

      const createdEntities = await knowledgeGraphManager.createEntities(testEntities);
      results.tests.push({
        name: 'Create Entities',
        status: 'passed',
        details: { created: createdEntities.length, entities: createdEntities }
      });
      results.summary.passed++;
    } catch (error) {
      results.tests.push({
        name: 'Create Entities',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
      results.summary.failed++;
    }
    results.summary.total++;

    // Test 3: Create relations
    try {
      console.log('🔗 Test: Creating relations...');
      const testRelations = [
        {
          from: 'TestUser1',
          to: 'TestUser2',
          relationType: 'collaborates_with'
        }
      ];

      const createdRelations = await knowledgeGraphManager.createRelations(testRelations);
      results.tests.push({
        name: 'Create Relations',
        status: 'passed',
        details: { created: createdRelations.length, relations: createdRelations }
      });
      results.summary.passed++;
    } catch (error) {
      results.tests.push({
        name: 'Create Relations',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
      results.summary.failed++;
    }
    results.summary.total++;

    // Test 4: Read graph
    try {
      console.log('📖 Test: Reading graph...');
      const graph = await knowledgeGraphManager.readGraph();
      results.tests.push({
        name: 'Read Graph',
        status: 'passed',
        details: { 
          entities: graph.entities.length, 
          relations: graph.relations.length,
          sample_entities: graph.entities.slice(0, 3).map(e => ({ name: e.name, type: e.entityType }))
        }
      });
      results.summary.passed++;
    } catch (error) {
      results.tests.push({
        name: 'Read Graph',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
      results.summary.failed++;
    }
    results.summary.total++;

    // Test 5: Search nodes
    try {
      console.log('🔍 Test: Searching nodes...');
      const searchResults = await knowledgeGraphManager.searchNodes('testing');
      results.tests.push({
        name: 'Search Nodes',
        status: 'passed',
        details: { 
          found_entities: searchResults.entities.length,
          found_relations: searchResults.relations.length,
          entities: searchResults.entities.map(e => ({ name: e.name, type: e.entityType }))
        }
      });
      results.summary.passed++;
    } catch (error) {
      results.tests.push({
        name: 'Search Nodes',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
      results.summary.failed++;
    }
    results.summary.total++;

    // Test 6: Add observations
    try {
      console.log('📝 Test: Adding observations...');
      const newObservations = [
        {
          entityName: 'TestUser1',
          contents: ['completed API test', 'verified SurrealDB integration']
        }
      ];

      const addedObservations = await knowledgeGraphManager.addObservations(newObservations);
      results.tests.push({
        name: 'Add Observations',
        status: 'passed',
        details: { observations_added: addedObservations }
      });
      results.summary.passed++;
    } catch (error) {
      results.tests.push({
        name: 'Add Observations',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      });
      results.summary.failed++;
    }
    results.summary.total++;

    console.log(`✅ Tests completed: ${results.summary.passed}/${results.summary.total} passed`);

    return json({
      success: true,
      message: `Knowledge Graph Manager ${getActiveManagerVersion()} test completed`,
      results
    });

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      version: getActiveManagerVersion()
    }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action, fileContent, fileName } = await request.json();

    if (action === 'cleanup') {
      // Clean up test data
      await knowledgeGraphManager.deleteEntities(['TestUser1', 'TestUser2']);

      return json({
        success: true,
        message: 'Test data cleaned up successfully'
      });
    }

    if (action === 'migrate') {
      if (fileContent && fileName) {
        // Import from file content
        const { migrateFromFileContent } = await import('../../../lib/domain/knowledge-manager/managers/index');
        await migrateFromFileContent(fileContent, fileName);

        return json({
          success: true,
          message: `Import from file "${fileName}" completed successfully`
        });
      } else {
        // Standard migration from V0 to V1
        const { migrateFromV0ToV1 } = await import('../../../lib/domain/knowledge-manager/managers/index');
        await migrateFromV0ToV1();

        return json({
          success: true,
          message: 'Migration from V0 to V1 completed successfully'
        });
      }
    }

    return json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 });

  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
};
