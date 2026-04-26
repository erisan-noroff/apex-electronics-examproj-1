import { emptyCart, getCart, getCartItemCount } from '../utils/cart.js';
import { Button } from '../components/buttons.js';
import { getProductById } from '../api/productApi.js';
import { createPriceElement } from '../components/productPrice.js';

async function init() {
    await renderCartSectionContent();
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
        const cartItemsRow = await renderCartItemsRow(cartItems[i].id, cartItemsRowsContainer);
        cartItemsRowsContainer.append(cartItemsRow);
    } 
}

async function renderCartItemsRow(productId) {
    const cartItemsRow = document.createElement('div');
    cartItemsRow.classList.add('cart-items__row');
    const product = await getProductById(productId);
    
    const image = document.createElement('img');
    image.src = product.image.url;
    image.alt = product.image.alt;
    
    const cartItemsRowDetails = document.createElement('div');
    cartItemsRowDetails.classList.add('cart-items__row__details');
    
    const productName = document.createElement('p');
    productName.textContent = product.title;
    
    const price = createPriceElement(product.discountedPrice, product.price);
    
    cartItemsRowDetails.append(productName, price);
    
    cartItemsRow.append(image, cartItemsRowDetails);
    return cartItemsRow;
}

function renderEmptyCart(cartItemsSection) {
    cartItemsSection.classList.add('cart-items--empty');

    const cartIcon = document.createElement('span');
    cartIcon.classList.add('material-icons', 'cart-items--empty__icon');
    cartIcon.textContent = 'shopping_cart';

    const cartEmpty = document.createElement('p');
    cartEmpty.classList.add('cart-items--empty-text');
    cartEmpty.textContent = 'Nothing here yet!';

    const exploreOurShopBtn = Button('Explore our shop', 'primary-btn primary-btn--full');

    cartItemsSection.prepend(cartIcon);
    cartItemsSection.append(cartEmpty, exploreOurShopBtn);
}

function cartEmptyButtonElement() {
    const emptyCartButton = Button('Empty Cart', 'cart-items--empty-button');
    emptyCartButton.addEventListener('click', () => {
        emptyCart();
    });
    
    return emptyCartButton;
}

await init();