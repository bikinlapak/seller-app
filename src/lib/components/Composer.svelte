<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	/*
	 * Komposer chat. Ada di beranda asisten dan di setiap thread, karena di
	 * desain ini chat adalah inti — bukan satu fitur di antara menu lain.
	 *
	 * Tombol kamera adalah jalur "foto sisa", aksi yang paling sering dipakai,
	 * jadi letaknya tetap dalam jangkauan jempol.
	 */
	let {
		aksi = '?/kirim',
		kameraAktif = false,
		kameraHref
	}: { aksi?: string; kameraAktif?: boolean; kameraHref?: string } = $props();
</script>

<form
	method="POST"
	action={aksi}
	class="flex items-center gap-2 border-t border-line bg-surface px-3 pt-2.5"
	style="padding-bottom: calc(1.125rem + env(safe-area-inset-bottom, 0px))"
>
	<button
		type="button"
		aria-label="Lampirkan"
		class="flex size-11 flex-none items-center justify-center rounded-[22px] border border-line bg-cream text-ink"
	>
		<Icon nama="tambah" ukuran={20} />
	</button>

	{#if kameraHref}
		<a
			href={kameraHref}
			aria-label="Kamera"
			class={[
				'flex size-11 flex-none items-center justify-center rounded-[22px]',
				kameraAktif
					? 'border-[1.5px] border-pine-600 bg-pine-100 text-pine-600'
					: 'border border-line bg-cream text-ink'
			]}
		>
			<Icon nama="kamera" ukuran={20} />
		</a>
	{:else}
		<button
			type="button"
			aria-label="Kamera"
			class={[
				'flex size-11 flex-none items-center justify-center rounded-[22px]',
				kameraAktif
					? 'border-[1.5px] border-pine-600 bg-pine-100 text-pine-600'
					: 'border border-line bg-cream text-ink'
			]}
		>
			<Icon nama="kamera" ukuran={20} />
		</button>
	{/if}

	<label class="flex min-w-0 flex-1">
		<span class="sr-only">Tulis pesan</span>
		<input
			type="text"
			name="pesan"
			placeholder="Tanya atau minta apa saja…"
			class="h-11 min-w-0 flex-1 rounded-[22px] border border-line bg-cream px-3.5 text-[15px] text-ink"
		/>
	</label>

	<button
		type="submit"
		aria-label="Kirim"
		class="flex size-11 flex-none items-center justify-center rounded-[22px] bg-pine-600 text-white"
	>
		<Icon nama="kirim" ukuran={20} />
	</button>
</form>
