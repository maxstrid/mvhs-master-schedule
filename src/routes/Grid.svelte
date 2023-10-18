<script lang="ts">
	export let rows = 7;
	export let cols = 10;

	let schedule_grid: HTMLDivElement;

	$: schedule_grid && schedule_grid.style.setProperty('--rows', `${rows}`);
	$: schedule_grid && schedule_grid.style.setProperty('--cols', `${cols}`);
</script>

<!-- <div id="schedule-grid" bind:this={schedule_grid}>
	{#each { length: rows * cols } as _, i}
		{#if i % 10 == 0}{:else}
			<div class="schedule-cell">Test</div>
		{/if}
		<!--
		<select class="schedule-cell" on:click={handleClick} name="null">
			<option value="test">test</option>
		</select>
	{/each}
</div>
-->

<style>
	:root {
		--rows: inherit;
		--cols: inherit;
	}

	#schedule-grid {
		display: grid;
		grid-gap: 0.5em;
		grid-template-rows: repeat(var(--rows), 1fr);
		grid-template-columns: repeat(var(--cols), 1fr);

		margin: 1em;
	}

	.schedule-cell {
		padding: 0.75em;
		background: #ffffff;
		text-align: center;
		border: 0.25em solid var(--accent-color);
		border-radius: 1em;
	}

	.schedule-cell:hover {
		background: var(--accent-color);
	}
</style>
