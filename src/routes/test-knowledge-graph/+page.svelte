<script lang="ts">
  import { onMount } from "svelte";

  let testResults: any = null;
  let loading = false;
  let error = "";

  async function runTests() {
    loading = true;
    error = "";
    testResults = null;

    try {
      const response = await fetch("/api/test-knowledge-graph");
      const data = await response.json();

      if (data.success) {
        testResults = data.results;
      } else {
        error = data.error || "Test failed";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  async function cleanup() {
    loading = true;
    error = "";

    try {
      const response = await fetch("/api/test-knowledge-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cleanup" }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Test data cleaned up successfully");
      } else {
        error = data.error || "Cleanup failed";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  let selectedFile: File | null = null;
  let fileInput: HTMLInputElement;

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
    }
  }

  function openFileDialog() {
    fileInput.click();
  }

  async function migrate() {
    loading = true;
    error = "";

    try {
      let migrationData: any = { action: "migrate" };

      // If a file is selected, read its content
      if (selectedFile) {
        const fileContent = await selectedFile.text();
        migrationData.fileContent = fileContent;
        migrationData.fileName = selectedFile.name;
      }

      const response = await fetch("/api/test-knowledge-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(migrationData),
      });

      const data = await response.json();
      if (data.success) {
        const source = selectedFile
          ? `from file "${selectedFile.name}"`
          : "from V0 storage";
        alert(
          `Migration ${source} completed successfully! Set KNOWLEDGE_GRAPH_VERSION=v1 to use SurrealDB`,
        );
        // Reset file selection after successful migration
        selectedFile = null;
        if (fileInput) fileInput.value = "";
      } else {
        error = data.error || "Migration failed";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    // Auto-run tests on page load
    runTests();
  });
</script>

<svelte:head>
  <title>Knowledge Graph Manager Test</title>
</svelte:head>

<div class="container mx-auto p-8 max-w-4xl">
  <h1 class="text-3xl font-bold mb-6">Knowledge Graph Manager Test</h1>

  <div class="mb-6 space-y-4">
    <div class="space-x-4">
      <button
        on:click={runTests}
        disabled={loading}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Tests"}
      </button>

      <button
        on:click={cleanup}
        disabled={loading}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Clean Up Test Data
      </button>

      <a
        href="/debug-knowledge-graph"
        class="inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        🔍 Debug Database
      </a>
    </div>

    <!-- Migration Section -->
    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
      <h3 class="text-lg font-semibold mb-3 text-green-800">
        Migration V0 → V1
      </h3>

      <!-- Hidden file input -->
      <input
        type="file"
        accept=".jsonl,.json,.txt"
        bind:this={fileInput}
        on:change={handleFileSelect}
        class="hidden"
      />

      <div class="space-y-3">
        <div class="flex items-center space-x-3">
          <button
            on:click={openFileDialog}
            disabled={loading}
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Select File (Optional)
          </button>

          {#if selectedFile}
            <span class="text-sm text-gray-600">
              Selected: <strong>{selectedFile.name}</strong> ({(
                selectedFile.size / 1024
              ).toFixed(1)} KB)
            </span>
            <button
              on:click={() => {
                selectedFile = null;
                fileInput.value = "";
              }}
              class="text-red-500 hover:text-red-700 text-sm"
            >
              ✕ Clear
            </button>
          {/if}
        </div>

        <div class="text-sm text-gray-600">
          <p><strong>Migration Options:</strong></p>
          <ul class="list-disc list-inside ml-4 mt-1">
            <li>
              No file selected: Migrate from current V0 storage to V1
              (SurrealDB)
            </li>
            <li>
              File selected: Import data from selected file to V1 (SurrealDB)
              <br /><em class="text-xs"
                >Note: All files are processed as JSONL format regardless of
                extension</em
              >
            </li>
          </ul>
        </div>

        <button
          on:click={migrate}
          disabled={loading}
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {selectedFile
            ? `Import from ${selectedFile.name}`
            : "Migrate V0 → V1"}
        </button>
      </div>
    </div>
  </div>

  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <strong>Error:</strong>
      {error}
    </div>
  {/if}

  {#if testResults}
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">
        Test Results - Version: {testResults.version}
      </h2>

      <div
        class="mb-4 p-4 rounded {testResults.summary.failed === 0
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'}"
      >
        <strong>Summary:</strong>
        {testResults.summary.passed}/{testResults.summary.total} tests passed
        {#if testResults.summary.failed > 0}
          ({testResults.summary.failed} failed)
        {/if}
      </div>

      <div class="space-y-4">
        {#each testResults.tests as test}
          <div
            class="border rounded p-4 {test.status === 'passed'
              ? 'border-green-300 bg-green-50'
              : 'border-red-300 bg-red-50'}"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">{test.name}</h3>
              <span
                class="px-2 py-1 rounded text-sm {test.status === 'passed'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'}"
              >
                {test.status}
              </span>
            </div>

            {#if test.error}
              <div class="text-red-600 text-sm">
                <strong>Error:</strong>
                {test.error}
              </div>
            {/if}

            {#if test.details}
              <details class="mt-2">
                <summary class="cursor-pointer text-sm text-gray-600"
                  >Show details</summary
                >
                <pre
                  class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(
                    test.details,
                    null,
                    2,
                  )}</pre>
              </details>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="mt-8 bg-gray-100 p-6 rounded-lg">
    <h3 class="text-lg font-semibold mb-3">Environment Configuration</h3>
    <div class="space-y-2 text-sm">
      <p>
        <strong>Current Version:</strong>
        {testResults?.version || "Unknown"}
      </p>
      <p>
        <strong>To use SurrealDB:</strong> Set
        <code class="bg-gray-200 px-1 rounded">KNOWLEDGE_GRAPH_VERSION=v1</code>
      </p>
      <p>
        <strong>To use File-based:</strong> Set
        <code class="bg-gray-200 px-1 rounded">KNOWLEDGE_GRAPH_VERSION=v0</code>
        (default)
      </p>
    </div>
  </div>

  <div class="mt-8 bg-blue-50 p-6 rounded-lg">
    <h3 class="text-lg font-semibold mb-3">Implementation Details</h3>
    <div class="space-y-2 text-sm">
      <p><strong>V0 (File-based):</strong> Uses JSONL files for storage</p>
      <p>
        <strong>V1 (SurrealDB):</strong> Pure schemaless SurrealDB with Zod validation
      </p>
      <p>
        <strong>Features:</strong> No DEFINE statements, automatic table creation,
        graph relations
      </p>
      <p>
        <strong>Validation:</strong> All input/output validated with Zod schemas
      </p>
    </div>
  </div>
</div>

<style>
  .container {
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  code {
    font-family: "Courier New", monospace;
  }
</style>
