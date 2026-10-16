<script lang="ts">
	/* Pil di tengah thread: catatan tindakan penjual, mis. "Kamu menyetujui 9 kg". */
	let { teks }: { teks: string } = $props();
</script>

<span
	class="self-center rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted"
	>{teks}</span
>
