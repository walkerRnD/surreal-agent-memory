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
                href="/docs/research/memory-api"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >Memory API Reference</a
              >
            </li>
            <li>
              <a
                href="/docs/research/mcp-memory-agent"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >MCP Memory Agent</a
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
                href="/docs/research/evaluation-datasets"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >Evaluation Datasets</a
              >
              <ul class="ml-4 mt-1 space-y-1">
                <li>
                  <a
                    href="/docs/research/evaluation-datasets/foundational"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Foundational Datasets</a
                  >
                </li>
                <li>
                  <a
                    href="/docs/research/evaluation-datasets/modern-benchmarks"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Modern Benchmarks</a
                  >
                </li>
                <li>
                  <a
                    href="/docs/research/evaluation-datasets/metrics"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Metrics & Methodology</a
                  >
                </li>
                <li>
                  <a
                    href="/docs/research/evaluation-datasets/challenges"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Challenges & Future</a
                  >
                </li>
              </ul>
            </li>
            <li>
              <a
                href="/docs/research/graphrag-variants"
                class="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >GraphRAG Variants</a
              >
              <ul class="ml-4 mt-1 space-y-1">
                <li>
                  <a
                    href="/docs/research/graphrag-variants/architecture"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Architecture</a
                  >
                </li>
                <li>
                  <a
                    href="/docs/research/graphrag-variants/variants"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Variants</a
                  >
                </li>
                <li>
                  <a
                    href="/docs/research/graphrag-variants/evaluation"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Evaluation</a
                  >
                </li>
                <li>
                  <a
                    href="/docs/research/graphrag-variants/applications"
                    class="block px-3 py-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    >Applications</a
                  >
                </li>
              </ul>
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
