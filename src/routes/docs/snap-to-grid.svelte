<script lang="ts">
	import Svelvet from "svelvetcake";
    import Logo from '../../assets/High Resolution Logo.png'
	const initialNodes = [
	  {
		id: 1,
		position: { x: 450, y: 100 },
		data: { label: "MAIN NODE"},
		// data: { html: ` <video width="360" height="240" src="https://i.imgur.com/VoBl9wh.mp4" controls autoplay loop></video> ` },
		// data: {html: `<h1> WE DEM BOIZ MONSTARZ </h1>` },
		width:  120,
		height: 60,
		bgColor: '#FFE4E6'
	  },
	  {
		id: 2,
		position: { x: 200, y: 230 },
		data: { label: "Snap!" },
		width: 70,
		height: 40,
		bgColor: "white",

	  },
	  {
		id: 3,
		position: { x: 460, y: 400 },
		data: { html: `<button> Svelvet 4.0 </button>` },
		width: 100,
		height: 40,
        bgColor: '#FFE4E6'

	  },
	  {
		id: 4,
		position: { x: 700, y: 110 },
		data: { label: 'SvelvetCake'},
		width: 300,
		height: 225,
		image: true,
		bgColor: "white",
		src: Logo
	  },
	  {
		id: 5,
		position: { x: 130, y: 110 },
		data: { label: "Drag Me" },
		width: 80,
		height: 40,
		bgColor: "white",

	  },
	  {
		id: 6,
		position: { x: 550, y: 180 },
		data: { html: ` <ul><li>SNAP</li><li>THAT</li><li>NODE</li></ul> ` },
		width: 85,
		height: 100,
		bgColor: "white",

	  }
	];

	const initialEdges = [
	  { id: "e1-2", source: 1, target: 2, type: "bezier" },
	  { id: "e1-3", source: 1, target: 3, type: "straight" },
	  {
		id: "e1-4",
		source: 1,
		target: 4,
		type: "bezier",
		animate: true,
		label: "labeled"
	  },
	  {
		id: "e1-5",
		source: 1,
		target: 5,
		type: "bezier",
		noHandle: true
	  },
	  {
		id: "e1-6",
		source: 1,
		target: 6,
		type: "bezier",
		arrow: true
	  }
	];
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">Snap-To-Grid</h2>

  <p class="my-4 text-gray-600">
    Snap-To-Grid is a lively feature that <code class="code">Svelvet</code> offers for a unique user experience when building out your data diagram-flow. Although simplisitc in its design, snap-to-grid can be as energetic or as subtle as you want. 
  </p>
  <div class="overflow-hidden my-8 border border-gray-200 rounded-lg shadow-lg shadow-slate-100">
    <Svelvet
      nodes={initialNodes}
      edges={initialEdges}
      width={1500}
      height={500}
      background
      movement={true}
      snap={true}
      snapTo={20}
    />
  </div>
  <p class="my-4 text-gray-600">
     Hello
  </p>

  <p class="my-4 text-gray-600">
    <strong>For SvelteKit apps:</strong> While
    <a class="text-rose-600 underline underline-offset-1" target="_blank" href="https://jestjs.io/"
      >@jest</a
    >
    is a reliable option for running your tests, SvelteKit applications are built with Vite and thus
    require separate configurations. We found that
    <a class="text-rose-600 underline underline-offset-1" target="_blank" href="https://vitest.dev/"
      >@vitest</a
    >
    is a great option for Vite apps as they share the same config files and require little additional
    work to get started, letting you focus on writing quality tests rather than config issues.
  </p>
</div>

<style>
    
</style>