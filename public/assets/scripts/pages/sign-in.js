import { Button, ButtonType } from '../components/buttons.js';
import { ToastMessage } from '../components/toast-messages.js';
import formValidation from '../utils/form-validation.js';
import { isAuthenticated, setAuthToken } from '../utils/authentication.js';

const homePage = new URL('index.html', window.location.href).toString();
function init() {
    if (isAuthenticated()) {
        window.location.href = homePage;
        return;
    }
    
    signInButton();
    forgotPassword();
}

function signInButton() {
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        const signInButton = Button('Sign In', 'primary-button', 'sign-in', ButtonType.Submit);
        formCard.insertBefore(signInButton, formCard.lastElementChild);
        
        formCard.addEventListener('submit', (e) => {
            const isValid = formValidation(e);
            if (!isValid) return;
            setAuthToken();
            window.location.href = homePage;
        });
    }
}

function forgotPassword() {
    const formCardRow = document.querySelector('.form-card__row');
    if (formCardRow) {
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
}

init();