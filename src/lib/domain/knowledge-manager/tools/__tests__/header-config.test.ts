import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEntitiesHandler, type McpRequestContext } from '../tool-handlers';
import { SERVER_CONFIG } from '../../../server/config';

// Mock the dependencies
vi.mock('../../../server/infra/db', () => ({
  createDbConnection: vi.fn().mockResolvedValue({
    // Mock database connection
    query: vi.fn(),
    close: vi.fn(),
  }),
}));

vi.mock('../managers/manager-v1', () => ({
  KnowledgeGraphManagerV1: vi.fn().mockImplementation(() => ({
    createEntities: vi.fn().mockResolvedValue([
      { id: 'test-entity', name: 'Test Entity', entityType: 'test' }
    ]),
  })),
}));

describe('Header-based Database Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use default configuration when no headers provided', async () => {
    const input = {
      entities: [
        {
          name: 'Test Entity',
          entityType: 'test',
          observations: ['Test observation'],
        },
      ],
    };

    const result = await createEntitiesHandler(input);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify([
            { id: 'test-entity', name: 'Test Entity', entityType: 'test' }
          ], null, 2),
        },
      ],
    });
  });

  it('should use custom configuration from headers', async () => {
    const input = {
      entities: [
        {
          name: 'Test Entity',
          entityType: 'test',
          observations: ['Test observation'],
        },
      ],
    };

    const extra: McpRequestContext = {
      headers: {
        'x-db-host': 'surreal://custom-host:8000',
        'x-db-namespace': 'custom_namespace',
        'x-db-database': 'custom_database',
        'x-db-username': 'custom_user',
        'x-db-password': 'custom_password',
      },
    };

    const result = await createEntitiesHandler(input, extra);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify([
            { id: 'test-entity', name: 'Test Entity', entityType: 'test' }
          ], null, 2),
        },
      ],
    });
  });

  it('should handle mixed case headers', async () => {
    const input = {
      entities: [
        {
          name: 'Test Entity',
          entityType: 'test',
          observations: ['Test observation'],
        },
      ],
    };

    const extra: McpRequestContext = {
      headers: {
        'X-DB-Host': 'surreal://custom-host:8000',
        'x-db-namespace': 'custom_namespace',
        'X-DB-Database': 'custom_database',
      },
    };

    const result = await createEntitiesHandler(input, extra);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify([
            { id: 'test-entity', name: 'Test Entity', entityType: 'test' }
          ], null, 2),
        },
      ],
    });
  });

  it('should fall back to default config for missing headers', async () => {
    const input = {
      entities: [
        {
          name: 'Test Entity',
          entityType: 'test',
          observations: ['Test observation'],
        },
      ],
    };

    const extra: McpRequestContext = {
      headers: {
        'x-db-host': 'surreal://custom-host:8000',
        // Missing other headers should fall back to SERVER_CONFIG
      },
    };

    const result = await createEntitiesHandler(input, extra);

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify([
            { id: 'test-entity', name: 'Test Entity', entityType: 'test' }
          ], null, 2),
        },
      ],
    });
  });
});
