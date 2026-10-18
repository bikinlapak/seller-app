import { dashboard, wasteReport } from '#lib/server/api/catalogue.js';

export const load = async ({ fetch }) => {
	// Independent sections: one failing does not blank the other.
	const [waste, dash] = await Promise.all([wasteReport(fetch), dashboard(fetch)]);
	return { waste, dash };
};
