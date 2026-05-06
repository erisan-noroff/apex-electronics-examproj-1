import {emptyCart, getCart, getCartItemCount, removeFromCart, updateCartItemQuantity} from '../utils/cart.js';
import { Button } from '../components/buttons.js';
import { getProductById } from '../api/productApi.js';
import { PriceElement } from '../components/productPrice.js';
import { CartSummary } from '../components/cart-summary.js';

async function init() {
    await renderCartSectionContent();
    await CartSummary();
    const proceedToCheckoutBtn = proceedToCheckoutBtnElement();
    const cartSummary = document.querySelector('.cart-summary');
    cartSummary.append(proceedToCheckoutBtn);
}

async function renderCartSectionContent() {
    const itemsInCartCount = getCartItemCount();
    const cartItemsSection = document.querySelector('.cart-items');
    
    if (itemsInCartCount === 0)
        return renderEmptyCart(cartItemsSection);

    const cartItemsHeader = document.querySelector('.cart-items__header');
    const emptyCartButton = cartEmptyButtonElement();    
    cartItemsHeader.append(emptyCartButton);
    
    const cartItemsRowsContainer = document.createElement('div');
    cartItemsRowsContainer.classList.add('cart-items__rows');
    cartItemsSection.append(cartItemsRowsContainer);
    
    const cartItems = getCart();
    for (let i = 0; i < cartItems.length; i++) {
        const cartItemsRow = await renderCartItemsRow(cartItems[i]);
        cartItemsRowsContainer.append(cartItemsRow);
    } 
}

async function renderCartItemsRow(cartItem) {
    const cartItemsRow = document.createElement('div');
    cartItemsRow.classList.add('cart-items__row');
    const { id: productId, quantity } = cartItem;
    const product = await getProductById(productId);
    
    const image = document.createElement('img');
    image.src = product.image.url;
    image.alt = product.image.alt;
    
    const cartItemsRowDetails = document.createElement('div');
    cartItemsRowDetails.classList.add('cart-items__row__details');
    
    const productName = document.createElement('p');
    productName.textContent = product.title;
    
    const price = PriceElement(product.discountedPrice, product.price);
    
    const quantityControls = document.createElement('div');
    quantityControls.classList.add('cart-items__row__quantity');
    
    const reduceQuantityButton = Button('');
    const reduceQuantityIcon = document.createElement('span');
    reduceQuantityIcon.classList.add('material-icons');
    reduceQuantityIcon.textContent = 'remove';
    reduceQuantityIcon.id = 'reduce-quantity';
    reduceQuantityButton.append(reduceQuantityIcon);
    
    const increaseQuantityButton = Button('');
    const increaseQuantityIcon = document.createElement('span');
    increaseQuantityIcon.classList.add('material-icons');
    increaseQuantityIcon.textContent = 'add';
    increaseQuantityIcon.id = 'increase-quantity';
    increaseQuantityButton.append(increaseQuantityIcon);
    
    const quantityInput = document.createElement('input');
    quantityInput.classList.add('cart-items__quantity-input');
    quantityInput.inputMode = 'numeric';
    quantityInput.maxLength = 3;
    quantityInput.value = quantity;

    const removeCartItemButton = Button('Remove');

    reduceQuantityButton.addEventListener('click', changeQuantityHandler(productId, quantityInput, -1));
    increaseQuantityButton.addEventListener('click', changeQuantityHandler(productId, quantityInput, 1));
    removeCartItemButton.addEventListener('click', removeFromCartHandler(product, cartItemsRow));
    const { onFocus, onInput } = createQuantityInputHandlers(productId);
    quantityInput.addEventListener('focus', onFocus);
    quantityInput.addEventListener('input', onInput);
    
    quantityControls.append(reduceQuantityButton, quantityInput, increaseQuantityButton);
    cartItemsRowDetails.append(productName, price);
    cartItemsRow.append(image, cartItemsRowDetails, quantityControls, removeCartItemButton);
    return cartItemsRow;
}

function changeQuantityHandler(productId, quantityInput, delta) {
    return () => {
        const newQuantity = parseInt(quantityInput.value) + delta;
        if (newQuantity < 1 || newQuantity > 999) return;
        updateCartItemQuantity(productId, newQuantity);
        quantityInput.value = newQuantity.toString();
    };
}

function removeFromCartHandler(product, cartItemsRow) {
    return () => {
        removeFromCart(product);
        cartItemsRow.remove();

        if (getCartItemCount() === 0) {
            document.querySelector('.cart-items__rows')?.remove();
            document.querySelector('.cart-items--empty-button')?.remove();
            renderEmptyCart(document.querySelector('.cart-items'));
        }
    };
}

function createQuantityInputHandlers(productId) {
    let timeout;
    let originalValue;

    return {
        onFocus(e) {
            originalValue = e.currentTarget.value;
        },
        onInput(e) {
            const input = e.currentTarget;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                let value = parseInt(input.value);
                if (!input.value || isNaN(value)) {
                    input.value = originalValue;
                    return;
                }
                value = Math.max(1, Math.min(999, value));
                input.value = value;
                updateCartItemQuantity(productId, value);
            }, 500);
        }
    };
}

function renderEmptyCart(cartItemsSection) {
    cartItemsSection.classList.add('cart-items--empty');

    const cartIcon = document.createElement('span');
    cartIcon.classList.add('material-icons', 'cart-items--empty__icon', 'text-secondary');
    cartIcon.textContent = 'shopping_cart';

    const cartEmpty = document.createElement('p');
    cartEmpty.classList.add('cart-items--empty-text', 'text-secondary');
    cartEmpty.textContent = 'Nothing here yet!';

    const exploreOurShopBtn = Button('Explore our shop', 'primary-btn primary-btn--full');

    cartItemsSection.prepend(cartIcon);
    cartItemsSection.append(cartEmpty, exploreOurShopBtn);
}

function cartEmptyButtonElement() {
    const emptyCartButton = Button('Empty Cart', 'cart-items--empty-button text-secondary text-underline');
    emptyCartButton.addEventListener('click', () => {
        emptyCart();
    });
    
    return emptyCartButton;
}

function proceedToCheckoutBtnElement() {
    const proceedToCheckoutBtn = Button('Proceed to Checkout', 'primary-btn primary-btn--full');
    return proceedToCheckoutBtn;
}

await init();