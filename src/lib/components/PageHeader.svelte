<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<header class="mb-6">
	<h1 class="font-display text-2xl font-bold tracking-tight">{title}</h1>
	{#if description}
		<p class="mt-1 text-ink-muted">{description}</p>
	{/if}
</header>
