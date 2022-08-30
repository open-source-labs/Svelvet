<script lang="ts">
    import { getPostFromDB } from '../../../supabase-db';
    import { onMount } from 'svelte';
    import IconButton, { Icon } from '@smui/icon-button';
    import Button, { Label } from '@smui/button';


    let toggleClicked = 0;
    let initialOff = false;
    let initialOn = true;
    let usingEvents = false;
    let starVotes = 23;
    let samplePosts = [];
    let postSubject = '';
    let postBody = '';
    let createdAt = '';

    onMount(async () => {
		samplePosts = await getPostFromDB()
        postSubject = samplePosts[0].post_subject;
        postBody = samplePosts[0].post_body;
        createdAt = samplePosts[0].created_at;
	});

  </script>



<!--Topic Section-->
<div class="topic-container">
    <!--Original thread-->
    <div class="head">
        <div class="authors">Original Author</div>
        <!-- <div class="content">Discussion Thread (Visited 325 Times)
        </div> -->
        <div>Posted {createdAt}</div>
    </div>

    <div class="body">
        <div class="authors">
            <div class="username"><a href="">Johnny T</a></div>
            <div class="username-small">u/johnny786 - 22'</div>

            <img src="data:image/jpeg;base64,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" alt="">
            <div class="metrics">
                <div class="upvote">

                    <div style="display: flex; align-items: center;">
                        <IconButton on:click={() => toggleClicked++} toggle bind:pressed={initialOff}>
                          <Icon class="material-icons" on>star</Icon>
                          <Icon class="material-icons">star_border</Icon>
                        </IconButton>
                      </div>
                      <pre class="status">STARS: {toggleClicked}</pre>

                      <Button on:click={() => (initialOn = !initialOn)}>
                        <Label>Toggle Programmatically</Label>
                      </Button>
                    </div>
                    <div style="display: flex; align-items: center;">

                </div>

            </div>

        </div>
        <div class="content">
         <b><h2>{postSubject}</h2> </b>
            <br>{postBody}
        </div>
    </div>
</div>

<!--Comment Area-->
<div class="reply-box">
    <textarea name="comment" placeholder="comment here ..."></textarea>
    <input class="login-container px-6 py-3 btn-primary"type="submit" value="Comment">
</div>


<!-- Test Portion -->

<style>

    .upvote-btn:focus {
        background-color: yellow;

    }

    .upvote {
        padding-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    .metrics {
        display: block;
        font-size: 13px;
    }


    .username {
        font-weight: bold;
        font-style: italic;
    }

    .username-small {
        font-style: oblique;
        font-size: 11px;
        font-weight: light;
        padding-bottom: 3px;
    }

    .reply-box textarea{
    width: 100%;
    padding: 8px;
    margin-block: none;
    border: solid .75px;
    border-color: #000000;
    }


.reply-box input{
    float: right;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
}

.reply-box input:hover{
    border: solid 1px #000000;
}

.head{
    display: flex;
    background-color: #ff4561b2;
    padding: 5px;
    font-weight: bold;
    font-size: 14px;
    padding-left: 8px;
    align-items: center;
    padding-right: 8px;
}

.authors{
    flex: 20%;
}

.content{
    flex: 80%;
    padding-top: 10px;
    padding-left: 30px;
}

.body{
    display: flex;
    background-color: #f5f5f5;
    padding: 10px;
    margin-top: 4px;
}

.body .authors .username{
    font-size: 20px;
}

.login-container{
    display: flex;
    width: auto;
    justify-content: center;
    border-style: solid;
    border-width: 1.25px;
    border-color: #ff4561;
    border-radius: 2em;
    align-items: center;
    flex: 1;
    float: left;
    padding: .25em 1em .25em;
}


</style>