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
    :global(body) {
        background-color: #eee;
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

    main :global(img.hero) {
        max-width: min(100svw, 1450px);
        max-height: 12rem;
        width: 100svw;


        margin-left: -50svw;
        margin-right: -50svw;

        object-fit: cover;
    }

    main.container {
        background-color: var(--pico-background-color);
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
