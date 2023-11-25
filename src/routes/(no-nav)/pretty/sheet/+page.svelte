<script lang="ts">
	export let data;

	const countText =
		data.counts.leads || data.counts.follows
			? `${data.counts.total}명 신청 🕺${data.counts.leads} 💃${data.counts.follows}`
			: `${data.counts.total} Rows`;
</script>

<svelte:head>
	<title>{countText}</title>
</svelte:head>

<main class="container">
	<h1><center>{countText}</center></h1>

	{#each data.rows as row}
		<hr />
		<details>
			<summary>
				<span class="summary-wrap">{@html row.summary}</span>
			</summary>
			{#each row.cells as cell, index}
				<b>{data.columnNames[index]}</b>
				<p>{cell}</p>
			{/each}
		</details>
	{/each}

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

	.summary-wrap {
		line-height: 1.8rem;
		display: inline-block;
		width: 93%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	summary :global(.cheer) {
		font-size: medium;
		opacity: 66%;
	}

	summary :global(.number) {
		display: inline-block;
		width: 2rem;
		text-align: right;
		opacity: 66%;
	}

	details,
	hr {
		margin: 0.2rem 0;
	}
</style>
