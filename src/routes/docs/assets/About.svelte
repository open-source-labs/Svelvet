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
  <h1>Svelvet 5.0 Team</h1>
  <div class="imgBox">
    <img
      class="pfp"
      src="https://www.dropbox.com/s/bunxvjowj5fxosa/de3t.jpg?raw=1"
      alt="osp homies"
    />
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
  .imgBox {
    display: flex;
    justify-content: center;
    height: 100px;
    width: 100px;
  }
  .pfp {
    height: 160px;
    width: 160x;
  }
</style>
