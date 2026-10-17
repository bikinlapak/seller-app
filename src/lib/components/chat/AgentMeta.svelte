<script lang="ts">
	import AiLabel from '#lib/components/AiLabel.svelte';

	/* The line above an agent turn: who, the AI label, the source, the time. */
	let { time, source }: { time: string; source?: string | null } = $props();
</script>

<div class="flex items-center gap-1.5 text-xs text-ink-muted">
	Shop Assistant <AiLabel small />
	{#if source}· {source}{/if}
	· {time}
</div>
