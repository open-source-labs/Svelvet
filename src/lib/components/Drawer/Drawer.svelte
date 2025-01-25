<script lang="ts">
	import { Node, Svelvet, Anchor, Edge } from '$lib';
	import type { SvelvetConfig, NodeConfig, XYPair, EdgeStyle, NodeDrawerConfig } from '$lib/types';
	import type { ComponentType } from 'svelte';
	import { defaultNodePropsStore } from './DrawerNode.svelte';

	// Props
	$props = {
		width: 0,
		height: 0,
		minimap: false,
		translation: { x: 0, y: 0 },
		controls: false,
		edge: null,
		edgeStyle: 'bezier',
		snapTo: 0,
		editable: false,
		fitView: false,
		locked: false,
		zoom: 1,
		theme: 'light',
		mermaid: '',
		mermaidConfig: {},
		TD: false,
		disableSelection: false,
		raiseEdgesOnSelect: false,
		modifier: 'meta',
		trackpadPan: false,
		toggle: false
	};

	// Store props in object to be passed to svelvet
	const svelvetProps: SvelvetConfig = {
		width: $props.width,
		height: $props.height,
		minimap: $props.minimap,
		translation: $props.translation,
		controls: $props.controls,
		edge: $props.edge,
		edgeStyle: $props.edgeStyle,
		snapTo: $props.snapTo,
		editable: $props.editable,
		fitView: $props.fitView,
		locked: $props.locked,
		zoom: $props.zoom,
		theme: $props.theme,
		mermaid: $props.mermaid,
		mermaidConfig: $props.mermaidConfig,
		TD: $props.TD,
		disableSelection: $props.disableSelection,
		raiseEdgesOnSelect: $props.raiseEdgesOnSelect,
		modifier: $props.modifier,
		trackpadPan: $props.trackpadPan,
		toggle: $props.toggle
	};

	// Array of default and custom nodes, anchors
	$state = {
		defaultNodes: [],
		dropped_in: false
	};

	// Drag and drop events
	const handleDragEnter = (): void => {
		if (!$state.dropped_in) $state.dropped_in = true;
	};

	const handleDragLeave = (): void => {
		$state.dropped_in = false;
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

		$state.defaultNodes = $defaultNodePropsStore;
	};
</script>

<div
	role="presentation"
	class="drop_zone"
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={onDragOver}
	ondrop={handleDrop}
>
	<Svelvet {...svelvetProps} drawer>
		{#each $state.defaultNodes as { anchors, edgeProps, ...nodeProps }}
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
