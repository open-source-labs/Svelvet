  <script lang="ts">
    // @ts-nocheck
      import Svelvet from 'svelvet';
      
        const initialNodes = [
        ];

        const demoNodes = [
          {
            id: 1,
            position: { x: 50, y: 50 },
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
  To access this feature, click the <code class="bg-rose-100 rounded-lg p-1">download</code> button in the bottom left of the diagram.
  This will download a JSON file that can be shared with any developer using <code class="bg-rose-100 rounded-lg p-1">Svelvet</code>! 
  After receiving the JSON file, simply open it and copy paste the JSON string into the <code class="bg-rose-100 rounded-lg p-1">upload</code> box in the bottom left of the diagram.
  Now just click the <code class="bg-rose-100 rounded-lg p-1">upload</code> button and you should be seeing an exact replica of the diagram!
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Importing & Exporting Diagrams</h3>
  <p class="text-gray-600">
    See the demo Svelvet diagram below to see implementation!
  </p>
</div>

<div class="demo">
  <Svelvet nodes={initialNodes} edges={initialEdges} width={500} height={500} bgColor={'pink'} background />
  <Svelvet nodes={demoNodes} edges={initialEdges} width={500} height={500} bgColor={'aqua'} background />
</div>

<style>
  .demo {
    display: flex;
    justify-content: space-around;
  }
</style>

