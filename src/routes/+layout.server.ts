import { error } from '@sveltejs/kit';

export const load = async ({ fetch, url }) => {
	console.log('+layout.server load');
	const resp = await fetch(
		url.origin +
			'/api/isr/https://docs.google.com/spreadsheets/d/1uFQ8W20dkHr01KB_zaoUkLU_1YhIAt7DtNOUNiHqKAk/edit'
	);

	if (resp.status === 200) {
		console.log(resp);
		console.log('Getting JSON...');
		const json = await resp.json();
		console.log({ json });

		const values = [...json.json.values];
		values.shift();

		const routeMap: Record<string, unknown> = {};
		const routes = values.map(([path, title, formUrl]) => {
			path = '/' + path;

			routeMap[path] = { title, formUrl };

			return { path, title, formUrl };
		});

		return { routes, routeMap };
	} else {
		if (resp.status === 404) {
			console.log(resp);
			const text = await resp.text();
			console.log(text);
		}

		throw error(555);
	}
};
