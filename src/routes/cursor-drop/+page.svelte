<script lang="ts">
	import { Node, Svelvet } from '$lib';
	import type { NodeConfig } from '$lib/types';
	let dropZoneClass = 'inactive';
	let NODE_DATA_TYPE = 'node';
	let nodes: NodeConfig[] = [];
	const onDragStart = (e: any) => {
		e.dataTransfer.setData(NODE_DATA_TYPE, e.target.dataset.value);
	};

	const onDragOver = (e: Event) => {
		e.preventDefault();
		return false;
	};

	const onDragEnter = (e: Event) => {
		dropZoneClass = 'active';
	};

	const onDragLeave = (e: Event) => {
		dropZoneClass = 'inactive';
	};

	const onDrop = (e: any) => {
		e.stopPropagation();
		//Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);

		dropZoneClass = 'inactive';
		const nodeType: string = e.dataTransfer.getData(NODE_DATA_TYPE);
		nodes = [...nodes, { id: nodes.length }];
		return false;
	};
</script>

<div
	class={dropZoneClass}
	on:dragover={onDragOver}
	on:dragenter={onDragEnter}
	on:dragleave={onDragLeave}
	on:drop={onDrop}
>
	<Svelvet height={600} zoom={0.75} minimap controls>
		{#each nodes as node (node.id)}
			<Node {...node} drop="cursor" />
		{/each}
	</Svelvet>
</div>

<div class="toolbox">
	<h3 class="title">Toolbox</h3>
	<ul class="toolbox-items">
		<li class="list-item" draggable="true" data-value="green" on:dragstart={onDragStart}>
			<div class="icon green" />
			Green Square
		</li>
		<li class="list-item" draggable="true" data-value="blue" on:dragstart={onDragStart}>
			<div class="icon blue" />
			Blue Square
		</li>
		<li class="list-item" draggable="true" data-value="red" on:dragstart={onDragStart}>
			<div class="icon red" />
			Red Square
		</li>
	</ul>
</div>
