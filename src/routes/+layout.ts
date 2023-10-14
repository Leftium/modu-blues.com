export const load = async ({ fetch }) => {
	const resp = fetch(
		'/api/isr/https://docs.google.com/spreadsheets/d/1uFQ8W20dkHr01KB_zaoUkLU_1YhIAt7DtNOUNiHqKAk/edit'
	);

	const json = (await resp).json();

	return json;
};
