<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';

	import { Node, Svelvet, Anchor, Edge } from '$lib';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import type { NodeConfig, CSSColorString, Direction } from '$lib/types';
	import CustomEdge from '../../example-components/CustomEdge.svelte';
	import { addProps } from '$lib/utils';

	let defaultNodes: NodeConfig[] = $state([]);
	let customNodes: NodeConfig[] = $state([]);
	let anchors: any[] = [];
	let edges: any[] = [];
	let customEdge: any;
	let dropped_in: boolean;

	// types for node creation
	let bgColor: CSSColorString | undefined = $state();
	let borderColor: CSSColorString | undefined = $state();
	let label: string | undefined = $state();
	let width: number = $state(200);
	let height: number = $state(100);
	let nodeDirection: string | undefined = $state();
	let inputs: number | undefined = $state();
	let outputs: number | undefined = $state();
	let locked: boolean | undefined = $state();
	let center: boolean | undefined = $state();
	let rotation: number | undefined = $state();
	let zIndex: number | undefined = $state();
	let TD: boolean | undefined;
	let LR: boolean | undefined;
	let useDefaults: boolean | undefined = $state();

	// types for anchor creation
	let invisible: boolean | undefined = $state();
	let nodeConnect: boolean | undefined = $state();
	let input: boolean | undefined = $state();
	let output: boolean | undefined = $state();
	let multiple: boolean | undefined = $state();
	let direction: Direction | undefined = $state();
	let dynamic: boolean | undefined = $state();
	let anchorEdgeLabel: string | undefined = $state();
	let anchorLocked: boolean | undefined = $state();
	let anchorBgColor: CSSColorString | undefined = $state();

	//types for edge creation
	let edgeWidth: number | undefined = $state();
	let targetColor: CSSColorString | undefined = $state();
	let color: CSSColorString | undefined = $state();
	let straight: boolean | undefined = $state();
	let step: boolean | undefined = $state();
	let cornerRadius: number | undefined = $state();
	let animate: boolean | undefined = $state();
	let edgeLabel: string | undefined = $state();
	let labelColor: CSSColorString | undefined = $state();
	let textColor: CSSColorString | undefined = $state();
	let edgeClick: () => void | null; // Stretch feature

	// Drag and drop events
	const handleDragEnter = (e: any) => {
		dropped_in = true;
	};

	const handleDragLeave = (e: any) => {
		dropped_in = false;
	};

	const handleDragEnd = (e: any) => {
		dropped_in = false;
	};

	const onDragOver = (e: Event) => {
		e.preventDefault();
		return false;
	};

	const handleDragStart = (e: any) => {
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDragDrop = (e: any) => {
		e.preventDefault();
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);
		dropped_in = true;

		// Object that stores properties for the created node
		const nodeProps: any = {};
		// Array of property names and values for node
		const nodePropNames: any[] = [
			'bgColor',
			'borderColor',
			'label',
			'width',
			'height',
			'locked',
			'center',
			'inputs',
			'outputs',
			'rotation',
			'zIndex',
			'TD',
			'LR',
			'useDefaults'
		];
		const nodePropsArray: any[] = [
			bgColor,
			borderColor,
			label,
			width,
			height,
			locked,
			center,
			inputs,
			outputs,
			rotation,
			zIndex,
			TD,
			LR,
			useDefaults
		];
		// Adds props to object if they exist
		const addProp = (names: any, vals: any, nodeProps: any): any => {
			for (let i = 0; i < names.length; i++) {
				if (vals[i]) nodeProps[names[i]] = vals[i];
			}
		};

		// Add props to node if they exist
		addProp(nodePropNames, nodePropsArray, nodeProps);

		// Object that stores properties for the created anchor
		const anchorProps: any = {};
		// Array of property names and values for anchor
		const anchorPropNames: any[] = [
			'invisible',
			'nodeConnect',
			'input',
			'output',
			'multiple',
			'dynamic',
			'edgeLabel',
			'direction',
			'locked',
			'bgColor'
		];
		const anchorPropsArray: any[] = [
			invisible,
			nodeConnect,
			input,
			output,
			multiple,
			dynamic,
			anchorEdgeLabel,
			direction,
			anchorLocked,
			anchorBgColor
		];
		// Adds props to anchor if they exist
		addProp(anchorPropNames, anchorPropsArray, anchorProps);

		// Objec that stores properties for the created edge
		const edgeProps: any = {};
		// Array of property names and values for edge
		const edgePropsNames: any[] = [
			'width',
			'targetColor',
			'color',
			'straight',
			'step',
			'cornerRadius',
			'animate',
			'label',
			'labelColor',
			'textColor'
		];
		const edgePropsArray: any[] = [
			edgeWidth,
			targetColor,
			color,
			straight,
			step,
			cornerRadius,
			animate,
			edgeLabel,
			labelColor,
			textColor
		];
		// Add props to edge if they exist
		addProp(edgePropsNames, edgePropsArray, edgeProps);

		// If anchor props were given to create an anchor, an anchor has been created
		if (Object.keys(anchorProps).length) {
			// Add custom node to array and push the custom props
			customNodes = [...customNodes, { ...nodeProps }];
			anchors.push(anchorProps);

			//If edge props were given to create an achor, a custom edge has been created
			if (Object.keys(edgeProps).length) {
				// Add edge props to edge array
				edges.push({ ...edgeProps });
			}
		} else {
			defaultNodes = [...defaultNodes, { ...nodeProps }];
		}
	};

	// Button clicks for defaultNodes
	const handleNodeResetButtonClick = (e: any) => {
		bgColor = undefined;
		borderColor = undefined;
		label = undefined;
		width = 200;
		height = 100;
		inputs = undefined;
		outputs = undefined;
		locked = undefined;
		center = undefined;
		rotation = undefined;
		zIndex = undefined;
		TD = undefined;
		LR = undefined;
		useDefaults = undefined;
	};

	const handleLockedButtonClick = (e: any) => {
		locked = e.target.checked;
	};

	const handleCenterButtonClick = (e: any) => {
		center = e.target.checked;
	};

	const handleUseDefaultsButtonClick = (e: any) => {
		useDefaults = e.target.checked;
	};

	const handleAnchorPositionButton = (e: any) => {
		if (e.target.value == '') nodeDirection = undefined;
		else {
			console.log(e.target.value);
			nodeDirection = e.target.value;
			if (nodeDirection === 'LR') {
				LR = true;
				TD = false;
			} else {
				TD = true;
				LR = false;
			}
		}
	};

	//Button Clicks for Anchors
	const handleAnchorLockedButtonClick = (e: any) => {
		anchorLocked = e.target.checked;
	};

	const handleInvisibleButtonClick = (e: any) => {
		invisible = e.target.checked;
	};

	const handleNodeConnectButtonClick = (e: any) => {
		nodeConnect = e.target.checked;
	};

	const handleInputButtonClick = (e: any) => {
		input = e.target.checked;
	};

	const handleOutputButtonClick = (e: any) => {
		output = e.target.checked;
	};

	const handleMultipleButtonClick = (e: any) => {
		multiple = e.target.checked;
	};

	const handleDynamicButtonClick = (e: any) => {
		dynamic = e.target.checked;
	};

	const handleDirectionButtonClick = (e: any) => {
		if (e.target.value == '') direction = undefined;
		else {
			direction = e.target.value;
		}
	};

	const handleAnchorResetButtonClick = (e: any) => {
		invisible = undefined;
		nodeConnect = undefined;
		input = undefined;
		output = undefined;
		multiple = undefined;
		direction = undefined;
		dynamic = undefined;
		anchorEdgeLabel = undefined;
		anchorLocked = undefined;
		anchorBgColor = undefined;
	};

	//Button clicks for Edges
	const handleStraightButtonClick = (e: any) => {
		straight = e.target.checked;
	};
	const handleStepButtonClick = (e: any) => {
		step = e.target.checked;
	};
	const handleAnimateButtonClick = (e: any) => {
		animate = e.target.checked;
	};

	const handleEdgeResetButtonClick = (e: any) => {
		edgeWidth = undefined;
		targetColor = undefined;
		color = undefined;
		straight = undefined;
		step = undefined;
		cornerRadius = undefined;
		animate = undefined;
		edgeLabel = undefined;
		labelColor = undefined;
		textColor = undefined;
		//edgeClick: () => void | null;
	};
