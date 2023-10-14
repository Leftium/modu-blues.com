<script lang="ts">
	import '../app.scss';

	import { marked } from 'marked';
</script>

<center>
	{@html marked.parse(
		'[Social Dancing & Classes](/) | [Dance Hall Rental](/rent) | [Bank Info](/bank) | [Map/Directions](/map)'
	)}
</center>

<main class="container">
	<slot />
</main>
