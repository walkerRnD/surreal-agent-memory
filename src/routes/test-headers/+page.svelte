<script lang="ts">
  let dbHost = 'surrealkv://data.db';
  let dbNamespace = 'test';
  let dbDatabase = 'memory';
  let dbUsername = 'root';
  let dbPassword = 'root';
  
  let entityName = 'Test Entity';
  let entityType = 'test';
  let observation = 'This is a test observation';
  
  let result = '';
  let loading = false;

  async function testHeaderConfig() {
    loading = true;
    result = '';
    
    try {
      const response = await fetch('/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-DB-Host': dbHost,
          'X-DB-Namespace': dbNamespace,
          'X-DB-Database': dbDatabase,
          'X-DB-Username': dbUsername,
          'X-DB-Password': dbPassword,
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
                  name: entityName,
                  entityType: entityType,
                  observations: [observation],
                },
              ],
            },
          },
        }),
      });

      const data = await response.json();
      result = JSON.stringify(data, null, 2);
    } catch (error) {
      result = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Test MCP Header Configuration</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-4xl">
  <h1 class="text-3xl font-bold mb-6">Test MCP Header Configuration</h1>
  
  <div class="grid md:grid-cols-2 gap-8">
    <!-- Configuration Form -->
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Database Configuration</h2>
        
        <div class="space-y-4">
          <div>
            <label for="dbHost" class="block text-sm font-medium text-gray-700 mb-1">
              Database Host
            </label>
            <input
              id="dbHost"
              type="text"
              bind:value={dbHost}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="surrealkv://data.db"
            />
          </div>
          
          <div>
            <label for="dbNamespace" class="block text-sm font-medium text-gray-700 mb-1">
              Namespace
            </label>
            <input
              id="dbNamespace"
              type="text"
              bind:value={dbNamespace}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test"
            />
          </div>
          
          <div>
            <label for="dbDatabase" class="block text-sm font-medium text-gray-700 mb-1">
              Database
            </label>
            <input
              id="dbDatabase"
              type="text"
              bind:value={dbDatabase}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="memory"
            />
          </div>
          
          <div>
            <label for="dbUsername" class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="dbUsername"
              type="text"
              bind:value={dbUsername}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="root"
            />
          </div>
          
          <div>
            <label for="dbPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="dbPassword"
              type="password"
              bind:value={dbPassword}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="root"
            />
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Test Entity</h2>
        
        <div class="space-y-4">
          <div>
            <label for="entityName" class="block text-sm font-medium text-gray-700 mb-1">
              Entity Name
            </label>
            <input
              id="entityName"
              type="text"
              bind:value={entityName}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Test Entity"
            />
          </div>
          
          <div>
            <label for="entityType" class="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <input
              id="entityType"
              type="text"
              bind:value={entityType}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test"
            />
          </div>
          
          <div>
            <label for="observation" class="block text-sm font-medium text-gray-700 mb-1">
              Observation
            </label>
            <textarea
              id="observation"
              bind:value={observation}
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="This is a test observation"
            ></textarea>
          </div>
        </div>
      </div>
      
      <button
        on:click={testHeaderConfig}
        disabled={loading}
        class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Testing...' : 'Test Header Configuration'}
      </button>
    </div>
    
    <!-- Results -->
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Request Headers</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto"><code>{JSON.stringify({
          'X-DB-Host': dbHost,
          'X-DB-Namespace': dbNamespace,
          'X-DB-Database': dbDatabase,
          'X-DB-Username': dbUsername,
          'X-DB-Password': '***'
        }, null, 2)}</code></pre>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Response</h2>
        {#if result}
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-x-auto max-h-96 overflow-y-auto"><code>{result}</code></pre>
        {:else}
          <p class="text-gray-500 italic">No response yet. Click "Test Header Configuration" to see results.</p>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="mt-8 bg-blue-50 p-6 rounded-lg">
    <h3 class="text-lg font-semibold mb-2">How it works</h3>
    <p class="text-gray-700">
      This form demonstrates how to pass database configuration through HTTP headers to MCP tools. 
      The server will use the provided headers to create a database connection for the specific request, 
      allowing different clients to use different database configurations dynamically.
    </p>
  </div>
</div>
