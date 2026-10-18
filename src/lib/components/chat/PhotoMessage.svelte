<script lang="ts">
	import type { DetectionBox } from '#lib/types/api.js';

	/*
	 * A photo the merchant sent, with detection boxes over it. A solid green
	 * box means the model is confident; a dashed amber one means it is not, and
	 * that item turns up in the waste card's "not sure" block.
	 *
	 * Box positions are percentages, so they do not depend on screen width.
	 */
	let { label, url, boxes }: { label: string; url?: string; boxes: DetectionBox[] } = $props();
</script>

<figure
	class="bubble-staff relative m-0 h-[165px] w-[220px] flex-none self-end overflow-hidden bg-photo-base"
>
	{#if url}
		<img src={url} alt={label} class="absolute inset-0 size-full object-cover" />
	{/if}
	{#each boxes as box, i (i)}
		<span
			class={[
				'absolute rounded-md',
				box.confident ? 'border-2 border-box-confident' : 'border-2 border-dashed border-kunyit-400'
			]}
			style="left: {box.x}%; top: {box.y}%; width: {box.w}%; height: {box.h}%"
		></span>
	{/each}
	<figcaption
		class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 pt-4 pb-1 text-right text-[11px] text-white"
	>
		{label}
	</figcaption>
</figure>
