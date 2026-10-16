<script lang="ts">
	import type { PerintahCepat } from '#lib/types/api.js';

	/*
	 * "Coba minta": contoh perintah yang mengajari penjual bahwa aplikasi ini
	 * dijalankan dengan bahasa biasa. Dua kolom, 56px, cukup besar untuk jempol.
	 */
	let { perintah }: { perintah: PerintahCepat[] } = $props();
</script>

<h2 class="m-0 text-[13px] font-bold text-ink-label">Coba minta</h2>
<nav aria-label="Perintah cepat" class="grid grid-cols-2 gap-2">
	{#each perintah as p (p.href)}
		<a
			href={p.href}
			class="flex min-h-14 items-center rounded-row border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink"
			>{p.label}</a
		>
	{/each}
</nav>
