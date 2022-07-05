import * as cookie from 'cookie';
import {createClient} from '@supabase/supabase-js';


// get the keys from VITE (svelte-kit's way of handing env variables)
const supabaseUrl = import.meta.env.VITE_SVELTE_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SVELTE_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

export const auth = supabase.auth;

export const signOut = async () => {
	await auth.signOut();
	await auth.unsetAuthCookie();
	goto('/');
};

export const getCookie = (name, token, extra) => {
	const Blank = { path: '/', expires: new Date(0) };
	const DefaultOptions = {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 180, // default Max-Age, can be overwritten via extra
	};
	let options = { ...DefaultOptions, ...extra };

	return token ? cookie.serialize(name, token, options) : cookie.serialize(name, '', Blank);
};

export const blankCookies = () => {
	return [getCookie('refresh_token', null), getCookie('access_token', null), getCookie('expires_at', null)];
};

const setServerSession = async (event, session) => {
	console.log('Setting Server Session >>>', event, session);
	await fetch('/api/auth.json', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		credentials: 'same-origin',
		body: JSON.stringify({ event, session }),
	});
};

export const setAuthCookie = async (session) => {
	await setServerSession('SIGNED_IN', session);
};
export const unsetAuthCookie = async () => {
	await setServerSession('SIGNED_OUT', null);
};