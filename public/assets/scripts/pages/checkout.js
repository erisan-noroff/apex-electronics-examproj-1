import { Summary } from '../components/summary.js';
import { Button, ButtonType } from '../components/buttons.js';
import formValidation from '../utils/form-validation.js';

async function init() {
    const wrapper = document.querySelector('.checkout-wrapper');
    if (!wrapper) return;
    const summary = await Summary();
    if (!summary) return;
    summary.classList.add('summary--card');
    wrapper.append(summary);
    
    const form = document.querySelector('.checkout-wrapper__form');
    if (!form) return;
    
    const completePurchaseBtn = completePurchaseBtnElement();
    form.append(completePurchaseBtn);
    
    
    toggleCardFields();
    changePaymentMethodListener();
    submitEventListener();
}

function completePurchaseBtnElement() {
    return Button('Complete Purchase', 'primary-btn primary-btn--full', 'complete-purchase', ButtonType.Submit);
}

function toggleCardFields(isCard) {
    const checkedRadio = document.querySelector('.form-card__row__payment-methods input[type="radio"]:checked');
    if (!checkedRadio) return;
    
    isCard = checkedRadio.value === 'card';
    const cardFields = document.querySelector('.form-card__row__payment-methods__card-fields');
    const cardInputs = cardFields.querySelectorAll('input');
    for (let i = 0; i < cardInputs.length; i++) {
        cardInputs[i].disabled = !isCard;
        if (!isCard) cardInputs[i].value = '';
    }

    cardFields.classList.toggle('form-card__row__payment-methods__card-fields--hidden', !isCard);
}

function changePaymentMethodListener() {
    const radioButtons = document.querySelectorAll('.form-card__row__payment-methods input[type="radio"]');
    for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener('change', (e) => {
            toggleCardFields(e.target.value === 'card');
        });
    }
}

function submitEventListener() {
    const form = document.querySelector('.checkout-wrapper__form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const tos = document.getElementById('accept-tos');
        const tosWrapper = tos.parentElement.parentElement;
        tosWrapper.querySelector('.input-wrapper__error')?.remove();
        const isValid = formValidation(e);
        if (!tos.checked) {
            const errorSpan = document.createElement('span');
            errorSpan.classList.add('input-wrapper__error');
            errorSpan.textContent = 'You must agree to Terms of Service';
            tosWrapper.append(errorSpan);
        }
        
        if (!isValid || !tos.checked) return;

        document.location =  new URL('checkout-success.html', window.location.href).toString();
    });
}

await init();