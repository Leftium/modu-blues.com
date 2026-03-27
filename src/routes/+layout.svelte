<script lang="ts">
	import { page } from '$app/stores';
	import '../app.scss';

	export let data;

	const menuItems = (routes: any[]) => routes.filter((route) => !!route.title);
</script>

<main>
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

        // Full-bleed: escape main's padding to reach viewport edges
        margin-inline: calc(var(--nc-spacing) * -1);

        display: flex;
        align-items: center;
        justify-content: center;

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

    main {
        background-color: var(--nc-surface-1);
        padding: var(--nc-spacing);
        padding-block-start: 0;
    }

	nav ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
		justify-content: center;
		align-items: center;
	}

	nav li {
		text-align: center;
	}

	a.active {
		font-weight: bold;
	}
</style>
