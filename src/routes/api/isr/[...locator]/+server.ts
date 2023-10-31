import * as cheerio from 'cheerio';

import { json as jsonResponse } from '@sveltejs/kit';

import { GCP_API_KEY } from '$env/static/private';

import type { Question, QuestionType } from '$lib';

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

enum GoogleFormsFieldTypeEnum {
	TEXT = 0,
	PARAGRAPH_TEXT = 1,
	MULTIPLE_CHOICE = 2,
	DROPDOWN = 3,
	CHECKBOXES = 4,
	SCALE = 5,
	TITLE_AND_DESCRIPTION = 6,
	GRID = 7,
	FILE_UPLOAD = 8,
	DATE = 9,
	TIME = 10,
	IMAGE = 11,
	VIDEO = 12
}

enum EmailCollectionRuleEnum {
	NONE = 1,
	VERIFIED = 2,
	INPUT = 3
}

type EmailOptions = 'NONE' | 'VERIFIED' | 'INPUT';

interface Form {
	filename: string;
	formUrl: string;
	formAction: string;
	headerImageUrl: string | null;
	title: string;
	titleHtml?: string;
	description: string | null;
	descriptionHtml?: string | null;
	collectEmails: EmailOptions;
	questions: Question[];
	error: false;
}

function parseGoogleForm(html: string) {
	let data = html.split('FB_PUBLIC_LOAD_DATA_ = ')[1];
	data = data.substring(0, data.lastIndexOf(';'));

	const jArray = JSON.parse(data);

	const description = jArray[1]?.[0] ?? null;
	const descriptionHtml = jArray[1]?.[24]?.[1] ?? null;
	const filename = jArray[3] ?? null;
	const title = jArray[1]?.[8] ?? null;
	const titleHtml = jArray[1]?.[25]?.[1] ?? null;
	const collectEmailsCodeValue = jArray[1]?.[10]?.[6] ?? null;
	const collectEmailsEnum = EmailCollectionRuleEnum[collectEmailsCodeValue];
	const collectEmails = collectEmailsEnum?.toString() ?? 'NONE';

	const arrayOfFields = jArray[1]?.[1] ?? [];

	const form: Form = {
		filename,
		formUrl: '',
		formAction: '',
		headerImageUrl: null,
		title,
		titleHtml,
		description,
		descriptionHtml,
		collectEmails: collectEmails as EmailOptions,
		questions: [],
		error: false
	};

	for (const field of arrayOfFields) {
		if (field.length < 4) {
			console.log('Continue: Non Submittable field or field without answer was found'); // Logging added
			console.log(field.length);
			console.log(field);
			continue;
		}

		const itemId = field[0];

		const questionText = field[1] as string;
		const questionDescription = (field[2] || '') as string;

		const questionTextHtml = field[11]?.[1] as string;
		const questionDescriptionHtml = (field[12]?.[1] || '') as string;

		const questionTypeCodeValue = field[3];

		const questionTypeEnum = GoogleFormsFieldTypeEnum[questionTypeCodeValue];
		const questionType = questionTypeEnum?.toString();

		const answerOptionsList: string[] = [];
		const answerOptionsListValue = field[4]?.[0]?.[1] ?? [];

		const mediaMetadata = field[6];

		const imageId = mediaMetadata?.[0];
		const youtubeId = mediaMetadata?.[3];

		const mediaWidth = mediaMetadata?.[2]?.[0];
		const mediaHeight = mediaMetadata?.[2]?.[1];

		if (answerOptionsListValue.length > 0) {
			for (const answerOption of answerOptionsListValue) {
				const option = answerOption[0]?.toString();
				if (option) {
					answerOptionsList.push(option);
				}
			}
		}

		const answerSubmissionId = field[4]?.[0]?.[0] as string;
		const isAnswerRequired = field[4]?.[0]?.[2] === 1;

		const question: Question = {
			itemId,
			title: questionText,
			titleHtml: questionTextHtml,
			description: questionDescription,
			descriptionHtml: questionDescriptionHtml,
			type: questionType as QuestionType,
			options: answerOptionsList,
			required: isAnswerRequired,
			id: answerSubmissionId,
			imageId: imageId,
			youtubeId: youtubeId,
			mediaWidth: mediaWidth,
			mediaHeight: mediaHeight
			//mediaMetaData: mediaMetadata
			//field
		};

		form.questions.push(question);
	}

	// Extract header image.
	const matches = html.match(/background-image: url\(([^)]*)/);

	if (matches?.length && matches[1]) {
		form.headerImageUrl = matches[1];
	}

	// Inject media source url's:
	const $ = cheerio.load(html);

	form.formAction = $('form').attr('action') || '';

	const itemDivs = $('div[role="list"] > div[role="listitem"]:not([jsname])');

	const media = itemDivs
		.map((_, itemDiv) => {
			const itemId = $(itemDiv).find('[data-item-id]').attr('data-item-id')?.toString();
			const imgUrl = $(itemDiv).find('img').attr('src')?.toString();

			return {
				itemId,
				imgUrl
			};
		})
		.toArray();

	media.map(({ imgUrl }, index) => {
		if (form.questions[index]) {
			if (imgUrl) {
				form.questions[index].imgUrl = imgUrl;
			}
		} else {
			console.log({ index, imgUrl });
		}
	});

	return form;
}

