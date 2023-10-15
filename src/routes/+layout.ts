export const load = async ({ fetch }) => {
	const resp = await fetch(
		'/api/isr/https://docs.google.com/spreadsheets/d/1uFQ8W20dkHr01KB_zaoUkLU_1YhIAt7DtNOUNiHqKAk/edit'
	);

	const json = await resp.json();

	const values = [...json.json.values];
	values.shift();

	const routes = values.map(([path, title, formUrl]) => {
		return {
			path: '/' + path,
			title,
			formUrl
		};
	});

	return { routes };
};
