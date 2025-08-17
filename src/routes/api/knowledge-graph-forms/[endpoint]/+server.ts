import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { knowledgeGraphManager } from '$lib/domain/knowledge-manager/managers/index';

export const GET: RequestHandler = async ({ params }) => {
  const { endpoint } = params;

  try {
    switch (endpoint) {
      case 'read-graph':
        const graph = await knowledgeGraphManager.readGraph();
        return json(graph);

      default:
        return json({ error: 'Unknown endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error in GET ${endpoint}:`, error);
    return json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ params, request }) => {
  const { endpoint } = params;

  try {
    const body = await request.json();

    switch (endpoint) {
      case 'create-entities':
        const createdEntities = await knowledgeGraphManager.createEntities(body.entities);
        return json(createdEntities);

      case 'create-relations':
        const createdRelations = await knowledgeGraphManager.createRelations(body.relations);
        return json(createdRelations);

      case 'add-observations':
        const addedObservations = await knowledgeGraphManager.addObservations(body.observations);
        return json(addedObservations);

      case 'delete-entities':
        const deletedEntities = await knowledgeGraphManager.deleteEntities(body.entityNames);
        return json(deletedEntities);

      case 'delete-observations':
        const deletedObservations = await knowledgeGraphManager.deleteObservations(body.deletions);
        return json(deletedObservations);

      case 'delete-relations':
        const deletedRelations = await knowledgeGraphManager.deleteRelations(body.relations);
        return json(deletedRelations);

      case 'search-nodes':
        const searchResults = await knowledgeGraphManager.searchNodes(body.query);
        return json(searchResults);

      case 'open-nodes':
        const openResults = await knowledgeGraphManager.openNodes(body.names);
        return json(openResults);

      default:
        return json({ error: 'Unknown endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    return json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};
