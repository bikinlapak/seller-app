<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	/*
	 * Quantity stepper. `max` comes from the action token's cap: the merchant
	 * may revise the quantity down, never above what the assistant proposed.
	 * The backend rejects anything over the cap; the UI must not offer it at all.
	 */
	let {
		value = $bindable(),
		max,
		min = 1,
		unit,
		name = 'quantity'
	}: { value: number; max: number; min?: number; unit: string; name?: string } = $props();

	function nudge(delta: number) {
		value = Math.min(max, Math.max(min, value + delta));
	}
</script>

<div class="flex items-center gap-2">
	<button
		type="button"
		onclick={() => nudge(-1)}
		disabled={value <= min}
		aria-label="Decrease"
		class="flex size-11 flex-none items-center justify-center rounded-action border border-line-strong bg-surface text-ink disabled:opacity-40"
	>
		<span aria-hidden="true" class="text-lg leading-none">−</span>
	</button>

	<label class="flex min-w-0 flex-1 items-baseline justify-center gap-1">
		<span class="sr-only">Quantity ({unit}), maximum {max}</span>
		<input
			type="number"
			{name}
			bind:value
			{min}
			{max}
			inputmode="numeric"
			class="w-16 border-0 bg-transparent p-0 text-center text-xl font-bold text-ink"
		/>
		<span class="text-sm text-ink-muted">{unit}</span>
	</label>

	<button
		type="button"
		onclick={() => nudge(1)}
		disabled={value >= max}
		aria-label="Increase"
		class="flex size-11 flex-none items-center justify-center rounded-action border border-line-strong bg-surface text-ink disabled:opacity-40"
	>
		<Icon name="plus" size={18} weight={2.5} />
	</button>
</div>

{#if value >= max}
	<p class="text-xs text-ink-muted">Maximum {max} {unit} — as much as the assistant suggested.</p>
{/if}
