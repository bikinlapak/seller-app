<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	/*
	 * The chat composer. It sits on the assistant home and inside every thread,
	 * because in this design chat is the core — not one feature among a menu.
	 *
	 * The camera button is the waste-photo path, the action used most often, so
	 * it stays within thumb reach.
	 */
	let {
		action = '?/send',
		cameraActive = false,
		cameraHref
	}: { action?: string; cameraActive?: boolean; cameraHref?: string } = $props();
</script>

<form
	method="POST"
	{action}
	class="flex items-center gap-2 border-t border-line bg-surface px-3 pt-2.5"
	style="padding-bottom: calc(1.125rem + env(safe-area-inset-bottom, 0px))"
>
	<button
		type="button"
		aria-label="Attach"
		class="flex size-11 flex-none items-center justify-center rounded-[22px] border border-line bg-cream text-ink"
	>
		<Icon name="plus" size={20} />
	</button>

	{#if cameraHref}
		<a
			href={cameraHref}
			aria-label="Camera"
			class={[
				'flex size-11 flex-none items-center justify-center rounded-[22px]',
				cameraActive
					? 'border-[1.5px] border-pine-600 bg-pine-100 text-pine-600'
					: 'border border-line bg-cream text-ink'
			]}
		>
			<Icon name="camera" size={20} />
		</a>
	{:else}
		<button
			type="button"
			aria-label="Camera"
			class={[
				'flex size-11 flex-none items-center justify-center rounded-[22px]',
				cameraActive
					? 'border-[1.5px] border-pine-600 bg-pine-100 text-pine-600'
					: 'border border-line bg-cream text-ink'
			]}
		>
			<Icon name="camera" size={20} />
		</button>
	{/if}

	<label class="flex min-w-0 flex-1">
		<span class="sr-only">Write a message</span>
		<input
			type="text"
			name="message"
			placeholder="Ask or request anything…"
			class="h-11 min-w-0 flex-1 rounded-[22px] border border-line bg-cream px-3.5 text-[15px] text-ink"
		/>
	</label>

	<button
		type="submit"
		aria-label="Send"
		class="flex size-11 flex-none items-center justify-center rounded-[22px] bg-pine-600 text-white"
	>
		<Icon name="send" size={20} />
	</button>
</form>
