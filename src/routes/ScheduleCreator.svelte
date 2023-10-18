<script lang="ts">
	export let period: number;

	let classLength = 0;

	function addClass() {
		classLength += 1;
	}
</script>

<div id="schedule-row">
	Period {period}

	{#each Array(classLength) as _}
		<select>
			<option>a</option>
		</select>
	{/each}

	<button id="add-class-button" on:click={addClass}> + </button>
</div>

<style>
	#schedule-row {
		margin: 1em;
	}

	#add-class-button {
		border: 2px solid #000000;
		border-radius: 0.75em;
		padding: 0.25em 0.5em 0.25em 0.5em;
		font-size: 1em;
		background: var(--accent-color);
	}

	#add-class-button:hover {
		filter: brightness(90%);
	}
</style>
