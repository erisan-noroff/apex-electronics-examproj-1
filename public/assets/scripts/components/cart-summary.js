import { getCart } from '../utils/cart.js';
import { getProductById } from '../api/productApi.js';

export async function CartSummary() {
    const cartSummary = document.querySelector('.cart-summary');
    if (!cartSummary) return;
    
    const header = document.createElement('h2');
    header.textContent = 'Summary'
    cartSummary.append(header);
    
    const cartItems = getCart();
    for (let i = 0; i < cartItems.length; i++) {
        const row = await summaryRow(cartItems[i]);
        cartSummary.append(row);
    }
}

async function summaryRow(cartItem) {
    const { id: productId, quantity } = cartItem;
    const product = await getProductById(productId);
    
    const summaryRow = document.createElement('div');
    summaryRow.classList.add('cart-summary__row');
    const quantityElement = document.createElement('p');
    quantityElement.textContent = `${quantity}x`;
    const title = document.createElement('p');
    title.textContent = product.title;
    const price = product.discountedPrice < product.price ? product.discountedPrice : product.price;
    const priceElement = document.createElement('p');
    priceElement.textContent = price;
    
    summaryRow.append(quantityElement, title, price);
    
    return summaryRow;
}