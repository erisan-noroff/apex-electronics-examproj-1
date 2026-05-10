import { getCart } from '../utils/cart.js';
import { getProductById } from '../api/productApi.js';

export async function Summary() {
    const cartItems = getCart();
    if (cartItems.length === 0) return;

    const cartSummary = document.createElement('aside');
    cartSummary.classList.add('summary');

    const header = document.createElement('h2');
    header.textContent = 'Summary'
    cartSummary.append(header);
    
    let totalRowsPrice = 0;
    for (let i = 0; i < cartItems.length; i++) {
        const rowData = await summaryRow(cartItems[i]);
        totalRowsPrice += rowData.price;
        cartSummary.append(rowData.row);
    }
    
    const subTotalRow = document.createElement('div');
    subTotalRow.classList.add('summary__fee-row');

    const subTotalLabel = document.createElement('p');
    subTotalLabel.textContent = 'Subtotal';

    const subTotalPriceElement = document.createElement('p');
    subTotalPriceElement.classList.add('summary__subtotal-price');
    subTotalPriceElement.textContent = formatTotalPrice(totalRowsPrice);
    subTotalRow.append(subTotalLabel, subTotalPriceElement);

    const shippingRow = document.createElement('div');
    shippingRow.classList.add('summary__fee-row');

    const shippingLabel = document.createElement('p');
    shippingLabel.textContent = 'Shipping';

    const shippingPrice = 49;
    const shippingPriceElement = document.createElement('p');
    shippingPriceElement.textContent = `${shippingPrice},-`;
    
    const totalRow = document.createElement('div');
    totalRow.classList.add('summary__total-row');

    const totalLabel = document.createElement('p');
    totalLabel.textContent = 'Total';

    const totalPriceElement = document.createElement('p');
    totalPriceElement.classList.add('summary__total-price');
    totalPriceElement.textContent = formatTotalPrice(totalRowsPrice + shippingPrice);

    totalRow.append(totalLabel, totalPriceElement);
    
    shippingRow.append(shippingLabel, shippingPriceElement);
    cartSummary.append(subTotalRow, shippingRow, totalRow);
    
    return cartSummary;
}

async function summaryRow(cartItem) {
    const { id: productId, quantity } = cartItem;
    const product = await getProductById(productId);
    
    const summaryRow = document.createElement('div');
    summaryRow.classList.add('summary__row');
    summaryRow.dataset.productId = productId;
    
    const quantityElement = document.createElement('p');
    quantityElement.classList.add('summary__row__quantity');
    quantityElement.textContent = `${quantity}x`;
    
    const title = document.createElement('p');
    title.classList.add('summary__row__product-title');
    title.textContent = product.title;
    
    const price = product.discountedPrice < product.price ? product.discountedPrice : product.price;
    const priceElement = document.createElement('p');
    priceElement.classList.add('summary__row__price');
    priceElement.textContent = `${price},-`;
    
    summaryRow.append(quantityElement, title, priceElement);
    
    return { row: summaryRow, price: price * quantity };
}

/**
 * Takes in productId and current quantity to update the Cart Summary
 * @param {string} productId
 * @param {number} newQuantity
 */
function updateCartSummaryRow(productId, newQuantity) {
    const row = document.querySelector(`.summary__row[data-product-id="${productId}"]`);
    if (!row) return;
    const quantityElement = row.querySelector('.summary__row__quantity');
    if (!quantityElement) return;

    const currentQuantity = parseInt(quantityElement.textContent);
    if (currentQuantity === newQuantity) return;

    quantityElement.textContent = `${newQuantity}x`;
    updateSubTotal();
}

function deleteSummaryRow(productId) {
    const row = document.querySelector(`.summary__row[data-product-id="${productId}"]`);
    if (!row) return;
    row.remove();
    updateSubTotal();
}

function updateSubTotal() {
    const rows = document.querySelectorAll('.summary__row');
    let subTotal = 0;
    for (let i = 0; i < rows.length; i++) {
        const unitPrice = parseFloat(rows[i].querySelector('.summary__row__price').textContent);
        const quantity = parseInt(rows[i].querySelector('.summary__row__quantity').textContent);
        subTotal += unitPrice * quantity;
    }
    
    const subTotalPriceEl = document.querySelector('.summary__subtotal-price');
    if (subTotalPriceEl) subTotalPriceEl.textContent = formatTotalPrice(subTotal);
}

/**
 * Formats the total price to the user's locale
 * @param {number} totalPrice
 * @returns {string}
 */
function formatTotalPrice(totalPrice) {
    return `${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2} )},-`;
}

export function cartSummaryListeners() {
    document.addEventListener('cart:updated', (e) => {
        const { productId, quantity, removed } = e.detail ?? {};
        if (!productId) return;
        if (removed) deleteSummaryRow(productId);
        else updateCartSummaryRow(productId, quantity);
    });
}