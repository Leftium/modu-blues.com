<script lang="ts">
	export let data;

	const countText =
		data.counts.leads || data.counts.follows
			? `${data.counts.total}명 신청 💃${data.counts.follows} 🕺${data.counts.leads}`
			: `${data.counts.total} Rows`;

        const earlyEggsFollower = '🥚'.repeat(data.counts.superEarlyBirdFollower) || '마감!'
        const earlyEggsLeader = '🥚'.repeat(data.counts.superEarlyBirdLeader) || '마감!'


	function toggleDetails(this: HTMLElement) {
		const detailsElement = this.classList.contains('details') ? this : this.nextElementSibling;

		if (detailsElement?.classList.contains('folded')) {
			detailsElement?.classList.remove('folded');
		} else {
			detailsElement?.classList.add('folded');
		}
	}
</script>

<svelte:head>
	<title>{countText} | {data.sheetJson.title}</title>
</svelte:head>

<main class="container">

    <center>
        <h1>{data.sheetJson.title}</h1>
        <h2>{countText}</h2>
        {#if data.counts.afterParty}
            <div>뒷풀이 참석 😋{data.counts.afterParty}</div>
        {/if}
        {#if data.isVivianBlues}
            <h2>🥚슈퍼 얼리버드 재고🐣</h2>
            <div>💃{earlyEggsFollower}</div>
            <div>🕺{earlyEggsLeader}</div>
        {/if}
    </center>

	<div class="container" class:grid={data.isGridLayout} class:no-grid={!data.isGridLayout}>
		{#each data.rows as row}
			<hr class="row" />
			<div class="row summary" on:click={toggleDetails} role="none">{@html row.summary}</div>
			<div class="row details folded" on:click={toggleDetails} role="none">
				{#each row.cells as cell, index}
					<div class="label">{data.columnNames[index] || ''}</div>
					<div class="cell">{cell || ''}</div>
				{/each}
			</div>
		{/each}
	</div>

    <center><a href={data.urlTarget}>Original Google Sheet</a></center>

	<div hidden>
		<pre>{JSON.stringify(data.counts, null, 4)}</pre>
		<pre>{JSON.stringify(data.columnNames, null, 4)}</pre>
		<pre>{JSON.stringify(data.rows, null, 4)}</pre>
		<pre>{JSON.stringify(data.sheetJson.values, null, 4)}</pre>
	</div>
</main>

<style>
	main {
		padding: 0.2rem 0;
	}

    h2 {
        margin-top: 1em;
        margin-bottom: 0;
    }

    .container {
        margin-top: 2rem;
    }

	.container.grid {
		overflow-x: hidden;

		display: grid;
		grid-template-columns: 2.5rem repeat(7, minmax(6rem, auto));

		gap: 0.1rem;
	}

	.row {
		display: grid;
		grid-column: 1 / -1;

		grid-template-columns: subgrid;
	}

	.summary {
        font-family: Lato, sans-serif;
		font-weight: 500;
	}

	.grid .row.details {
		grid-column: 2 / -1;
		grid-template-columns: 1fr;
	}

	.no-grid .row {
		margin-bottom: 0.4rem;
	}

	.no-grid .row.details {
		padding-left: 3rem;
	}

	.folded {
		display: none;
	}

	.row :global(div) {
		overflow-x: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

    :global(.info) {
        display: grid;

        grid-template-columns: 62% 1.5rem 1fr;

    }

	:global(.number) {
		display: inline-block;
		width: 2rem;
		text-align: right;
		opacity: 66%;
	}

	:global(.cheer) {
		padding-left: 2.5rem;
		font-size: medium;
		opacity: 66%;
	}

	.label {
		opacity: 66%;
	}

	.cell {
		padding-left: 1rem;
	}

	hr {
		margin: 0.2rem 0;
	}
</style>
