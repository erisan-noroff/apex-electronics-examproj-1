const TOAST_TYPES = {
    success: {
        id: 'toast-success',
        modifier: 'toast--success',
        icon: 'check',
        altText: 'success alert'
    },
    error: {
        id: 'toast-error',
        modifier: 'toast--error',
        icon: 'close',
        altText: 'error alert'
    }
}

export const ToastMessage = {
    /**
     * Display success toast message
     * @param {string} title - Toast title
     * @param {string} message - Toast message
    */
    success(title, message) {
        displayToast('success', title, message);
    },
    /**
     * Display error toast message
     * @param {string} title - Toast title
     * @param {string} message - Toast message
     */
    error(title, message) {
        displayToast('error', title, message);
    },
    /**
    * Display API data load error toast message
    */
    apiDataLoadError() {
        displayToast('error', 'Unable to fetch data', 'An error occurred when fetching data. Please refresh the page.');
    }
}

function displayToast(type, title, message) {
    // Avoids same toast from being displayed multiple times if the user spam clicks a button that triggers it.
    removeToastIfAlreadyiExsts();
    
    const main = document.querySelector('main');
    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-wrapper');
    toastContainer.id = TOAST_TYPES[type].id;
    main.prepend(toastContainer);
    
    const toastIndicator = document.createElement('span');
    toastIndicator.classList.add('toast__indicator', `${TOAST_TYPES[type].modifier}`);
    toastContainer.append(toastIndicator);

    const toastContent = document.createElement('div');
    toastContent.classList.add('toast__content');
    toastContainer.append(toastContent);

    const toastIconContainer = document.createElement('span');
    toastIconContainer.classList.add('toast__icon', `${TOAST_TYPES[type].modifier}`);
    
    const toastIcon = document.createElement('span');
    toastIcon.className = 'material-icons';
    toastIcon.textContent = TOAST_TYPES[type].icon;
    toastIconContainer.append(toastIcon);
    toastContent.append(toastIconContainer);
    
    const toastText = document.createElement('div');
    toastText.classList.add('toast__text');
    toastContent.append(toastText);

    const toastTitle = document.createElement('p');
    toastTitle.classList.add('toast__title');
    toastTitle.innerText = title;
    toastText.append(toastTitle);

    const toastMessage = document.createElement('p');
    toastMessage.classList.add('toast__message');
    toastMessage.innerText = message;
    toastText.append(toastMessage);
    
    const toastCloseBtn = document.createElement('button');
    toastCloseBtn.id = 'close-toast';
    toastContainer.append(toastCloseBtn);
    const toastCloseIcon = document.createElement('span');
    toastCloseIcon.className = 'material-icons';
    toastCloseIcon.textContent = 'close';
    toastCloseBtn.append(toastCloseIcon);
    addCloseBtnEventListener(type);
    
    setTimeout(() => {
        toastContainer.remove();
    }, 5000);
}

function addCloseBtnEventListener(type) {
    const closeToastBtn = document.getElementById('close-toast');
    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', () => {
            document.getElementById(TOAST_TYPES[type].id)?.remove();
        });
    }
}

function removeToastIfAlreadyiExsts() {
    Object.values(TOAST_TYPES).forEach(({ id }) => document.getElementById(id)?.remove());
}