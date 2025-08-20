import type { RequestHandler } from './$types'
import { createMcpHandler } from '@vercel/mcp-adapter'
import {
	createEntitiesSchema,
	createRelationsSchema,
	addObservationsSchema,
	deleteEntitiesSchema,
	deleteObservationsSchema,
	deleteRelationsSchema,
	readGraphSchema,
	searchNodesSchema,
	openNodesSchema,
	createEntitiesHandler,
	createRelationsHandler,
	addObservationsHandler,
	deleteEntitiesHandler,
	deleteObservationsHandler,
	deleteRelationsHandler,
	readGraphHandler,
	searchNodesHandler,
	openNodesHandler,
} from '../../../lib/domain/knowledge-manager/tools'

const handler = createMcpHandler(
	(server) => {
		// Knowledge graph management tools
		server.tool(
			'create_entities_to_memory',
			'Create multiple new entities in the knowledge graph',
			createEntitiesSchema,
			createEntitiesHandler,
		)

		server.tool(
			'create_relations_to_memory',
			'Create multiple new relations between entities in the knowledge graph. Relations should be in active voice',
			createRelationsSchema,
			createRelationsHandler,
		)

		server.tool(
			'add_observations_to_memory',
			'Add new observations to existing entities in the knowledge graph',
			addObservationsSchema,
			addObservationsHandler,
		)

		server.tool(
			'delete_entities_to_memory',
			'Delete multiple entities and their associated relations from the knowledge graph',
			deleteEntitiesSchema,
			deleteEntitiesHandler,
		)

		server.tool(
			'delete_observations_to_memory',
			'Delete specific observations from entities in the knowledge graph',
			deleteObservationsSchema,
			deleteObservationsHandler,
		)

		server.tool(
			'delete_relations_to_memory',
			'Delete multiple relations from the knowledge graph',
			deleteRelationsSchema,
			deleteRelationsHandler,
		)

		server.tool(
			'read_graph_to_memory',
			'Read the entire knowledge graph',
			readGraphSchema,
			readGraphHandler,
		)

		server.tool(
			'search_nodes_to_memory',
			'Search for nodes in the knowledge graph based on a query',
			searchNodesSchema,
			searchNodesHandler,
		)

		server.tool(
			'open_nodes_to_memory',
			'Open specific nodes in the knowledge graph by their names',
			openNodesSchema,
			openNodesHandler,
		)
	},
	{},
	{
		maxDuration: 5,
		streamableHttpEndpoint: '/mcp',
		verboseLogs: true,
	},
)

export const GET: RequestHandler = async ({ request }) => {
	return handler(request)
}

export const POST: RequestHandler = async ({ request }) => {
	console.log(request)
	return handler(request)
}

export const DELETE: RequestHandler = async ({ request }) => {
	return handler(request)
}