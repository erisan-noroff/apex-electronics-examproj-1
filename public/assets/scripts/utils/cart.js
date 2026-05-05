export function getCart() {
    return JSON.parse(localStorage.getItem('cart') ?? '[]');
}

export function addItemToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct)
        existingProduct.quantity = existingProduct.quantity < 999 ? existingProduct.quantity += 1 : 999;
    else
        cart.push({ id: product.id, quantity: 1 });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    cartUpdatedEventDispatch();
}

export function removeFromCart(product) {
    const cartMinusItem = getCart().filter(item => item.id !== product.id);
    localStorage.setItem('cart', JSON.stringify(cartMinusItem));
}

export function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (!item)
        return;

    item.quantity = Math.min(Math.max(quantity, 1), 999);
    localStorage.setItem('cart', JSON.stringify(cart));
    cartUpdatedEventDispatch();
}

export function emptyCart() {
    localStorage.removeItem('cart');
}

export function getCartItemCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function cartUpdatedEventDispatch() {
    document.dispatchEvent(new CustomEvent('cart:updated'));
}