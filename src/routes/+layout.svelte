<script lang="ts">
	import '../app.scss';

	export let data;
</script>

<center>
	{#each data?.json?.values || [] as row, index}
		{#if row[1] && index !== 0}
			<a href="/{row[0]}">{row[1]}</a>
			{#if index < data?.json?.values.length - 1}
				|&nbsp;
			{/if}
		{/if}
	{/each}
</center>

<main class="container">
	<slot />

	<pre>{JSON.stringify(data.json, null, 4)}</pre>
</main>
