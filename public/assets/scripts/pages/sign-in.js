import { Button, ButtonType } from '../components/buttons.js';
import { ToastMessage } from '../components/toast-messages.js';
import formValidation from '../utils/form-validation.js';
import { isAuthenticated, authApiClient } from '../utils/authentication.js';

function init() {
    if (isAuthenticated()) {
        window.location.href = new URL('index.html', window.location.href).toString();
        return;
    }

    const form = document.querySelector('.form-card__form');
    if (!form) return;

    const signInBtn = signInBtnElement();
    form.insertBefore(signInBtn, form.lastElementChild);

    submitEventListener();
    forgotPassword();
}

function signInBtnElement() {
    return Button('Sign In', 'primary-btn primary-btn--full', 'sign-in', ButtonType.Submit);
}

function submitEventListener() {
    const form = document.querySelector('.form-card__form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        const isValid = formValidation(e);
        if (!isValid) return;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const response = await authApiClient('login', { email, password });
        if (!response) { 
            ToastMessage.apiDataLoadError();
            return;
        }

        const data = await response.json();
        if (!response.ok) {
            ToastMessage.error('Login failed', data.errors[0].message);
            return;
        }

        const accessToken = data.data.accessToken;
        if (!accessToken) {
            ToastMessage.error('Unexpected server error', 'No authentication token received');
            return;
        }

        localStorage.setItem('auth_token', data.data.accessToken);
        window.location.href = new URL('index.html', window.location.href).toString();
    });
}

function forgotPassword() {
    const formCardRow = document.querySelector('.form-card__row');
    if (!formCardRow) return;
    
    const forgotPasswordButton = Button('Forgot password?', 'form-card__forgot-password');
    formCardRow.append(forgotPasswordButton);

    forgotPasswordButton.addEventListener('click', () => {
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            ToastMessage.error('Missing email address', 'Insert your email address to reset your password');
            return;
        }

        ToastMessage.success('Password Reset', 'If the account exists, a reset link has been sent to your email');
    });
}

init();