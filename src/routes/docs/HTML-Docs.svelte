<script lang="ts">
	// @ts-nocheck
	
	
		import Svelvet from 'svelvet';
		
		  const initialNodes = [
			{
			  id: 1,
			  position: { x: 110, y: 50 },
			  data: { html: ` <video width="480" height="360" src="https://i.imgur.com/zdT6tSz.mp4" autoplay loop></video>` },
			  width:  490,
			  height: 370,
			  bgColor: "white",
			},
			{
			  id: 2,
			  position: { x: 0, y: 330 },
			  data: { label: "LEADER" },
			  width: 70,
			  height: 40,
			  bgColor: "white",
			  clickCallback: node => console.log(coreSvelvetStore)
			},
			{
			  id: 3,
			  position: { x: 750, y: 145 },
			  data: { html: `<iframe src="https://audiomack.com/embed/aubertlone/song/ragtime-southernmelody?background=1" scrolling="no" width="100%" height="252" scrollbars="no" frameborder="0"></iframe>` },
			  width: 260,
			  height: 260,
			  bgColor: "blue",
	  
			},
			{
			  id: 4,
			  position: { x: 400, y: 530 },
			  data: { html: `<label for="lname">Message Box:</label> <input type="text" id="lname" name="lname" form="form1">` },
			  width: 200,
			  height: 70,
			  bgColor: "#85c1e9"
			},
			{
			  id: 5,
			  position: { x: 180, y: 650 },
			  data: { label: "no handle" },
			  width: 80,
			  parentNode: 2,
			  height: 40,
			  bgColor: "white",
	  
			},
			{
			  id: 6,
			  position: { x: 770, y: 725 },
			  data: { html: ` <ul><li>Coffee</li><li>Tea</li><li>Milk</li></ul> ` },
			  width: 100,
			  height: 80,
			  bgColor: "white",
	  
			}
		  ];
	  
	  
		const initialEdges = [
		  { id: 'e1-2', source: 1, target: 2, label: 'edge label' },
		  { id: 'e1-3', source: 1, target: 3, animate: true,},
		  { id: 'e1-4', source: 1, target: 4, type: 'step', animate: true, edgeColor: '#FF4121' },
		  { id: 'e2-5', source: 2, target: 5, label: 'colored edges', animate: true, arrow: true, edgeColor: '#FF4121', labelBgColor: '#1F2937', labelTextColor: '#FFE4E6' },
		  { id: 'e2-5', source: 4, target: 6, type: 'straight' },
		  { id: 'e2-5', source: 3, target: 6, type: 'smoothstep', label: 'colored label', labelBgColor: '#FF4561', labelTextColor: 'white', animate: true }
		];

		const code_sample0 = `{`
		const code_sample1 = `id: 1,`
		const code_sample2 = ` position: { x: 110, y: 50 },`
		const code_sample3 = `  data: { html: \`<video width="480" height="360" src="https://i.imgur.com/zdT6tSz.mp4" autoplay loop></video>\`},`
		const code_sample4 = `  width:  490,`
		const code_sample5 = `  height: 370,`
		const code_sample6 = `  bgColor: "white",`
		const code_sample7 = `}, `
</script>

<div>
  <h2 class="text-4xl font-semibold mb-12">HTML Enhancements</h2>

  <p class="my-4 text-gray-600">
    <code class="code">Svelvet 4.0</code> supports full HTML rendering within nodes. Any HTML element supported within the browser will now render inside a node. Whether you want to render video, audio, lists, iframes, forms, scripts, objects, buttons.... The list goes on & on. The only limit to this feature is your imagination! The Svelvet diagram below features four nodes with html elements.
	</p>
	<p>
	The node featuring dolphins contains a video tag, and the node labeled: Message Box contains a simple form input. The node featuring "ragtime-southernmelody" contains an embedded audio player from Audio Mack. Last but not least, the node in the lower right hand listing common beverages contains a simple unordered list.
  </p>
  <div class="overflow-hidden my-8 border border-gray-200 rounded-lg shadow-lg shadow-slate-100">
	<Svelvet 
	nodes={initialNodes}  
	edges={initialEdges} 
	width={1100} 
	height={900} 
	background />

  </div>
  <p class="my-4 text-gray-600">
     To render HTML elements inside your node, include the following inside your Svelvet component declaration. 
	 
	 </p>
	 <p>We will be using the <code class="code">data</code> prop with a key of <code class="code">html</code>. The value for the  <code class="code">html</code> key will be your raw HTML elements surrounded by backticks (``). The declaration for the node featuring dolphins has been included below to serve as an example. <br><br> 
     <!-- <code> <Svelvet nodes={initialNodes} edges={initialEdges} background snap={true} snapTo={30}/> </code>  -->

     <code class="block rounded-md p-3 bg-rose-100 text-rose-600"> 
		{code_sample0} <br> {code_sample1}	<br>  {code_sample2} <br>  {code_sample3} <br> 
		{code_sample4} <br> {code_sample5} <br> {code_sample6} <br> {code_sample7}
    </code>

     <br> Let your imagination run wild with this feature!
  </p>
</div>

<style>
    
</style>