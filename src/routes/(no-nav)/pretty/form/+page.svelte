<script lang="ts">
	import GoogleFormField from '$lib/GoogleFormField.svelte';

	export let data;

	export let form;
</script>

<svelte:head>
	<title>{data.formJson.title}</title>
</svelte:head>

<main class="container">
	{#if form?.success || form?.status}
		<center>
			<blockquote>
				{#if form?.success}
					<div class="success">Successfully signed up! 신청 성공!</div>
				{:else if form?.status}
					<div class="error">Sorry! There was an error:</div>
					{form.status}: {form.statusText}
				{/if}
			</blockquote>
		</center>
	{/if}

	<form method="POST">
		<input type="hidden" name="formUrl" value={data.formJson.formUrl} />
		<input type="hidden" name="formAction" value={data.formJson.formAction} />

		{#each data.formJson.fields as field}
			{#if data.formJson.hasInput && data.formJson.hasRequired && field.inputIndex === 1}
				<span class="required-mark">* Required 필수항목</span>
			{/if}

			<GoogleFormField {field} />
		{/each}

		{#if data.formJson.hasInput}
			<input type="submit" value="Submit" />
		{/if}
	</form>

	<center><a href={data.formJson.formUrl}>Go to original Google form</a></center>

	<div hidden>
		<hr />
		<pre>{JSON.stringify(data.formJson, null, 4)}</pre>
	</div>
</main>

<style>
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
