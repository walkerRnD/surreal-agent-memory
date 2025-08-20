import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEntitiesHandler, type McpRequestContext } from '../tool-handlers';

// Import the function we want to test directly
// We'll need to export it from the module for testing
import { getDbConfigFromRequest } from '../tool-handlers';

// Mock the dependencies
vi.mock('../../../server/config', () => ({
  SERVER_CONFIG: {
    port: 3000,
    db: {
      host: 'surrealkv://data.db',
      namespace: 'local',
      database: 'persisted',
      username: 'root',
      password: 'root',
    }
  }
}));

vi.mock('../../../server/infra/db', () => ({
  createDbConnection: vi.fn().mockResolvedValue({
    // Mock database connection
    query: vi.fn(),
    close: vi.fn(),
  }),
  getDb: vi.fn().mockResolvedValue({
    // Mock database connection
    query: vi.fn(),
    close: vi.fn(),
  }),
}));

vi.mock('../managers/manager-v1', () => ({
  KnowledgeGraphManagerV1: vi.fn().mockImplementation(() => ({
    createEntities: vi.fn().mockResolvedValue([
      { name: 'Test Entity', entityType: 'test', observations: ['Test observation'] }
    ]),
  })),
}));

describe('Database Configuration Extraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDbConfigFromRequest', () => {
    it('should extract configuration from headers', () => {
      const context: McpRequestContext = {
        headers: {
          'x-db-host': 'surreal://test-host:8000',
          'x-db-namespace': 'test_namespace',
          'x-db-database': 'test_database',
          'x-db-username': 'test_user',
          'x-db-password': 'test_password',
          'x-db-token': 'test_token',
        },
      };

      const config = getDbConfigFromRequest(context);

      expect(config).toEqual({
        host: 'surreal://test-host:8000',
        namespace: 'test_namespace',
        database: 'test_database',
        username: 'test_user',
        password: 'test_password',
        token: 'test_token',
      });
    });

    it('should extract configuration from query string parameters', () => {
      const mockRequest = new Request('http://localhost:3000/mcp?db-host=surreal://query-host:8000&db-namespace=query_namespace&db-database=query_database&db-username=query_user&db-password=query_password&db-token=query_token');

      const context: McpRequestContext = {
        request: mockRequest,
      };

      const config = getDbConfigFromRequest(context);

      expect(config).toEqual({
        host: 'surreal://query-host:8000',
        namespace: 'query_namespace',
        database: 'query_database',
        username: 'query_user',
        password: 'query_password',
        token: 'query_token',
      });
    });

    it('should prioritize query string over headers', () => {
      const mockRequest = new Request('http://localhost:3000/mcp?db-host=surreal://query-host:8000&db-namespace=query_namespace');

      const context: McpRequestContext = {
        headers: {
          'x-db-host': 'surreal://header-host:8000',
          'x-db-namespace': 'header_namespace',
          'x-db-database': 'header_database',
          'x-db-username': 'header_user',
          'x-db-password': 'header_password',
        },
        request: mockRequest,
      };

      const config = getDbConfigFromRequest(context);

      expect(config).toEqual({
        host: 'surreal://query-host:8000', // From query string
        namespace: 'query_namespace', // From query string
        database: 'header_database', // From headers (fallback)
        username: 'header_user', // From headers (fallback)
        password: 'header_password', // From headers (fallback)
        token: undefined,
      });
    });

    it('should handle mixed case headers', () => {
      const context: McpRequestContext = {
        headers: {
          'X-DB-Host': 'surreal://mixed-case-host:8000',
          'x-db-namespace': 'mixed_namespace',
          'X-DB-Database': 'mixed_database',
        },
      };

      const config = getDbConfigFromRequest(context);

      expect(config).toEqual({
        host: 'surreal://mixed-case-host:8000',
        namespace: 'mixed_namespace',
        database: 'mixed_database',
        username: undefined,
        password: undefined,
        token: undefined,
      });
    });

    it('should handle invalid request URL gracefully', () => {
      const mockRequest = { url: 'invalid-url' } as Request;

      const context: McpRequestContext = {
        headers: {
          'x-db-host': 'surreal://fallback-host:8000',
          'x-db-namespace': 'fallback_namespace',
          'x-db-database': 'fallback_database',
        },
        request: mockRequest,
      };

      const config = getDbConfigFromRequest(context);

      expect(config).toEqual({
        host: 'surreal://fallback-host:8000',
        namespace: 'fallback_namespace',
        database: 'fallback_database',
        username: undefined,
        password: undefined,
        token: undefined,
      });
    });

    it('should throw error when host is missing', () => {
      const context: McpRequestContext = {
        headers: {
          'x-db-namespace': 'test_namespace',
          'x-db-database': 'test_database',
        },
      };

      expect(() => getDbConfigFromRequest(context)).toThrow('Database host is required');
    });
  });
});
