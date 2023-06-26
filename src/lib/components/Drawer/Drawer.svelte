<script lang="ts">
	import { Node, Svelvet, Anchor } from '$lib';
	import type {
		SvelvetConfig,
		NodeConfig,
		XYPair,
		EdgeStyle,
		AnchorDrawerConfig
	} from '$lib/types';
	import type { ComponentType } from 'svelte';
	import { defaultNodePropsStore, customNodePropsStore } from './DrawerNode.svelte';
	import { anchorPropsStore } from './DrawerAnchor.svelte';

	// Props
	export let width = 0;
	export let height = 0;
	export let minimap = false;
	export let translation: XYPair = { x: 0, y: 0 };
	export let controls = false;
	export let edge: ComponentType | null = null;
	export let edgeStyle: EdgeStyle = 'bezier';
	export let snapTo = 0;
	export let editable = false;
	export let fitView: boolean | 'resize' = false;
	export let locked = false;
	export let zoom = 1;
	export let theme = 'light';
	export let mermaid = '';
	export let mermaidConfig: Record<string, NodeConfig> = {};
	export let TD = false;
	export let disableSelection = false;
	export let raiseEdgesOnSelect: boolean | 'source' | 'target' = false;
	export let modifier: 'alt' | 'ctrl' | 'shift' | 'meta' = 'meta';
	export let trackpadPan = false;
	export let toggle = false;

	// Store props in object to be passed to svelvet
	const sveltetProps: SvelvetConfig = {
		width,
		height,
		minimap,
		translation,
		controls,
		edge,
		edgeStyle,
		snapTo,
		editable,
		fitView,
		locked,
		zoom,
		theme,
		mermaid,
		mermaidConfig,
		TD,
		disableSelection,
		raiseEdgesOnSelect,
		modifier,
		trackpadPan,
		toggle
	};

	// Array of default and custom nodes, anchors
	let defaultNodes: NodeConfig[] = [];
	let customNodes: NodeConfig[] = [];
	let anchors: AnchorDrawerConfig[][] = [];
	let dropped_in: boolean;

	// Drag and drop events
	const handleDragEnter = (): void => {
		dropped_in = true;
	};

	const handleDragLeave = (): void => {
		dropped_in = false;
	};

	const onDragOver = (e: DragEvent): boolean => {
		e.preventDefault();
		return false;
	};

	const handleDrop = (e: MouseEvent): void => {
		e.stopPropagation();
		//Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		const target = e.target as HTMLElement;
		target.dispatchEvent(moveEvent);

		defaultNodes = $defaultNodePropsStore;
		customNodes = $customNodePropsStore;
		anchors = $anchorPropsStore;
	};
</script>

<div
	class="drop_zone"
	on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
	on:dragover={onDragOver}
	on:drop={handleDrop}
>
	<Svelvet {...sveltetProps} drawer>
		{#each defaultNodes as node, index}
			<Node {...node} drop="cursor" />
		{/each}

		{#each customNodes as customNode, index}
			<Node {...customNode} drop="cursor">
				{#each anchors[index] as anchorProp}
					<div class={anchorProp.direction}>
						<Anchor {...anchorProp} />
					</div>
				{/each}
			</Node>
		{/each}

		<slot />
		<slot name="minimap" slot="minimap" />
		<slot name="controls" slot="controls" />
		<!-- <slot name="background" slot='background'></slot>  -->
		<slot name="toggle" slot="toggle" />
	</Svelvet>
</div>

<style>
	/* Styling for anchor position */
	.west {
		transform: translate(-50%);
		position: absolute;
		left: 0;
	}

	.east {
		transform: translate(50%);
		position: absolute;
		right: 0;
	}

	.north {
		transform: translate(0, -50%);
		position: absolute;
		top: 0;
	}

	.south {
		transform: translate(0, 50%);
		position: absolute;
		bottom: 0;
	}
</style>
