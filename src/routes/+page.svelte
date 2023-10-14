<script lang="ts">
	import '../app.scss';

	const URL = '/api/isr/google-sheets/13vBBjqXnVfXk4zu-rcj7b3XG_BFxNPKBJgywckdIO_U';

	let result = 'No results, yet.';

	type FetchOptions = {
		method: string;
		headers: Record<string, string>;
	};

	async function handleClick(this: HTMLButtonElement) {
		const method = this.dataset.method ?? 'ERROR';
		const revalidate = 'revalidate' in this.dataset;

		const fetchOptions: FetchOptions = { method, headers: {} };
		if (revalidate) {
			fetchOptions.headers['x-prerender-revalidate'] = 'true';
		}

		const resp = await fetch(URL, fetchOptions);

		result = `${method}\n\n${revalidate}\n\n`;

		if (method === 'HEAD') {
			result += resp.headers.get('generated-at');
		} else {
			result += `${JSON.stringify(await resp.json(), null, 4)}`;
		}
	}
</script>

<main class="container">
	<p>
		<button on:click={handleClick} data-method="GET"> GET /api/isr/google-sheets/[id] </button>
	</p>

	<p>
		<button on:click={handleClick} data-method="GET" data-revalidate>
			GET /api/isr/google-sheets/[id] (revalidate)</button
		>
	</p>

	<p>
		<button on:click={handleClick} data-method="HEAD"> HEAD /api/isr/google-sheets/[id] </button>
	</p>

	<p>
		<button on:click={handleClick} data-method="HEAD" data-revalidate>
			HEAD /api/isr/google-sheets/[id] (revalidate)
		</button>
	</p>

	<p><a href={URL}>/api/isr/google-sheets/[id]</a></p>

	<pre>{result}</pre>
</main>
