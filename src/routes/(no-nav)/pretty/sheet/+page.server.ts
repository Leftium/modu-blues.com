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

	let columnNames = sheetJson.values.shift();

	const counts = {
		total: 0,
		leads: 0,
		follows: 0
	};

	const rows: { summary: string; cells: string[] }[] = [];

	let isGridLayout = false;

	sheetJson.values.forEach((cells: string[]) => {
		if (cells.join('') == '') {
			// Empty row.
			return;
		}

		if (cells.join('').includes(columnNames.join('')) || cells.join('').includes('입금여부')) {
			// Duplicate title row.
			columnNames = cells;
			return;
		}

		let summary = '';
		let cheer = '';
		let role = '';
		let name = '';
		let paid = '';
		let foodTour = '';

		counts.total++;

		cells.forEach((cell, index) => {
			const columnName = columnNames[index];

			if (/^역할/.test(columnName) || /^리드\/팔로우/.test(columnName)) {
				if (cell.match(/리더|리드|lead/i)) {
					role += '🕺';
					counts.leads++;
				}
				if (cell.match(/팔뤄|follow/i)) {
					counts.follows++;
					role += '💃';
				}
			} else if (/^입금여부/.test(columnName)) {
				paid = cell ? '💰' : '';
			} else if (/말씀/.test(columnName)) {
				cheer = cell || '';
			} else if (/^닉네임/.test(columnName)) {
				name = cell || '';
			} else if (/맛집/.test(columnName)) {
				foodTour = cell.match(/y|네|얍/i) ? '😋' : '';
			}
		});

		isGridLayout = !name;

		if (isGridLayout) {
			summary = `<div class="number use-grid">${counts.total}.</div>${cells
				.map((cell: string) => {
					return `<div>${cell}</div>`;
				})
				.join('')}`;
		} else {
			summary = `<div><span class="number">${counts.total}.</span> ${role}${foodTour}${paid}<b>${name}</b><div class="cheer">${cheer}</div></div>`;
		}

		rows.push({
			summary,
			cells
		});
	});

	return { isGridLayout, counts, columnNames, rows, sheetJson, urlTarget };
};
