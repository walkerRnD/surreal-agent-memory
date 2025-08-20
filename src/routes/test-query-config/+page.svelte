<script lang="ts">
  import { onMount } from 'svelte';

  let result = '';
  let loading = false;
  let error = '';

  // Test configuration
  let testConfig = {
    host: 'surrealkv://test.db',
    namespace: 'test',
    database: 'query_test',
    username: 'test_user',
    password: 'test_pass',
    token: 'test_token'
  };

  async function testQueryStringConfig() {
    loading = true;
    error = '';
    result = '';

    try {
      // Build query string
      const params = new URLSearchParams();
      params.set('db-host', testConfig.host);
      params.set('db-namespace', testConfig.namespace);
      params.set('db-database', testConfig.database);
      params.set('db-username', testConfig.username);
      params.set('db-password', testConfig.password);
      params.set('db-token', testConfig.token);

      const url = `/mcp?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'create_entities_to_memory',
            arguments: {
              entities: [
                {
                  name: 'Query Test Entity',
                  entityType: 'test',
                  observations: ['Created via query string configuration']
                }
              ]
            }
          }
        })
      });

      const data = await response.json();
      result = JSON.stringify(data, null, 2);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  async function testHeaderConfig() {
    loading = true;
    error = '';
    result = '';

    try {
      const response = await fetch('/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DB-Host': testConfig.host,
          'X-DB-Namespace': testConfig.namespace,
          'X-DB-Database': testConfig.database,
          'X-DB-Username': testConfig.username,
          'X-DB-Password': testConfig.password,
          'X-DB-Token': testConfig.token,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'create_entities_to_memory',
            arguments: {
              entities: [
                {
                  name: 'Header Test Entity',
                  entityType: 'test',
                  observations: ['Created via header configuration']
                }
              ]
            }
          }
        })
      });

      const data = await response.json();
      result = JSON.stringify(data, null, 2);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  async function testMixedConfig() {
    loading = true;
    error = '';
    result = '';

    try {
      // Query string will override headers
      const params = new URLSearchParams();
      params.set('db-host', 'surrealkv://priority.db');
      params.set('db-namespace', 'priority');

      const url = `/mcp?${params.toString()}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DB-Host': testConfig.host, // This will be overridden
          'X-DB-Namespace': testConfig.namespace, // This will be overridden
          'X-DB-Database': testConfig.database, // This will be used
          'X-DB-Username': testConfig.username, // This will be used
          'X-DB-Password': testConfig.password, // This will be used
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'create_entities_to_memory',
            arguments: {
              entities: [
                {
                  name: 'Mixed Config Test Entity',
                  entityType: 'test',
                  observations: ['Created via mixed configuration (query string + headers)']
                }
              ]
            }
          }
        })
      });

      const data = await response.json();
      result = JSON.stringify(data, null, 2);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-8">Database Configuration Test</h1>
  
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-4">Test Configuration</h2>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Host:</label>
        <input bind:value={testConfig.host} class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Namespace:</label>
        <input bind:value={testConfig.namespace} class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Database:</label>
        <input bind:value={testConfig.database} class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Username:</label>
        <input bind:value={testConfig.username} class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Password:</label>
        <input bind:value={testConfig.password} type="password" class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Token:</label>
        <input bind:value={testConfig.token} class="w-full p-2 border rounded" />
      </div>
    </div>
  </div>

  <div class="space-y-4 mb-8">
    <button 
      on:click={testQueryStringConfig}
      disabled={loading}
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
    >
      Test Query String Configuration
    </button>
    
    <button 
      on:click={testHeaderConfig}
      disabled={loading}
      class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
    >
      Test Header Configuration
    </button>
    
    <button 
      on:click={testMixedConfig}
      disabled={loading}
      class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
    >
      Test Mixed Configuration (Query String Priority)
    </button>
  </div>

  {#if loading}
    <div class="text-blue-600">Loading...</div>
  {/if}

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <strong>Error:</strong> {error}
    </div>
  {/if}

  {#if result}
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-2">Result:</h3>
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto text-sm">{result}</pre>
    </div>
  {/if}

  <div class="mt-8 text-sm text-gray-600">
    <h3 class="font-semibold mb-2">How it works:</h3>
    <ul class="list-disc list-inside space-y-1">
      <li><strong>Query String:</strong> Parameters are passed in the URL (highest priority)</li>
      <li><strong>Headers:</strong> Configuration passed via HTTP headers (fallback)</li>
      <li><strong>Mixed:</strong> Query string parameters override headers when both are present</li>
      <li><strong>Default:</strong> Server default configuration is used for missing values</li>
    </ul>
  </div>
</div>
