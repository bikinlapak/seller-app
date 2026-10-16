import { redirect } from '@sveltejs/kit';

// Chat adalah inti aplikasi, jadi penjual langsung masuk ke Asisten Lapak.
export const load = () => {
	redirect(307, '/asisten');
};
