<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import type { Toko } from '#lib/types/api.js';

	let {
		toko,
		kembali,
		judul,
		pengaturanHref
	}: { toko?: Toko; kembali?: string; judul?: string; pengaturanHref?: string } = $props();
</script>

<header class="flex items-center gap-2 border-b border-line bg-surface py-2.5 pr-3 pl-1">
	{#if kembali}
		<a
			href={kembali}
			aria-label="Kembali"
			class="flex size-11 flex-none items-center justify-center rounded-field text-ink"
		>
			<Icon nama="kiri" />
		</a>
	{/if}

	{#if judul}
		<span class="flex-1 text-[17px] font-bold">{judul}</span>
	{:else if toko}
		<span
			class="flex size-9 flex-none items-center justify-center rounded-[11px] bg-pine-600 font-display text-sm text-kunyit-400"
			aria-hidden="true">bl</span
		>
		<span class="flex flex-1 flex-col gap-px">
			<span class="text-base font-bold">Asisten Lapak</span>
			<span class="text-xs text-ink-muted">AI · {toko.nama}</span>
		</span>
	{/if}

	{#if pengaturanHref}
		<a
			href={pengaturanHref}
			aria-label="Pengaturan AI"
			class="flex size-11 flex-none items-center justify-center rounded-field text-ink"
		>
			<Icon nama="pengaturan" />
		</a>
	{/if}
</header>
