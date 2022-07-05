import { createClient } from '@supabase/supabase-js';


// this will be the root of all of our supabase functionalities. We will export these into the __layout.svelte file, which is a top layer component that sits on top of our whole page (it will be easier to keep user state this way)

// import supabase db url and anon key in order to connect to the database
const supabase_URL = import.meta.env.VITE_SVELTE_APP_SUPABASE_URL;
const supabase_ANON_KEY = import.meta.env.VITE_SVELTE_APP_SUPABASE_ANON_KEY;

// this is how we initialize the supabase connection
export const supabase = createClient(supabase_URL, supabase_ANON_KEY);

export const logout = async function signout() {
  const { error } = await supabase.auth.signOut()
};

// export const signInWithGithub = async function signInWithGithub() {
//   const { user, session, error } = await supabase.auth.signIn({
//     provider: 'github',
//   })
// }

// this returns the current logged in user
export const user = supabase.auth.user();


export let testSession;
// this is basically an event listener. I think this would be useful for listening to when the login happens when the user logs in.
export default supabase.auth.onAuthStateChange((event, session) => {
  // if (event == 'SIGNED_IN') testSession = event; //console.log('SIGNED_IN', session)
  if(event === 'SIGNED_IN') {
    console.log('SIGNED_IN, testing return', session);
    return session;
  }
});

// this might be useful? not sure
export const current_session = supabase.auth.session();



