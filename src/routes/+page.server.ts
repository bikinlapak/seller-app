import { redirect } from '@sveltejs/kit';

// Chat is the core of the app, so a merchant lands straight in the assistant.
export const load = () => {
	redirect(307, '/assistant');
};
