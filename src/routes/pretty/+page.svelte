<script lang="ts">
	import '../../app.scss';

	let url = 'https://forms.gle/ipLF7tw1q9QoWbRx6';
</script>

<main class="container">
	<form method="POST">
		<label>URL of Google Form/Sheet<input type="text" name="url" bind:value={url} /></label>
		<button>Prettify</button>
	</form>
</main>
