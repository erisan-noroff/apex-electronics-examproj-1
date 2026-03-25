import { isAuthenticated } from '../utils/authentication.js';

const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
    <header>
        <a href="index.html"><span class="logo">Apex Electronics</span></a>
        <nav class="desktop-menu">
            <ul>
                <li><a href="index.html">Products</a></li>
                ${!isAuthenticated() ? '<li><a href="signin.html">Login</a></li>' : ''}
                <!-- Non-functional/not yet implemeneted. -->
                <li><i class="fa-solid fa-cart-shopping"></i></li>
            </ul>
        </nav>
        <button id="toggle-mobile-menu" class="mobile-menu-toggle" aria-label="Menu" type="button">
            <i class="fa-solid fa-bars mobile-menu-toggle__icon"></i>
        </button>
        <nav class="mobile-nav">
            <a href="index.html">Products</a>
            ${!isAuthenticated() ? '<a href="signin.html">Login</a>' : ''}
            <!-- Non-functional/not yet implemented. -->
            <a href="#"><i class="fa-solid fa-cart-shopping"></i> Cart</a>
        </nav>
    </header>
`;

class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.appendChild(headerTemplate.content.cloneNode(true));
        this.addEventListenerMobileMenu();
    }

    addEventListenerMobileMenu() {
        const btn = this.querySelector('#toggle-mobile-menu');
        const mobileNav = this.querySelector('.mobile-nav');

        btn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('mobile-nav--open');
            btn.setAttribute('aria-expanded', isOpen);
        });
    }
}

customElements.define('header-component', HeaderComponent);
