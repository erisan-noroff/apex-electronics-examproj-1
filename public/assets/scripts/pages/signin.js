import { Button, ButtonType } from '../components/buttons.js';
import { ToastMessage } from '../components/toast-messages.js';

function init() {
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        const signInButton = Button('Sign In', 'primary-button', 'sign-in', ButtonType.Submit);
        formCard.insertBefore(signInButton, formCard.lastElementChild);
    }
    
    const formCardRow = document.querySelector('.form-card__row');
    if (formCardRow) {
        const forgotPasswordButton = Button('Forgot password?', 'form-card__forgot-password');
        formCardRow.append(forgotPasswordButton);
        
        forgotPasswordButton.addEventListener('click', () => {
            const email = document.getElementById('email');
            if (!email.value.trim()) {
                ToastMessage.error('Missing email address', 'Insert your email address to reset your password')
                return;
            }
            
            ToastMessage.success('Password Reset', 'If the account exists, a reset link has been sent to your email');
        });
    }
}

init();