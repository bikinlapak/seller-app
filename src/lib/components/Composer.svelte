<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '#lib/components/Icon.svelte';
	import { prepare } from '#lib/photo.js';

	/*
	 * The chat composer. It sits on the assistant home and inside every thread,
	 * because in this design chat is the core — not one feature among a menu.
	 *
	 * The camera button is the waste-photo path, the action used most often, so
	 * it stays within thumb reach. Outside the waste thread it links there
	 * (`cameraHref`); inside it (`upload`) it opens the camera and sends the
	 * photo, re-encoded on the device so no location data leaves the phone.
	 */
	let {
		action = '?/send',
		cameraActive = false,
		cameraHref,
		upload = false
	}: { action?: string; cameraActive?: boolean; cameraHref?: string; upload?: boolean } = $props();

	let photoForm: HTMLFormElement | undefined = $state();
	let photoInput: HTMLInputElement | undefined = $state();
	let uploading = $state(false);
	let sending = $state(false);

	const cameraClass = $derived([
		'flex size-11 flex-none items-center justify-center rounded-[22px]',
		cameraActive || upload
			? 'border-[1.5px] border-pine-600 bg-pine-100 text-pine-600'
			: 'border border-line bg-cream text-ink'
	]);
</script>

{#if upload}
	<form
		bind:this={photoForm}
		method="POST"
		action="?/photo"
		enctype="multipart/form-data"
		class="hidden"
		use:enhance={async ({ formData }) => {
			uploading = true;
			const file = formData.get('photo');
			if (file instanceof File && file.size > 0) {
				try {
					formData.set('photo', await prepare(file), 'leftovers.jpg');
				} catch {
					// Unsupported format in this browser: the server strips
					// metadata anyway, so send the original.
				}
			}
			return async ({ update }) => {
				uploading = false;
				if (photoInput) photoInput.value = '';
				await update({ reset: false });
			};
		}}
	>
		<input
			bind:this={photoInput}
			type="file"
			name="photo"
			accept="image/jpeg,image/png,image/webp"
			capture="environment"
			onchange={() => photoForm?.requestSubmit()}
		/>
	</form>
{/if}

<form
	method="POST"
	{action}
	use:enhance={() => {
		sending = true;
		return async ({ update }) => {
			sending = false;
			await update();
		};
	}}
	class="flex flex-none items-center gap-2 border-t border-line bg-surface px-3 pt-2.5"
	style="padding-bottom: calc(1.125rem + env(safe-area-inset-bottom, 0px))"
>
	{#if cameraHref}
		<a href={cameraHref} aria-label="Photograph leftovers" class={cameraClass}>
			<Icon name="camera" size={20} />
		</a>
	{:else if upload}
		<button
			type="button"
			aria-label={uploading ? 'Uploading photo' : 'Take a photo of leftovers'}
			disabled={uploading}
			onclick={() => photoInput?.click()}
			class={[cameraClass, uploading && 'animate-pulse']}
		>
			<Icon name="camera" size={20} />
		</button>
	{/if}

	<label class="flex min-w-0 flex-1">
		<span class="sr-only">Write a message</span>
		<input
			type="text"
			name="message"
			required
			maxlength="500"
			autocomplete="off"
			placeholder={uploading ? 'Reading the photo…' : 'Ask or request anything…'}
			class="h-11 min-w-0 flex-1 rounded-[22px] border border-line bg-cream px-3.5 text-[15px] text-ink"
		/>
	</label>

	<button
		type="submit"
		aria-label="Send"
		disabled={sending}
		class="flex size-11 flex-none items-center justify-center rounded-[22px] bg-pine-600 text-white disabled:opacity-60"
	>
		<Icon name="send" size={20} />
	</button>
</form>
