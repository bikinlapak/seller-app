import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	SELLER_SVC_URL: {
		description: 'Alamat seller-svc. Hanya dipakai di sisi server.',
		schema: (value) => (value || 'http://127.0.0.1:8080').replace(/\/+$/, '')
	}
});
