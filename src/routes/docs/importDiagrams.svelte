  <script lang="ts">
    // @ts-nocheck
      import Svelvet from 'svelvet';
      
        const demoNodes = [
          {
            id: 1,
            position: { x: 10, y: 10 },
            data: { label: "default styling" },
            width: 150,
            height: 40,
            bgColor: "white"
		      },
        ];
      
      const initialEdges = [];
  </script>
<h2 class="text-4xl font-semibold mb-12">Importing & Exporting Diagrams</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> allows you to download a snapshot of your diagram as a JSON file that can be shared with others!
  This feature is optional and must be passed down as a prop <code class="bg-rose-100 rounded-lg p-1">shareable</code> to your Svelvet application.
  To access this feature, click the <code class="bg-rose-100 rounded-lg p-1">download</code> button in the bottom left of the diagram.
  This will download a JSON file that can be shared with any developer using <code class="bg-rose-100 rounded-lg p-1">Svelvet</code>! 
  After receiving the JSON file, simply open it and copy paste the JSON string into the <code class="bg-rose-100 rounded-lg p-1">upload</code> box in the bottom left of the diagram.
  Now just click the <code class="bg-rose-100 rounded-lg p-1">upload</code> button and you should be seeing an exact replica of the diagram!
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Importing & Exporting Diagrams</h3>
  <p class="text-gray-600">
    See the demo Svelvet diagram below to see implementation!
    Edit the diagram below and then click the <code class="bg-rose-100 rounded-lg p-1">download</code> button in the bottom right. 
    Once the download has been completed, <code class="bg-rose-100 rounded-lg p-1">refresh</code> the page to reset the diagram.
    Then copy the downloaded JSON string into the <code class="bg-rose-100 rounded-lg p-1">upload</code> box and click the <code class="bg-rose-100 rounded-lg p-1">button</code> to see the same diagram you downloaded.
  </p>
</div>


<Svelvet nodes={demoNodes} edges={initialEdges} shareable width={500} height={500} bgColor={'gainsboro'} nodeEdit nodeLink nodeCreate background />


<style>

</style>

