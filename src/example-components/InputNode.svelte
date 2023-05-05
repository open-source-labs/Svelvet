<script lang="ts">
	import { Anchor, Node } from '$lib';

	let text = 'Test';
	let checked = true;
	let color = '#ff0000';
	let date = new Date();
	let datetime = new Date();
	let email = '';
	let month = '';
	let number = 0;
	let password = '';
	let radio = '';
	let range = 0;
	let search = '';
	let tel = '';
	let url = '';
	let week = '';
</script>

<Node id="input" bgColor="black" label="StartNode" borderRadius={10} let:destroy>
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
		<textarea id="textarea-test" />
		<button on:click={destroy}>Test</button>
	</div>
</Node>

<style>
	.node {
		width: 400px;
		height: 400px;
	}
</style>
