const footerTemplate = document.createElement('template');
footerTemplate.innerHTML = `
    <footer>Copyright © 2026 Apex Electronics</footer>
`;

class FooterComponent extends HTMLElement {
    connectedCallback() {
        this.appendChild(footerTemplate.content.cloneNode(true));
    }
}

customElements.define('footer-component', FooterComponent);