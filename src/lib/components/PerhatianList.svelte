<script lang="ts">
	import AiLabel from '#lib/components/AiLabel.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import type { PerluPerhatian } from '#lib/types/api.js';

	/*
	 * "Perlu perhatian hari ini": hal paling mendesak, ditulis sebagai akibat
	 * ("Kopi Arabika habis Kamis"), bukan sebagai angka. Tiap baris masuk
	 * langsung ke thread yang menanganinya.
	 *
	 * Kalau tidak ada yang mendesak, bagian ini tidak tampil — lebih baik kosong
	 * daripada diisi kabar yang menenangkan tapi tak berguna.
	 */
	let { perhatian }: { perhatian: PerluPerhatian[] } = $props();

	const gaya = {
		stok: 'bg-pine-100 text-pine-600',
		kedaluwarsa: 'bg-kunyit-100 text-kunyit-700',
		donasi: 'bg-sukses-bg text-sukses'
	} as const;
</script>

{#if perhatian.length > 0}
	<section
		aria-label="Perlu perhatian hari ini"
		class="overflow-hidden rounded-card border border-line bg-surface"
	>
		<div class="flex items-center justify-between px-3.5 pt-3 pb-1.5">
			<h2 class="m-0 text-[13px] font-bold text-ink-label">Perlu perhatian hari ini</h2>
			<AiLabel />
		</div>

		{#each perhatian as p (p.id)}
			<a
				href={p.href}
				class="flex items-center gap-3 border-t border-line-soft px-3.5 py-2.5 text-ink"
			>
				<span
					class={['flex size-9 flex-none items-center justify-center rounded-tile', gaya[p.ikon]]}
				>
					<Icon nama={p.ikon === 'stok' ? 'stok' : p.ikon} ukuran={18} />
				</span>
				<span class="flex flex-1 flex-col gap-0.5">
					<span class="text-sm font-semibold">{p.judul}</span>
					<span class="text-xs text-ink-muted">{p.detail}</span>
				</span>
				<span class="flex-none text-ink-faint"><Icon nama="kanan" ukuran={18} /></span>
			</a>
		{/each}
	</section>
{/if}
