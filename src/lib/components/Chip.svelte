<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Severity } from '#lib/types/api.js';

	/*
	 * Status chip. The colour follows severity, but the text is always shown
	 * too — status is never carried by colour alone.
	 */
	let { severity = 'ok', children }: { severity?: Severity; children: Snippet } = $props();

	const styles: Record<Severity, string> = {
		ok: 'bg-pine-100 text-pine-800',
		warn: 'bg-kunyit-100 text-kunyit-800',
		critical: 'bg-danger-bg text-danger'
	};
</script>

<span class={['rounded-full px-2 py-0.5 text-xs font-bold', styles[severity]]}>
	{@render children()}
</span>
