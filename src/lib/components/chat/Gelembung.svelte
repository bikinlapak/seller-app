<script lang="ts">
	import type { Snippet } from 'svelte';

	/*
	 * Gelembung chat. Sudut 4px menghadap pengirim (lihat .bubble-* di
	 * layout.css). Agen: kartu putih bergaris, rata kiri. Penjual: pine,
	 * teks putih, rata kanan.
	 */
	let { penulis, children }: { penulis: 'agent' | 'staff'; children: Snippet } = $props();
</script>

{#if penulis === 'agent'}
	<div
		class="bubble-agent max-w-[320px] self-start border border-line bg-surface px-3.5 py-2.5 text-sm leading-relaxed"
	>
		{@render children()}
	</div>
{:else}
	<div class="bubble-staff self-end bg-pine-600 px-3.5 py-2.5 text-[15px] text-white">
		{@render children()}
	</div>
{/if}
