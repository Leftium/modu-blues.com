<script lang="ts">
	import '../../../app.scss';

	export let data;
</script>

<main class="container">
	<pre>{JSON.stringify(data.json, null, 4)}</pre>
</main>
