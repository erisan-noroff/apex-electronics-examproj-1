/**
 * Validates all required inputs in a form on submit. Clears previous error states before
 * re-evaluating. Runs type-specific validation (email domain, password strength/match)
 * where applicable.
 * @param {Event} e - Form submit event
 * @returns {boolean} True if all inputs pass validation
 */
export default function formValidation(e) {
    e.preventDefault();
    let isValid = true;

    const requiredInputs = e.target.querySelectorAll('[required]');
    for (let i = 0; i < requiredInputs.length; i++) {
        const input = requiredInputs[i];
        input.classList.remove('input-wrapper__input--error');
        input.parentElement.querySelector('span')?.remove();
        if (input.value.trim() === '') appendError(input, `${input.previousElementSibling.textContent} must be filled in`);
        else if (input.type === 'email' && input.dataset.validateDomain) validateEmailDomain(input);
        else if (input.type === 'password') validatePasswordLength(input);
        if (input.id === 'confirm-password') validatePasswordMatch();
    }

    /**
     * Marks the input as invalid and appends an error message. Sets the global isValid variable to false.
     * @param {HTMLInputElement} input
     * @param {string} message
     */
    function appendError(input, message) {
        isValid = false;
        input.classList.add('input-wrapper__input--error');
        const errorSpan = document.createElement('span');
        errorSpan.classList.add('input-wrapper__error');
        errorSpan.innerText = message;
        input.parentElement.append(errorSpan);
    }

    /**
     * Requires the `data-validate-domain` attribute on the input to run.
     * Checks if the email ends with @stud.noroff.no and marks as invalid if not.
     * @param {HTMLInputElement} input
     */
    function validateEmailDomain(input) {
        if (input.value.endsWith('@stud.noroff.no')) return;
        appendError(input, 'Email must be a valid @stud.noroff.no address');
    }

    /**
     * @param {HTMLInputElement} input
     */
    function validatePasswordLength(input) {
        if (input.value.trim().length >= 8) return;
        appendError(input, 'Password must be at least 8 characters long');
    }

    /**
     * Compares the value of #password and #confirm-password. Marks #confirm-password
     * as invalid if they don't match.
     */
    function validatePasswordMatch() {
        const password = document.getElementById('password')?.value?.trim();
        const confirmPassword = document.getElementById('confirm-password')?.value?.trim();
        if (password.length < 8) return;
        if (password === confirmPassword) return;
        const confirmPasswordInput = document.getElementById('confirm-password');
        appendError(confirmPasswordInput, 'Passwords do not match');
    }

    return isValid;
}