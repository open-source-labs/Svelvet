<script lang="ts">
	import { Node, Svelvet, Anchor, Edge } from '$lib';
	import type { SvelvetConfig, NodeConfig, XYPair, EdgeStyle, NodeDrawerConfig } from '$lib/types';
	import type { ComponentType } from 'svelte';
	import { defaultNodePropsStore } from './DrawerNode.svelte';
	import { writable } from 'svelte/store';

	export let width: number;
	export let height: number;
	export let minimap: boolean;
	export let translation: XYPair;
	export let controls: boolean;
	export let edge: ComponentType;
	export let edgeStyle: EdgeStyle;
	export let snapTo: number;
	export let editable: boolean;
	export let fitView: boolean;
	export let locked: boolean;
	export let zoom: number;
	export let theme: string;
	export let mermaid: string;
	export let mermaidConfig: object;
	export let TD: boolean;
	export let disableSelection: boolean;
	export let raiseEdgesOnSelect: boolean;
	export let modifier: string;
	export let trackpadPan: boolean;
	export let toggle: boolean;

	$props = {
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

	$state = {
		svelvetProps: $props,
		defaultNodes: [],
		dropped_in: false
	};

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
	<Svelvet {...$state.svelvetProps} drawer>
		{#each $state.defaultNodes as { anchors, edgeProps, ...nodeProps }}
			{#if anchors}
				<Node {...nodeProps} drop="cursor">
					{#each anchors.left as leftAnchorProps}
						{#if edgeProps}
							<Anchor {...leftAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...leftAnchorProps} />
						{/if}
					{/each}
					{#each anchors.right as rightAnchorProps}
						{#if edgeProps}
							<Anchor {...rightAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...rightAnchorProps} />
						{/if}
					{/each}
					{#each anchors.top as topAnchorProps}
						{#if edgeProps}
							<Anchor {...topAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...topAnchorProps} />
						{/if}
					{/each}
					{#each anchors.bottom as bottomAnchorProps}
						{#if edgeProps}
							<Anchor {...bottomAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...bottomAnchorProps} />
						{/if}
					{/each}
					{#each anchors.self as anchorProps}
						{#if edgeProps}
							<Anchor {...anchorProps}>
								<Edge {...edgeProps} />
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

		{@render children}
		{@render $props.minimap as minimap}
		{@render $props.controls as controls}
		{@render $props.toggle as toggle}
	</Svelvet>
</div>
