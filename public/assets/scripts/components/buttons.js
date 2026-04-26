import { getCartItemCount } from '../utils/cart.js';

/**
 * Button type enum for form buttons
 */
export const ButtonType = {
    Button: 'button',
    Submit: 'submit'
}

/**
 * Button
 * @param {string} text - Button text
 * @param {string} [className=''] - Class name(s) to be added
 * @param {string} [idPrefix=''] - ID prefix for button (will append '-btn')
 * @param {('button'|'submit'|'reset')} [type=ButtonType.Button] - Button type (button, submit)
 * @returns {HTMLButtonElement} - HTML button element
 */
export function Button(text, className = '', idPrefix='', type = ButtonType.Button) {
    const button = document.createElement('button');
    button.type = type;
    if (className) button.classList.add(...className.split(' '));
    if (idPrefix) button.id = `${idPrefix}-btn`;
    button.textContent = text;
    return button;
}

export function CartButton() {
    const itemsCount = getCartItemCount();
    const button = Button(`Cart (${itemsCount})`, 'primary-btn cart-btn', 'cart');
    const cartIcon = document.createElement('span');
    cartIcon.classList.add('material-icons');
    cartIcon.textContent = 'shopping_cart';
    button.prepend(cartIcon);
    return button;
}