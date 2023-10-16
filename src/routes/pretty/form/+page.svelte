<script lang="ts">
	import { marked } from 'marked';

	import TurndownService from 'turndown';
	const turndownService = new TurndownService();
	turndownService.escape = (text: string) => text; // Don't escape markdown
	const turndown = (html: string) => turndownService.turndown(html);

	function parseMarkdown(markdown: string) {
		return marked.parse(markdown).replace(/(^<p>)|(<\/p>\s*$)/g, '');
	}

	export let data;
</script>

<svelte:head>
	<title>{data.formJson.title}</title>
</svelte:head>

<main class="container">
	<form method="POST">
		<input type="hidden" name="formAction" value={data.formJson.formAction} />
		{#if data.formJson.hasInput}
			<button>Submit</button>
		{/if}
		{#each data.formJson.fields as field}
			<div>
				{#if field.type === 'TITLE_AND_DESCRIPTION'}
					<center>
						<h1>{@html parseMarkdown(turndown(field.titleHtml))}</h1>
					</center>
					{@html parseMarkdown(turndown(field.descriptionHtml))}
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
				{:else if ['PARAGRAPH_TEXT', 'TEXT'].includes(field.type)}
					<label for="entry.{field.id}">
						{@html parseMarkdown(turndown(field.titleHtml))}
					</label>
					<small>{@html parseMarkdown(turndown(field.descriptionHtml))}</small>

					{#if field.type === 'PARAGRAPH_TEXT'}
						<textarea id="entry.{field.id}" name="entry.{field.id}" required={field.required} />
					{:else if field.type === 'TEXT'}
						<input id="entry.{field.id}" name="entry.{field.id}" required={field.required} />
					{/if}
				{:else if field.type === 'DROPDOWN'}
					<label for="entry.{field.id}">
						{@html parseMarkdown(turndown(field.titleHtml))}
					</label>
					<small>{@html parseMarkdown(turndown(field.descriptionHtml))}</small>

					<select id="entry.{field.id}" name="entry.{field.id}" required={field.required}>
						<option value="">Choose</option>
						{#each field.options as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				{:else if ['MULTIPLE_CHOICE', 'CHECKBOXES'].includes(field.type)}
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label for="">{@html parseMarkdown(turndown(field.titleHtml))}</label>

					<small>{@html parseMarkdown(turndown(field.descriptionHtml))}</small>

					{#each field.options as option}
						<label
							><input
								type={field.type === 'CHECKBOXES' ? 'checkbox' : 'radio'}
								id="entry.{field.id}"
								name="entry.{field.id}"
								value={option}
							/>{option}</label
						>
					{/each}
				{:else}
					<div class="hidden">
						TODO: {field.type}
						<pre>{JSON.stringify(field, null, 4)}</pre>
					</div>
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

	label[for] {
		font-weight: bold;
	}
	.hidden {
		display: none;
	}
</style>
