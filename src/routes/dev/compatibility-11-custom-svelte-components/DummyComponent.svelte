<script>
  // Import the required components

  // Define the variables for the username and password
  let username = '';
  let password = '';

  let user = { loggedIn: false };
  function toggle() {
    user.loggedIn = !user.loggedIn;
  }
</script>

{#if !user.loggedIn}
  <h1>svelvet demo</h1>
  <div class="form">
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
    <button class="button" on:click={toggle}> Login Here </button>
  </div>
{:else}
  <div class="logout">
    <h1>You are logged in</h1>
    <button class="button" on:click={toggle}> Logout </button>
  </div>
{/if}

<style>
  /* Add some basic styles to the login form */
  h1 {
    color: #ff4742;
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .logout {
    display: flex;
    flex-direction: column;
  }
  .button {
    background: #ff4742;
    border: 1px solid #ff4742;
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: inline-block;
    font-family: nunito, roboto, proxima-nova, 'proxima nova', sans-serif;
    font-size: 16px;
    font-weight: 800;
    line-height: 16px;
    min-height: 40px;
    outline: 0;
    padding: 12px 14px;
    text-align: center;
    text-rendering: geometricprecision;
    text-transform: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
  }

  .button:hover,
  .button:active {
    background-color: initial;
    background-position: 0 0;
    color: #ff4742;
  }

  .button:active {
    opacity: 0.5;
  }
</style>
