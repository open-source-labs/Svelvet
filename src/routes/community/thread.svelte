<script>
import { each } from "svelte/internal";

    const samplePosts = [
        {
            subject: 'Test Post 1',
            body: 'Sample body 1 1dfadsfsdfdsfsadfsdafsdfdsjhfsdakfhasdjkfhsdkjfhsdjfhdsjkfhsdjkfhsadkjfhkdsjfhasdkjhfaskdjhfsdkjfhasdkjfhsdkjfhsdajkfhsdfhsjkdfhsdkfhsakfjhsdkjfhsadkjfhaskdfhsdkjf',
        },
        {
            subject: 'Test Post 2',
            body: 'Sample body 2 1dfadsfsdfdsfsadfsdafsdfdsjhfsdakfhasdjkfhsdkjfhsdjfhdsjkfhsdjkfhsadkjfhkdsjfhasdkjhfaskdjhfsdkjfhasdkjfhsdkjfhsdajkfhsdfhsjkdfhsdkfhsakfjhsdkjfhsadkjfhaskdfhsdkjf',
        },
        {
            subject: 'Test Post 3',
            body: 'Sample body 3 1dfadsfsdfdsfsadfsdafsdfdsjhfsdakfhasdjkfhsdkjfhsdjfhdsjkfhsdjkfhsadkjfhkdsjfhasdkjhfaskdjhfsdkjfhasdkjfhsdkjfhsdajkfhsdfhsjkdfhsdkfhsakfjhsdkjfhsadkjfhaskdfhsdkjf',
        },
    ]
</script>



<h1 class="header">Discussion Thread</h1>

  <button><div class="login-container px-3 py-3 btn-primary">
     <a href="/community/create-post">Create Post</a>
    </div></button>
<div class="main-container">

  <div class='thread-container'>
    {#each samplePosts as post (post.body)}
    <div>{post}</div>
    {/each}
  </div>

  <!-- vvv End of main container div vvv -->
  </div>
  
  





<style>
    .header {
        display: flex;
        justify-content: center;
        font-size: large;
        font-weight: bolder;
    }
.main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 20px;
    color: #ffffff;
    font-weight: bold;
    font-size: 1.5em;
    background: rgba(0, 0, 0, 0.1);
    width: 1150px;
}


.login-container{
    display: flex;
    width: 8em;
    justify-content: space-between;
    border-style: solid;
    border-width: 1.25px;
    border-color: #ff4561;
    border-radius: 2em;
    align-items: center;
    flex: 1;
    float: left;
    padding: .25em 1em .25em;
}

.thread-container {
    display: flex;
    justify-content: center;
    width: 650px;
    height: 800px;
    background: #ff4561;

}

</style>