<script lang="ts">
	import DrawerNode from './DrawerNode.svelte';
	import DrawerAnchor from './DrawerAnchor.svelte';
	import DrawerEdge from './DrawerEdge.svelte';
	import { createNodeProps } from './DrawerNode.svelte';
	import { createAnchorProps } from './DrawerAnchor.svelte';
	import { createEdgeProps } from './DrawerEdge.svelte';
	import Icon from '$lib/assets/icons/Icon.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { getSnappedPosition } from '$lib/utils/snapGrid';
	let isOpen = false;
	let nodeContainerOpen = false;
	let edgeContainerOpen = false;
	let anchorContainerOpen = false;
	let nav: HTMLElement;
	let drawerBtn: HTMLElement;
	let nodeBtn: HTMLElement;
	let edgeBtn: HTMLElement;
	let anchorBtn: HTMLElement;
	let drawerContents: HTMLElement;
	let nodeContainer: HTMLElement;
	let anchorContainer: HTMLElement;
	let edgeContainer: HTMLElement;
	let currentNode: HTMLElement | null = null;

	console.log('📌 DrawerController Loaded!');

	const handleDragStart = (e: DragEvent, node: HTMLElement) => {
		// const handleDragStart = (e: DragEvent) => {
		if (!e.dataTransfer) return;
		console.log('Dragging Node:', node); 

		e.dataTransfer.dropEffect = 'move';
		e.dataTransfer.setData('text/plain', node.id); 

		// Store the current node being dragged
		currentNode = node;
		offsetX = e.clientX - node.offsetLeft;
		offsetY = e.clientY - node.offsetTop;

		node.style.position = 'absolute'; 

		// Create props for anchor or edge if values were given
		const anchorProps = createAnchorProps(true);
		const edgeCreated = createEdgeProps();
		// Create props for node
		createNodeProps(edgeCreated, anchorProps);
	};

	const handleDrawer = () => {
		if (!isOpen) {
			isOpen = true;
			nav.style.height = 'fit-content';
			nav.style.width = '300px';
		} else {
			isOpen = false;
			nav.style.height = '35px';
			nav.style.width = '35px';
			anchorContainerOpen = false;
			edgeContainerOpen = false;
			nodeContainerOpen = false;
			nodeContainer.style.display = 'block';
			edgeContainer.style.display = 'none';
			anchorContainer.style.display = 'none';
			nodeBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
			edgeBtn.style.borderBottom = 'none';
			anchorBtn.style.borderBottom = 'none';
		}
	};

	const handleNodeContainer = () => {
		if (!nodeContainerOpen) {
			nodeContainerOpen = true;
			anchorContainerOpen = false;
			edgeContainerOpen = false;
			nodeContainer.style.display = 'block';
			edgeContainer.style.display = 'none';
			anchorContainer.style.display = 'none';
			nodeBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
			edgeBtn.style.borderBottom = 'none';
			anchorBtn.style.borderBottom = 'none';
		}
	};
	const handleAnchorContainer = () => {
		if (!anchorContainerOpen) {
			anchorContainerOpen = true;
			edgeContainerOpen = false;
			nodeContainerOpen = false;
			anchorContainer.style.display = 'block';
			edgeContainer.style.display = 'none';
			nodeContainer.style.display = 'none';
			nodeBtn.style.borderBottom = 'none';
			edgeBtn.style.borderBottom = 'none';
			anchorBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
		}
	};
	const handleEdgeContainer = () => {
		if (!edgeContainerOpen) {
			edgeContainerOpen = true;
			nodeContainerOpen = false;
			anchorContainerOpen = false;
			edgeContainer.style.display = 'block';
			anchorContainer.style.display = 'none';
			nodeContainer.style.display = 'none';
			nodeBtn.style.borderBottom = 'none';
			edgeBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
			anchorBtn.style.borderBottom = 'none';
		}
	};

	let currentComponent = 'Node'; // Add this line

	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'D') {
			handleDrawer();
		} else if (e.key === 'T' && isOpen) {
			// Only toggle components if the drawer is open
			if (currentComponent === 'Node') {
				handleAnchorContainer();
				currentComponent = 'Anchor';
			} else if (currentComponent === 'Anchor') {
				handleEdgeContainer();
				currentComponent = 'Edge';
			} else if (currentComponent === 'Edge') {
				handleNodeContainer();
				currentComponent = 'Node';
			}
		}
	};
	let offsetX = 0;
	let offsetY = 0;

	// Dragging logic for node
	const handleNodeDragStart = (e: DragEvent, node: HTMLElement) => {
		if (!e.dataTransfer) return;

		// Store the current node being dragged
		currentNode = node;

		// Store the initial offset relative to the mouse position
		offsetX = e.clientX - node.offsetLeft;
		offsetY = e.clientY - node.offsetTop;

		node.style.position = 'absolute'; // To move freely within the container
	};

	const handleDragMove = (e: MouseEvent) => {
		if (!currentNode) return;
		console.log("handleDragMove function called!");

		console.log('Dragging...', e.clientX, e.clientY); // ✅ Debugging log

		// Calculate the new position based on mouse movement
		const newX = e.clientX - offsetX;
		const newY = e.clientY - offsetY;

		// Snap the new position to the grid
		const { x: snappedX, y: snappedY } = getSnappedPosition(newX, newY);
		console.log('Snapped to:', snappedX, snappedY); // ✅ Check snapping

		//only update if the position actually changed
		if (
			parseInt(currentNode.style.left, 10) !== snappedX ||
			parseInt(currentNode.style.top, 10) !== snappedY
		) {
			currentNode.style.left = `${snappedX}px`;
			currentNode.style.top = `${snappedY}px`;
		}
	};

	const handleDragEnd = () => {
		if (!currentNode) return;

		// Get final snapped position
		const { x: snappedX, y: snappedY } = getSnappedPosition(
			parseInt(currentNode.style.left, 10),
			parseInt(currentNode.style.top, 10)
		);

		// Store the final snapped position (Example: Update store if needed)
		currentNode.style.left = `${snappedX}px`;
		currentNode.style.top = `${snappedY}px`;
		// Perform any cleanup after the drag ends
		currentNode = null;
	};

	// Add the event listener when the component mounts
	onMount(() => {
		window.addEventListener('keydown', handleKeyPress);
		window.addEventListener('mousemove', handleDragMove);
		window.addEventListener('mouseup', handleDragEnd);
	});

	// Remove the event listener when the component unmounts
	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyPress);
		window.removeEventListener('mousemove', handleDragMove); // ✅ Cleanup
		window.removeEventListener('mouseup', handleDragEnd);
	});
