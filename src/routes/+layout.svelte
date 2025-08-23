<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="bg-white border-b border-gray-200">
	<div class="container mx-auto px-6 py-4 flex items-center justify-between">
		<a href="/" class="font-bold text-gray-900">Surreal Agent Memory</a>
		<nav class="flex items-center gap-6 text-sm">
			<a href="/docs/roadmap" class="text-gray-700 hover:text-gray-900"
				>Roadmap</a
			>
			<a href="/docs/research" class="text-gray-700 hover:text-gray-900"
				>Research</a
			>
			<a href="/knowledge-graph-forms" class="text-gray-700 hover:text-gray-900"
				>Demos</a
			>
			<a
				href="https://github.com/walkerRnD/surreal-agent-memory"
				target="_blank"
				class="text-gray-700 hover:text-gray-900">GitHub</a
			>
		</nav>
	</div>
</header>

<main>
	{@render children?.()}
</main>
