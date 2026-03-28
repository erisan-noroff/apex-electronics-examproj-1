import { API_KEY } from './config.js';

/**
 * Checks whether the user is currently authenticated.
 * @returns {boolean} True if a valid auth token exists in localStorage.
 */
export function isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
}

/**
 * Sends a POST request to the Noroff auth API.
 * @param {string} endpoint - The auth endpoint to call ("login" or "register").
 * @param {object} body - The request payload.
 * @returns {Promise<Response>} The raw fetch Response.
 */
export async function authApiClient(endpoint, body) {
    const baseApiUrl = 'https://v2.api.noroff.dev/auth';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Noroff-API-Key': `${API_KEY}`
        },
        body: JSON.stringify(body)
    };
    
    return await fetch(`${baseApiUrl}/${endpoint}`, options);
}