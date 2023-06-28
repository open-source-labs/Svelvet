<script lang="ts">
	import { Svelvet, Node, ThemeToggle } from '$lib';
</script>

<body>
	<Svelvet controls>
		<Node
			--anchor-color="green"
			--anchor-width="20px"
			--anchor-radius="2px"
			id="node1"
			label="test"
			resizable
		/>
		<Node --node-color="red" --node-border-radius="40px" id="node2" label="test" />
		<Node label="what" position={{ x: 10, y: 200 }} inputs={3} TD />
		<Node label="what" position={{ x: 100, y: 200 }} inputs={2} TD blocked />
		<ThemeToggle slot="toggle" main="light" alt="custom-theme" />
	</Svelvet>
</body>

<style>
	body {
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
	}

	:root[svelvet-theme='custom-theme'] {
		--node-cursor-blocked: crosshair;
		--node-color: hsl(225, 30%, 50%);
		--node-border-color: hsl(225, 20%, 40%);
		--node-selection-color: hsl(45, 90%, 60%);
		--text-color: hsl(0, 0%, 100%);
		--node-shadow: var(--shadow-elevation-medium);

		--background-color: hsl(225, 20%, 27%);
		--dot-color: hsl(225, 10%, 50%);

		--accent-color: hsl(45, 90%, 60%);
		--primary-color: hsl(225, 30%, 66%);

		--edge-color: hsl(0, 0%, 100%);
		--target-edge-color: hsl(225, 20%, 40%);
		--edge-shadow: var(--shadow-elevation-medium);

		--anchor-color: hsl(45, 90%, 67%);
		--anchor-border-color: hsl(45, 90%, 87%);
		--anchor-connected: hsl(45, 90%, 100%);
		--anchor-connected-border: hsl(225, 20%, 20%);

		--anchor-connecting: hsl(225, 30%, 40%);
		--anchor-connecting-border: hsl(0, 0%, 100%);

		--anchor-hovering: hsl(225, 20%, 46%);
		--anchor-hovering-border: hsl(0, 0%, 0%);

		--minimap-background-color: hsl(225, 20%, 27%);

		--minimap-node-color: hsl(225, 30%, 20%);

		--controls-background-color: hsl(225, 20%, 27%);
		--controls-text-color: hsl(0, 0%, 100%);

		--theme-toggle-text-color: hsl(0, 0%, 100%);
		--theme-toggle-color: hsl(225, 20%, 27%);
	}
</style>
