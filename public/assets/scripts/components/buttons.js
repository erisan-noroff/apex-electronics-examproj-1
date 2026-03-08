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
 * @param {('button'|'submit'|'reset')} [type=ButtonType.Button] - Button type (button, submit)
 * @param {string} [idPrefix=''] - ID prefix for button (will append '-btn')
 * @returns {HTMLButtonElement} - HTML button element
 */
export function PrimaryButton(text, type = ButtonType.Button, idPrefix = '') {
    const idAttr = idPrefix ? `id="${idPrefix}-btn"` : '';
    const button = document.createElement('button');
    button.type = type;
    button.classList.add('primary-button');
    if (idAttr) button.id = `${idPrefix}-btn`;
    button.textContent = text;
    return button;
}