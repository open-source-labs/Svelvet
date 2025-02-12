 <!-- <script lang="ts">
	import { Svelvet, Node, Anchor, Resizer, Group } from '$lib';
	//gets snappedPosition
	import { getSnappedPosition } from '$lib/utils/snapGrid';

	import Connector from '../example-components/Connector.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
	import TextField from '$lib/components/data/TextField/TextField.svelte';
	// Controls is not used on the canvas itself, but is part of the HUD of the dev homepage
	// maybe not needed here
	import Controls from '$lib/components/Controls/Controls.svelte';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
    
	import CircleColor from '../example-components/sandbox/CircleColor.svelte';
	import DashCount from '../example-components/sandbox/DashCount.svelte';
	import Noise from '../example-components/sandbox/Noise.svelte';
	import Scale from '../example-components/sandbox/Scale.svelte';
	import Thickness from '../example-components/sandbox/Thickness.svelte';
	import Output from '../example-components/sandbox/Output.svelte';
	// added getJSONState function
	import { getJSONState } from '$lib/utils/savers/saveStore';
	// added Graph interface import
	import type { Graph } from '$lib/types';
	// added getContext import
	import { getContext } from 'svelte';
	// added graphStore import
	import { graphStore } from '$lib/stores';
	import ContrastTheme from '$lib/components/ContrastTheme/ContrastTheme.svelte';
	import { get } from 'svelte/store';
	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}
	let totalNodes = 2;
	let widthCount = 1;
	let graph: any;

	graphStore.subscribe((graphMap) => {
        // console.log("Graph Map:", graphMap);
		const graphKey = 'G-1';
		graph = graphMap.get(graphKey);
		// console.log('Graph from store:', graph);
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
<!-- <Drawer/> --
	<Svelvet minimap title="test" controls >
		
		<!-- buttons on lower level node --
		<Connector />
		<Node bgColor="red" inputs={4} position={{ x: 600, y: 200 }}>
			<button on:click={() => widthCount++} />
			{#each { length: widthCount } as item}
				<div>Height</div>
			{/each}
			<!-- <button on:click={() => alert('hi')}>ALERTe</button> --
			<button
				style="cursor: pointer;"
				on:click={() => {
					// const graph = getContext('graph');
					console.log('Graph on user interaction:', graph);
					getJSONState(graph);
				}}>SAVE STATE</button
			>

			<button on:click={logCurrentGraphState}>Log Current Graph State</button>
		</Node>
		<!-- text field --
		<Node inputs={5} position={{ x: 600, y: 600 }}>
			<TextField placeholder="name" />
		</Node>
		<!-- blue node --
		<Node let:selected dimensions={{ width: 400, height: 100 }}>
			<div class="node" class:selected>
				<Resizer width height rotation />
			</div>
		</Node>
		<!-- top gray node --
		<Node useDefaults dimensions={{ width: 400, height: 300 }} position={{ x: 100, y: 300 }}>
			<div class="anchor">
				<Anchor nodeConnect />
			</div>
			<Anchor nodeConnect />
		</Node>
		{#each { length: totalNodes } as node}
			<!-- <Node let:connect useDefaults position={{ x: Math.random() * 200, y: Math.random() * 400 }} /> --
			<Node
				let:connect
				useDefaults
				position={getSnappedPosition(Math.random() * 200, Math.random() * 400)}
			/>
		{/each}

		<ThemeToggle slot="toggle" />
		<ContrastTheme slot="contrast" />
        <!-- <slot name="drawer" slot="drawer" /> --
	</Svelvet>
</body>

<style>
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
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
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
  -->
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
