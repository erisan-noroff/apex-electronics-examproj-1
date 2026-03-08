export function isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return token !== null && token !== '';
}

export function setAuthToken() {
    // Reference: https://stackoverflow.com/questions/1349404/generate-a-string-of-random-characters
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < charset.length; i++)
        token += charset.charAt(Math.floor(Math.random() * charset.length));
    
    localStorage.setItem('auth_token', token);
}

export function clearToken() {
    localStorage.removeItem('auth_token');
}