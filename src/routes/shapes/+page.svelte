<script lang="ts">
	import { Svelvet, Node, Anchor, Resizer, type Connections } from '$lib';
	import ThemeToggle from '$lib/components/ThemeToggle/ThemeToggle.svelte';
</script>

<body>
	<Svelvet minimap controls edgeStyle='step'>
		<Node id='round-rect' dimensions={{width: 150, height: 50}} position={{x:300, y:100}}>
			<svg class="roundRect" height='100%' width='100%'>
				<rect width='100%' height='100%' rx='30' ry='30' fill='slateblue' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='60%'>Round Rectangle</text>
			</svg>
			<div class='right-anchor'>
				<Anchor direction='east' invisible connections={['hexagon']}/>
			</div>			
			<div class='bottom-anchor'>
				<Anchor direction=south invisible connections={['diamond']}/>
			</div>
		</Node>		
		<Node id='diamond' dimensions={{width: 100, height: 100}} position={{x:300, y:300}}>			
			<svg class="diamond" height='100%' width='100%'>
				<path d='M0,50 L50,0 L100,50 L50,100 z' fill='orange' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='55%'>Diamond</text>
			</svg>
            <div class='top-anchor'>
				<Anchor direction='north' invisible/>
			</div>			
            <div class='bottom-anchor'>
				<Anchor direction='south' invisible connections={['circle']}/>
			</div>
		</Node>
		<Node id='circle' dimensions={{width: 100, height: 100}} position={{x:300, y:500}}>			
			<svg class="circle" height='100%' width='100%'>
				<circle r='50' cx='50%' cy='50%' fill='lightseagreen' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='55%'>Circle</text>
            </svg>
            <div class='top-anchor'>
				<Anchor direction='north' invisible />
			</div>	
            <div class='right-anchor'>
				<Anchor direction='east' invisible/>
			</div>	
		</Node>
		<Node id='ellipse' dimensions={{width: 150, height: 50}} position={{x:500, y:200}}>			
			<svg class="ellipse" height='100%' width='100%'>
				<ellipse rx='75' ry='25' cx='50%' cy='50%' fill='magenta' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='60%'>Ellipse</text>
			</svg>
            <div class='right-anchor'>
				<Anchor direction='east' invisible connections={['parallelogram']}/>
			</div>
            <div class='bottom-anchor'>
				<Anchor direction='south' invisible/>
			</div>
		</Node>
		<Node id='triangle' dimensions={{width: 100, height: 70}} position={{x:500, y:400}}>			
			<svg class="triangle" height='100%' width='100%'>
				<path d='M0,70 L50,0 L100,70 z' fill='navy' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='75%'>Triangle</text>
			</svg>
            <div class='top-anchor'>
				<Anchor direction='north' invisible connections={['ellipse']}/>
			</div>
            <div class='bottom-anchor'>
				<Anchor direction='south' invisible connections={['circle']}/>
			</div>
		</Node>
		<Node id='hexagon' dimensions={{width: 120, height: 60}} position={{x:700, y:50}}>			
			<svg class="hexagon" height='100%' width='100%'>
				<path d='M10,0 L110,0  L120,30 L110,60 L10,60 L0,30 z' fill='red' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='60%'>Hexagon</text>
			</svg>
            <div class='left-anchor'>
				<Anchor direction='west' invisible/>
			</div>
			<div class='right-anchor'>
				<Anchor direction='east' invisible connections={['arrow-rect']}/>
			</div>
		</Node>
		<Node id='parallelogram' dimensions={{width: 150, height: 70}} position={{x:700, y:300}}>
			<svg class="parallelogram" height='100%' width='100%'>
				<path d='M0,70 L37.5,0 L150,0 L112.5,70 z' fill='slateblue' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='55%'>Parallelogram</text>
			</svg>
            <div class='top-anchor'>
				<Anchor direction='north' invisible connections={['arrow-rect']}/>
			</div>
            <div class='bottom-anchor'>
				<Anchor direction='south' invisible connections={['database']}/>
			</div>
		</Node>
		<Node id='arrow-rect' dimensions={{width: 130, height: 50}} position={{x:900, y:200}}>
            
			<svg class="arrow-rect" height='100%' width='100%'>
				<path d="M0,0 L120,0  L130,25 L120,50 L0,50 z" fill='purple' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='60%'>Arrow Rectangle</text>
			</svg>
			<div class='top-anchor'>
				<Anchor direction='north' invisible/>
			</div>
            <div class='bottom-anchor'>
				<Anchor direction='south' invisible/>
			</div>
		</Node>
		<Node id='database' dimensions={{width: 100, height: 80}} position={{x:900, y:500}}>
			<svg class="database" height='100%' width='100%'>
				<path d="M0,10  L 0,70 A 50 10 0 1 0 100 70 L 100,10 A 50 10 0 1 1 0 10 A 50 10 0 1 1 100 10 A 50 10 0 1 1 0 10 z" fill='darkgray' stroke='black'/>
				<text class='nodeText' text-anchor='middle' font-size={15} fill='white' x='50%' y='60%'>Database</text>
			</svg>
			<div class='top-anchor'>
				<Anchor direction='north' invisible/>
			</div>			
            <div class='left-anchor'>
				<Anchor direction='west' invisible/>
			</div>
		</Node>
		<ThemeToggle main='dark' alt='light' slot="toggle"/>
	</Svelvet>
</body>

<style>
	:global(.svelvet-node) {
		box-shadow: none !important;
	}
	.nodeText {
		align-items: center;
	}
    .bottom-anchor {
        position: absolute;
        bottom: 0;
        left: 50%; /* Adjust the left value based on your design */
        transform: translateX(-50%);
    }
    .top-anchor {
        position: absolute;
        top: 0;
        left: 50%; /* Adjust the left value based on your design */
        transform: translateX(-50%);
    }
    .left-anchor {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateX(-50%);
    }
    .right-anchor {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateX(-50%);
    }	
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}	
</style>
