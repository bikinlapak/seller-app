<script lang="ts">
	import type { Severity, WasteCard, WasteItem } from '#lib/types/api.js';

	/*
	 * The AI vision result: what was detected, a destination per item, then a
	 * "not sure" block for anything below the confidence threshold.
	 *
	 * Rule from the design: destinations are filtered by the item's condition.
	 * Anything past its date cannot be sold or donated, and "Discard" is always
	 * an explicit choice — never preselected.
	 */
	let { card }: { card: WasteCard } = $props();

	// svelte-ignore state_referenced_locally
	let chosen = $state(
		Object.fromEntries(
			card.items.map((i) => [
				i.id,
				i.destinations.find((d) => d.selected)?.id ?? i.destinations[0]?.id
			])
		)
	);

	const severityColour: Record<Severity, string> = {
		ok: 'text-sukses',
		warn: 'text-kunyit-700',
		critical: 'text-danger'
	};

	function label(item: WasteItem) {
		return `${item.name} × ${item.quantity}`;
	}
</script>

<article class="bubble-agent overflow-hidden border border-line bg-surface">
	<div class="flex items-center justify-between border-b border-line-soft px-3.5 py-2.5">
		<h2 class="label-section m-0 text-pine-600">{card.label}</h2>
		<span class="text-xs text-ink-muted">{card.value}</span>
	</div>

	{#each card.items as item (item.id)}
		<div class="flex flex-col gap-1.5 border-b border-line-soft px-3.5 py-2.5">
			<div class="flex justify-between gap-2">
				<span class="text-sm font-semibold">{label(item)}</span>
				<span class={['flex-none text-xs font-semibold', severityColour[item.severity]]}
					>{item.severityLabel}</span
				>
			</div>

			<fieldset class="m-0 flex flex-wrap gap-1.5 border-0 p-0">
				<legend class="sr-only">Destination for {label(item)}</legend>
				{#each item.destinations as destination (destination.id)}
					{@const selected = chosen[item.id] === destination.id}
					<label
						class={[
							'flex min-h-[34px] cursor-pointer items-center rounded-full px-3 text-[13px]',
							selected
								? 'border-[1.5px] border-pine-600 bg-pine-100 font-bold text-pine-800'
								: 'border border-line-strong bg-surface text-ink'
						]}
					>
						<input
							type="radio"
							name="destination-{item.id}"
							value={destination.id}
							checked={selected}
							onchange={() => (chosen[item.id] = destination.id)}
							class="sr-only"
						/>
						{destination.label}
					</label>
				{/each}
			</fieldset>

			{#if item.warning}
				<p class="m-0 text-xs text-ink-muted">{item.warning}</p>
			{/if}
		</div>
	{/each}

	{#if card.uncertain}
		<div class="flex flex-col gap-1.5 bg-surface-warn px-3.5 py-2.5">
			<p class="m-0 text-sm font-semibold text-kunyit-700">
				Not sure ({card.uncertain.confidence}%): what is this?
			</p>
			<div class="flex flex-wrap gap-1.5">
				{#each card.uncertain.candidates as candidate (candidate.id)}
					<button
						type="button"
						class="min-h-[34px] rounded-full border border-pine-600 bg-surface px-3 text-[13px] font-semibold text-pine-600"
						>{candidate.name}</button
					>
				{/each}
				<button
					type="button"
					class="min-h-[34px] rounded-full border border-line-strong bg-surface px-3 text-[13px] font-semibold text-ink-muted"
					>Not one of our products</button
				>
			</div>
		</div>
	{/if}

	<div class="flex flex-col gap-1.5 px-3.5 pt-2.5 pb-3">
		<a
			href="/assistant/donation"
			class="flex min-h-[46px] items-center justify-center rounded-field bg-pine-600 text-[15px] font-bold text-white"
			>Record and continue to donation</a
		>
		<p class="m-0 text-center text-xs text-ink-muted">{card.note}</p>
	</div>
</article>
