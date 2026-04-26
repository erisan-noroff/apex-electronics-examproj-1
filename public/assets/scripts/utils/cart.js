export function getCart() {
    return JSON.parse(localStorage.getItem('cart') ?? '[]');
}

export function addItemToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct)
        existingProduct.quantity += 1;
    else
        cart.push({ id: product.id, quantity: 1 });
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function removeFromCart(product) {
    const cartMinusItem = getCart().filter(item => item.id !== product.id);
    localStorage.setItem('cart', JSON.stringify(cartMinusItem));
}

export function reduceCartItemQuantity(product) {
    const cart = getCart();
    const indexOfExistingProduct = cart.findIndex(item => item.id === product.id);
    if (indexOfExistingProduct === -1)
        return;
    
    if (cart[indexOfExistingProduct].quantity > 1) {
        cart[indexOfExistingProduct].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

export function emptyCart() {
    localStorage.removeItem('cart');
}

export function getCartItemCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
}