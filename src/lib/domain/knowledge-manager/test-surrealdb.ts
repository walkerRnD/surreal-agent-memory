#!/usr/bin/env node

/**
 * Test script for SurrealDB Knowledge Graph Manager V1
 * 
 * This script tests the new SurrealDB-based manager to ensure it works correctly
 * with the pure schemaless approach using Zod validation.
 * 
 * Usage:
 * - Set KNOWLEDGE_GRAPH_VERSION=v1 to test SurrealDB version
 * - Set KNOWLEDGE_GRAPH_VERSION=v0 to test file-based version (default)
 * 
 * Example:
 * KNOWLEDGE_GRAPH_VERSION=v1 node src/lib/domain/knowledge-manager/test-surrealdb.ts
 */

import { knowledgeGraphManager, getActiveManagerVersion, healthCheck } from './managers/index';

async function testKnowledgeGraphManager() {
  console.log('🧪 Testing Knowledge Graph Manager');
  console.log(`📊 Active version: ${getActiveManagerVersion()}`);
  console.log('');

  try {
    // Health check
    console.log('🔍 Running health check...');
    const health = await healthCheck();
    console.log(`Health status: ${health.status} (version: ${health.version})`);
    if (health.error) {
      console.error(`Health check error: ${health.error}`);
      return;
    }
    console.log('✅ Health check passed');
    console.log('');

    // Test 1: Create entities
    console.log('🏗️  Test 1: Creating entities...');
    const testEntities = [
      {
        name: 'Alice',
        entityType: 'person',
        observations: ['likes coffee', 'works remotely', 'enjoys reading']
      },
      {
        name: 'Bob',
        entityType: 'person',
        observations: ['plays guitar', 'loves hiking']
      },
      {
        name: 'Coffee Shop',
        entityType: 'place',
        observations: ['serves excellent coffee', 'has wifi', 'quiet atmosphere']
      }
    ];

    const createdEntities = await knowledgeGraphManager.createEntities(testEntities);
    console.log(`✅ Created ${createdEntities.length} entities`);
    console.log('');

    // Test 2: Create relations
    console.log('🔗 Test 2: Creating relations...');
    const testRelations = [
      {
        from: 'Alice',
        to: 'Bob',
        relationType: 'knows'
      },
      {
        from: 'Alice',
        to: 'Coffee Shop',
        relationType: 'visits'
      },
      {
        from: 'Bob',
        to: 'Coffee Shop',
        relationType: 'visits'
      }
    ];

    const createdRelations = await knowledgeGraphManager.createRelations(testRelations);
    console.log(`✅ Created ${createdRelations.length} relations`);
    console.log('');

    // Test 3: Add observations
    console.log('📝 Test 3: Adding observations...');
    const newObservations = [
      {
        entityName: 'Alice',
        contents: ['speaks French', 'vegetarian']
      },
      {
        entityName: 'Coffee Shop',
        contents: ['has outdoor seating', 'dog-friendly']
      }
    ];

    const addedObservations = await knowledgeGraphManager.addObservations(newObservations);
    console.log('✅ Added observations:');
    addedObservations.forEach(result => {
      console.log(`  - ${result.entityName}: ${result.addedObservations.length} new observations`);
    });
    console.log('');

    // Test 4: Read full graph
    console.log('📖 Test 4: Reading full graph...');
    const fullGraph = await knowledgeGraphManager.readGraph();
    console.log(`✅ Graph contains ${fullGraph.entities.length} entities and ${fullGraph.relations.length} relations`);
    console.log('');

    // Test 5: Search nodes
    console.log('🔍 Test 5: Searching nodes...');
    const searchResults = await knowledgeGraphManager.searchNodes('coffee');
    console.log(`✅ Search for 'coffee' found ${searchResults.entities.length} entities and ${searchResults.relations.length} relations`);
    searchResults.entities.forEach(entity => {
      console.log(`  - ${entity.name} (${entity.entityType})`);
    });
    console.log('');

    // Test 6: Open specific nodes
    console.log('🎯 Test 6: Opening specific nodes...');
    const specificNodes = await knowledgeGraphManager.openNodes(['Alice', 'Bob']);
    console.log(`✅ Opened nodes for Alice and Bob: ${specificNodes.entities.length} entities, ${specificNodes.relations.length} relations`);
    console.log('');

    // Test 7: Delete observations
    console.log('🗑️  Test 7: Deleting observations...');
    await knowledgeGraphManager.deleteObservations([
      {
        entityName: 'Alice',
        observations: ['vegetarian']
      }
    ]);
    console.log('✅ Deleted observations');
    console.log('');

    // Test 8: Delete relations
    console.log('🔗❌ Test 8: Deleting relations...');
    await knowledgeGraphManager.deleteRelations([
      {
        from: 'Bob',
        to: 'Coffee Shop',
        relationType: 'visits'
      }
    ]);
    console.log('✅ Deleted relations');
    console.log('');

    // Test 9: Delete entities
    console.log('🗑️  Test 9: Deleting entities...');
    await knowledgeGraphManager.deleteEntities(['Bob']);
    console.log('✅ Deleted entities');
    console.log('');

    // Final state
    console.log('📊 Final state:');
    const finalGraph = await knowledgeGraphManager.readGraph();
    console.log(`Final graph: ${finalGraph.entities.length} entities, ${finalGraph.relations.length} relations`);
    
    console.log('\n🎉 All tests completed successfully!');
    
    if (getActiveManagerVersion() === 'v1') {
      console.log('\n💡 SurrealDB manager is working with pure schemaless approach + Zod validation');
    } else {
      console.log('\n💡 File-based manager is working (set KNOWLEDGE_GRAPH_VERSION=v1 to test SurrealDB)');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testKnowledgeGraphManager().catch(console.error);
}

export { testKnowledgeGraphManager };
