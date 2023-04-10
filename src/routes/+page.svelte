<script lang="ts">
	import { Svelvet, Controls, Minimap, Node } from '$lib';

	function randomColor() {
		return Math.floor(Math.random() * 255);
	}

	function updateConnected(e: CustomEvent) {
		const { node } = e.detail;
		node.label.set('Connected');
	}

	function updateDisconnected(e: CustomEvent) {
		const { node } = e.detail;
		node.label.set('Disconnected');
	}
</script>

<body>
	<div class="wrapper">
		<Svelvet theme="dark" width={300} height={300} TD minimap>
			<Node
				label="Custom Event"
				on:connection={updateConnected}
				on:disconnection={updateDisconnected}
				on:nodeClicked={(e) => {
					// Destructure the node from the event
					const { node } = e.detail;

					node.label.set('Clicked');

					node.bgColor.set(`rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`);

					// Reset the node after 500ms
					setTimeout(() => {
						node.label.set('Custom Event');
						node.bgColor.set('gray');
					}, 500);
				}}
			/>
			<Node
				label="Custom Event"
				on:connection={updateConnected}
				on:disconnection={updateDisconnected}
				on:nodeClicked={(e) => {
					// Destructure the node from the event
					const { node } = e.detail;

					node.label.set('Clicked');

					node.bgColor.set(`rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`);

					// Reset the node after 500ms
					setTimeout(() => {
						node.label.set('Custom Event');
						node.bgColor.set('gray');
					}, 500);
				}}
				LR
			/>
			<Node
				label="Custom Event"
				on:connection={updateConnected}
				on:disconnection={updateDisconnected}
				on:nodeClicked={(e) => {
					// Destructure the node from the event
					const { node } = e.detail;

					node.label.set('Clicked');

					node.bgColor.set(`rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`);

					// Reset the node after 500ms
					setTimeout(() => {
						node.label.set('Custom Event');
						node.bgColor.set('gray');
					}, 500);
				}}
			/>
			<Node
				label="Custom Event"
				on:connection={updateConnected}
				on:disconnection={updateDisconnected}
				on:nodeClicked={(e) => {
					// Destructure the node from the event
					const { node } = e.detail;

					node.label.set('Clicked');

					node.bgColor.set(`rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`);

					// Reset the node after 500ms
					setTimeout(() => {
						node.label.set('Custom Event');
						node.bgColor.set('gray');
					}, 500);
				}}
				LR
			/>
		</Svelvet>
	</div>
</body>

<style>
	.wrapper {
		display: flex;
		border: solid 1px black;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 0 40px 0 rgba(37, 37, 37, 0.5);
	}
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: gray;
		width: 100vw;
		height: 100vh;
	}
</style>
