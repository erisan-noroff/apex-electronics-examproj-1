// Base URL contains a list of all products. /<id> can be added to the URL to get a specific product.
const baseApiUrl = 'https://v2.api.noroff.dev/online-shop';

export async function getAllProducts() {
    const PRODUCT_TAGS = ['audio', 'electronics', 'headphones', 'storage', 'watch'];
    const response = await fetch(`${baseApiUrl}`);
    if (!response.ok) throw new Error();
    const data = (await response.json()).data.filter(x => PRODUCT_TAGS.some(tag => x.tags.includes(tag)));
    if (!data || data.length < 12) throw new Error();
    console.log(data);
    return data;
}

export async function getProductById(id) {
    const response = await fetch(`${baseApiUrl}/${id}`);
    if (!response.ok) throw new Error();
    return (await response.json()).data;
}