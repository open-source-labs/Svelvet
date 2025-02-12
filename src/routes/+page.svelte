
  <script lang="ts">
    import { Svelvet, Node, Anchor, Resizer, Group } from '$lib';
    import { getSnappedPosition } from '$lib/utils/snapGrid';
    import Connector from '../example-components/Connector.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
    import TextField from '$lib/components/data/TextField/TextField.svelte';
    import { getJSONState } from '$lib/utils/savers/saveStore';
    import type { Graph } from '$lib/types';
    import { get } from 'svelte/store';
    import { graphStore } from '$lib/stores';
    import ContrastTheme from '$lib/components/ContrastTheme/ContrastTheme.svelte';


    let totalNodes = 2;
    let graph: any;


    graphStore.subscribe((graphMap) => {
        graph = graphMap.get('G-1');
    });


    function logCurrentGraphState() {
        const currentGraphMap = get(graphStore);
        const graph = currentGraphMap.get('G-1');
        if (graph) {
            console.log('Current Graph State:', graph);
        } else {
            console.log('No current graph found');
        }
    }
</script>


<body>

    <!-- Fullscreen container -->
    <div class="container">
        <Svelvet minimap title="Advanced Graph Editor" controls>
            <Connector />


            <!-- Red Draggable Node -->
            <Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }} draggable>
                <button on:click={() => totalNodes++}>Add Node</button>
                <button style="cursor: pointer;" on:click={() => getJSONState(graph)}>SAVE STATE</button>
                <button on:click={logCurrentGraphState}>Log Current Graph State</button>
            </Node>


            <!-- TextField Node -->
            <Node inputs={5} position={{ x: 600, y: 600 }} draggable>
                <TextField placeholder="name" />
            </Node>


            <!-- Resizable Blue Node -->
            <Node let:selected dimensions={{ width: 400, height: 100 }} draggable>
                <div class="node" class:selected>
                    <Resizer width height rotation />
                </div>
            </Node>


            <!-- Anchored Node -->
            <Node useDefaults dimensions={{ width: 400, height: 300 }} position={{ x: 100, y: 300 }} draggable>
                <div class="anchor">
                    <Anchor nodeConnect />
                </div>
                <Anchor nodeConnect />
            </Node>


            <!-- Dynamically Added Nodes -->
            {#each { length: totalNodes } as node}
                <Node useDefaults position={getSnappedPosition(Math.random() * 500, Math.random() * 500)} draggable />
            {/each}


            <ThemeToggle slot="toggle" />
            <ContrastTheme slot="contrast" />
        </Svelvet>
    </div>
</body>


<!-- <script lang="ts">
	import { Node, Svelvet, Anchor, Edge } from '$lib';
	import type { SvelvetConfig, NodeConfig, XYPair, EdgeStyle, NodeDrawerConfig } from '$lib/types';
	import type { ComponentType } from 'svelte';
	import { defaultNodePropsStore } from '../lib/components/Drawer/DrawerNode.svelte';

	//Test de componente usando onMount
	// import { onMount } from 'svelte';

	// onMount(() => {
	// 	console.log('Drawer.svelte montado correctamente');
	// });

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
	const svelvetProps: SvelvetConfig = {width,height,minimap,translation,controls,edge,edgeStyle,snapTo,editable,fitView,locked,zoom,theme,mermaid,mermaidConfig,TD,disableSelection,raiseEdgesOnSelect,modifier,trackpadPan,toggle};

	// Suscripción reactiva al store
	let defaultNodes = $defaultNodePropsStore;
	let dropped_in: boolean;
	// Verifica el valor de defaultNodes, pero no esta trabajando
	$: {
		console.log('defaultNodes actualizado:', defaultNodes);
	}

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
		console.log('Evento handleDrop ejecutado'); // Verifica que el evento se está ejecutando, pero no printea nada
		// Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		const target = e.target as HTMLElement;
		target.dispatchEvent(moveEvent);
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
		<slot name="toggle" slot="toggle" />
	</Svelvet>
</div>
<style>
	.drop_zone {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style> -->

<style>
    /* Ensures the entire screen is used */
    html, body {
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }


    .container {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        display: flex;
    }


    Svelvet {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        display: flex;
    }


    .node {
        width: 100%;
        height: 100%;
        background-color: aqua;
        border: 2px solid black;
    }


    .anchor {
        position: absolute;
        right: 10px;
    }


    :root[theme='dark'] {
        --background-color: black;
        --node-color: white;
    }


    :root[theme='light'] {
        --background-color: purple;
        --node-color: green;
    }
</style>
