// Base URL contains a list of all products. /<id> can be added to the URL to get a specific product.
const baseApiUrl = 'https://v2.api.noroff.dev/online-shop';

export async function getAllProducts() {
    const PRODUCT_TAGS = ['audio', 'headphones', 'electronics', 'watch', 'storage'];
    const response = await fetch(`${baseApiUrl}`);
    if (!response.ok) throw new Error();
    const data = (await response.json()).data;
    if (!data || data.length < 12) throw new Error();
    return data.filter(x => x.tags.some(tag => PRODUCT_TAGS.includes(tag)))
                         .sort((a, b) => PRODUCT_TAGS.findIndex(t => a.tags.includes(t)) - PRODUCT_TAGS.findIndex(t => b.tags.includes(t)));
}

export async function getProductById(id) {
    const response = await fetch(`${baseApiUrl}/${id}`);
    if (!response.ok) throw new Error();
    return (await response.json()).data;
}