<script lang="ts">
	// import { getContext, onMount, setContext } from 'svelte';
	import { Node, Svelvet, Anchor } from '$lib';
	// import Graph from '$lib/containers/Graph/Graph.svelte';
	// import { graphStore } from '$lib/stores';
	import type { NodeConfig, CSSColorString, InitialDimensions} from '$lib/types';

	//const graph = getContext<Graph>('graph');

	let dropZoneClass = 'inactive';
	let NODE_BG_TYPE = 'nodebg';
	let NODE_HEIGHT_DIMENSIONS_TYPE = 'nodeHeight';
	let NODE_WIDTH_DIMENSIONS_TYPE = 'nodeWidth';
	let NODE_BORDER_TYPE = 'nodeborder';
	let NODE_BORDER_WIDTH = 'borderWidth'
	// let NODE_TD_ANCHOR_POSITION_TYPE = 'nodeTD';
	// let NODE_LR_ANCHOR_POSITION_TYPE = 'nodeLR';
	let NODE_INPUTS = 'inputs';
	let NODE_OUTPUTS = 'outputs';

	// types for node creation
	let nodeBackgroundColor: CSSColorString = '#F2F2F2';
	let nodeBorderColor: CSSColorString = '#DEDEDE';
	let nodeWidth: number = 200;
	let nodeHeight: number = 100;
	// let nodeTD: boolean =  false;
	// let nodeLR: boolean = false;
	let input: number = 1
	let output: number = 1;
	let border_width: number = 1;
	let nodeText: string = '';


	let nodes: NodeConfig[] = [];

	const onDragStart = (e: any) => {
	 	e.dataTransfer.setData(NODE_BG_TYPE, nodeBackgroundColor);
		e.dataTransfer.setData(NODE_BORDER_TYPE, nodeBorderColor);
		e.dataTransfer.setData(NODE_BORDER_WIDTH, border_width);
		e.dataTransfer.setData(NODE_WIDTH_DIMENSIONS_TYPE, nodeWidth);
		e.dataTransfer.setData(NODE_HEIGHT_DIMENSIONS_TYPE, nodeHeight);
		// e.dataTransfer.setData(NODE_TD_ANCHOR_POSITION_TYPE, nodeTD);
		// e.dataTransfer.setData(NODE_LR_ANCHOR_POSITION_TYPE, nodeLR);
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

	// const setPositionTD = (e: any) => {
		
	// 	nodeTD = true;
	// }

	// const setPositionLR = (e: any) => {
	// 	nodeLR = true;
	// }

	const onDrop = (e: any) => {
		e.stopPropagation();
		//Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);

		

		const nodeType: CSSColorString = e.dataTransfer.getData(NODE_BG_TYPE);
		const borderType: CSSColorString = e.dataTransfer.getData(NODE_BORDER_TYPE);
		const width: number = e.dataTransfer.getData(NODE_WIDTH_DIMENSIONS_TYPE);
		const height: number = e.dataTransfer.getData(NODE_HEIGHT_DIMENSIONS_TYPE);
		const dimensions: InitialDimensions = {width, height};
		// const TD: boolean =  e.dataTransfer.getData(NODE_TD_ANCHOR_POSITION_TYPE);
		//const LR: boolean =  e.dataTransfer.getData(NODE_LR_ANCHOR_POSITION_TYPE);
		//let direction: 'TD' | 'LR' | undefined = TD ? 'TD' : LR ? 'LR' : undefined;
		
		// if(TD) ? direction = 'TD' : direction : 'LR'

		const inputs: number = input;
		const outputs: number = output;
		const label: string = nodeText;
		const borderWidth: number = e.dataTransfer.getData(NODE_BORDER_WIDTH);
		// console.log('border width', borderWidth)
		console.log('border',borderType);
		console.log('background', nodeType);
		// console.log('direction', TD);
		const direction = 'TD';

		dropZoneClass = 'inactive';
		nodes = [...nodes, { id: nodes.length}];
		return false;
	};

	//
	const handleClick = (e: any) => {
		
		nodeBackgroundColor = '#F2F2F2';
	 	nodeBorderColor = '#DEDEDE';
		nodeWidth = 200;
		nodeHeight = 100;


	}

</script>
<body>
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



<div class="drawer">
	<h1>Create Node</h1>
	<div id='node' >
			<ul>
				<li class="list-item">Background Color: <input type='color' bind:value={nodeBackgroundColor}></li>
				<li class="list-item">Background Color: <input type='color' bind:value={nodeBorderColor}></li>
				<li class='list-item'>Label: <input type="text" bind:value={nodeText}></li>
				<li class='list-item'>Border Width: <input type="number" bind:value={border_width}></li>
				<li class="list-item">
					<h3>Dimensions: </h3>
					<label for='width'>Height:</label>
						<input id='width' type='input' bind:value={nodeHeight}>
					<label for='height'>Width:</label> 
						<input id='height' type='input' bind:value={nodeWidth}>
				</li>
				
				<!-- <li>
			  		<h3>Default Anchors</h3>
					<label for="#inputAnchor">Input Anchors: </label>
					<input id='inputAnchor' type="number" bind:value={input}>
					<label for="#outputAnchor">Output Anchors: </label>
					<input id='outputAnchor' type="number" bind:value={output}>
			  	</li> -->
				<!-- <li class="list-item">
					<h3>Anchor Position: </h3>
					<label for='#td'>TD: </label>
						<input id='td' type='checkbox' bind:value={nodeTD} on:change={setPositionTD}>
					<label for='#lr'>LR: </label> 
						<input id='lr' type='checkbox' bind:value={nodeLR} on:change={setPositionLR}>
				</li> -->
				<li class="list-item">
					<div class='createNode' draggable="true" on:dragstart={onDragStart}>
						Node
					</div>
				   <button on:click|stopPropagation={handleClick}>Reset</button>
				</li>
			</ul>
	</div>
</div>
</body>
<style>
	.createNode {
			font-size: 2em;
			font-weight: bold;
	}

	.listItem {
		list-style: none;
	}

</style>

<!-- <div class="toolbox">
	<h3 class="title">Toolbox</h3>
	<ul class="toolbox-items">
		<li class="list-item" draggable="true" data-bordervalue='red' data-bordervalue='red' on:dragstart={onDragStart}>
			<div class="icon green" />
			Green Square
		</li>
		<li class="list-item" draggable="true" data-bgvalue="blue" on:dragstart={onDragStart}>
			<div class="icon blue" />
			Blue Square
		</li>
		<li class="list-item" draggable="true" data-bgvalue="red" on:dragstart={onDragStart}>
			<div class="icon red" />
			Red Square
		</li>
	</ul>
</div> -->
