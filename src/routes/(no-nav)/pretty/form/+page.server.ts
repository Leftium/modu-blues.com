import { fail } from '@sveltejs/kit';

export const load = async ({ url, fetch }) => {
	const urlTarget = url.searchParams.get('u');

	const fetchUrl = `/api/isr/${urlTarget}`;

	const resp = await fetch(fetchUrl);
	const json = await resp.json();

	// Unwrap from inside meta data.
	const formJson = json.json;

	return { formJson };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const fetchUrl = formData.get('formAction') as string;

		const resp = await fetch(fetchUrl, {
			method: 'POST',
			body: formData
		});

		if (resp.status !== 200) {
			return fail(resp.status, {
				status: resp.status,
				statusText: resp.statusText
			});
		}

		return { success: true };
	}
};
