export const load = async ({ url, fetch }) => {
	console.log('LOAD', url.href);
	const urlTarget = url.searchParams.get('u');

	const fetchUrl = `/api/isr/${urlTarget}`;

	let resp = await fetch(fetchUrl);
	if (resp.status === 302) {
		resp = await fetch(resp.headers.get('location') || '');
	}

	const json = await resp.json();

	// Unwrap from inside meta data.
	const sheetJson = json.json;

	const columnNames = sheetJson.values.shift();

	const counts = {
		total: sheetJson.values.length,
		leads: 0,
		follows: 0
	};

	const rows: { summary: string; cells: string[] }[] = [];
	sheetJson.values.forEach((cells: string[], rowIndex: number) => {
		let summary = '';
		let cheer = '';
		let role = '';
		let name = '';
		let paid = '';

		cells.forEach((cell, index) => {
			const columnName = columnNames[index];

			if (/^역할/.test(columnName)) {
				if (cell === '리더') {
					role = '🕺';
					counts.leads++;
				} else {
					counts.follows++;
					role = '💃';
				}
			} else if (/^입금확인/.test(columnName)) {
				paid = cell ? '💰' : '';
			} else if (/^응원/.test(columnName)) {
				cheer = cell || '';
			} else if (/^닉네임/.test(columnName)) {
				name = cell || '';
			}
		});

		summary = `<div class="cheer">${cheer}</div>${rowIndex + 1}. ${role}<b>${name}</b>`;

		rows.push({
			summary,
			cells
		});
	});

	return { counts, columnNames, rows, sheetJson };
};
