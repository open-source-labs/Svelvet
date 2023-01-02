
<script>
let user = {loggedIn: false}
function toggle () {
  user.loggedIn = !user.loggedIn
}
</script>


{#if !user.loggedIn}
<div class='login'>
  <input type="text" placeholder="Username" />
  <input type="password" placeholder="Password" />
  <button on:click={toggle}> Login Here </button>
</div>
{:else}
 <div> 
  You are logged in 
  <button on:click={toggle}> Logout </button>
 </div>
{/if}

<!-- This is the CSS for your svelte component -->
<style>
	.login {
    margin: 1rem;
		display: flex;
		flex-direction: column;
		height: 300px;
		width: 150px;
	}
</style>