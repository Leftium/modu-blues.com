<script lang="ts">
	import type { Question } from '$lib';
	import MarkdownIt from 'markdown-it';
	import emoji from 'markdown-it-emoji';

	const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
	md.use(emoji);

	import TurndownService from 'turndown';
	const turndownService = new TurndownService();
	turndownService.escape = (text: string) => text; // Don't escape markdown
	const turndown = (html?: string | null) => turndownService.turndown(html || '');

	// Props:
	export let field: Question;

	// Bindings:
	let value = '';
	let group: string[] = [];

	// String value to store in localStorage:
	$: storeValue = field.type === 'CHECKBOXES' ? group.join(', ') : value;

	function parseMarkdown(markdown: string, options?: { collapseNewlines: any } | undefined) {
		console.log(`parseMarkdown ${'-'.repeat(100)}`);
		console.log({ options });
		console.log('[IN:]');
		console.log(markdown);
		console.log('[OUT:]');

		const collapsNewlines = options?.collapseNewlines ?? false;

		if (collapsNewlines) {
			markdown = markdown.replaceAll('\n\n', '\n').replaceAll('\n', '<br>');
		}

		let result = md.render(markdown);

		if (collapsNewlines) {
			result = result.replace(/(<p>)|(<\/p>)/g, '');
		}

		console.log(result);
		return result;
	}

	const parseMarkdownCollapseNewlines = (markdown: string) =>
		parseMarkdown(markdown, { collapseNewlines: true });
</script>

<section class:has-input={!!field.inputIndex}>
	{#if field.type === 'TITLE_AND_DESCRIPTION'}
		<center>
			<h1>{@html parseMarkdownCollapseNewlines(turndown(field.titleHtml))}</h1>
		</center>
		{@html parseMarkdown(turndown(field.descriptionHtml))}
	{:else if field.type === 'IMAGE'}
		{#if field.titleHtml}
			<center>
				<h1>{@html parseMarkdownCollapseNewlines(turndown(field.titleHtml))}</h1>
			</center>
		{/if}
		<center><img src={field.imgUrl} alt="alt" /></center>
	{:else if field.type === 'VIDEO'}
		<center>
			<div class="wrap-youtube">
				<iframe
					title="YouTube Video"
					class="youtube"
					src="https://www.youtube.com/embed/{field.youtubeId}/?rel=0&controls=1&modestbranding=1"
					allowfullscreen
				/>
			</div>
		</center>
	{:else if ['PARAGRAPH_TEXT', 'TEXT'].includes(field.type)}
		<label for="entry.{field.id}">
			{#if field.required}
				<span class="required-mark">*</span>
			{/if}
			{@html parseMarkdownCollapseNewlines(turndown(field.titleHtml))}
			<div>
				<small>
					{@html parseMarkdownCollapseNewlines(turndown(field.descriptionHtml))}
				</small>
			</div>
		</label>

		{#if field.type === 'PARAGRAPH_TEXT'}
			<textarea
				id="entry.{field.id}"
				name="entry.{field.id}"
				required={field.required}
				bind:value
			/>
		{:else if field.type === 'TEXT'}
			<input id="entry.{field.id}" name="entry.{field.id}" required={field.required} bind:value />
		{/if}
	{:else if field.type === 'DROPDOWN'}
		<label for="entry.{field.id}">
			{#if field.required}
				<span class="required-mark">*</span>
			{/if}
			{@html parseMarkdownCollapseNewlines(turndown(field.titleHtml))}
			<div>
				<small>
					{@html parseMarkdownCollapseNewlines(turndown(field.descriptionHtml))}
				</small>
			</div>
		</label>

		<select id="entry.{field.id}" name="entry.{field.id}" required={field.required} bind:value>
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
			{@html parseMarkdownCollapseNewlines(turndown(field.titleHtml))}
			<div>
				<small>
					{@html parseMarkdownCollapseNewlines(turndown(field.descriptionHtml))}
				</small>
			</div>
		</label>

		{#each field.options as option}
			<label>
				{#if field.type === 'CHECKBOXES'}
					<input
						type="checkbox"
						id="entry.{field.id}"
						name="entry.{field.id}"
						value={option}
						bind:group
					/>
				{:else}
					<input
						type="radio"
						id="entry.{field.id}"
						name="entry.{field.id}"
						value={option}
						bind:group={value}
					/>
				{/if}{option}
			</label>
		{/each}
	{:else}
		<div class="hidden">
			TODO: {field.type}
			<pre>{JSON.stringify(field, null, 4)}</pre>
		</div>
	{/if}
	<pre>{JSON.stringify({ value, group, storeValue }, null, 4)}</pre>
</section>

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

	section {
		margin-top: 2em;
		margin-bottom: 2em;
	}

	section:first-of-type,
	.has-input {
		margin-bottom: 0;
		margin-top: 0;
	}

	small {
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

	:global(a[role='button']) {
		width: 100%;
	}
</style>
