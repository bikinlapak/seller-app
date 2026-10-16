<script lang="ts">
	import AiLabel from '#lib/components/AiLabel.svelte';

	/* Baris di atas giliran agen: siapa, label AI, sumber, waktu. */
	let { waktu, sumber }: { waktu: string; sumber?: string | null } = $props();
</script>

<div class="flex items-center gap-1.5 text-xs text-ink-muted">
	Asisten Lapak <AiLabel kecil />
	{#if sumber}· {sumber}{/if}
	· {waktu}
</div>
