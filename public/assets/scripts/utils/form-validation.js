/**
 * Validates form inputs and marks invalid fields
 * @param {Event} event - Form submit event
 * @returns {boolean} True if all inputs are valid
*/
export default function formValidation(event) {
    event.preventDefault();
    let isValid = true;

    const requiredInputs = event.target.querySelectorAll('[required]');
    for (let i = 0; i < requiredInputs.length; i++) {
        const input = requiredInputs[i];
        input.value.trim() === '' ? markInputAsInvalid(input) : markInputAsValid(input);
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