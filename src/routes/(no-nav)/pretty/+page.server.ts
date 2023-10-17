import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		throw redirect(302, `/pretty/form/?u=${formData.get('url')}`);
	}
};
