<h2 class="text-4xl font-semibold mb-12">Diagram Boundary</h2>

<p class="text-gray-600">
  <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> now has an optional boundary that users can implement into their diagrams!
  To access this feature, pass the <code class="bg-rose-100 rounded-lg p-1">boundary</code> prop to your <code class="bg-rose-100 rounded-lg p-1">Svelvet</code> application and set it equal to an object. 
  Give the <code class="bg-rose-100 rounded-lg p-1">boundary</code>  object an <code class="bg-rose-100 rounded-lg p-1">x</code> and <code class="bg-rose-100 rounded-lg p-1">y</code> key and set their values to a <code class="bg-rose-100 rounded-lg p-1">positive</code> number.
  The <code class="bg-rose-100 rounded-lg p-1">x</code> and <code class="bg-rose-100 rounded-lg p-1">y</code> properties represent the width and height of your <code class="bg-rose-100 rounded-lg p-1">boundary</code> and will create 
  a <code class="bg-rose-100 rounded-lg p-1">boundary</code> starting from <code class="bg-rose-100 rounded-lg p-1">0</code> to the number specified. 
  Do not set node positions to negative values while using the <code class="bg-rose-100 rounded-lg p-1">boundary</code> feature.
</p>

<div>
  <h3 class="text-xl font-semibold mt-12 mb-6">Implementing Diagram Boundaries</h3>
  <p class="text-gray-600">
    See the Code Sandbox below to see implementation!
  </p>
</div>