</script>

<nav id="drawerWrapper" bind:this={nav}>
	<slot>
		<button
			class="drawerBtn"
			bind:this={drawerBtn}
			on:click={handleDrawer}
			aria-label="Open/Close Drawer"
		>
			<Icon icon={isOpen ? 'south_east' : 'north_west'} />
		</button>
		<ul class="drawerContents" bind:this={drawerContents}>
			<li class="list-item">
				<div class="menu">
					<button
						class="dropdown"
						bind:this={nodeBtn}
						on:click={handleNodeContainer}
						aria-label="Component"
					>
						Node
					</button>
					<button
						class="dropdown"
						bind:this={anchorBtn}
						on:click={handleAnchorContainer}
						aria-label="Component"
					>
						Anchor
					</button>
					<button
						class="dropdown"
						bind:this={edgeBtn}
						on:click={handleEdgeContainer}
						aria-label="Component"
					>
						Edge
					</button>
				</div>
			</li>
			<!-- Handle Node Dropdown -->
			<li class="list-item">
				<div class="propsContainer nodeContainer" bind:this={nodeContainer}>
					<DrawerNode />
				</div>
			</li>
			<!-- Handle Anchor Dropdown -->
			<li class="list-item">
				<div class="propsContainer anchorContainer" bind:this={anchorContainer}>
					<DrawerAnchor />
				</div>
			</li>
			<!-- Handle Edge Dropdown -->
			<li class="list-item">
				<div class="propsContainer edgeContainer" bind:this={edgeContainer}>
					<DrawerEdge />
				</div>
			</li>
			<li class="list-item">
				<div
					role="presentation"
					class="defaultNodes"
					draggable="true"
					on:dragstart={handleDragStart}
				>
					Node
				</div>
			</li>
		</ul>
	</slot>
</nav>

<style>
	#drawerWrapper {
		position: absolute;
		width: 35px;
		height: 30px;
		border-radius: 6px;
		left: 10px;
		top: 10px;
		border: solid 1px;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: 1s;
		padding-top: 10px;
		cursor: auto;
		color: var(
			--prop-controls-text-color,
			var(--controls-text-color, var(--default-controls-text-color))
		);
		background-color: var(
			--prop-controls-background-color,
			var(--controls-background-color, var(--default-controls-background-color))
		);
	}

	#drawerWrapper ul {
		display: flex;
		flex-direction: column;
		list-style: none;
		width: 100%;
		text-decoration: none;
		font-size: 20px;
		overflow: hidden;
		transition: 0.3s;
		padding: 0;
		margin-top: 45px;
	}

	.drawerBtn {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 20px;
		left: 20px;
		font-size: 20px;
		cursor: pointer;
		padding: 0.2rem 0;
		border: none;
		background: none;
		color: inherit;
	}
	.menu {
		display: flex;
		justify-content: space-between;
	}

	.menu .dropdown {
		padding: 10px;
		font-size: 1rem;
		flex-grow: 1;
		cursor: pointer;
		border: none;
		margin: 0;
		color: var(
			--prop-drawer-button-text-color,
			var(--drawer-button-text-color, var(--default-drawer-button-text-color))
		);
		background-color: var(
			--prop-drawer-button-color,
			var(--drawer-button-color, var(--default-drawer-button-color))
		);
	}

	.menu .dropdown:first-child {
		border-bottom: 3px solid
			var(
				--prop-drawer-button-text-color,
				var(--drawer-button-text-color, var(--default-drawer-button-text-color))
			);
	}

	.defaultNodes {
		margin: auto;
		margin-top: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
		width: 120px;
		cursor: grab;
		border-radius: 8px;
		background-color: var(--prop-background-color, var(--node-color, var(--default-node-color)));
		color: var(--prop-text-color, var(--text-color, var(--default-text-color)));
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
	}
	button:hover {
		cursor: pointer;
	}

	.propsContainer {
		height: fit-content;
		width: fit-content;
		overflow: hidden;
		padding: 0 18px;
		margin-top: 20px;
	}

	.nodeContainer {
		display: block;
	}
	.edgeContainer {
		display: none;
	}
	.anchorContainer {
		display: none;
	}
</style>
