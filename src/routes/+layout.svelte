<script lang="ts">
	import { page } from '$app/stores';
	import '../app.scss';

	export let data;
</script>

{#if !/^\/\(no-nav\)/.test($page.route.id || '')}
	<nav>
		<ul>
			{#each data.routes as route, index}
				<li>
					<a href={route.path} class:active={$page.url.pathname === `${route.path}`}
						>{@html route.title.replace(' # ', '<br />')}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<main class="container">
	<slot />

	<pre hidden>{JSON.stringify(data.routes, null, 4)}</pre>
</main>

<style>
	:h1 {
		--pico-font-size: 1.6em;
	}

	nav {
		justify-content: center;
	}

	nav li {
		text-align: center;
	}

	main {
		max-width: 800px;
	}

	a.active {
		font-weight: bold;
	}
</style>
