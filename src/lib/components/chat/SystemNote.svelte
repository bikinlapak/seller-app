<script lang="ts">
	/* A pill in the middle of the thread recording what the merchant did. */
	let { text }: { text: string } = $props();
</script>

<span
	class="self-center rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted"
	>{text}</span
>
