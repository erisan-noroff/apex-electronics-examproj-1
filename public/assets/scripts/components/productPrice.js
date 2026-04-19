export function createPriceElement(discountedPrice, price) {
    const priceElement = document.createElement('p');
    if (discountedPrice < price) {
        const discountedPriceElement = document.createElement('span');
        discountedPriceElement.classList.add('discounted-price');
        discountedPriceElement.textContent = `${discountedPrice},- `;
        const originalPriceElement = document.createElement('span');
        originalPriceElement.textContent = `${price}`;
        originalPriceElement.classList.add('original-price');
        priceElement.appendChild(discountedPriceElement);
        priceElement.appendChild(originalPriceElement);
    } else priceElement.textContent = `${price},-`;

    return priceElement;
}