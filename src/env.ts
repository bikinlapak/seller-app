import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	SELLER_SVC_URL: {
		description: 'Address of seller-svc. Server side only.',
		schema: (value) => (value || 'http://127.0.0.1:8080').replace(/\/+$/, '')
	},
	SELLER_SVC_AUDIENCE: {
		description:
			'ID token audience for calling an IAM-protected seller-svc ' +
			'(usually the same as SELLER_SVC_URL). Empty locally: there is no ' +
			'metadata server, and a local seller-svc asks for no token.',
		schema: (value) => value ?? ''
	},
	SELLER_SVC_MOCK: {
		description:
			'Use the fixtures in src/lib/mock/ and do not contact seller-svc. ' +
			'Still on by default so `npm run dev` runs without a backend; ' +
			'seller-svc itself serves all of these endpoints. ' +
			'Set `false` to use it.',
		schema: (value) => value !== 'false' && value !== '0'
	}
});