function adjustGoogleFormData(json: Form) {
	// Adjust Google forms JSON:
	const newJson = {
		formUrl: json.formUrl,
		formAction: json.formAction,
		headerImageUrl: json.headerImageUrl,
		title: json.title,
		collectEmails: json.collectEmails,
		hasInput: false,
		hasRequired: false,
		fields: json.questions
	};

	// Insert initial TITLE_AND_DESCRIPTION after first item if image/video:
	const insertIndex = ['IMAGE', 'VIDEO'].includes(newJson.fields[0]?.type) ? 1 : 0;

	newJson.fields.splice(insertIndex, 0, {
		itemId: 0,
		title: json.title,
		titleHtml: json.titleHtml,
		description: json.description,
		descriptionHtml: json.descriptionHtml,
		type: 'TITLE_AND_DESCRIPTION',
		options: [],
		required: false,
		id: ''
	});

	const INPUT_TYPES = ['TEXT', 'PARAGRAPH_TEXT', 'MULTIPLE_CHOICE', 'DROPDOWN', 'CHECKBOXES'];

	let inputIndex = 1;
	newJson.fields.forEach((field) => {
		if (INPUT_TYPES.includes(field.type)) {
			newJson.hasInput = true;
			field.inputIndex = inputIndex++;

			if (field.required) {
				newJson.hasRequired = true;
			}
		}
	});

	return newJson;
}

// https://stackoverflow.com/a/16233621/117030
function excelDateToJsDate(serial: number) {
	const utc_days = Math.floor(serial - 25569);
	const utc_value = utc_days * 86400;
	const date_info = new Date(utc_value * 1000);

	const fractional_day = serial - Math.floor(serial) + 0.0000001;

	let total_seconds = Math.floor(86400 * fractional_day);

	const seconds = total_seconds % 60;

	total_seconds -= seconds;

	const hours = Math.floor(total_seconds / (60 * 60));
	const minutes = Math.floor(total_seconds / 60) % 60;

	return new Date(
		date_info.getFullYear(),
		date_info.getMonth(),
		date_info.getDate(),
		hours,
		minutes,
		seconds
	);
}

function adjustGoogleSheetData(json: { sheets: { data: any[] }[] }) {
	const data = json?.sheets?.[0]?.data?.[0];

	if (!data) {
		return json;
	}

	const columnHiddenByUser = data.columnMetadata.map(
		(columnMetadatam: { hiddenByUser: boolean | undefined }) => {
			return !!columnMetadatam.hiddenByUser;
		}
	);

	const timestamps: (Date | null)[][] = [];

	const values = data.rowData.map((rowDatum: { values: any[] }, rowIndex: number) => {
		timestamps.push([]);
		return rowDatum.values
			.filter((_: unknown, columnIndex: number) => {
				return !columnHiddenByUser[columnIndex];
			})
			.map((value) => {
				let timestamp = null;
				if (value?.userEnteredFormat?.numberFormat?.type === 'DATE_TIME') {
					const excelSerialDate = value?.effectiveValue?.numberValue;
					timestamp = excelDateToJsDate(excelSerialDate);
				}
				timestamps[rowIndex].push(timestamp);
				return value.formattedValue || '';
			});
	});

	return { values, timestamps };
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
	const matches = fetchUrl.href.match(
		/^https:\/\/(docs.google.com|sheets.googleapis.com\/v4)\/spreadsheets\/(d\/)?([^/]*)/
	);
	if (matches) {
		// fetchUrl.href = `https://sheets.googleapis.com/v4/spreadsheets/${matches[3]}/values/A:ZZZ`;
		fetchUrl.href = `https://sheets.googleapis.com/v4/spreadsheets/${matches[3]}/?ranges=A:ZZZ&fields=sheets.data.columnMetadata.hiddenByUser,sheets.data.rowData.values(formattedValue,effectiveValue.numberValue,userEnteredFormat.numberFormat)`;
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
		json.formUrl = fetchUrl.href;
		json = adjustGoogleFormData(json);
	}

	if (!json) {
		try {
			json = JSON.parse(text);
		} catch (e) {
			console.log(e);
		}
	}

	// Link to Google sheet:
	if (matches) {
		json = adjustGoogleSheetData(json);
	}

	if (fetchUrl.searchParams.has('key')) {
		fetchUrl.searchParams.set('key', 'GCP_API_KEY');
	}

	const response: ApiResponse = {
		generatedAt: new Date().toISOString(),
		locator: params.locator,
		url: decodeURIComponent(fetchUrl.href),
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
