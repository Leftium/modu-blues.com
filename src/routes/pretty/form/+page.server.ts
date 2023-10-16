export const load = async ({ url, fetch }) => {
	const urlTarget = url.searchParams.get('u');

	const fetchUrl = `/api/isr/${urlTarget}`;

	const resp = await fetch(fetchUrl);
	const json = await resp.json();

	// Adjust Google forms JSON:
	const formJson = {
		headerImageUrl: json.json.headerImageUrl,
		title: json.json.title,
		collectEmails: json.json.collectEmails,
		hasInput: false,
		fields: json.json.questions
	};

	// Insert initial TITLE_AND_DESCRIPTION after first item if image/video:
	const insertIndex = ['IMAGE', 'VIDEO'].includes(formJson.fields[0].type) ? 1 : 0;

	formJson.fields.splice(insertIndex, 0, {
		itemId: null,
		title: json.json.title,
		titleHtml: json.json.titleHtml,
		description: json.json.description,
		descriptionHtml: json.json.descriptionHtml,
		type: 'TITLE_AND_DESCRIPTION',
		options: [],
		required: false
	});

	const types = formJson.fields.map((field: { type: string }) => field.type);

	if (types.includes('PARAGRAPH_TEXT')) {
		formJson.hasInput = true;
	}

	return { formJson };
};
