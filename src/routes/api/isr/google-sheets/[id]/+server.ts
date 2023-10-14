import { json as jsonResponse } from '@sveltejs/kit';

import { GCP_API_KEY } from '$env/static/private';

export const config = {
	isr: {
		expiration: 10,
		bypassToken: 'TrueTrueTrueTrueTrueTrueTrueTrue'
	}
};

export const GET = async ({ params }) => {
	// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
	const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${params.id}/values/A:ZZZ`;
	const fetchParams = new URLSearchParams({
		key: GCP_API_KEY
	});

	const resp = await fetch(fetchUrl + '?' + fetchParams);
	const json = await resp.json();

	const generatedAt = new Date().toISOString();

	return jsonResponse({
		generatedAt,
		url: fetchUrl,
		json
	});
};

export const HEAD = async () => {
	return new Response('', {
		headers: {
			'generated-at': new Date().toISOString()
		}
	});
};
