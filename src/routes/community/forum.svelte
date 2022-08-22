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



<h1 class="header">Discussion Forum</h1>

  <button><div class="login-container px-3 py-3 btn-primary">
     <a href="/community/create-post">Create Post</a>
    </div></button>

    <div class="search-box">
        <div>
            <select name="" id="">
                <option value="everything">Everything</option>
                <option value="titles">Titles</option>
                <option value="descriptions">Descriptions</option>
            </select>
            <input type="text" name="q" placeholder=" search ...">
            <button>Search button</button>
        </div>
    </div>


<div class="main-container">

    

  <div class="container">
    <div class="subforum">
        <div class="subforum-title">


            <h1>General Information</h1>
        </div>
        <div class="subforum-row">
            <div class="subforum-icon subforum-column center">
                <i>Icon</i>
            </div>
            <div class="subforum-description subforum-column">
                <h1>
                    <a href="#">Description Title:</a>
                </h1>
                <p>Description Content: adfkjadsfjakfadlfkalkfjsk</p>
            </div>
            <div class="subforum-stats subforum-column center">
                <span>23 posts | 13 Tags
                </span>
            </div>
            <div class="subforum-info subforum-column">
                <b> <a href="#">Last Post</a></b> by <a href="#">AnonymousUser12345</a> 
                <br>
                on <small>20 Aug 2022</small> 
            </div>
        </div>
    </div>

    <!-- More Forums -->
    <div class="subforum">
        <div class="subforum-title">


            <h1>General Information</h1>
        </div>
        <div class="subforum-row">
            <div class="subforum-icon subforum-column center">
                <i>Icon</i>
            </div>
            <div class="subforum-description subforum-column">
                <h1>
                    <a href="#">Description Title:</a>
                </h1>
                <p>Description Content: adfkjadsfjakfadlfkalkfjsk</p>
            </div>
            <div class="subforum-stats subforum-column center">
                <span>23 posts | 13 Tags
                </span>
            </div>
            <div class="subforum-info subforum-column">
                <b> <a href="#">Last Post</a></b> by <a href="#">AnonymousUser12345</a> 
                <br>
                on <small>20 Aug 2022</small> 
            </div>
        </div>
    </div>
    <!-- More Foums 2 -->
    <div class="subforum">
        <div class="subforum-title">


            <h1>General Information</h1>
        </div>
        <div class="subforum-row">
            <div class="subforum-icon subforum-column center">
                <i>Icon</i>
            </div>
            <div class="subforum-description subforum-column">
                <h1>
                    <a href="#">Description Title:</a>
                </h1>
                <p>Description Content: adfkjadsfjakfadlfkalkfjsk</p>
            </div>
            <div class="subforum-stats subforum-column center">
                <span>23 posts | 13 Tags
                </span>
            </div>
            <div class="subforum-info subforum-column">
                <b> <a href="#">Last Post</a></b> by <a href="#">AnonymousUser12345</a> 
                <br>
                on <small>20 Aug 2022</small> 
            </div>
        </div>
    </div>

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

* {
    box-sizing: border-box;
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
    border-radius: 5px;
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
    padding: 10px;
    margin: 4px;
    border-radius: 5px;
    background-color: #111314;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.subforum-icon {
    font-size: 30px;
}

.search-box {
    border: solid 1px #ff4561;
    margin-top: 20px;
    padding: 40px;
    display: flex;
    justify-content: center;
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

</style>