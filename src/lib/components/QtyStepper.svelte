<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	/*
	 * Stepper jumlah. `max` datang dari batas token aksi: penjual boleh
	 * menurunkan jumlah, tidak boleh menaikkannya di atas yang diusulkan asisten.
	 * Backend menolak kalau dilewati; UI tidak boleh menawarkannya sama sekali.
	 */
	let {
		nilai = $bindable(),
		max,
		min = 1,
		satuan,
		nama = 'jumlah'
	}: { nilai: number; max: number; min?: number; satuan: string; nama?: string } = $props();

	function ubah(delta: number) {
		nilai = Math.min(max, Math.max(min, nilai + delta));
	}
</script>

<div class="flex items-center gap-2">
	<button
		type="button"
		onclick={() => ubah(-1)}
		disabled={nilai <= min}
		aria-label="Kurangi"
		class="flex size-11 flex-none items-center justify-center rounded-action border border-line-strong bg-surface text-ink disabled:opacity-40"
	>
		<span aria-hidden="true" class="text-lg leading-none">−</span>
	</button>

	<label class="flex min-w-0 flex-1 items-baseline justify-center gap-1">
		<span class="sr-only">Jumlah ({satuan}), maksimal {max}</span>
		<input
			type="number"
			name={nama}
			bind:value={nilai}
			{min}
			{max}
			inputmode="numeric"
			class="w-16 border-0 bg-transparent p-0 text-center text-xl font-bold text-ink"
		/>
		<span class="text-sm text-ink-muted">{satuan}</span>
	</label>

	<button
		type="button"
		onclick={() => ubah(1)}
		disabled={nilai >= max}
		aria-label="Tambah"
		class="flex size-11 flex-none items-center justify-center rounded-action border border-line-strong bg-surface text-ink disabled:opacity-40"
	>
		<Icon nama="tambah" ukuran={18} tebal={2.5} />
	</button>
</div>

{#if nilai >= max}
	<p class="text-xs text-ink-muted">Maksimal {max} {satuan} — sebanyak yang disarankan asisten.</p>
{/if}
