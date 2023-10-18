<script lang="ts">
	import GoogleFormField from '$lib/GoogleFormField.svelte';

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
	.required-mark {
		color: red;
	}
</style>
