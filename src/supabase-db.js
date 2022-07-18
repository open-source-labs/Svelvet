import { createClient } from '@supabase/supabase-js';
import { user, logged_in, user_avatar, user_name, user_email, diagrams } from '$lib/stores/authStore.js'
import { get } from 'svelte/store';
// this is the root of all of our supabase functionalities. We will export these into the __layout.svelte file, which is a top layer component that sits on top of our whole page (it will be easier to keep user state this way)

// import supabase db url and anon key in order to connect to the database
const supabase_URL = import.meta.env.VITE_SVELTE_APP_SUPABASE_URL;
const supabase_ANON_KEY = import.meta.env.VITE_SVELTE_APP_SUPABASE_ANON_KEY;

// this is how we initialize the supabase connection
export const supabase = createClient(supabase_URL, supabase_ANON_KEY);

export const logout = async function signout() {
  const { error } = await supabase.auth.signOut()
};

export const signInWithGithub = async function signInWithGithub() {
  const { user, session, error } = await supabase.auth.signIn(
    {provider: 'github'}, {redirectTo: window.location.href}
  )
}

// this returns the current logged in user
export const userInfo = supabase.auth.user();


// detects when the Auth state changes
export default supabase.auth.onAuthStateChange((event, session) => {
  if(event === 'SIGNED_IN') {
    console.log('identities', supabase.auth.user().identities)
    const avatar = supabase.auth.user().identities[0].identity_data.avatar_url;
    user_avatar.set(avatar);
    user.set(session?.user);
    const username = supabase.auth.user().identities[0].identity_data.user_name;
    const email = supabase.auth.user().identities[0].identity_data.email;
    user_name.set(username);
    user_email.set(email);
    logged_in.set(true);
    const diagramsArray = get(diagrams);
    console.log('diagramsArray,', diagramsArray)
    if(session?.user) {
      // populate diagrams store with the user's diagram objects from the db
      getCodeFromDB(email)
      .then(data => {
        diagrams.set(data);
      }) 
    }
  }
  if(event === 'SIGNED_OUT') {
    user.set(null);
    logged_in.set(false);
    user_name.set(null);
    user_email.set(null);
    diagrams.set([]);
  }
});

export const addCodeToDB = async (code, test_email, diagramName, project_store) => {
  const updatedDiagramStore = [];
  await supabase
			.from('user_saved_projects')
			.insert([
				{ code: code, created_by: test_email, diagram_name: diagramName }
			])
      .then((response) => {
        project_store.forEach(obj => {
        updatedDiagramStore.push(obj);
      });
      updatedDiagramStore.push(response.body[0]);
      diagrams.set(updatedDiagramStore);
    })
}

export const getCodeFromDB = async (user_email) => {
  const {data, error} = await supabase
  .from('user_saved_projects')
  .select('*')
  .in('created_by', [user_email])
  if(error) {
    return console.error(error);
  }
  return data;
};

export const current_session = supabase.auth.session();

export const updateCodeInDB = async (id, updated_code, project_store) => {
  const {data, error} = await supabase
    .from('user_saved_projects')
    .update({ code: updated_code })
    .match({ id: id })

    const updatedDiagramStore = [];
    project_store.forEach(obj => {
      if(obj.id === data[0].id) {
        updatedDiagramStore.push({...obj, code: data[0].code});
      }
      else {
        updatedDiagramStore.push(obj);
      }
    })
    diagrams.set(updatedDiagramStore);
    if(error) {
      return console.error(error);
    }
}

export const deleteCodeFromDB = async (id, project_store) => {
  const {data, error} = await supabase
    .from('user_saved_projects')
    .delete()
    .match({ id: id })
    const updatedDiagramStore = [];
    project_store.forEach(obj => {
      if(obj.id !== data[0].id) {
        updatedDiagramStore.push(obj);
      }
    })
    diagrams.set(updatedDiagramStore);
    if(error) {
      return console.error(error);
    }
}
