<script lang="ts">
	export let name: string;
	export let options: [string];
</script>

<select {name}>
	{#each options as option}
		<option value={option}>
			{option}
		</option>
	{/each}
</select>
