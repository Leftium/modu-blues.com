export const load = async ({ url, fetch }) => {
	const urlTarget = url.searchParams.get('u');

	const fetchUrl = `/api/isr/${urlTarget}`;

	const resp = await fetch(fetchUrl);
	const json = await resp.json();

	return json;
};
