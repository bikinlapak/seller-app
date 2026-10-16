<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Kondisi } from '#lib/types/api.js';

	/*
	 * Chip status. Warna mengikuti kondisi, tapi teksnya selalu ikut tampil —
	 * status tidak pernah dibedakan dengan warna saja.
	 */
	let { kondisi = 'aman', children }: { kondisi?: Kondisi; children: Snippet } = $props();

	const gaya: Record<Kondisi, string> = {
		aman: 'bg-pine-100 text-pine-800',
		hampir: 'bg-kunyit-100 text-kunyit-800',
		lewat: 'bg-bahaya-bg text-bahaya'
	};
</script>

<span class={['rounded-full px-2 py-0.5 text-xs font-bold', gaya[kondisi]]}>
	{@render children()}
</span>
