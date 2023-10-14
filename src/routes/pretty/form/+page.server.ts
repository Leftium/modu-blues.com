export const load = async ({ url, fetch }) => {
	const urlTarget = url.searchParams.get('u');

	const fetchUrl = `/api/isr/${urlTarget}`;

	const resp = await fetch(fetchUrl);
	const json = await resp.json();

	// Adjust Google forms JSON:
	const formJson = {
		headerImageUrl: json.json.headerImageUrl,
		collectEmails: json.json.collectEmails,
		fields: json.json.questions
	};

	// Insert after first image/video:
	formJson.fields.splice(1, 0, {
		itemId: null,
		title: json.json.title,
		titleHtml: json.json.titleHtml,
		description: json.json.description,
		descriptionHtml: json.json.descriptionHtml,
		type: 'TITLE_AND_DESCRIPTION',
		options: [],
		required: false
	});

	return { formJson };
};
