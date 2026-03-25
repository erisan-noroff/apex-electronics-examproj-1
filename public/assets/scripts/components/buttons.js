/**
 * Button type enum for form buttons
 */
export const ButtonType = {
    Button: 'button',
    Submit: 'submit'
}

/**
 * Primary button
 * @param {string} text - Button text
 * @param {string} [className=''] - Class name to be added
 * @param {string} [idPrefix=''] - ID prefix for button (will append '-btn')
 * @param {('button'|'submit'|'reset')} [type=ButtonType.Button] - Button type (button, submit)
 * @returns {HTMLButtonElement} - HTML button element
 */
export function Button(text, className = '', idPrefix='', type = ButtonType.Button) {
    const button = document.createElement('button');
    button.type = type;
    if (className) button.classList.add(className);
    if (idPrefix) button.id = `${idPrefix}-btn`;
    button.textContent = text;
    return button;
}