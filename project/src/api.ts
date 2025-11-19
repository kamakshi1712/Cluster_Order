const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// @ts-ignore
export async function api(path, options = {}, token) {
// @ts-ignore    
options.headers = options.headers || {};// @ts-ignore
if (token) options.headers['Authorization'] = 'Bearer ' + token;// @ts-ignore
if (!options.headers['Content-Type'] && options.body)// @ts-ignore
options.headers['Content-Type'] = 'application/json';


const res = await fetch(API + path, options);
return res.json();
}
// @ts-ignore