<div>
  <h2 class="text-4xl font-semibold mb-12">Minimap</h2>

  <p class="my-4 text-gray-600">
    <code class="code">Svelvet 5.0</code> introduces a new optional feature that can be added to diagrams now. To access this feature set the minimap prop to <code class="code">{true}</code> in your svelvet application. 
	</p>
	<p>
	Paragraph here
  </p>
  <p class="my-4 text-gray-600">
    It is important to note that the minimap scales to your current zoom settings which you can affect by scrolling your mouse wheel up or down; if you are on a touchpad or touchscreen, expand or collapse and it should work the same way. Different browsers may have different settings. 
	 </p>
	 <p>Create nodes interactively by clicking and dragging an anchor to an empty space and see how the minimap interacts with nodes- far away, close by, small or large. <br> You can also create nodes by simply following the format in Codesandbox if you want to interact with the Svelvet component directly. <br> <br> (Optional node linkage and creation features are set up in the Svelvet application)
    <br> By clicking on specific points on the minimap itself, navigation of your node diagram becomes not only intuitive but also very easy to use!
    <br> Setting up a boundary for the minimap will make the diagram more performant but is not absolutely necessary. Svelvet inheritently does not have an initial boundary set but you can achieve it by adding a boundary prop to your Svelvet application. The prop should have a key of boundary assigned to an object with x and y positions representing the boundaries.
</p>
  <br> Let your imagination run wild with this feature!
</div>

<iframe src="https://codesandbox.io/embed/minimap-website-documentation-9uy92c?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Custom Svelte Components"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

<style>
    
</style>