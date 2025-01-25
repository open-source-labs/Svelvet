<script lang="ts">
	import { Anchor, Node } from '$lib';

	let text = $state('Test');
	let checked = $state(true);
	let color = $state('#ff0000');
	let date = $state(new Date());
	let datetime = $state(new Date());
	let email = $state('');
	let month = $state('');
	let number = $state(0);
	let password = $state('');
	let radio = $state('');
	let range = $state(0);
	let search = $state('');
	let tel = $state('');
	let url = '';
	let week = '';
</script>

<Node id="input" bgColor="black" label="StartNode" borderRadius={10} >
	{#snippet children({ destroy })}
		<div class="node">
			<input id="text-test" type="text" bind:value={text} />
			<input id="checkbox-test" type="checkbox" bind:checked />
			<input type="color" bind:value={color} />
			<input type="date" bind:value={date} />
			<input type="datetime-local" bind:value={datetime} />
			<input type="email" bind:value={email} />
			<input type="month" bind:value={month} />
			<input type="number" bind:value={number} />
			<input type="password" bind:value={password} />
			<input type="radio" bind:value={radio} />
			<input type="range" bind:value={range} />
			<input type="search" bind:value={search} />
			<input type="tel" bind:value={tel} />
			<select id="numberSelect">
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
			</select>
			<textarea id="textarea-test"></textarea>
			<button onclick={destroy}>Test</button>
		</div>
	{/snippet}
</Node>

<style>
	.node {
		width: 400px;
		height: 400px;
	}
</style>
