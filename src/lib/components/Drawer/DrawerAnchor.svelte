<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	import type { CSSColorString, Direction, AnchorProps, AnchorDrawerConfig } from '$lib/types';
	import { addProps } from '$lib/utils';
	import type { ComponentType } from 'svelte';
	import Icon from '$lib/assets/icons/Icon.svelte';

	// Local stores
	const anchorCounter = writable<number>(0);

	// Props for anchor creation
	let invisible: boolean | undefined;
	let nodeConnect: boolean | undefined;
	let input: boolean | undefined;
	let output: boolean | undefined;
	let multiple: boolean | undefined;
	let direction: Direction | undefined | '';
	let dynamic: boolean | undefined;
	let anchorEdgeLabel: string | undefined;
	let anchorLocked: boolean | undefined;
	let anchorBgColor: CSSColorString | undefined;
	let directionValue: HTMLElement;
	let edgeProps: ComponentType | undefined = undefined;

	// Array of props for pending anchors
	let anchorsCreated: AnchorDrawerConfig[] = [];

	// Creates props and adds to store, returns true if anchor was created
	export const createAnchorProps = (createAnchors: boolean): AnchorDrawerConfig[] | undefined => {
		if (direction == '') direction = undefined;
		// Adds edgeprops to edge component if edge was created, need to add anchorCreated parameter

		// Object that stores properties for the created anchor
		const anchorProps: AnchorDrawerConfig = {};
		// Array of property names and values for anchor
		const anchorPropNames: string[] = [
			'invisible',
			'nodeConnect',
			'input',
			'output',
			'multiple',
			'direction',
			'dynamic',
			'edgeLabel',
			'locked',
			'bgColor',
			'edge'
		];
		const anchorPropsArray: AnchorProps = [
			invisible,
			nodeConnect,
			input,
			output,
			multiple,
			direction,
			dynamic,
			anchorEdgeLabel,
			anchorLocked,
			anchorBgColor,
			edgeProps
		];

		// Adds props to anchor if they exist
		addProps(anchorPropNames, anchorPropsArray, anchorProps);
		// If props were created add anchorProps object to store
		if (Object.keys(anchorProps).length) {
			if (createAnchors) {
				return [...anchorsCreated];
			}
			anchorsCreated.push(anchorProps);
			return [...anchorsCreated];
		}
		return;
	};

	//Button Clicks for Anchors
	const handleAnchorLockedButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		anchorLocked = target.checked;
	};

	const handleInvisibleButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		invisible = target.checked;
	};

	const handleNodeConnectButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		nodeConnect = target.checked;
	};

	const handleInputButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		input = target.checked;
	};

	const handleOutputButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		output = target.checked;
	};

	const handleMultipleButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		multiple = target.checked;
	};

	const handleDynamicButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		dynamic = target.checked;
	};

	const handleDirectionButtonClick = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		if (target.value == '') direction = undefined;
		else {
			direction = target.value as Direction | undefined;
		}
	};

	const handleAnchorResetButtonClick = (e: Event) => {
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
		anchorsCreated = [];

		anchorCounter.set(anchorsCreated.length);
		const formElement = e.target as HTMLFormElement;
		if (e) formElement.reset();
	};

	const addAnchor = () => {
		createAnchorProps(false);
		anchorCounter.set(anchorsCreated.length);
	};

	const deleteAnchor = () => {
		anchorsCreated.pop();
		anchorCounter.set(anchorsCreated.length);
	};
</script>

