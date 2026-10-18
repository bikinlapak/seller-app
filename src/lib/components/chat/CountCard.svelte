<script lang="ts">
	import { enhance } from '$app/forms';
	import { plural } from '#lib/format.js';
	import type { CountCard, Severity } from '#lib/types/api.js';

	/*
	 * Stock count from a photo. Per product: what the photo shows (editable),
	 * what the system says, and what that means — cover and the order the
	 * forecast implies. Those figures come from seller-svc for the photo's
	 * count; after a correction they are recomputed on confirm.
	 *
	 * Nothing changes until "Confirm counts": then stock is adjusted and the
	 * reorder suggestions for these products are recalculated.
	 */
	let { card }: { card: CountCard } = $props();

	// svelte-ignore state_referenced_locally
	let counts = $state(Object.fromEntries(card.lines.map((l) => [l.productId, l.counted])));
	// svelte-ignore state_referenced_locally
	let unsureCounts = $state(Object.fromEntries(card.unsure.map((u) => [u.itemId, u.quantity])));
	let picks = $state<Record<string, string>>({});
	let sending = $state(false);
	const idempotencyKey = crypto.randomUUID();
	const open = $derived(card.state === 'open');

	const tone: Record<Severity, string> = {
		ok: 'text-sukses',
		warn: 'text-kunyit-700',
		critical: 'text-danger'
	};
</script>

<article class="bubble-agent overflow-hidden border border-line bg-surface">
	<div class="flex items-center justify-between border-b border-line-soft px-3.5 py-2.5">
		<h2 class="label-section m-0 text-pine-600">{card.label}</h2>
		{#if !open}<span class="text-xs text-ink-muted">Confirmed</span>{/if}
	</div>

	<form
		method="POST"
		action="?/count"
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

		{#each card.lines as line (line.productId)}
			{@const edited = counts[line.productId] !== line.counted}
			<div class="flex flex-col gap-1 border-b border-line-soft px-3.5 py-2.5">
				<input type="hidden" name="line" value={line.productId} />
				<div class="flex items-center justify-between gap-2">
					<span class="text-sm font-semibold">{line.name}</span>
					<label class="flex flex-none items-center gap-1.5 text-[13px] text-ink-label">
						<span class="sr-only">Counted {line.name}</span>
						<input
							type="number"
							name="qty-{line.productId}"
							bind:value={counts[line.productId]}
							min="0"
							max="9999"
							disabled={!open}
							class="h-9 w-16 rounded-lg border border-line-strong bg-cream px-2 text-center text-sm font-bold"
						/>
						{plural(line.unit, counts[line.productId] ?? 0)}
					</label>
				</div>
				<p class="m-0 text-xs text-ink-muted">
					System: {line.system}
					{plural(line.unit, line.system)} · {edited ? 'edited' : line.differenceLabel}
				</p>
				{#if !edited}
					<p class="m-0 text-xs text-ink-muted">{line.coverLabel}</p>
					<p class={['m-0 text-[13px] font-semibold', tone[line.severity]]}>{line.needLabel}</p>
				{:else}
					<p class="m-0 text-xs text-ink-muted">Cover and order are recalculated on confirm.</p>
				{/if}
			</div>
		{/each}

		{#each card.unsure as u (u.itemId)}
			<div class="flex flex-col gap-1.5 border-b border-line-soft bg-surface-warn px-3.5 py-2.5">
				<input type="hidden" name="unsure" value={u.itemId} />
				<div class="flex items-center justify-between gap-2">
					<span class="text-sm font-semibold text-kunyit-700">Not sure: {u.label}</span>
					<input
						type="number"
						name="qty-{u.itemId}"
						bind:value={unsureCounts[u.itemId]}
						min="0"
						disabled={!open}
						aria-label="Count for {u.label}"
						class="h-9 w-16 rounded-lg border border-line-strong bg-cream px-2 text-center text-sm font-bold"
					/>
				</div>
				<fieldset class="m-0 flex flex-wrap gap-1.5 border-0 p-0" disabled={!open}>
					<legend class="sr-only">Which product is the {u.label}?</legend>
					{#each [...u.candidates, { id: 'none', name: 'Not ours' }] as c (c.id)}
						<label
							class={[
								'flex min-h-[34px] cursor-pointer items-center rounded-full px-3 text-[13px] font-semibold',
								picks[u.itemId] === c.id
									? 'border-[1.5px] border-pine-600 bg-pine-600 text-white'
									: 'border border-pine-600 bg-surface text-pine-600'
							]}
						>
							<input
								type="radio"
								name="pick-{u.itemId}"
								value={c.id}
								checked={picks[u.itemId] === c.id}
								onchange={() => (picks[u.itemId] = c.id)}
								class="sr-only"
							/>
							{c.name}
						</label>
					{/each}
				</fieldset>
			</div>
		{/each}

		{#if card.unmatched.length > 0}
			<p class="m-0 border-b border-line-soft px-3.5 py-2 text-xs text-ink-muted">
				Also seen, not in your catalog: {card.unmatched.join(', ')}
			</p>
		{/if}

		<div class="flex flex-col gap-1.5 px-3.5 pt-2.5 pb-3">
			{#if open}
				<button
					type="submit"
					disabled={sending}
					class="flex min-h-[46px] items-center justify-center rounded-field bg-pine-600 text-[15px] font-bold text-white disabled:opacity-60"
					>{sending ? 'Updating stock…' : 'Confirm counts'}</button
				>
			{/if}
			<p class="m-0 text-center text-xs text-ink-muted">{card.note}</p>
		</div>
	</form>
</article>
