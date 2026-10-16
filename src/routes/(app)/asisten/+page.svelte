<script lang="ts">
	import ChatHeader from '#lib/components/ChatHeader.svelte';
	import Composer from '#lib/components/Composer.svelte';
	import PerhatianList from '#lib/components/PerhatianList.svelte';
	import PerintahCepat from '#lib/components/PerintahCepat.svelte';

	let { data } = $props();
</script>

<svelte:head><title>Asisten Lapak · bikinlapak</title></svelte:head>

{#if data.home}
	<ChatHeader toko={data.home.toko} pengaturanHref="/saya" />

	<main class="flex flex-1 flex-col gap-3 px-4 py-3.5">
		<h1 class="m-0 font-display text-2xl font-normal text-pine-600">{data.home.toko.sapaan}</h1>
		<PerhatianList perhatian={data.home.perhatian} />
		<PerintahCepat perintah={data.home.perintah} />
	</main>

	<Composer kameraHref="/asisten/sisa" />
{:else}
	<main class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
		<p class="m-0 text-ink-muted">Asisten belum bisa dihubungi.</p>
		<a
			href="/asisten"
			class="flex min-h-11 items-center rounded-field bg-pine-600 px-4 font-semibold text-white"
			>Coba lagi</a
		>
	</main>
{/if}
