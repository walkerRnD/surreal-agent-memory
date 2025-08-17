<script lang="ts">
  import { onMount } from "svelte";

  // State for different operations
  let loading = false;
  let results: any = null;
  let error = "";

  // Create Entities Form
  let createEntitiesForm = {
    entities: [{ name: "", entityType: "", observations: [""] }],
  };

  // Create Relations Form
  let createRelationsForm = {
    relations: [{ from: "", to: "", relationType: "" }],
  };

  // Add Observations Form
  let addObservationsForm = {
    observations: [{ entityName: "", contents: [""] }],
  };

  // Delete Entities Form
  let deleteEntitiesForm = {
    entityNames: [""],
  };

  // Delete Observations Form
  let deleteObservationsForm = {
    deletions: [{ entityName: "", observations: [""] }],
  };

  // Delete Relations Form
  let deleteRelationsForm = {
    relations: [{ from: "", to: "", relationType: "" }],
  };

  // Search Form
  let searchForm = {
    query: "",
  };

  // Open Nodes Form
  let openNodesForm = {
    names: [""],
  };

  // Current graph data
  let graphData: any = null;

  // Helper functions to add/remove form fields
  function addEntity() {
    createEntitiesForm.entities = [
      ...createEntitiesForm.entities,
      { name: "", entityType: "", observations: [""] },
    ];
  }

  function removeEntity(index: number) {
    createEntitiesForm.entities = createEntitiesForm.entities.filter(
      (_, i) => i !== index,
    );
  }

  function addObservationToEntity(entityIndex: number) {
    createEntitiesForm.entities[entityIndex].observations = [
      ...createEntitiesForm.entities[entityIndex].observations,
      "",
    ];
  }

  function removeObservationFromEntity(entityIndex: number, obsIndex: number) {
    createEntitiesForm.entities[entityIndex].observations =
      createEntitiesForm.entities[entityIndex].observations.filter(
        (_, i) => i !== obsIndex,
      );
  }

  function addRelation() {
    createRelationsForm.relations = [
      ...createRelationsForm.relations,
      { from: "", to: "", relationType: "" },
    ];
  }

  function removeRelation(index: number) {
    createRelationsForm.relations = createRelationsForm.relations.filter(
      (_, i) => i !== index,
    );
  }

  function addObservationEntry() {
    addObservationsForm.observations = [
      ...addObservationsForm.observations,
      { entityName: "", contents: [""] },
    ];
  }

  function removeObservationEntry(index: number) {
    addObservationsForm.observations = addObservationsForm.observations.filter(
      (_, i) => i !== index,
    );
  }

  function addContentToObservation(obsIndex: number) {
    addObservationsForm.observations[obsIndex].contents = [
      ...addObservationsForm.observations[obsIndex].contents,
      "",
    ];
  }

  function removeContentFromObservation(
    obsIndex: number,
    contentIndex: number,
  ) {
    addObservationsForm.observations[obsIndex].contents =
      addObservationsForm.observations[obsIndex].contents.filter(
        (_, i) => i !== contentIndex,
      );
  }

  function addEntityName() {
    deleteEntitiesForm.entityNames = [...deleteEntitiesForm.entityNames, ""];
  }

  function removeEntityName(index: number) {
    deleteEntitiesForm.entityNames = deleteEntitiesForm.entityNames.filter(
      (_, i) => i !== index,
    );
  }

  function addNodeName() {
    openNodesForm.names = [...openNodesForm.names, ""];
  }

  function removeNodeName(index: number) {
    openNodesForm.names = openNodesForm.names.filter((_, i) => i !== index);
  }

  // API call function
  async function callAPI(endpoint: string, method: string = "GET", body?: any) {
    loading = true;
    error = "";
    results = null;

    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(
        `/api/knowledge-graph-forms/${endpoint}`,
        options,
      );
      const data = await response.json();

      if (response.ok) {
        results = data;
      } else {
        error = data.error || "API call failed";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  // Operation functions
  async function createEntities() {
    const filteredEntities = createEntitiesForm.entities
      .filter((e) => e.name.trim() && e.entityType.trim())
      .map((e) => ({
        ...e,
        observations: e.observations.filter((obs) => obs.trim()),
      }));

    if (filteredEntities.length === 0) {
      error = "Please provide at least one entity with name and type";
      return;
    }

    await callAPI("create-entities", "POST", { entities: filteredEntities });
    if (results && !error) {
      // Refresh graph data
      await readGraph();
    }
  }

  async function createRelations() {
    const filteredRelations = createRelationsForm.relations.filter(
      (r) => r.from.trim() && r.to.trim() && r.relationType.trim(),
    );

    if (filteredRelations.length === 0) {
      error = "Please provide at least one relation with from, to, and type";
      return;
    }

    await callAPI("create-relations", "POST", { relations: filteredRelations });
    if (results && !error) {
      // Refresh graph data
      await readGraph();
    }
  }

  async function addObservations() {
    const filteredObservations = addObservationsForm.observations
      .filter((o) => o.entityName.trim() && o.contents.some((c) => c.trim()))
      .map((o) => ({
        ...o,
        contents: o.contents.filter((c) => c.trim()),
      }));

    if (filteredObservations.length === 0) {
      error =
        "Please provide at least one observation with entity name and content";
      return;
    }

    await callAPI("add-observations", "POST", {
      observations: filteredObservations,
    });
    if (results && !error) {
      // Refresh graph data
      await readGraph();
    }
  }

  async function deleteEntities() {
    const filteredNames = deleteEntitiesForm.entityNames.filter((name) =>
      name.trim(),
    );

    if (filteredNames.length === 0) {
      error = "Please provide at least one entity name to delete";
      return;
    }

    await callAPI("delete-entities", "POST", { entityNames: filteredNames });
    if (results && !error) {
      // Refresh graph data
      await readGraph();
    }
  }

  async function deleteObservations() {
    const filteredDeletions = deleteObservationsForm.deletions
      .filter(
        (d) => d.entityName.trim() && d.observations.some((obs) => obs.trim()),
      )
      .map((d) => ({
        ...d,
        observations: d.observations.filter((obs) => obs.trim()),
      }));

    if (filteredDeletions.length === 0) {
      error = "Please provide at least one entity with observations to delete";
      return;
    }

    await callAPI("delete-observations", "POST", {
      deletions: filteredDeletions,
    });
    if (results && !error) {
      // Refresh graph data
      await readGraph();
    }
  }

  async function deleteRelations() {
    const filteredRelations = deleteRelationsForm.relations.filter(
      (r) => r.from.trim() && r.to.trim() && r.relationType.trim(),
    );

    if (filteredRelations.length === 0) {
      error = "Please provide at least one relation to delete";
      return;
    }

    await callAPI("delete-relations", "POST", { relations: filteredRelations });
    if (results && !error) {
      // Refresh graph data
      await readGraph();
    }
  }

  async function readGraph() {
    await callAPI("read-graph");
    if (results && !error) {
      graphData = results;
    }
  }

  async function searchNodes() {
    if (!searchForm.query.trim()) {
      error = "Please provide a search query";
      return;
    }

    await callAPI("search-nodes", "POST", { query: searchForm.query });
  }

  async function openNodes() {
    const filteredNames = openNodesForm.names.filter((name) => name.trim());

    if (filteredNames.length === 0) {
      error = "Please provide at least one node name to open";
      return;
    }

    await callAPI("open-nodes", "POST", { names: filteredNames });
  }

  // Load graph data on mount
  onMount(() => {
    readGraph();
  });
</script>

<svelte:head>
  <title>Knowledge Graph Manager V1 - Interactive Forms</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-6xl">
  <h1 class="text-4xl font-bold mb-8 text-center">
    Knowledge Graph Manager V1 - Interactive Forms
  </h1>

  <!-- Navigation -->
  <div class="mb-8 flex flex-wrap gap-2 justify-center">
    <a
      href="/test-knowledge-graph"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      🧪 Automated Tests
    </a>
    <a
      href="/debug-knowledge-graph"
      class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
    >
      🔍 Debug Database
    </a>
    <button
      on:click={readGraph}
      disabled={loading}
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      📊 Refresh Graph
    </button>
  </div>

  <!-- Error Display -->
  {#if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <strong>Error:</strong>
      {error}
    </div>
  {/if}

  <!-- Results Display -->
  {#if results}
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">Results</h2>
      <pre
        class="bg-gray-100 p-4 rounded overflow-auto text-sm">{JSON.stringify(
          results,
          null,
          2,
        )}</pre>
    </div>
  {/if}

  <!-- Current Graph Display -->
  {#if graphData}
    <div class="bg-blue-50 shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">Current Graph Data</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">
            Entities ({graphData.entities?.length || 0})
          </h3>
          <div class="bg-white p-3 rounded max-h-64 overflow-auto">
            {#each graphData.entities || [] as entity}
              <div class="border-b pb-2 mb-2">
                <strong>{entity.name}</strong> ({entity.entityType})
                {#if entity.observations?.length > 0}
                  <ul class="text-sm text-gray-600 ml-4">
                    {#each entity.observations as obs}
                      <li>• {obs}</li>
                    {/each}
                  </ul>
                {/if}
              </div>
            {/each}
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">
            Relations ({graphData.relations?.length || 0})
          </h3>
          <div class="bg-white p-3 rounded max-h-64 overflow-auto">
            {#each graphData.relations || [] as relation}
              <div class="border-b pb-1 mb-1 text-sm">
                <strong>{relation.from}</strong> →
                <strong>{relation.to}</strong>
                ({relation.relationType})
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Forms Grid -->
  <div class="grid lg:grid-cols-2 gap-8">
    <!-- Create Entities Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Create Entities</h2>

      {#each createEntitiesForm.entities as entity, entityIndex}
        <div class="border rounded p-4 mb-4 bg-gray-50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold">Entity {entityIndex + 1}</h3>
            {#if createEntitiesForm.entities.length > 1}
              <button
                on:click={() => removeEntity(entityIndex)}
                class="text-red-500 hover:text-red-700"
              >
                ✕ Remove
              </button>
            {/if}
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input
                bind:value={entity.name}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Entity name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Type</label>
              <input
                bind:value={entity.entityType}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Entity type"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Observations</label>
              {#each entity.observations as observation, obsIndex}
                <div class="flex gap-2 mb-2">
                  <input
                    bind:value={observation}
                    type="text"
                    class="flex-1 border rounded px-3 py-2"
                    placeholder="Observation"
                  />
                  {#if entity.observations.length > 1}
                    <button
                      on:click={() =>
                        removeObservationFromEntity(entityIndex, obsIndex)}
                      class="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  {/if}
                </div>
              {/each}
              <button
                on:click={() => addObservationToEntity(entityIndex)}
                class="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Observation
              </button>
            </div>
          </div>
        </div>
      {/each}

      <div class="flex gap-2">
        <button
          on:click={addEntity}
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          + Add Entity
        </button>
        <button
          on:click={createEntities}
          disabled={loading}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Entities"}
        </button>
      </div>
    </div>

    <!-- Create Relations Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Create Relations</h2>

      {#each createRelationsForm.relations as relation, relationIndex}
        <div class="border rounded p-4 mb-4 bg-gray-50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold">Relation {relationIndex + 1}</h3>
            {#if createRelationsForm.relations.length > 1}
              <button
                on:click={() => removeRelation(relationIndex)}
                class="text-red-500 hover:text-red-700"
              >
                ✕ Remove
              </button>
            {/if}
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">From Entity</label>
              <input
                bind:value={relation.from}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Source entity name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">To Entity</label>
              <input
                bind:value={relation.to}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Target entity name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Relation Type</label
              >
              <input
                bind:value={relation.relationType}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Relation type"
              />
            </div>
          </div>
        </div>
      {/each}

      <div class="flex gap-2">
        <button
          on:click={addRelation}
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          + Add Relation
        </button>
        <button
          on:click={createRelations}
          disabled={loading}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Relations"}
        </button>
      </div>
    </div>

    <!-- Add Observations Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Add Observations</h2>

      {#each addObservationsForm.observations as observation, obsIndex}
        <div class="border rounded p-4 mb-4 bg-gray-50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold">Observation Set {obsIndex + 1}</h3>
            {#if addObservationsForm.observations.length > 1}
              <button
                on:click={() => removeObservationEntry(obsIndex)}
                class="text-red-500 hover:text-red-700"
              >
                ✕ Remove
              </button>
            {/if}
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Entity Name</label>
              <input
                bind:value={observation.entityName}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Entity name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >Observation Contents</label
              >
              {#each observation.contents as content, contentIndex}
                <div class="flex gap-2 mb-2">
                  <input
                    bind:value={content}
                    type="text"
                    class="flex-1 border rounded px-3 py-2"
                    placeholder="Observation content"
                  />
                  {#if observation.contents.length > 1}
                    <button
                      on:click={() =>
                        removeContentFromObservation(obsIndex, contentIndex)}
                      class="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  {/if}
                </div>
              {/each}
              <button
                on:click={() => addContentToObservation(obsIndex)}
                class="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Content
              </button>
            </div>
          </div>
        </div>
      {/each}

      <div class="flex gap-2">
        <button
          on:click={addObservationEntry}
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          + Add Observation Set
        </button>
        <button
          on:click={addObservations}
          disabled={loading}
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Observations"}
        </button>
      </div>
    </div>

    <!-- Search Nodes Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Search Nodes</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Search Query</label>
          <input
            bind:value={searchForm.query}
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Search in names, types, or observations"
          />
        </div>

        <button
          on:click={searchNodes}
          disabled={loading}
          class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search Nodes"}
        </button>
      </div>
    </div>

    <!-- Delete Entities Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Delete Entities</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1"
            >Entity Names to Delete</label
          >
          {#each deleteEntitiesForm.entityNames as entityName, nameIndex}
            <div class="flex gap-2 mb-2">
              <input
                bind:value={entityName}
                type="text"
                class="flex-1 border rounded px-3 py-2"
                placeholder="Entity name"
              />
              {#if deleteEntitiesForm.entityNames.length > 1}
                <button
                  on:click={() => removeEntityName(nameIndex)}
                  class="text-red-500 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              {/if}
            </div>
          {/each}
          <button
            on:click={addEntityName}
            class="text-blue-500 hover:text-blue-700 text-sm"
          >
            + Add Entity Name
          </button>
        </div>

        <button
          on:click={deleteEntities}
          disabled={loading}
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete Entities"}
        </button>
      </div>
    </div>

    <!-- Delete Observations Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Delete Observations</h2>

      {#each deleteObservationsForm.deletions as deletion, delIndex}
        <div class="border rounded p-4 mb-4 bg-gray-50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold">Deletion Set {delIndex + 1}</h3>
            {#if deleteObservationsForm.deletions.length > 1}
              <button
                on:click={() =>
                  (deleteObservationsForm.deletions =
                    deleteObservationsForm.deletions.filter(
                      (_, i) => i !== delIndex,
                    ))}
                class="text-red-500 hover:text-red-700"
              >
                ✕ Remove
              </button>
            {/if}
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Entity Name</label>
              <input
                bind:value={deletion.entityName}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Entity name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >Observations to Delete</label
              >
              {#each deletion.observations as observation, obsIndex}
                <div class="flex gap-2 mb-2">
                  <input
                    bind:value={observation}
                    type="text"
                    class="flex-1 border rounded px-3 py-2"
                    placeholder="Observation to delete"
                  />
                  {#if deletion.observations.length > 1}
                    <button
                      on:click={() =>
                        (deletion.observations = deletion.observations.filter(
                          (_, i) => i !== obsIndex,
                        ))}
                      class="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  {/if}
                </div>
              {/each}
              <button
                on:click={() =>
                  (deletion.observations = [...deletion.observations, ""])}
                class="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Observation
              </button>
            </div>
          </div>
        </div>
      {/each}

      <div class="flex gap-2">
        <button
          on:click={() =>
            (deleteObservationsForm.deletions = [
              ...deleteObservationsForm.deletions,
              { entityName: "", observations: [""] },
            ])}
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          + Add Deletion Set
        </button>
        <button
          on:click={deleteObservations}
          disabled={loading}
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete Observations"}
        </button>
      </div>
    </div>

    <!-- Delete Relations Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Delete Relations</h2>

      {#each deleteRelationsForm.relations as relation, relationIndex}
        <div class="border rounded p-4 mb-4 bg-gray-50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold">Relation {relationIndex + 1}</h3>
            {#if deleteRelationsForm.relations.length > 1}
              <button
                on:click={() =>
                  (deleteRelationsForm.relations =
                    deleteRelationsForm.relations.filter(
                      (_, i) => i !== relationIndex,
                    ))}
                class="text-red-500 hover:text-red-700"
              >
                ✕ Remove
              </button>
            {/if}
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">From Entity</label>
              <input
                bind:value={relation.from}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Source entity name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">To Entity</label>
              <input
                bind:value={relation.to}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Target entity name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Relation Type</label
              >
              <input
                bind:value={relation.relationType}
                type="text"
                class="w-full border rounded px-3 py-2"
                placeholder="Relation type"
              />
            </div>
          </div>
        </div>
      {/each}

      <div class="flex gap-2">
        <button
          on:click={() =>
            (deleteRelationsForm.relations = [
              ...deleteRelationsForm.relations,
              { from: "", to: "", relationType: "" },
            ])}
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          + Add Relation
        </button>
        <button
          on:click={deleteRelations}
          disabled={loading}
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete Relations"}
        </button>
      </div>
    </div>

    <!-- Open Nodes Form -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">Open Nodes</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1"
            >Node Names to Open</label
          >
          {#each openNodesForm.names as nodeName, nameIndex}
            <div class="flex gap-2 mb-2">
              <input
                bind:value={nodeName}
                type="text"
                class="flex-1 border rounded px-3 py-2"
                placeholder="Node name"
              />
              {#if openNodesForm.names.length > 1}
                <button
                  on:click={() => removeNodeName(nameIndex)}
                  class="text-red-500 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              {/if}
            </div>
          {/each}
          <button
            on:click={addNodeName}
            class="text-blue-500 hover:text-blue-700 text-sm"
          >
            + Add Node Name
          </button>
        </div>

        <button
          on:click={openNodes}
          disabled={loading}
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? "Opening..." : "Open Nodes"}
        </button>
      </div>
    </div>
  </div>
</div>
