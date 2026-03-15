const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
    <header>
        <span class="logo">Apex Electronics</span>
        <nav class="desktop-menu">
            <ul>
                <li><a href="index.html">Products</a></li>
                <li><a href="login.html">Login</a></li>
                <!-- Uncomment when Log In and Checkout is implemented -->
                <!--<i class="fa-solid fa-cart-shopping"></i>-->
            </ul>
        </nav>
        <button id="toggle-mobile-menu" class="mobile-menu-toggle" aria-label="Menu" type="button">
            <i class="fa-solid fa-bars mobile-menu-toggle__icon"></i>
        </button>
        <nav class="mobile-nav">
            <a href="index.html">Products</a>
            <a href="login.html">Login</a>
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
