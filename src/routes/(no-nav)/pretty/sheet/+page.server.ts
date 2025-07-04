export const load = async ({ url, fetch }) => {
	console.log('LOAD', url.href);
	const urlTarget = url.searchParams.get('u');

	const fetchUrl = `/api/isr/${urlTarget}`;

	let resp = await fetch(fetchUrl);
	if (resp.status === 302) {
		resp = await fetch(resp.headers.get('location') || '');
	}

	const json = await resp.json();

	if (json.json.error) {
		return {
			error: {
				...json.json.error,
				url: urlTarget
			}
		};
	}

	// Unwrap from inside meta data.
	const sheetJson = json.json;

	const isVivianBlues = /블파/.test(sheetJson.title);
	const isPracticeGroup = /연습모임/.test(sheetJson.title) 

	let columnNames = sheetJson.values.shift();

	const counts = {
		total: 0,
		leads: 0,
		follows: 0,
		afterParty: 0
	};

	let rows: { summary: string; cells: string[] }[] = [];

	let isGridLayout = false;
	let cheerIndex = -1;

	sheetJson.values.forEach((cells: string[]) => {
		if (cells.join('') == '') {
			// Empty row.
			return;
		}

		if (
			cells.join('').includes(columnNames.join('')) ||
			cells.join('').includes('입금여부') ||
			cells.join('').includes('입금확인')
		) {
			// Duplicate title row.
			columnNames = cells;
			return;
		}

		let summary = '';
		let cheer = '';
		let role = '';
		let name = '';
		let paid = '';
		let afterParty = '';

		counts.total++;

		cells.forEach((cell, index) => {
			const columnName = columnNames[index];

			if (/역할/.test(columnName) || /^리드\/팔로우/.test(columnName)) {
				if (cell.match(/리더|리드|lead/i)) {
					role += '🕺';
					counts.leads++;
				}
				if (cell.match(/팔|follow/i)) {
					counts.follows++;
					role += '💃';
				}
			} else if (/^입금(여부|확인)/.test(columnName)) {
				paid = cell ? '💰' : '';
			} else if (/말씀/.test(columnName)) {
				cheer = cell || '';
				cheerIndex = index;
			} else if (/^닉네임/.test(columnName)) {
				name = cell || '';
			} else if (/뒷풀이/.test(columnName)) {
				if (cell.match(/y|네|얍/i)) {
					afterParty = '😋';
					counts.afterParty++;
				}
			} else if (/연락|contact/i.test(columnName)) {
				cells[index] = cells[index].replaceAll(/[0-9]/g, '*');
			}
		});

		isGridLayout = !(isVivianBlues || isPracticeGroup) || !name;

		if (isGridLayout) {
			summary = `<div class="number use-grid">${counts.total}.</div>${cells
				.map((cell: string) => {
					return `<div>${cell}</div>`;
				})
				.join('')}`;
		} else {
			summary = `<div>
        <div class="info"><div><span class="number">${'counts.total'}.</span> ${role} <b>${name}</b></div><div>${paid}</div><div>${afterParty}</div></div>
        <div class="cheer">${cheer}</div>
    </div>`;
		}

		rows.push({
			summary,
			cells
		});
	});

	if (!isGridLayout) {
		rows.reverse();

		if (cheerIndex !== -1) {
			rows.sort(function (a, b) {
				const aHasCheer = a.cells[cheerIndex]?.length > 0;
				const bHasCheer = b.cells[cheerIndex]?.length > 0;

				if (aHasCheer && !bHasCheer) {
					return -1;
				}
				if (!aHasCheer && bHasCheer) {
					return 1;
				}
				return 0;
			});
		}

		// Calculate numbers after sorting:
		rows = rows.map((row, index) => {
			if (row.summary) {
				row.summary = row.summary.replace('counts.total', `${rows.length - index}`);
			}
			return row;
		});
	}

	return { isGridLayout, isVivianBlues, counts, columnNames, rows, sheetJson, urlTarget };
};
