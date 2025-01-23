<script lang="ts">
	import { page } from '$app/stores';
	import '../app.scss';

	export let data;

	const menuItems = (routes: any[]) => routes.filter((route) => !!route.title);
</script>

<main class="container">
    {#if !/^\/\(no-nav\)/.test($page.route.id || '')}
	<nav>
		<ul>
			{#each menuItems(data.routes) as route}
				<li>
					<a href={route.path} class:active={$page.url.pathname === `${route.path}`}>
						{@html route.title.replace(' # ', '<br />')}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

	<slot />

	<pre hidden>{JSON.stringify(data.routes, null, 4)}</pre>
</main>

<style lang=scss>
    :global(html),
    :global(body) {
        background-color: #eee;
    }

    nav {
        background-image: url(https://lh3.googleusercontent.com/j43E_euuaVMRuQ1DWTspgSDrVUt0a-1jeyUJRAyHmCtgqLTM-DG65Fg-8bwVZabcAYFNRUI8EEbWMAAgCNbL5tyYdjL9yDSqO5jwwl7i3BFXcdzScRqGRNDCmRLptI-qHZeTuWsSLg=w940);
        background-size: cover;
        background-position: center;
        background-color: #0b4474;

        height: min(280px, 20svh);

        & * {
            color: white;
        }
    }

    @mixin dark-background {
        :global(body) {
            background-color: #111;
        }
	}

	@media only screen and (prefers-color-scheme: dark) {
		@include dark-background;
	}

	:global([data-theme='dark']) {
		@include dark-background;
	}

    main.container {
        background-color: var(--pico-background-color);
        padding: 0;
    }


	:h1 {
		--pico-font-size: 1.6em;
	}

	nav {
		justify-content: center;
	}

	nav li {
		text-align: center;
	}

	a.active {
		font-weight: bold;
	}
</style>
