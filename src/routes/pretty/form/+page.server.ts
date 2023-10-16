export const load = async ({ url, fetch }) => {
	const urlTarget = url.searchParams.get('u');

	const fetchUrl = `/api/isr/${urlTarget}`;

	const resp = await fetch(fetchUrl);
	const json = await resp.json();

	// Adjust Google forms JSON:
	const formJson = {
		formUrl: json.json.formUrl,
		formAction: json.json.formAction,
		headerImageUrl: json.json.headerImageUrl,
		title: json.json.title,
		collectEmails: json.json.collectEmails,
		hasInput: false,
		hasRequired: false,
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

	const INPUT_TYPES = ['TEXT', 'PARAGRAPH_TEXT', 'MULTIPLE_CHOICE', 'DROPDOWN', 'CHECKBOXES'];

	let inputIndex = 1;
	formJson.fields.forEach((field: { type: string; inputIndex: number; required: any }) => {
		if (INPUT_TYPES.includes(field.type)) {
			formJson.hasInput = true;
			field.inputIndex = inputIndex++;

			if (field.required) {
				formJson.hasRequired = true;
			}
		}
	});

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

		const returnValue = {
			status: resp.status,
			statusText: resp.statusText
		};
		return returnValue;
	}
};
