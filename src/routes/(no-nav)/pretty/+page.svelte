<script lang="ts">
	import { page } from '$app/stores';
	const origin = $page.url.origin;

	// Bindings:
	let url = 'https://forms.gle/LLXyK6eUaUJi124E6';

	$: urlPrettyForm = `${origin}/pretty/form?u=${url}`;
	$: markdownPrettyForm = `[link text](/pretty/form?u=${url})`;

	$: urlPrettySheet = `${origin}/pretty/sheet?u=${url}`;
	$: markdownPrettySheet = `[link text](/pretty/sheet?u=${url})`;

	$: urlJson = `${origin}/api/isr/${url}`;
	$: markdownJson = `[link text](/api/isr/${url})`;

	function handleFocus(this: HTMLInputElement) {
		this.select();
	}

	function handleClick(this: HTMLInputElement) {
		try {
			navigator.clipboard.writeText(this.value);
		} finally {
			this.select();
		}
	}
</script>

<main class="container">
	<form method="POST">
		<h4>URL of Google Form/Sheet</h4>
		<input bind:value={url} on:focus={handleFocus} />
	</form>

	<hr />

	<h4><a href={urlPrettyForm}>Form Pretty Version</a></h4>
	<h5>link</h5>
	<input bind:value={urlPrettyForm} on:click={handleClick} readonly />
	<h5>markdown</h5>
	<input bind:value={markdownPrettyForm} on:click={handleClick} readonly />

	<h4><a href={urlPrettySheet}>Sheet Pretty Version</a></h4>
	<h5>link</h5>
	<input bind:value={urlPrettySheet} on:click={handleClick} readonly />
	<h5>markdown</h5>
	<input bind:value={markdownPrettySheet} on:click={handleClick} readonly />

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
