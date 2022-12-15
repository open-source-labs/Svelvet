<!-- This is the HTML for your svelte component -->
<div class='page'>
	<nav>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
<h1>My Basic Webpage</h1>
<p>This is a basic webpage created with svelte.</p>
</div>

<!-- This is the CSS for your svelte component -->
<style>
	.page {
		display: flex;
		flex-direction: column;
		height: 300px;
		width: 300px;
	}
	nav {
		background-color: #333;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  li {
    float: left;
  }
  li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }
  li a:hover {
    background-color: #111;
  }
  h1 {
    color: blue;
  }
	
</style>