</script>

<div
	id="drop_zone"
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondrop={handleDragDrop}
	ondragover={onDragOver}
>
	<Svelvet height={600} zoom={0.7} minimap controls>
		{#each defaultNodes as node}
			<Node {...node} drop="cursor" />
		{/each}
		{#each customNodes as cNode, index}
			<Node {...cNode} drop="cursor">
				<Anchor {...anchors[index]}>
					<!-- <Edge {...edges[index]}></Edge> -->
				</Anchor>
			</Node>
		{/each}
		{#snippet toggle()}
				<ThemeToggle main="light" alt="dark"  />
			{/snippet}
	</Svelvet>
</div>

<div id="drawerContainer">
	<div id="nodeContainer">
		<h2>Nodes</h2>
		<ul>
			<li class="list-item">
				<div
					class="defaultNodes"
					draggable="true"
					ondragstart={handleDragStart}
					ondragend={handleDragEnd}
				>
					Node
				</div>
			</li>
			<li class="list-item">
				<label for="bgColor">Background Color : </label>
				<input id="bgColor" class="colorWheel" type="color" bind:value={bgColor} />
			</li>
			<li class="list-item">
				<label for="borderColor">Border Color : </label>
				<input id="borderColor" class="colorWheel" type="color" bind:value={borderColor} />
			</li>
			<li class="list-item">
				<label for="useDefaults">useDefaults: </label>
				<input
					id="useDefaults"
					type="checkbox"
					bind:value={useDefaults}
					onchange={handleUseDefaultsButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="label">Label : </label>
				<input id="label" type="text" bind:value={label} />
			</li>

			<li class="list-item">
				<h4>Dimensions:</h4>
			</li>
			<li class="list-item">
				<label for="width">Width:</label>
				<input id="width" class="inputField" type="input" bind:value={width} />
				<label for="height">Height:</label>
				<input id="height" class="inputField" type="input" bind:value={height} />
			</li>
			<li class="list-item">
				<h4>Default Anchors:</h4>
			</li>
			<li class="list-item">
				<label for="inputAnchor">Input Anchors: </label>
				<input id="inputAnchor" class="inputField" type="number" bind:value={inputs} />
				<label for="outputAnchor">Output Anchors: </label>
				<input id="outputAnchor" class="inputField" type="number" bind:value={outputs} />
			</li>
			<li class="list-item">
				<label for="anchorPositon">Anchor Position: </label>
				<select
					id="anchorPosition"
					bind:value={nodeDirection}
					onchange={handleAnchorPositionButton}
				>
					<option value="">-</option>
					<option value="LR">LR</option>
					<option value="TD">TD</option>
				</select>
			</li>
			<li class="list-item">
				<button class="nodeResetBtn btn" onclick={stopPropagation(handleNodeResetButtonClick)}
					>Reset</button
				>
			</li>
			<li class="list-item">
				<h4>Additional Settings:</h4>
			</li>
			<li class="list-item">
				<label for="locked">Locked: </label>
				<input id="label" type="checkbox" bind:value={locked} onchange={handleLockedButtonClick} />
			</li>
			<li class="list-item">
				<label for="centered">Centered: </label>
				<input
					id="centered"
					type="checkbox"
					bind:value={center}
					onchange={handleCenterButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="rotation">Rotation:</label>
				<input id="rotation" class="inputField" type="number" bind:value={rotation} />
			</li>
			<li class="list-item">
				<label for="zIndex">zIndex:</label>
				<input id="zIndex" class="inputField" type="number" bind:value={zIndex} />
			</li>
		</ul>
	</div>
	<div id="customContainer">
		<div id="customHeading">
			<h2>Customize</h2>
		</div>
		<div id="innerContainer">
			<div id="anchorContainer">
				<h3>Anchors:</h3>
				<ul>
					<li class="list-item">
						<label for="anchorBgColor">Background Color : </label>
						<input id="anchorBgColor" class="colorWheel" type="color" bind:value={anchorBgColor} />
					</li>
					<li class="list-item">
						<label for="invisible">Invisible : </label>
						<input
							id="invisible"
							type="checkbox"
							bind:value={invisible}
							onchange={handleInvisibleButtonClick}
						/>
					</li>
					<li class="list-item">
						<label for="nodeConnect">Node Connect: </label>
						<input
							id="nodeConnect"
							type="checkbox"
							bind:value={nodeConnect}
							onchange={handleNodeConnectButtonClick}
						/>
					</li>
					<li class="list-item">
						<label for="input">Input : </label>
						<input
							id="input"
							type="checkbox"
							bind:value={input}
							onchange={handleInputButtonClick}
						/>
					</li>
					<li class="list-item">
						<label for="output">Output: </label>
						<input
							id="output"
							type="checkbox"
							bind:value={output}
							onchange={handleOutputButtonClick}
						/>
					</li>
					<li class="list-item">
						<label for="multiple">Multiple: </label>
						<input
							id="multiple"
							type="checkbox"
							bind:value={multiple}
							onchange={handleMultipleButtonClick}
						/>
					</li>
					<li class="list-item">
						<label for="direction">Direction: </label>
						<select id="direction" bind:value={direction} onchange={handleDirectionButtonClick}>
							<option value="">-</option>
							<option value="north">North</option>
							<option value="south">South</option>
							<option value="east">East</option>
							<option value="west">West</option>
							<option value="self">Self</option>
						</select>
					</li>
					<li class="list-item">
						<label for="dynamic">Dynamic: </label>
						<input
							id="dynamic"
							type="checkbox"
							bind:value={dynamic}
							onchange={handleDynamicButtonClick}
						/>
					</li>
					<li class="list-item">
						<label for="anchorEdgeLabel">Edge Label : </label>
						<input id="anchorEdgeLabel" type="text" bind:value={anchorEdgeLabel} />
					</li>

					<li class="list-item">
						<label for="anchorLocked">Locked : </label>
						<input
							id="anchorLocked"
							type="checkbox"
							bind:value={anchorLocked}
							onchange={handleAnchorLockedButtonClick}
						/>
					</li>
					<li class="list-item">
						<button
							class="anchorResetBtn btn"
							onclick={stopPropagation(handleAnchorResetButtonClick)}>Reset</button
						>
					</li>
				</ul>
			</div>
			<div id="edgeContainer">
				<h3>Edges:</h3>
				<ul>
					<li class="list-item">
						<label for="targetColor">Target Color : </label>
						<input id="targetColor" class="colorWheel" type="color" bind:value={targetColor} />
					</li>
					<li class="list-item">
						<label for="color">Color : </label>
						<input id="color" class="colorWheel" type="color" bind:value={color} />
					</li>
					<li class="list-item">
						<label for="labelColor">Label Color : </label>
						<input id="labelColor" class="colorWheel" type="color" bind:value={labelColor} />
					</li>
					<li class="list-item">
						<label for="textColor">Text Color : </label>
						<input id="textColor" class="colorWheel" type="color" bind:value={textColor} />
					</li>
					<li class="list-item">
						<label for="width">Width :</label>
						<input id="width" class="inputField" type="number" bind:value={edgeWidth} />
					</li>
					<li class="list-item">
						<label for="cornerRadius">Corner Radius :</label>
						<input id="cornerRadius" class="inputField" type="number" bind:value={cornerRadius} />
					</li>
					<li class="list-item">
						<label for="straight">Straight : </label>
						<input
							id="straight"
							type="checkbox"
							bind:value={straight}
							onchange={handleStraightButtonClick}
						/>
					</li>
					<li class="list-item">
						<label for="step">Step : </label>
						<input id="step" type="checkbox" bind:value={step} onchange={handleStepButtonClick} />
					</li>
					<li class="list-item">
						<label for="animate">Animate : </label>
						<input
							id="animate"
							type="checkbox"
							bind:value={animate}
							onchange={handleAnimateButtonClick}
						/>
					</li>

					<li class="list-item">
						<label for="edgeLabel">Edge Label : </label>
						<input id="edgeLabel" type="text" bind:value={edgeLabel} />
					</li>
					<li class="list-item">
						<button class="edgeResetBtn btn" onclick={stopPropagation(handleEdgeResetButtonClick)}
							>Reset</button
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	/* General Styling */
	#drawerContainer {
		display: flex;
		position: relative;
		overflow-y: auto;
		width: 100%;
	}

	#customHeading {
		margin: auto;
		display: block;
		text-align: center;
	}

	#customContainer {
		width: 60%;
	}

	#innerContainer {
		display: flex;
	}

	label {
		margin-right: 10px;
	}

	.list-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		list-style: none;
		margin-bottom: 8px;
	}
	.colorWheel {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: transparent;
		border: none;
		width: 40px;
		height: 40px;
		cursor: pointer;
		border-radius: 50%;
	}

	.colorWheel::-webkit-color-swatch {
		border-radius: 50%;
	}
	.colorWheel::-moz-color-swatch {
		border-radius: 50%;
	}

	.inputField {
		width: 50px;
		margin-left: 10px;
		margin-right: 10px;
	}

	.btn {
		width: 150px;
		color: aliceblue;
		padding: 5px;
		margin: auto;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	/* nodeContainer Styling */
	#nodeContainer {
		width: 40%;
		padding-right: 20px;
		border-right: 1px solid gray;
	}

	#nodeContainer h2 {
		text-align: center;
	}
	.defaultNodes {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 100px;
		border: 1px solid gray;
		cursor: grab;
	}

	.nodeResetBtn {
		background-color: rgb(109, 109, 246);
	}

	/* Anchor Styling  */
	#anchorContainer {
		width: 50%;
		margin-left: 20px;
		padding-right: 20px;
		border-right: 1px solid gray;
	}
	.anchorResetBtn {
		background-color: rgb(236, 107, 118);
	}

	/* Edge Styling  */
	#edgeContainer {
		margin-left: 20px;
	}
	.edgeResetBtn {
		background-color: rgb(81, 122, 49);
	}
</style>
