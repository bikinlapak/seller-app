<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';

	let { data } = $props();
</script>

<PageHeader title="Beranda" description="Ringkasan toko kamu." />

<section class="max-w-md rounded-card bg-white p-5 shadow-e1">
	<h2 class="font-semibold">Status layanan</h2>
	{#if data.health}
		<p class="mt-2 text-sukses" data-testid="svc-status">
			seller-svc terhubung (v{data.health.version})
		</p>
	{:else}
		<p class="mt-2 text-error" data-testid="svc-status">
			seller-svc belum bisa dihubungi. Cek <code>SELLER_SVC_URL</code>.
		</p>
	{/if}
</section>
