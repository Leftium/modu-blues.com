<script lang="ts">
	import { page } from '$app/stores';
	const origin = $page.url.origin;

	// Bindings:
	let url = 'https://forms.gle/ipLF7tw1q9QoWbRx6';

	$: urlPretty = `${origin}/pretty/form?u=${url}`;
	$: markdownPretty = `[link text](/pretty/formUrl?u=${url})`;

	$: urlJson = `${origin}/api/isr/${url}`;
	$: markdownJson = `[link text](/api/isr/${url})`;

	function handleFocus(this: HTMLInputElement) {
		this.select();
	}

	function handleClick(this: HTMLInputElement) {
		navigator.clipboard.writeText(this.value);
		this.select();
	}
</script>

<main class="container">
	<form method="POST">
		<h4>URL of Google Form/Sheet</h4>
		<input bind:value={url} on:focus={handleFocus} />
	</form>

	<hr />

	<h4><a href={urlPretty}>Pretty Version</a></h4>
	<h5>link</h5>
	<input bind:value={urlPretty} on:click={handleClick} readonly />
	<h5>markdown</h5>
	<input bind:value={markdownPretty} on:click={handleClick} readonly />

	<h4><a href={urlJson}>JSON Version</a></h4>
	<h5>link</h5>
	<input bind:value={urlJson} on:click={handleClick} readonly />
	<h5>markdown</h5>
	<input bind:value={markdownJson} on:click={handleClick} readonly />
</main>

<style>
	h5 {
		margin-top: 0;
		margin-bottom: 0;
	}
</style>
