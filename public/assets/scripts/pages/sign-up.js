import { Button, ButtonType } from '../components/buttons.js';
import { ToastMessage } from '../components/toast-messages.js';
import formValidation from '../utils/form-validation.js';
import { authApiClient, isAuthenticated } from '../utils/authentication.js';

const formCard = document.querySelector('.form-card');
async function init() {
    if (isAuthenticated()) {
        window.location.href = new URL('index.html', window.location.href).toString();
        return;
    }

    signUpButton();
}

function signUpButton() {
    if (formCard) {
        const signUpButton = Button('Sign Up', 'primary-btn', 'sign-up', ButtonType.Submit);
        formCard.append(signUpButton);

        formCard.addEventListener('submit', async (e) => {
            const isValid = formValidation(e);
            if (!isValid) return;
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const response = await authApiClient('register', { name: `${firstName}_${lastName}`, email, password });
            if (!response) ToastMessage.apiDataLoadError();
            
            const data = await response.json();
            if (!response.ok) ToastMessage.error('Registration failed', data.errors[0].message);
            
            signUpSuccess();
        });
    }
}

function signUpSuccess() {
    if (formCard) {
        const signupSuccessH1 = document.createElement('h1');
        signupSuccessH1.textContent = 'Registration Successful!';
        const signupSuccessBody = document.createElement('p');
        signupSuccessBody.textContent = "We've sent a confirmation email.\nClick the link to activate your account.";
        const exploreShopButton = Button('Sign in to start shopping', 'primary-btn');
        formCard.replaceChildren(signupSuccessH1, signupSuccessBody, exploreShopButton);
        
        exploreShopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = new URL('sign-in.html', window.location.href).toString();
        });
    }
}

await init();