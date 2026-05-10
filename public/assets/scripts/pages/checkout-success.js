import { emptyCart } from '../utils/cart.js';
import { isAuthenticated } from '../utils/authentication.js';
import { Button } from '../components/buttons.js';

function init() {
    if (!isAuthenticated() || sessionStorage.getItem('payment-success') !== 'true') {
        window.location.href = new URL('index.html', window.location.href).toString();
        return;
    }
    
    emptyCart();
    
    setTimeout(() => {
        renderCheckoutSuccess();
    }, 2000);
}

function renderCheckoutSuccess() {
    const main = document.querySelector('main');
    if (!main) return;
    
    const section = document.createElement('section');
    section.classList.add('checkout-success', 'content-gutters');
    
    const header = document.createElement('h1');
    header.textContent = 'Thank you for your purchase!';
    
    const orderNumber = document.createElement('p');
    orderNumber.classList.add('checkout-success__order-number');
    orderNumber.textContent = `Order numer: #${Math.floor(Math.random() * 90000000) + 10000000}`;
    
    const bodyTextWrapper = document.createElement('div');
    bodyTextWrapper.classList.add('checkout-success__body-text-wrapper');
    const firstLine = document.createElement('p');
    firstLine.textContent = 'An order confirmation has been sent to your email.';
    const secondLine = document.createElement('p');
    secondLine.textContent = 'Please get in touch with us if you have any questions or issues.';
    bodyTextWrapper.append(firstLine, secondLine);
    
    const backToHome = Button('Back to Home', 'primary-btn primary-btn--full');
    backToHome.addEventListener('click', () => {
       document.location =  new URL('index.html', window.location.href).toString(); 
    });
    
    section.append(header, orderNumber, bodyTextWrapper, backToHome);
    main.replaceChildren(section);
}

init();