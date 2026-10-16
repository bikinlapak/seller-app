<script lang="ts">
	/*
	 * Penanda "dibuat AI". Wajib ada di setiap teks atau kartu yang dihasilkan
	 * model — lihat docs/plan/04-design-system.md.
	 */
	let { kecil = false }: { kecil?: boolean } = $props();
</script>

<span
	title="Dibuat oleh AI"
	class={[
		'rounded-full bg-chip font-bold text-ink-label',
		kecil ? 'px-[7px] py-px text-[11px]' : 'px-2 py-0.5 text-[11px]'
	]}>AI</span
>
