<script lang="ts">
  let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-6 py-10">
    <div class="grid lg:grid-cols-12 gap-8">
      <!-- Sidebar -->
      <aside class="lg:col-span-3">
        <nav
          class="sticky top-20 bg-white border border-gray-200 rounded-xl shadow-sm p-5"
        >
          <div class="text-xs uppercase tracking-wide text-gray-500 mb-3">
            Docs
          </div>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                href="/docs/roadmap"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >Roadmap</a
              >
            </li>
            <li>
              <a
                href="/docs/research"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >Research Hub</a
              >
            </li>
            <li
              class="mt-4 text-[11px] uppercase tracking-wide text-gray-500 px-3"
            >
              Research Pages
            </li>
            <li>
              <a
                href="/docs/research/agent-memory"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >Agent Memory Overview</a
              >
            </li>
            <li>
              <a
                href="/docs/research/memory-types"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >Memory Types</a
              >
            </li>
            <li>
              <a
                href="/docs/research/rag-reference"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >RAG Reference</a
              >
            </li>
            <li>
              <a
                href="/docs/research/graphrag-variants"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >GraphRAG Variants</a
              >
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Content -->
      <section class="lg:col-span-9">
        <div class="prose prose-slate max-w-none">
          {@render children?.()}
        </div>
      </section>
    </div>
  </div>
</div>
