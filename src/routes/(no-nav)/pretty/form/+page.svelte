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

<style>
	article {
		margin-top: 1em;
		text-align: center;
	}

    :global(body) {
        overflow-x: hidden;
    }

    main :global(img.hero) {
        max-width: 100vw;
        max-height: 25vh;
        width: 100vw;


        margin-left: -50vw;
        margin-right: -50vw;

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
