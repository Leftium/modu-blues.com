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
		<input type="hidden" name="formUrl" value={data.formJson.formUrl} />
		<input type="hidden" name="formAction" value={data.formJson.formAction} />

		{#each data.formJson.fields as field}
			{#if data.formJson.hasInput && data.formJson.hasRequired && field.inputIndex === 1}
				<span class="required-mark">* Required 필수항목</span>
			{/if}
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
						{#if field.required}
							<span class="required-mark">*</span>
						{/if}
						{@html parseMarkdown(turndown(field.titleHtml))}
						<div><small>{@html parseMarkdown(turndown(field.descriptionHtml))}</small></div>
					</label>

					{#if field.type === 'PARAGRAPH_TEXT'}
						<textarea id="entry.{field.id}" name="entry.{field.id}" required={field.required} />
					{:else if field.type === 'TEXT'}
						<input id="entry.{field.id}" name="entry.{field.id}" required={field.required} />
					{/if}
				{:else if field.type === 'DROPDOWN'}
					<label for="entry.{field.id}">
						{#if field.required}
							<span class="required-mark">*</span>
						{/if}
						{@html parseMarkdown(turndown(field.titleHtml))}
						<small>{@html parseMarkdown(turndown(field.descriptionHtml))}</small>
					</label>

					<select id="entry.{field.id}" name="entry.{field.id}" required={field.required}>
						<option value="">Choose</option>
						{#each field.options as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				{:else if ['MULTIPLE_CHOICE', 'CHECKBOXES'].includes(field.type)}
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label for="">
						{#if field.required}
							<span class="required-mark">*</span>
						{/if}
						{@html parseMarkdown(turndown(field.titleHtml))}
						<small>{@html parseMarkdown(turndown(field.descriptionHtml))}</small>
					</label>

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

		<input type="submit" value="Submit" />
	</form>

	<center><a href={data.formJson.formUrl}>View Original Google Form</a></center>

	<div hidden>
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

	form small {
		opacity: 0.5;
		font-size: 80%;
	}

	label[for] {
		font-weight: bold;
		margin-top: 1.5em;
	}

	.required-mark {
		color: red;
	}

	.hidden {
		display: none;
	}
</style>
