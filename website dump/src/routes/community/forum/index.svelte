<script context="module">
    export async function load() {
        return {
            status: 302,
            redirect: "/404"
        };
    }
</script>

<!-- SVELVET 3.0: WE HAVE CREATED BASIC FUNCTIONALITY TO PULL DATA FROM SUPABASE FOR A DISCUSSION THREAD PAGE AS BELOW -->
<!-- <script>
    import { getPostFromDB } from '../../../supabase-db';
    import { onMount } from 'svelte';

    let samplePosts = [];
// fetch (post_subject, post_body, created_at, user) from SupabaseDB
	onMount(async () => {
		samplePosts = await getPostFromDB();
        console.log(samplePosts);
	});
    export let forum
</script> -->


<!-- Beginning of Forum Lander -->

<!-- <h1 class="header">Welcome to the Discussion Forum</h1>



    <div class="search-box">
        <div class="search-box-inner">

            <input class="community-searchbox" type="text" name="q" placeholder=" Search community...">
            <button><div class="login-container px-3 py-3 btn-primary">
                <a href="/community/forum/create-post">Find</a>
               </div></button>

               <button><div class="login-container px-3 py-3 btn-primary">
                <a href="/community/forum/create-post">Create Post</a>
               </div></button>

        </div>
    </div>


<div class="main-container">


  <div class="container">
    <div class="subforum">
        <div class="subforum-title">

            {#each samplePosts as post}

        <div class="subforum-row">
            <div class="subforum-icon subforum-column center">
                <i>Icon</i>
            </div>
            <div class="subforum-description subforum-column">
                <h1>
                    <a class="subject-line" id={post.id} href="/forum/user-post/${post.id}">{post.post_subject}</a>
                </h1>
                <p class="body-line" >{post.post_body}</p>
            </div>

            <div class="subforum-stats subforum-column center">
                <span>{post.comments} comments
                </span>
            </div>
            <div class="subforum-info subforum-column">
                <b> <a href="#">Post</a></b> by <a href="#">{post.user}</a>
                <br>
                on <small>{post.created_at}</small>
            </div>
        </div>
        {/each}
    </div>
</div>
    </div>

  </div> -->

<!-- End of Forum Lander -->






<!-- <style>
    .subject-line{
        text-decoration: underline;
        padding-top: 5px;
        padding-left: 5px;
}

.body-line {
    padding-left: 5px;
    font-size: 22px;
}

.header{
        display: flex;
        justify-content: center;
        font-size: large;
        font-weight: bolder;
}

.main-container{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 20px;
    color: black;
    font-weight: bold;
    font-size: 1.5em;
    /* background: rgba(0,0,0, 0.1); */
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

h1 {
    font-size: 16px;
    font-weight: bolder;
}

.container {
    margin: 20px;
    padding: 20px;
}

.subforum {
    margin-top: 20px;
}

.subforum-title {
    background-color: #292B2E;
    padding: 5px;
    margin: 4px;
}

.subforum-description {
    margin-block: 0;
}

.subforum-row {
    display: grid;
    grid-template-columns: 7% 60% 13% 20%;
}

.subforum-column {
    padding: 1px;
    margin: 4px;
    background-color: #f5f5f5;
}

.subforum-icon {
    font-size: 30px;
}



.subforum-info{
    font-size: 20px;
    padding: 25px;
}

.subforum-stats{
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}


.search-box {
    margin-top: 20px;
    padding: 40px;
    display: flex;
    justify-content: center;
}


.community-searchbox{
    border: solid;
}


@media screen and (max-width: 460) {
    .container {
        margin: 10px;
        padding: 10px;
    }
    .subforum-row {
    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-rows: 65% 35%;
    }

}

</style> -->