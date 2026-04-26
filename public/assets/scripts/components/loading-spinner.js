const loadingSpinnerTemplate = document.createElement('template');
loadingSpinnerTemplate.innerHTML = `
    <div class="loading-state content-gutters">
        <p>Fetching data...</p>
        <div class="loading-state__spinner"></div>
    </div>
`;

class LoadingSpinnerComponent extends HTMLElement {
    connectedCallback() {
        this.appendChild(loadingSpinnerTemplate.content.cloneNode(true));
    }
}

customElements.define('loading-spinner-component', LoadingSpinnerComponent);