<div id="anchorContainer">
	<!-- On submit resets all the values on the input field in the form to default -->
	<form on:submit|preventDefault={handleAnchorResetButtonClick}>
		<ul aria-labelledby="select_props">
			<li class="list-item">
				<label for="anchorBgColor">Background: </label>
				<input id="anchorBgColor" class="colorWheel" type="color" bind:value={anchorBgColor} />
			</li>
			<li class="list-item">
				<label for="invisible">Invisible: </label>
				<input
					id="invisible"
					type="checkbox"
					bind:value={invisible}
					on:change={handleInvisibleButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="nodeConnect">Node Connect: </label>
				<input
					id="nodeConnect"
					type="checkbox"
					bind:value={nodeConnect}
					on:change={handleNodeConnectButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="input">Input: </label>
				<input id="input" type="checkbox" bind:value={input} on:change={handleInputButtonClick} />
			</li>
			<li class="list-item">
				<label for="output">Output: </label>
				<input
					id="output"
					type="checkbox"
					bind:value={output}
					on:change={handleOutputButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="multiple">Multiple: </label>
				<input
					id="multiple"
					type="checkbox"
					bind:value={multiple}
					on:change={handleMultipleButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="direction">Direction: </label>
				<select
					id="direction"
					bind:this={directionValue}
					bind:value={direction}
					on:change={handleDirectionButtonClick}
				>
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
					on:change={handleDynamicButtonClick}
				/>
			</li>

			<li class="list-item">
				<label for="anchorLocked">Locked: </label>
				<input
					id="anchorLocked"
					type="checkbox"
					bind:value={anchorLocked}
					on:change={handleAnchorLockedButtonClick}
				/>
			</li>

			<li class="list-item">
				<label for="addAnchors"> Add Anchors: </label>
				<button class="deleteAnchor" type="button" on:click|stopPropagation={deleteAnchor}>
					<Icon icon="arrow_left" />
				</button>
				<span class="list-item counter">{$anchorCounter}</span>
				<button class="addAnchor" type="button" on:click|stopPropagation={addAnchor}>
					<Icon icon="arrow_right" />
				</button>
			</li>
			<li class="list-item">
				<button class="anchorResetBtn btn" type="submit" aria-label="Reset">Reset</button>
			</li>
		</ul>
	</form>
</div>

<style>
	/* Anchor dropdown Styling */
	#anchorContainer {
		width: 100%;
		font-size: 15px;
	}
	#anchorContainer ul {
		margin: 0;
		padding: 0;
	}
	label {
		margin-right: 10px;
	}
	.list-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		list-style: none;
		margin-bottom: 10px;
		margin-right: 3px;
	}
	.colorWheel {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: transparent;
		border: none;
		width: 35px;
		height: 35px;
		cursor: pointer;
		border-radius: 50%;
	}

	.colorWheel::-webkit-color-swatch {
		border-radius: 40%;
	}
	.colorWheel::-moz-color-swatch {
		border-radius: 40%;
	}

	.btn {
		width: 120px;
		padding: 8px 20px;
		margin: auto;
		margin-top: 10px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 15px;
		margin-left: 70px;
	}

	.addAnchor,
	.deleteAnchor {
		border: none;
		cursor: pointer;
		padding: 5px;
		border-radius: 8px;
		color: var(
			--prop-drawer-reset-button-text-color,
			var(--drawer-reset-button-text-color, var(--default-reset-drawer-button-text-color))
		);
		background-color: var(
			--prop-drawer-reset-button-color,
			var(--drawer-reset-button-color, var(--default-drawer-reset-button-color))
		);
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
	}

	.addAnchor:hover,
	.deleteAnchor:hover {
		color: var(
			--prop-drawer-reset-button-hover-text-color,
			var(
				--drawer-reset-button-hover-text-color,
				var(--default-drawer-reset-button-hover-text-color)
			)
		);
		background-color: var(
			--prop-drawer-reset-button-hover-color,
			var(--drawer-reset-button-hover-color, var(--default-drawer-reset-button-hover-color))
		);
	}

	.counter {
		display: inline-block;
		width: 15px;
		margin: 0 10px;
		font-size: 18px;
	}

	.anchorResetBtn {
		color: var(
			--prop-drawer-reset-button-text-color,
			var(--drawer-reset-button-text-color, var(--default-reset-drawer-button-text-color))
		);
		background-color: var(
			--prop-drawer-reset-button-color,
			var(--drawer-reset-button-color, var(--default-drawer-reset-button-color))
		);
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
	}

	.anchorResetBtn:hover {
		color: var(
			--prop-drawer-reset-button-hover-text-color,
			var(
				--drawer-reset-button-hover-text-color,
				var(--default-drawer-reset-button-hover-text-color)
			)
		);
		background-color: var(
			--prop-drawer-reset-button-hover-color,
			var(--drawer-reset-button-hover-color, var(--default-drawer-reset-button-hover-color))
		);
	}
</style>
