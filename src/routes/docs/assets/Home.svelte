<!-- This is the HTML for your svelte component -->
<div class="page">
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Profile</a></li>
      <li><a href="#">Game</a></li>
    </ul>
  </nav>
  <h1>Home Page</h1>
  <div class="info">
    <h4>This is a basic webpage created with svelte.</h4>
    <p>
      Wow this is so cool! A custom Svelte component as a node! There is so many
      cool things we can do with this new feature! Look at all of these
      components we can now load as custom components!
    </p>
  </div>
</div>

<!-- This is the CSS for your svelte component -->
<style>
  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
    width: 300px;
    /* overflow-y: scroll;
    scrollbar-color: rebeccapurple green;
    scrollbar-width: thin; */
  }
  .info {
    display: flex;
    flex-direction: column;
  }
  nav {
    background-color: #ff4742;
    width: 100%;
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
    color: #ff4742;
  }
</style>
