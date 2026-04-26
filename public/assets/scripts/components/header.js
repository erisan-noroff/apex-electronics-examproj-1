import { isAuthenticated } from '../utils/authentication.js';
import { CartButton } from './buttons.js';

const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
    <header>
        <a href="index.html"><span class="logo">Apex Electronics</span></a>
        <nav class="desktop-menu">
            <ul>
                <li><a href="index.html">Products</a></li>
                ${!isAuthenticated() ? '<li><a href="sign-in.html">Login</a></li>' : ''}
                <li id="cart-btn-container"></li>
            </ul>
        </nav>
        <button id="toggle-mobile-menu" class="mobile-menu-toggle" aria-label="Menu" type="button">
            <span class="material-icons mobile-menu-toggle__icon">menu</span>
        </button>
        <nav class="mobile-nav">
            <a href="index.html"><span class="material-icons">devices</span>Products</a>
            ${!isAuthenticated() ? '<a href="sign-in.html"><span class="material-icons">login</span> Sign in</a>' : ''}
            <a href="cart.html"><span class="material-icons cart-btn">shopping_cart</span> Cart</a>
        </nav>
    </header>
`;

class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.appendChild(headerTemplate.content.cloneNode(true));
        document.getElementById('cart-btn-container').appendChild(CartButton());
        this.addEventListenerCartButtons();
        this.addEventListenerMobileMenu();
    }
    
    addEventListenerCartButtons() {
        const btn = this.querySelector('.cart-btn');
        btn.addEventListener('click', () => {
            window.location.href = new URL('cart.html', window.location.href).toString();
        });
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
