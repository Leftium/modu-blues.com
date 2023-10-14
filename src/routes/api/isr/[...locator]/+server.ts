import { json as jsonResponse } from '@sveltejs/kit';

import { GCP_API_KEY } from '$env/static/private';

export const config = {
	isr: {
		expiration: 10,
		bypassToken: 'TrueTrueTrueTrueTrueTrueTrueTrue'
	}
};

type ApiResponse = {
	generatedAt: string;
	locator: string;
	contentType: string | null;
	url: string;
	text?: string;
	json?: unknown;
};

function parseGoogleForm(html: string) {
	return {
		html
	};
}

export const GET = async ({ params }) => {
	/***
    params.locator

    - sheet (Google sheets URL or ID)
        - https://docs.google.com/spreadsheets/d/13vBBjqXnVfXk4zu-rcj7b3XG_BFxNPKBJgywckdIO_U/edit?resourcekey#gid=426369713
        - https://sheets.googleapis.com/v4/spreadsheets/13vBBjqXnVfXk4zu-rcj7b3XG_BFxNPKBJgywckdIO_U/values/A:ZZZ1?key=AIzaSyDI-_ALr1kkTzo9VNZwwZnJlHNaJUJCj8U
    - form (Google forms URL or ID)
	    - https://forms.gle/QJYo684gH5yw1wnKA
	    - https://docs.google.com/forms/d/e/1FAIpQLSfXm6FkpT5GbnFxUs_oeDXXnhLiMGJbzIPb0NeQNGFKurUqsQ/viewform
	- url

    ***/

	const fetchUrl = new URL(params.locator);

	// Link to Google sheet:
	const matches = fetchUrl.href.match(/^https:\/\/docs.google.com\/spreadsheets\/d\/([^/]*)/);
	if (matches) {
		fetchUrl.href = `https://sheets.googleapis.com/v4/spreadsheets/${matches[1]}/values/A:ZZZ1`;
	}

	if (/^https:\/\/sheets.googleapis.com/.test(fetchUrl.href)) {
		fetchUrl.searchParams.append('key', GCP_API_KEY);
	}

	const resp = await fetch(fetchUrl);
	const contentType = resp.headers.get('content-type');
	const text = await resp.text();

	let json;

	// Link to Google form:
	if (/^https:\/\/(forms.gle\/)|(docs.google.com\/forms\/d\/e)/.test(fetchUrl.href)) {
		json = parseGoogleForm(text);
	}

	if (!json) {
		try {
			json = JSON.parse(text);
		} catch (e) {
			console.log(e);
		}
	}

	const response: ApiResponse = {
		generatedAt: new Date().toISOString(),
		locator: params.locator,
		url: fetchUrl.href,
		contentType
	};

	if (json) {
		response.json = json;
	} else {
		response.text = text;
	}

	return jsonResponse(response);
};

export const HEAD = async () => {
	return new Response('', {
		headers: {
			'generated-at': new Date().toISOString()
		}
	});
};
