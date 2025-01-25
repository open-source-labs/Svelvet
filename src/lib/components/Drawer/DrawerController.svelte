<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<script lang="ts">
	import DrawerNode from './DrawerNode.svelte';
	import DrawerAnchor from './DrawerAnchor.svelte';
	import DrawerEdge from './DrawerEdge.svelte';
	import { createNodeProps } from './DrawerNode.svelte';
	import { createAnchorProps } from './DrawerAnchor.svelte';
	import { createEdgeProps } from './DrawerEdge.svelte';
	import Icon from '$lib/assets/icons/Icon.svelte';
	import { onMount, onDestroy } from 'svelte';

	// State variables to manage the drawer and its components
	$state = {
		isOpen: false, // Indicates if the drawer is open or closed
		nodeContainerOpen: false, // Indicates if the node container is open
		edgeContainerOpen: false, // Indicates if the edge container is open
		anchorContainerOpen: false, // Indicates if the anchor container is open
		nav: null, // Reference to the navigation element
		drawerBtn: null, // Reference to the drawer button element
		nodeBtn: null, // Reference to the node button element
		edgeBtn: null, // Reference to the edge button element
		anchorBtn: null, // Reference to the anchor button element
		drawerContents: null, // Reference to the drawer contents element
		nodeContainer: null, // Reference to the node container element
		anchorContainer: null, // Reference to the anchor container element
		edgeContainer: null, // Reference to the edge container element
		currentComponent: 'Node' // Indicates the current component being displayed
	};

	// Handle the drag start event for creating node props
	const handleDragStart = (e: DragEvent) => {
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = 'move';

		// Create props for anchor or edge if values were given
		const anchorProps = createAnchorProps(true);
		const edgeCreated = createEdgeProps();
		// Create props for node
		createNodeProps(edgeCreated, anchorProps);
	};

	// Toggle the drawer open or closed
	const handleDrawer = () => {
		if (!$state.isOpen) {
			$state.isOpen = true;
			$state.nav.style.height = 'fit-content';
			$state.nav.style.width = '300px';
		} else {
			$state.isOpen = false;
			$state.nav.style.height = '35px';
			$state.nav.style.width = '35px';
			$state.anchorContainerOpen = false;
			$state.edgeContainerOpen = false;
			$state.nodeContainerOpen = false;
			$state.nodeContainer.style.display = 'block';
			$state.edgeContainer.style.display = 'none';
			$state.anchorContainer.style.display = 'none';
			$state.nodeBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
			$state.edgeBtn.style.borderBottom = 'none';
			$state.anchorBtn.style.borderBottom = 'none';
		}
	};

	// Toggle the node container open or closed
	const handleNodeContainer = () => {
		if (!$state.nodeContainerOpen) {
			$state.nodeContainerOpen = true;
			$state.anchorContainerOpen = false;
			$state.edgeContainerOpen = false;
			$state.nodeContainer.style.display = 'block';
			$state.edgeContainer.style.display = 'none';
			$state.anchorContainer.style.display = 'none';
			$state.nodeBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
			$state.edgeBtn.style.borderBottom = 'none';
			$state.anchorBtn.style.borderBottom = 'none';
		}
	};

	// Toggle the anchor container open or closed
	const handleAnchorContainer = () => {
		if (!$state.anchorContainerOpen) {
			$state.anchorContainerOpen = true;
			$state.edgeContainerOpen = false;
			$state.nodeContainerOpen = false;
			$state.anchorContainer.style.display = 'block';
			$state.edgeContainer.style.display = 'none';
			$state.nodeContainer.style.display = 'none';
			$state.nodeBtn.style.borderBottom = 'none';
			$state.edgeBtn.style.borderBottom = 'none';
			$state.anchorBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
		}
	};

	// Toggle the edge container open or closed
	const handleEdgeContainer = () => {
		if (!$state.edgeContainerOpen) {
			$state.edgeContainerOpen = true;
			$state.nodeContainerOpen = false;
			$state.anchorContainerOpen = false;
			$state.edgeContainer.style.display = 'block';
			$state.anchorContainer.style.display = 'none';
			$state.nodeContainer.style.display = 'none';
			$state.nodeBtn.style.borderBottom = 'none';
			$state.edgeBtn.style.borderBottom =
				'3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
			$state.anchorBtn.style.borderBottom = 'none';
		}
	};

	// Handle key press events for toggling the drawer and components
	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'D') {
			handleDrawer();
		} else if (e.key === 'T' && $state.isOpen) {
			// Only toggle components if the drawer is open
			if ($state.currentComponent === 'Node') {
				handleAnchorContainer();
				$state.currentComponent = 'Anchor';
			} else if ($state.currentComponent === 'Anchor') {
				handleEdgeContainer();
				$state.currentComponent = 'Edge';
			} else if ($state.currentComponent === 'Edge') {
				handleNodeContainer();
				$state.currentComponent = 'Node';
			}
		}
	};

	// Add the event listener when the component mounts
	onMount(() => {
		window.addEventListener('keydown', handleKeyPress);
	});

	// Remove the event listener when the component unmounts
	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyPress);
	});
</script>

<nav id="drawerWrapper" bind:this={$state.nav}>
	<slot>
		<button
			class="drawerBtn"
			bind:this={$state.drawerBtn}
			onclick={handleDrawer}
			aria-label="Open/Close Drawer"
		>
			<Icon icon={$state.isOpen ? 'south_east' : 'north_west'} />
		</button>
		<ul class="drawerContents" bind:this={$state.drawerContents}>
			<li class="list-item">
				<div class="menu">
					<button
						class="dropdown"
						bind:this={$state.nodeBtn}
						onclick={handleNodeContainer}
						aria-label="Component"
					>
						Node
					</button>
					<button
						class="dropdown"
						bind:this={$state.anchorBtn}
						onclick={handleAnchorContainer}
						aria-label="Component"
					>
						Anchor
					</button>
					<button
						class="dropdown"
						bind:this={$state.edgeBtn}
						onclick={handleEdgeContainer}
						aria-label="Component"
					>
						Edge
					</button>
				</div>
			</li>
			<!-- Handle Node Dropdown -->
			<li class="list-item">
				<div class="propsContainer nodeContainer" bind:this={$state.nodeContainer}>
					<DrawerNode />
				</div>
			</li>
			<!-- Handle Anchor Dropdown -->
			<li class="list-item">
				<div class="propsContainer anchorContainer" bind:this={$state.anchorContainer}>
					<DrawerAnchor />
				</div>
			</li>
			<!-- Handle Edge Dropdown -->
			<li class="list-item">
				<div class="propsContainer edgeContainer" bind:this={$state.edgeContainer}>
					<DrawerEdge />
				</div>
			</li>
			<li class="list-item">
				<div
					role="presentation"
					class="defaultNodes"
					draggable="true"
					ondragstart={handleDragStart}
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
