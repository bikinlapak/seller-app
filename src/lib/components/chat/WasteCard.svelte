<script lang="ts">
	import { enhance } from '$app/forms';
	import { plural } from '#lib/format.js';
	import type { Severity, WasteCard, WasteItem } from '#lib/types/api.js';

	/*
	 * The vision result as a form: per item a count the merchant can correct
	 * and a destination, then a "not sure" block for anything below the
	 * confidence threshold. Nothing is recorded until "Record".
	 *
	 * Rules from the design, enforced again by seller-svc: destinations are
	 * filtered by the item's condition (past its date: compost or discard
	 * only), and "Discard" is always an explicit choice — never preselected.
	 */
	let { card }: { card: WasteCard } = $props();

	const preselected = (dests: { id: string; selected: boolean }[]) =>
		dests.find((d) => d.selected)?.id ?? dests[0]?.id ?? '';

	// svelte-ignore state_referenced_locally
	let chosen = $state(
		Object.fromEntries(card.items.map((i) => [i.id, preselected(i.destinations)]))
	);
	// svelte-ignore state_referenced_locally
	let counts = $state(Object.fromEntries(card.items.map((i) => [i.id, i.quantity])));
	// svelte-ignore state_referenced_locally
	let pick = $state('');
	// svelte-ignore state_referenced_locally
	let unsureDest = $state(card.uncertain ? preselected(card.uncertain.destinations) : '');

	const idempotencyKey = crypto.randomUUID();
	let sending = $state(false);

	const severityColour: Record<Severity, string> = {
		ok: 'text-sukses',
		warn: 'text-kunyit-700',
		critical: 'text-danger'
	};

	const donating = $derived(
		Object.values(chosen).includes('donated') ||
			(pick && pick !== 'none' && unsureDest === 'donated')
	);
	const label = (item: WasteItem) => `${item.name}`;
	const open = $derived(card.state === 'open');
</script>

<article class="bubble-agent overflow-hidden border border-line bg-surface">
	<div class="flex items-center justify-between border-b border-line-soft px-3.5 py-2.5">
		<h2 class="label-section m-0 text-pine-600">{card.label}</h2>
		<span class="text-xs text-ink-muted">{card.value}</span>
	</div>

	<form
		method="POST"
		action="?/waste"
		use:enhance={() => {
			sending = true;
			return async ({ update }) => {
				sending = false;
				await update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="token" value={card.token} />
		<input type="hidden" name="idempotencyKey" value={idempotencyKey} />

		{#each card.items as item (item.id)}
			<div class="flex flex-col gap-1.5 border-b border-line-soft px-3.5 py-2.5">
				<input type="hidden" name="item" value={item.id} />
				<div class="flex items-center justify-between gap-2">
					<span class="text-sm font-semibold">{label(item)}</span>
					<span class={['flex-none text-xs font-semibold', severityColour[item.severity]]}
						>{item.severityLabel}</span
					>
				</div>

				<label class="flex items-center gap-2 text-[13px] text-ink-label">
					Count
					<input
						type="number"
						name="qty-{item.id}"
						bind:value={counts[item.id]}
						min="1"
						max={item.maxQuantity}
						disabled={!open}
						class="h-9 w-16 rounded-lg border border-line-strong bg-cream px-2 text-center text-sm font-bold"
					/>
					{plural(item.unit, counts[item.id])}
				</label>

				<fieldset class="m-0 flex flex-wrap gap-1.5 border-0 p-0" disabled={!open}>
					<legend class="sr-only">Destination for {label(item)}</legend>
					{#each item.destinations as destination (destination.id)}
						{@const selected = chosen[item.id] === destination.id}
						<label
							class={[
								'flex min-h-[34px] cursor-pointer items-center rounded-full px-3 text-[13px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-pine-600',
								selected
									? 'border-[1.5px] border-pine-600 bg-pine-100 font-bold text-pine-800'
									: 'border border-line-strong bg-surface text-ink'
							]}
						>
							<input
								type="radio"
								name="dest-{item.id}"
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
			{@const u = card.uncertain}
			<div class="flex flex-col gap-1.5 bg-surface-warn px-3.5 py-2.5">
				<input type="hidden" name="item" value={u.itemId} />
				<input type="hidden" name="qty-{u.itemId}" value={u.quantity} />
				<p class="m-0 text-sm font-semibold text-kunyit-700">
					Not sure ({u.confidence}%): what is this?
				</p>
				<fieldset class="m-0 flex flex-wrap gap-1.5 border-0 p-0" disabled={!open}>
					<legend class="sr-only">Which product is the {u.label}?</legend>
					{#each [...u.candidates, { id: 'none', name: 'Not one of our products' }] as c (c.id)}
						<label
							class={[
								'flex min-h-[34px] cursor-pointer items-center rounded-full px-3 text-[13px] font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-pine-600',
								pick === c.id
									? 'border-[1.5px] border-pine-600 bg-pine-600 text-white'
									: c.id === 'none'
										? 'border border-line-strong bg-surface text-ink-muted'
										: 'border border-pine-600 bg-surface text-pine-600'
							]}
						>
							<input
								type="radio"
								name="pick-{u.itemId}"
								value={c.id}
								checked={pick === c.id}
								onchange={() => (pick = c.id)}
								class="sr-only"
							/>
							{c.name}
						</label>
					{/each}
				</fieldset>
				{#if pick && pick !== 'none'}
					<fieldset class="m-0 flex flex-wrap gap-1.5 border-0 p-0" disabled={!open}>
						<legend class="mb-1 text-xs text-ink-muted">Where does it go?</legend>
						{#each u.destinations as d (d.id)}
							<label
								class={[
									'flex min-h-[34px] cursor-pointer items-center rounded-full px-3 text-[13px]',
									unsureDest === d.id
										? 'border-[1.5px] border-pine-600 bg-pine-100 font-bold text-pine-800'
										: 'border border-line-strong bg-surface text-ink'
								]}
							>
								<input
									type="radio"
									name="dest-{u.itemId}"
									value={d.id}
									checked={unsureDest === d.id}
									onchange={() => (unsureDest = d.id)}
									class="sr-only"
								/>
								{d.label}
							</label>
						{/each}
					</fieldset>
				{:else if !pick}
					<!-- Unanswered counts as "not ours": nothing is recorded for it. -->
					<input type="hidden" name="pick-{u.itemId}" value="none" />
				{/if}
			</div>
		{/if}

		<div class="flex flex-col gap-1.5 px-3.5 pt-2.5 pb-3">
			{#if open}
				<button
					type="submit"
					disabled={sending}
					class="flex min-h-[46px] items-center justify-center rounded-field bg-pine-600 text-[15px] font-bold text-white disabled:opacity-60"
					>{sending
						? 'Recording…'
						: donating
							? 'Record and continue to donation'
							: 'Record leftovers'}</button
				>
			{:else}
				<p class="m-0 text-center text-[13px] text-ink-muted">Recorded.</p>
			{/if}
			<p class="m-0 text-center text-xs text-ink-muted">{card.note}</p>
		</div>
	</form>
</article>
