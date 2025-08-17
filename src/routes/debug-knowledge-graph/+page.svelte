<script lang="ts">
  import { onMount } from "svelte";

  let loading = false;
  let error = "";
  let debugData: any = null;

  async function loadDebugData() {
    loading = true;
    error = "";

    try {
      const response = await fetch("/api/debug-knowledge-graph");
      const data = await response.json();

      if (data.success) {
        debugData = data.data;
      } else {
        error = data.error || "Failed to load debug data";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  async function clearDatabase() {
    if (
      !confirm(
        "Are you sure you want to clear all data from the database? This action cannot be undone.",
      )
    ) {
      return;
    }

    loading = true;
    error = "";

    try {
      const response = await fetch("/api/debug-knowledge-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Database cleared successfully!");
        await loadDebugData(); // Reload data
      } else {
        error = data.error || "Failed to clear database";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadDebugData();
  });
</script>

<svelte:head>
  <title>Knowledge Graph Debug</title>
</svelte:head>

<div class="container mx-auto p-8 max-w-6xl">
  <h1 class="text-3xl font-bold mb-6">Knowledge Graph Debug</h1>

  <div class="mb-6 space-x-4">
    <button
      on:click={loadDebugData}
      disabled={loading}
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {loading ? "Loading..." : "Refresh Data"}
    </button>

    <button
      on:click={clearDatabase}
      disabled={loading}
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      Clear Database
    </button>
  </div>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <strong>Error:</strong>
      {error}
    </div>
  {/if}

  {#if debugData}
    <div class="space-y-6">
      <!-- Database Info -->
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 class="text-xl font-semibold mb-3 text-blue-800">
          Database Information
        </h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Active Version:</strong> {debugData.version}</div>
          <div><strong>Database Status:</strong> {debugData.dbStatus}</div>
          <div><strong>Total Entities:</strong> {debugData.entityCount}</div>
          <div><strong>Total Relations:</strong> {debugData.relationCount}</div>
        </div>

        {#if debugData.debugInfo}
          <div class="mt-3 pt-3 border-t border-blue-300">
            <h3 class="font-semibold text-blue-700 mb-2">Debug Info</h3>
            <div class="text-xs space-y-1">
              <div>
                <strong>Timestamp:</strong>
                {debugData.debugInfo.timestamp}
              </div>
              <div>
                <strong>Environment Variable:</strong>
                {debugData.debugInfo.environment}
              </div>
              <div>
                <strong>Detected Version:</strong>
                {debugData.debugInfo.activeVersion}
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Raw Entities -->
      <div class="bg-green-50 p-4 rounded-lg border border-green-200">
        <h2 class="text-xl font-semibold mb-3 text-green-800">
          Raw Entities ({debugData.rawEntities?.length || 0})
        </h2>
        {#if debugData.rawEntities && debugData.rawEntities.length > 0}
          <div class="bg-white p-3 rounded border overflow-x-auto">
            <pre class="text-xs">{JSON.stringify(
                debugData.rawEntities,
                null,
                2,
              )}</pre>
          </div>
        {:else}
          <p class="text-gray-600 italic">No entities found</p>
        {/if}
      </div>

      <!-- Raw Relations -->
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h2 class="text-xl font-semibold mb-3 text-purple-800">
          Raw Relations ({debugData.rawRelations?.length || 0})
        </h2>
        {#if debugData.rawRelations && debugData.rawRelations.length > 0}
          <div class="bg-white p-3 rounded border overflow-x-auto">
            <pre class="text-xs">{JSON.stringify(
                debugData.rawRelations,
                null,
                2,
              )}</pre>
          </div>
        {:else}
          <p class="text-gray-600 italic">No relations found</p>
        {/if}
      </div>

      <!-- All Tables -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold mb-3 text-gray-800">
          All Database Tables
        </h2>
        {#if debugData.allTables && debugData.allTables.length > 0}
          <div class="bg-white p-3 rounded border overflow-x-auto">
            <pre class="text-xs">{JSON.stringify(
                debugData.allTables,
                null,
                2,
              )}</pre>
          </div>
        {:else}
          <p class="text-gray-600 italic">No tables found</p>
        {/if}
      </div>

      <!-- Processed Graph (Legacy Format) -->
      <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h2 class="text-xl font-semibold mb-3 text-yellow-800">
          Processed Graph (Legacy Format)
        </h2>
        {#if debugData.processedGraph}
          <div class="space-y-3">
            <div>
              <h3 class="font-semibold">
                Entities ({debugData.processedGraph.entities?.length || 0}):
              </h3>
              <div class="bg-white p-3 rounded border overflow-x-auto">
                <pre class="text-xs">{JSON.stringify(
                    debugData.processedGraph.entities,
                    null,
                    2,
                  )}</pre>
              </div>
            </div>
            <div>
              <h3 class="font-semibold">
                Relations ({debugData.processedGraph.relations?.length || 0}):
              </h3>
              <div class="bg-white p-3 rounded border overflow-x-auto">
                <pre class="text-xs">{JSON.stringify(
                    debugData.processedGraph.relations,
                    null,
                    2,
                  )}</pre>
              </div>
            </div>
          </div>
        {:else}
          <p class="text-gray-600 italic">No processed graph data</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  pre {
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
