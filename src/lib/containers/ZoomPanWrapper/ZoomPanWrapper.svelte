<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { updateTranslation } from '$lib/utils';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');
	const transforms = graph.transforms;
	const scale = transforms.scale;
	const translation = transforms.translation;
	const cursor = graph.cursor;

	$props = {
		isMovable: false
	};

	$state = {
		animationFrameId: 0,
		moving: false
	};

	$: graphTranslation = $translation;

	// Reactive statement to update the transform attribute of the wrapper
	$: transform = `translate(${graphTranslation.x}px, ${graphTranslation.y}px) scale(${$scale})`;

	$effect(() => {
		if ($props.isMovable && !$state.moving) {
			$state.moving = true;
			$state.animationFrameId = requestAnimationFrame(translate);
		} else if (!$props.isMovable || !$state.moving) {
			$state.moving = false;
			cancelAnimationFrame($state.animationFrameId);
		}
	});

	function translate() {
		$translation = updateTranslation(get(initialClickPosition), $cursor, transforms);
		$state.animationFrameId = requestAnimationFrame(translate);
	}
</script>

<div
	role="presentation"
	class="svelvet-graph-wrapper"
	style:transform
	oncontextmenu={event => event.preventDefault()}
	onclick={event => event.preventDefault()}
	ontouchstart={event => event.preventDefault()}
>
	<slot />
</div>

<style>
	.svelvet-graph-wrapper {
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none !important;
		touch-action: none;
		/* outline: solid 1px red; */
	}
</style>
