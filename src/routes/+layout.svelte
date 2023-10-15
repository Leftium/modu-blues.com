<script lang="ts">
	import { page } from '$app/stores';
	import '../app.scss';

	export let data;
</script>

<center>
	{#each data.routes as route, index}
		<a href={route.path} class:active={$page.url.pathname === `${route.path}`}>{route.title}</a>
		{#if index < data.routes.length - 1}
			|&nbsp;
		{/if}
	{/each}
</center>

<main class="container">
	<slot />

	<pre>{JSON.stringify(data.routes, null, 4)}</pre>
</main>

<style>
	a.active {
		font-weight: bold;
	}
</style>
