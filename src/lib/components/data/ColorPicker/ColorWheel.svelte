<script lang="ts">
	import { getContext } from 'svelte';
	import type { Graph, CustomWritable, CSSColorString, RGBString, HSLString } from '$lib/types';
	import { calculateRelativeCursor } from '$lib/utils';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');
	$: cursor = graph.cursor;
	$: cursorX = $cursor.x;
	$: cursorY = $cursor.y;

	export let size = 200;
	export let parameterStore: CustomWritable<CSSColorString>;

	let { pickerX, pickerY } = colorToPickerXY($parameterStore, size);

	let picker: HTMLDivElement;
	let picking = false;
	let wheel = true;

	let wheelTop = 0;
	let wheelLeft = 0;

	const updatePosition = () => {
		if (!picker) return;
		const { top, left } = picker.getBoundingClientRect();

		const dimensions = get(graph.dimensions);
		const scale = get(graph.transforms.scale);

		const translationX = get(graph.transforms.translation.x);
		const translationY = get(graph.transforms.translation.y);

		const scaled = calculateRelativeCursor(
			{ clientX: left, clientY: top },
			dimensions.top,
			dimensions.left,
			dimensions.width,
			dimensions.height,
			scale,
			translationX,
			translationY
		);

		wheelTop = scaled.y;
		wheelLeft = scaled.x;
	};

	$: if (picking) {
		const offsetX = cursorX - wheelLeft;
		const offsetY = cursorY - wheelTop;
		const radius = size / 2;
		const dx = offsetX - radius;
		const dy = offsetY - radius;

		const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
		const normalizedDistance = Math.min(distanceFromCenter, radius);
		const angle = Math.atan2(dy, dx);

		const normalizedX = radius + (dx / distanceFromCenter) * normalizedDistance;
		const normalizedY = radius + (dy / distanceFromCenter) * normalizedDistance;

		pickerX = normalizedX;
		pickerY = normalizedY;

		const hue = ((angle + Math.PI) / (2 * Math.PI)) * 360;
		const saturation = (normalizedDistance / radius) * 100;
		const pickedColor: CSSColorString = `hsl(${hue}, ${saturation}%, ${
			50 + (100 - saturation) / 2
		}%)`;
		$parameterStore = pickedColor;
	}
	function downUp(node: HTMLDivElement) {
		function onMouseDown(e: MouseEvent) {
			e.stopPropagation();
			e.preventDefault();
			updatePosition();
			picking = true;
			window.addEventListener('mouseup', onMouseUp);
		}

		function onMouseUp() {
			picking = false;
			window.removeEventListener('mouseup', onMouseUp);
		}

		node.addEventListener('mousedown', onMouseDown);

		return {
			destroy() {
				node.removeEventListener('mousedown', onMouseDown);
			}
		};
	}
	function colorToPickerXY(
		color: CSSColorString,
		size: number
	): { pickerX: number; pickerY: number } {
		const rgb = namedColorToRGB(color);
		const hsl = rgbToHsl(rgb);
		const hslRegex = /hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/;
		const match = hsl.match(hslRegex);
		if (!match) {
			throw new Error('Invalid HSL color string');
		}

		const hue = parseInt(match[1]);
		const saturation = parseInt(match[2]);
		const radius = size / 2;

		const angle = (hue / 360) * 2 * Math.PI - Math.PI;
		const normalizedDistance = (saturation / 100) * radius;

		const pickerX = radius + Math.cos(angle) * normalizedDistance;
		const pickerY = radius + Math.sin(angle) * normalizedDistance;

		// const xValue = (hue / 360) * size;
		// return { pickerX: xValue, pickerY: 0 };
		return { pickerX, pickerY };
	}

	function namedColorToRGB(colorName: CSSColorString): RGBString {
		const tempElement = document.createElement('div');
		tempElement.style.color = colorName;
		document.body.appendChild(tempElement);

		const computedStyle = getComputedStyle(tempElement);
		const color = computedStyle.color as RGBString;

		document.body.removeChild(tempElement);
		return color;
	}

	function rgbToHsl(rgbColor: RGBString): HSLString {
		const rgbRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
		const match = rgbColor.match(rgbRegex);

		if (!match) {
			throw new Error('Invalid RGB color string');
		}

		const r = parseInt(match[1]) / 255;
		const g = parseInt(match[2]) / 255;
		const b = parseInt(match[3]) / 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const delta = max - min;

		let hue;
		if (delta === 0) {
			hue = 0;
		} else if (max === r) {
			hue = 60 * (((g - b) / delta) % 6);
		} else if (max === g) {
			hue = 60 * ((b - r) / delta + 2);
		} else {
			hue = 60 * ((r - g) / delta + 4);
		}
		hue = Math.round(hue);

		const lightness = (max + min) / 2;

		const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

		return `hsl(${hue}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
	}
</script>

<div class="wrapper">
	<div
		class:picking
		class:wheel
		bind:this={picker}
		use:downUp
		style:width={size ? `${size}px` : '100%'}
		style:aspect-ratio={1 / 1}
	>
		<div class="cursor" style:top="{pickerY}px" style:left="{pickerX}px" />
	</div>
</div>

<style>
	.cursor {
		width: 8px;
		height: 8px;
		border: solid 1.5px rgb(255, 255, 255);
		transform: translate(-50%, -50%);
		border-radius: 50%;
		position: absolute;
	}
	.wrapper {
		position: relative;
	}
	.picking {
		cursor: none !important;
	}
	.wheel {
		background: conic-gradient(from -90deg, red, yellow, lime, cyan, blue, magenta, red);
		border-radius: 50%;
		cursor: crosshair;
		position: relative;
	}

	/* .line {
		position: relative;
		width: 200px;
		height: 30px;
		border-radius: 6px;
		background: linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red);
	} */
</style>
