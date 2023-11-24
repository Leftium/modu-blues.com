<script lang="ts">
	export let data;
</script>

<main class="container">
	<h1>
		<center>{data.counts.total}명 신청 🕺{data.counts.leads} 💃{data.counts.follows}</center>
	</h1>

	{#each data.rows as row}
		<hr />
		<details>
			<summary>
				{@html row.summary}
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
	summary {
		line-height: 1.6rem;
	}

	summary :global(.cheer) {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: medium;
		opacity: 66%;
	}

	details,
	hr {
		margin: 0.2rem 0;
	}
</style>
