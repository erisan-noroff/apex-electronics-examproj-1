/**
 * Validates form inputs and marks invalid fields
 * @param {SubmitEvent} event - Form submit event
 * @returns {boolean} True if all inputs are valid
*/
export default function formValidation(event) {
    event.preventDefault();
    const form = event.target;
    let isValid = true;

    for (let i = 0; i < form.elements.length; i++) {
        const input = form.elements[i];
        if (['text', 'email', 'password'].includes(input.type)) {
            input.value.trim() === '' ? markInputAsInvalid(input) : markInputAsValid(input);
        }
    }

    function markInputAsInvalid(input) {
        isValid = false;
        input.classList.add('input-wrapper__input--error');
        if (input.parentElement.querySelector('span')) return;

        const errorSpan = document.createElement('span');
        errorSpan.classList.add('input-wrapper__error');
        errorSpan.innerText = `${input.previousElementSibling.textContent} must be filled in`;
        input.parentElement.append(errorSpan);
    }

    function markInputAsValid(input) {
        input.classList.remove('input-wrapper__input--error');
        input.parentElement.querySelector('span')?.remove();
    }

    return isValid;
}