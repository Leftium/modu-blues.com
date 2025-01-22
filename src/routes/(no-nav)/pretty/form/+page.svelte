<script lang="ts">
	import GoogleFormField from '$lib/GoogleFormField.svelte';

	export let data;

	export let form;
</script>

<svelte:head>
	<title>{data.formJson?.title}</title>
</svelte:head>

<main class="container">
	{#if form?.success || form?.status}
		<article>
			{#if form?.success}
				<div class="success">Successfully signed up! 신청 성공!</div>
			{:else if form?.status}
				<div class="error">Sorry! There was an error. 오류:</div>
				{form.status}: {form.statusText}
			{/if}
		</article>
	{/if}

	<form method="POST">
		<input type="hidden" name="formUrl" value={data.formJson?.formUrl} />
		<input type="hidden" name="formAction" value={data.formJson?.formAction} />

		{#each data.formJson?.fields || [] as field}
			{#if data.formJson?.hasInput && data.formJson?.hasRequired && field.inputIndex === 1}
				<span class="required-mark">* Required 필수항목</span>
			{/if}

			<GoogleFormField {field} />
		{/each}

		{#if data.formJson?.hasInput}
			<input type="submit" value="Sign up 신청" />
		{/if}
	</form>

	<center><a href={data.formJson?.formUrl}>Go to original Google form</a></center>

	<div hidden>
		<hr />
		<pre>{JSON.stringify(data.formJson, null, 4)}</pre>
	</div>
</main>

<style lang=scss>
	article {
		margin-top: 1em;
		text-align: center;
	}

    :global(body) {
        overflow-x: hidden;
    }

    main {
        max-width: 40ch;
    }


    main :global(h1),
    main :global(h6) {
        margin-top: 0em;
        margin-bottom: 0em;
    }

    main :global(h1 a:first-child:last-child),
    main :global(h2),
    main :global(h6 a:first-child:last-child) {
        display: block;
        text-align: center;
    }

    main :global(td) {
        vertical-align: top;
    }

    main :global(td:first-child p),
    main :global(td:first-child) {
        min-width: 2em;
        font-weight: bold;
        text-wrap: nowrap;
    }

    main :global(ul) {
        padding-left: 0px;
        margin-bottom: .2em;
    }

    main :global(ul a),
    main :global(td p) {
        margin-bottom: .2em;
    }

   	main :global(li::marker) {
		color: rgba(0, 0, 0, 0.15);
	}

   	@mixin dark-marker {
		main :global(li::marker) {
			color: rgba(255, 255, 255, 0.3);
		}
	}

	@media only screen and (prefers-color-scheme: dark) {
		@include dark-marker;
	}

	[data-theme='dark'] {
		@include dark-marker;
	}

    main :global(img.hero) {
        max-width: 100svw;
        max-height: 12rem;
        width: 100svw;


        margin-left: -50svw;
        margin-right: -50svw;

        object-fit: cover;
    }

	.success {
		color: green;
		font-weight: bold;
	}

	.error {
		color: red;
		font-weight: bold;
	}

	.required-mark {
		color: red;
	}
</style>
