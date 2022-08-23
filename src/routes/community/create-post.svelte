<script>

let inputSubjectString = '';
console.log(inputSubjectString);
let inputBodyString = '';

const submitPostClick = (inputSubjectString, inputBodyString) => {
  console.log(inputSubjectString, inputBodyString);
}


</script>


<h2 class="text-xl font-semibold"> Share with the Svelvet Community!</h2>

<form>
  <h3 class="subjectHeader"> Subject: </h3>
  <input type="text" class="inputSubject" autocomplete="off" placeholder="Check out my design template!" bind:value={inputSubjectString}>

  <h3 class="bodyHeader"> Body: </h3>
  <textarea type="text" class="inputBody" autocomplete="off" placeholder="Hi Svelvet Community! I've created something amazing...." bind:value={inputBodyString}></textarea>
  <br>

  <button type="submit" class="submitPostButton" on:click={() => submitPostClick(inputSubjectString, inputBodyString)}>
    <!-- <a href="/community/forum">Submit Post</a> -->
    Submit Post
  </button>

  <input class="submit-file" type="file" title="Choose File">
</form>


<style>

input[type='file'] {
  color: rgba(0, 0, 0, 0)
}

  .submit-file {
    margin-left: 20px;
    margin-top: 2px;
  }


  .inputSubject {
    display: flex;
    flex: 1;
    float: left;
    width: 100%;
    padding: 1rem;
    border: 2px solid grey;
    border-radius: 10px;
    border-color: grey;
    height: 40px;
    /* display: flex;
    width: 500px;
    justify-content: space-between;
    border-style: solid;
    border-width: 1.25px;
    border-color: #ff4561;
    border-radius: 2em;
    align-items: center;
    flex: 1;
    float: left;
    padding: .25em 1em .25em; */

  }


  .inputBody {
    display: flex;
    padding: 1rem;
    width: 100%;
    height: 300px;
    border: 2px solid grey;
    border-radius: 10px;
    border-color: grey;
  }
  .submitPostButton {
  /* display: flex; */
  width: 8em;
  justify-content: space-between;
  border-style: solid;
  border-width: 1.25px;
  color: white;
  border-color: #ff4561;
  background: #ff4561;
  border-radius: 2em;
  align-items: center;
  flex: 1;
  float: left;
  padding: .25em 1em .25em;
  }
  .subjectHeader {
    padding-top: 1em;
    font-weight: bold;
  }
  .bodyHeader {

    margin-top: 4em;
    font-weight: bold;
  }
  .submitPostButton {
    display: flex;

  }
  .rick {
    margin-top: 6em;
    display: flex;
    border: #ff4561;
  }
</style>

<img class="rick" src="https://www.hidefninja.com/community/attachments/e28ec92dea750c11082236b1ecfa8c5d-gif.523656/" alt="dancing rick">
