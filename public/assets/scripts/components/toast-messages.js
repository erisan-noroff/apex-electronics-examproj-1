const TOAST_TYPES = {
    success: {
        id: 'toast-success',
        icon: 'fa-solid fa-check fa-sm',
        altText: 'success alert'
    },
    error: {
        id: 'toast-error',
        icon: 'fa-solid fa-xmark fa-sm',
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
        displayToast('error', 'Unable to fetch data', 'An error occurred when fetching data.\nPlease refresh the page.');
    }
}

function displayToast(type, title, message) {
    // Avoids same toast from being displayed multiple times if the user spam clicks a button that triggers it.
    removeToastIfAlreadyiExsts();
    
    const main = document.querySelector('main');
    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container');
    toastContainer.id = TOAST_TYPES[type].id;
    main.prepend(toastContainer);
    
    const toastIndicator = document.createElement('span');
    toastIndicator.classList.add('toast-indicator', `${TOAST_TYPES[type].id}`);
    toastContainer.append(toastIndicator);
    
    const toastContent = document.createElement('div');
    toastContent.classList.add('toast-content');
    toastContainer.append(toastContent);
    
    const toastIconContainer = document.createElement('span');
    toastIconContainer.classList.add('toast-icon', `${TOAST_TYPES[type].id}`);
    
    const toastIcon = document.createElement('i');
    toastIcon.className = TOAST_TYPES[type].icon;
    toastIconContainer.append(toastIcon);
    toastContent.append(toastIconContainer);
    
    const toastText = document.createElement('div');
    toastText.classList.add('toast-text');
    toastContent.append(toastText);

    const toastTitle = document.createElement('p');
    toastTitle.classList.add('text-semibold');
    toastTitle.innerText = title;
    toastText.append(toastTitle);

    const toastMessage = document.createElement('p');
    toastMessage.classList.add('text-secondary');
    toastMessage.innerText = message;
    toastText.append(toastMessage);
    
    const toastCloseBtn = document.createElement('button');
    toastCloseBtn.id = 'close-toast';
    toastContainer.append(toastCloseBtn);
    const toastCloseIcon = document.createElement('i');
    toastCloseIcon.className = 'fa-solid fa-xmark';
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

function removeToastIfAlreadyiExsts(type) {
    document.getElementById(type)?.remove();
}