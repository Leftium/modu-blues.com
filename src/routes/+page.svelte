<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.scss';

	type FetchOptions = {
		method: string;
		headers: Record<string, string>;
	};

	const LOCATORS = [
		'https://docs.google.com/spreadsheets/d/13vBBjqXnVfXk4zu-rcj7b3XG_BFxNPKBJgywckdIO_U',
		'https://sheets.googleapis.com/v4/spreadsheets/13vBBjqXnVfXk4zu-rcj7b3XG_BFxNPKBJgywckdIO_U/values/A:ZZZ1',
		'https://forms.gle/QJYo684gH5yw1wnKA',
		'https://docs.google.com/forms/d/e/1FAIpQLSfXm6FkpT5GbnFxUs_oeDXXnhLiMGJbzIPb0NeQNGFKurUqsQ/viewform'
	];

	let result = 'No results, yet.';

	// bindings:
	let method = 'GET';
	let revalidate = false;

	async function handleClick(this: HTMLAnchorElement, e: MouseEvent) {
		const fetchOptions: FetchOptions = { method, headers: {} };

		if (revalidate) {
			fetchOptions.headers['x-prerender-revalidate'] = 'TrueTrueTrueTrueTrueTrueTrueTrue';
		}

		const resp = await fetch(this.href, fetchOptions);

		result = `href: ${this.href}\n\nmethod: ${method}\n\nrevalidate: ${revalidate}\n\n`;

		if (method === 'HEAD') {
			result += resp.headers.get('generated-at');
		} else {
			result += `${JSON.stringify(await resp.json(), null, 4)}`;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.altKey) {
			method = method === 'GET' ? 'HEAD' : 'GET';
			e.preventDefault();
		}

		if (e.shiftKey) {
			revalidate = !revalidate;
			e.preventDefault();
		}
	}

	onMount(function () {
		document.addEventListener('keydown', handleKeydown);

		return function () {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<main class="container">
	<label><input type="radio" bind:group={method} value="GET" /> GET</label>
	<label><input type="radio" bind:group={method} value="HEAD" /> HEAD</label>

	<label><input type="checkbox" bind:checked={revalidate} /> Revalidate</label>

	{#each LOCATORS as locator}
		{@const href = `/api/isr/${locator}`}
		<p><a on:click|preventDefault={handleClick} {href}>{href}</a></p>
	{/each}

	<pre>{result}</pre>
</main>
