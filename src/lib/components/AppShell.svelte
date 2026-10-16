<script lang="ts">
	import type { Snippet } from 'svelte';
	import BottomNav from '#lib/components/BottomNav.svelte';

	/*
	 * Kerangka aplikasi. Rancangannya ponsel 390x844, jadi lebar maksimum
	 * dikunci dan dipusatkan di layar besar — desktop memakai aplikasi yang sama,
	 * bukan tata letak lain.
	 *
	 * `bar` boleh dimatikan di layar thread, yang memakai komposer sebagai
	 * penutup halaman, persis seperti di kanvas.
	 */
	let { children, bar = true }: { children: Snippet; bar?: boolean } = $props();
</script>

<div class="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-cream">
	{@render children()}
	{#if bar}
		<BottomNav />
	{/if}
</div>
