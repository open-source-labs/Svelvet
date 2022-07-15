import { createClient } from '@supabase/supabase-js';
import { user, logged_in, user_avatar, user_name, user_email } from '$lib/stores/authStore.js'


// this will be the root of all of our supabase functionalities. We will export these into the __layout.svelte file, which is a top layer component that sits on top of our whole page (it will be easier to keep user state this way)

// import supabase db url and anon key in order to connect to the database
const supabase_URL = import.meta.env.VITE_SVELTE_APP_SUPABASE_URL;
const supabase_ANON_KEY = import.meta.env.VITE_SVELTE_APP_SUPABASE_ANON_KEY;

// this is how we initialize the supabase connection
export const supabase = createClient(supabase_URL, supabase_ANON_KEY);

export const logout = async function signout() {
  const { error } = await supabase.auth.signOut()
};

export const signInWithGithub = async function signInWithGithub() {
  const { user, session, error } = await supabase.auth.signIn({
    provider: 'github',
  })
}

// this returns the current logged in user
export const userInfo = supabase.auth.user();


// this is basically an event listener. I think this would be useful for listening to when the login happens when the user logs in.
export default supabase.auth.onAuthStateChange((event, session) => {
  // if (event == 'SIGNED_IN') testSession = event; //console.log('SIGNED_IN', session)
  if(event === 'SIGNED_IN') {
    console.log('SIGNED_IN, testing return', session);
    const avatar = supabase.auth.user().identities[0].identity_data.avatar_url;
    // console.log(avatar);
    user_avatar.set(avatar);
    // console.log(supabase.auth.user().identities[0].identity_data.avatar_url);
    // user.set(session?.user);
    user.set(session?.user);
    const username = supabase.auth.user().identities[0].identity_data.user_name;
    // console.log(supabase.auth.user().identities[0].identity_data)
    const email = supabase.auth.user().identities[0].identity_data.email;
    // console.log('email just after declaration-->', email);
    user_name.set(username);
    user_email.set(email);
    // logged_in.set(true);
    logged_in.set(true);
    if(session?.user) {
      // redirect to saved diagrams page or playground?
      // load saved diagrams
    }
  }
  if(event === 'SIGNED_OUT') {
    console.log('SIGNED_OUT', session);
    // user.set(null);
    user.set(null);
    logged_in.set(false);
    user_name.set(null);
    user_email.set(null);
  }
});

/* export const signInWithGithub = async function signInWithGithub() {
  const { user, session, error } = await supabase.auth.signIn({
    provider: 'github',
  })
} */

/* export const addCodeToDB = async function addCodeToDB(code) {
  console.log('user_email inside addCodeToDb-->', user_email);
  const {data, error} = await supabase
			.from('user_saved_projects')
			.insert([
				{ code: code, created_by: user_email }
			])
      if(error) console.log('ERROR: ', error);
      console.log("data", data, "was added to DB")
} */
export const addCodeToDB = async (code, test_email) => {
  console.log('test_email inside addCodeToDb-->', test_email);
  const {data, error} = await supabase
			.from('user_saved_projects')
			.insert([
				{ code: code, created_by: test_email }
			])
      if(error) console.log('ERROR: ', error);
      console.log("data", data, "was added to DB")
}

export const getCodeFromDB = async (user_email) => {
  const {data, error} = await supabase
  .from('user_saved_projects')
  .select('code', 'created_by')
  .in('created_by', [user_email])
  if(error) {
    return console.error(error);
  }
  console.log(data);
  return data;
};


/* export const addCodeToDB = code => {
  console.log("addCodeToDB hit")
  const { data, error } = async () => await supabase
			.from('user_saved_projects')
			.insert([
				{ code: code, created_by: user_name }
			])
      if(error) console.log('ERROR: ', error);
      console.log("was added to DB")
    }
 */
// export const getCodeFromDB = () => {
//   const {data, error} = async () => await supabase
//   .from('user_saved_projects')
//   .select('code')
//   if(error) {
//     return console.error(error);
//   }
//   console.log(data);
// }
// this might be useful? not sure
export const current_session = supabase.auth.session();



