<script lang="ts">
	import { Node, Svelvet, Anchor, Edge } from '$lib';
	import type { SvelvetConfig, NodeConfig, XYPair, EdgeStyle, NodeDrawerConfig } from '$lib/types';
	import type { ComponentType } from 'svelte';
	import { defaultNodePropsStore } from './DrawerNode.svelte';

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
	const svelvetProps: SvelvetConfig = {
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
	let defaultNodes: NodeDrawerConfig[] = [];
	let dropped_in: boolean;

	// Drag and drop events
	const handleDragEnter = (): void => {
		if (!dropped_in) dropped_in = true;
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
	};
</script>

<div
	role="presentation"
	class="drop_zone"
	on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
	on:dragover={onDragOver}
	on:drop={handleDrop}
>
	<Svelvet {...svelvetProps} drawer>
		{#each defaultNodes as { anchors, edgeProps, ...nodeProps }}
			{#if anchors}
				<Node {...nodeProps} drop="cursor">
					<slot slot="anchorWest">
						{#each anchors.left as leftAnchorProps}
							{#if edgeProps}
								<Anchor {...leftAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...leftAnchorProps} />
							{/if}
						{/each}
					</slot>
					<slot slot="anchorEast">
						{#each anchors.right as rightAnchorProps}
							{#if edgeProps}
								<Anchor {...rightAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...rightAnchorProps} />
							{/if}
						{/each}
					</slot>
					<slot slot="anchorNorth">
						{#each anchors.top as topAnchorProps}
							{#if edgeProps}
								<Anchor {...topAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...topAnchorProps} />
							{/if}
						{/each}
					</slot>
					<slot slot="anchorSouth">
						{#each anchors.bottom as bottomAnchorProps}
							{#if edgeProps}
								<Anchor {...bottomAnchorProps}>
									<Edge {...edgeProps} slot="edge" />
								</Anchor>
							{:else}
								<Anchor {...bottomAnchorProps} />
							{/if}
						{/each}
					</slot>
					{#each anchors.self as anchorProps}
						{#if edgeProps}
							<Anchor {...anchorProps}>
								<Edge {...edgeProps} slot="edge" />
							</Anchor>
						{:else}
							<Anchor {...anchorProps} />
						{/if}
					{/each}
				</Node>
			{:else}
				<Node {...nodeProps} drop="cursor" />
			{/if}
		{/each}

		<slot />
		<slot name="minimap" slot="minimap" />
		<slot name="controls" slot="controls" />
		<!-- <slot name="background" slot='background'></slot>  -->
		<slot name="toggle" slot="toggle" />
	</Svelvet>
</div>
