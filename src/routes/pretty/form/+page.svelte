<script lang="ts">
	import { marked } from 'marked';

	import TurndownService from 'turndown';

	const turndownService = new TurndownService();
	turndownService.escape = (text: string) => text; // Don't escape markdown
	const turndown = (html: string) => turndownService.turndown(html);

	export let data;
</script>

<svelte:head>
	<title>{data.formJson.title}</title>
</svelte:head>

<main class="container">
	<form method="POST">
		{#if data.formJson.hasInput}
			<button>Submit</button>
		{/if}
		{#each data.formJson.fields as field}
			<div>
				{#if field.type === 'TITLE_AND_DESCRIPTION'}
					<center>
						<h1>{@html marked.parse(turndown(field.titleHtml))}</h1>
					</center>
					{@html marked.parse(turndown(field.descriptionHtml))}
				{:else if field.type === 'IMAGE'}
					<img src={field.imgUrl} alt="alt" />
				{:else if field.type === 'VIDEO'}
					<div class="wrap-youtube">
						<iframe
							title="YouTube Video"
							class="youtube"
							src="https://www.youtube.com/embed/{field.youtubeId}/?rel=0&controls=1&modestbranding=1"
							allowfullscreen
						/>
					</div>
				{:else if field.type === 'PARAGRAPH_TEXT'}
					<textarea name="entry.{field.id}" required={field.required} />

					<pre>{JSON.stringify(field, null, 4)}</pre>
				{:else}
					TODO: {field.type}
				{/if}
			</div>
		{/each}
	</form>

	<div>
		<hr />
		<pre>{JSON.stringify(data.formJson, null, 4)}</pre>
	</div>
</main>

<style>
	:global(.wrap-youtube) {
		position: relative;
		width: 100%;
		height: 0;
		padding-bottom: 56.25%;
	}
	:global(.youtube) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
