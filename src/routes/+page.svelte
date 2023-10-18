<script lang="ts">
	import ScheduleCreator from './ScheduleCreator.svelte';

	let files: FileList;

	$: if (files) {
		console.log(files);
	}

	let response: string;

	async function sendFile() {
		const res = await fetch('/api/parser', {
			method: 'POST',
			body: JSON.stringify({
				filename: files.item(0)?.name
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		response = await res.json();
	}
</script>

<!--<label for="file">Upload a file:</label>
<input bind:files id="file" name="input" type="file" />
<button on:click={sendFile}>Send</button>

{#if response}
	<p>{response}</p>
{/if}-->

{#each { length: 7 } as _, i}
	<ScheduleCreator period={i + 1} />
{/each}
