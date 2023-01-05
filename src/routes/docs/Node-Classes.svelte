<div>
    <h2 class="text-4xl font-semibold mb-12">Node Classes</h2>
    <p class="my-4 text-gray-600">
      <code class="code">Svelvet 5.0</code> also brings on an extra layer of customization in creating your diagrams. This is achieved with the implementation of custom classes with custom styling that you, the user, can input.
    </p>
    <p class="my-4 text-gray-600">
      <strong> *Setup* </strong> <br> It is important to note that you must add a key value pair to your node object in initialNodes. It should look something like this: <br> <code class='code'> className: 'yourCustomClass'</code>
       
    </p>
    <br> Also be sure when your are creating your custom styling in the stylesheet block you include the  <code class='code'> :global </code> keyword.
    <br> Try it out below! One custom class has already been created for you as an example.
  </div>
  
  <iframe src="https://codesandbox.io/embed/custom-node-styling-doc-r835sf?autoresize=1&fontsize=14&module=%2FApp.svelte&theme=dark"
       style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
       title="Custom Svelte Components"
       allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
       sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  ></iframe>
  
  <style>
      
  </style>