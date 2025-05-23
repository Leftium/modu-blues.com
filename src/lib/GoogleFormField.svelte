<script lang="ts">
	import type { Question } from '$lib';
	import MarkdownIt from 'markdown-it';
	import emoji from 'markdown-it-emoji';
	import easyTables from 'markdown-it-easy-tables';
	import sup from 'markdown-it-sup';
	import sub from 'markdown-it-sub';
	import deflist from 'markdown-it-deflist';

	import multimdTable from 'markdown-it-multimd-table';

	const md = new MarkdownIt({ html: true, linkify: true, typographer: true, breaks: true });
	md.use(emoji)
		.use(sup)
		.use(sub)
		.use(deflist)
		.use(multimdTable, {
			multiline: true,
			headerless: true
		})
		.use(easyTables);

	import store from 'store';
	import { browser } from '$app/environment';
	import { parallax } from './parallax';

	// Props:
	export let field: Question;

	// Bindings:
	let value = '';
	let group: string[] = [];

	// String value to store in localStorage:
	$: storeValue = field.type === 'CHECKBOXES' ? group?.join(', ') : value;

	function parseMarkdown(
		markdown?: string | null,
		options?: { collapseNewlines: any } | undefined
	) {
		/*
		console.log(`parseMarkdown ${'-'.repeat(100)}`);
		console.log({ options });
		console.log('[IN:]');
		console.log(markdown);
		console.log('[OUT:]');
        */

		markdown = markdown || '';

		const collapsNewlines = options?.collapseNewlines ?? false;

		if (collapsNewlines) {
			markdown = markdown.replaceAll('\n\n', '\n').replaceAll('\n', '<br>');
		}

		let result = md.render(markdown);

		if (collapsNewlines) {
			result = result.replace(/(<p>)|(<\/p>)/g, '');
		}

		result = result.replace(/^(<p>)|(<\/p>\s*$)/g, '');

		// console.log(result);
		return result;
	}

	const parseMarkdownCollapseNewlines = (markdown?: string | null) =>
		parseMarkdown(markdown, { collapseNewlines: true });

	function normalizeTitle(title: string) {
		return title?.trim()?.toLowerCase().replace(/\s+/g, '_');
	}

	function handleChange(this: HTMLInputElement) {
		const storedValues = store.get('storedValues') || { byId: {}, byTitle: {} };

		storedValues.byId[field.id] = storeValue;
		storedValues.byTitle[normalizeTitle(field.title)] = storeValue;

		store.set('storedValues', storedValues);
	}

	if (browser) {
		const storedValues = store.get('storedValues') || { byId: {}, byTitle: {} };

		if (field.type === 'CHECKBOXES') {
			group =
				storedValues.byId[field.id]?.split(', ') ||
				storedValues.byTitle[normalizeTitle(field.title)]?.split(', ');
		} else {
			value = storedValues.byId[field.id] || storedValues.byTitle[normalizeTitle(field.title)];
		}
	}
</script>

<section class:has-input={!!field.inputIndex}>
	{#if field.type === 'TITLE_AND_DESCRIPTION'}
		<center>
			<h3>{@html parseMarkdown(field.title)}</h3>
		</center>
		{@html parseMarkdown(field.description)}
	{:else if field.type === 'IMAGE'}
		{#key field.title}
			{#if field.title && field.title !== 'hero'}
				<center>
					<h1>{@html parseMarkdown(field.title)}</h1>
				</center>
			{/if}
			<center>
				<img
					src={field.imgUrl?.replace(/=w\d+$/i, '')}
					use:parallax={{ hero: field.title === 'hero' }}
					alt=""
				/>
			</center>
		{/key}
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
			{@html parseMarkdown(field.title)}
			<div>
				<small>
					{@html parseMarkdown(field.description)}
				</small>
			</div>
		</label>

		{#if field.type === 'PARAGRAPH_TEXT'}
			<textarea
				id="entry.{field.id}"
				name="entry.{field.id}"
				required={field.required}
				bind:value
				on:input={handleChange}
			/>
		{:else if field.type === 'TEXT'}
			<input
				id="entry.{field.id}"
				name="entry.{field.id}"
				required={field.required}
				bind:value
				on:input={handleChange}
			/>
		{/if}
	{:else if field.type === 'DROPDOWN'}
		<label for="entry.{field.id}">
			{#if field.required}
				<span class="required-mark">*</span>
			{/if}
			{@html parseMarkdown(field.title)}
			<div>
				<small>
					{@html parseMarkdown(field.description)}
				</small>
			</div>
		</label>

		<select
			id="entry.{field.id}"
			name="entry.{field.id}"
			required={field.required}
			bind:value
			on:change={handleChange}
		>
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
			{@html parseMarkdown(field.title)}
			<div>
				<small>
					{@html parseMarkdown(field.description)}
				</small>
			</div>
		</label>

		{#each field.options as option}
			<label>
				{#if field.type === 'CHECKBOXES' || field.options.length === 1}
					<input
						type="checkbox"
						id="entry.{field.id}"
						name="entry.{field.id}"
						value={option}
						bind:group
						on:change={handleChange}
					/>
				{:else}
					<input
						type="radio"
						id="entry.{field.id}"
						name="entry.{field.id}"
						value={option}
						bind:group={value}
						on:change={handleChange}
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
	<pre hidden>{JSON.stringify({ value, group, storeValue }, null, 4)}</pre>
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
