import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	SELLER_SVC_URL: {
		description: 'Alamat seller-svc. Hanya dipakai di sisi server.',
		schema: (value) => (value || 'http://127.0.0.1:8080').replace(/\/+$/, '')
	},
	SELLER_SVC_MOCK: {
		description:
			'Pakai data tiruan dari src/lib/mock/ dan jangan hubungi seller-svc. ' +
			'Masih aktif secara bawaan supaya `npm run dev` jalan tanpa backend; ' +
			'seller-svc sendiri sudah melayani semua endpoint ini. ' +
			'Setel `false` untuk memakainya.',
		schema: (value) => value !== 'false' && value !== '0'
	}
});
