import { getProductById } from '../api/productApi.js';
import { ToastMessage } from '../components/toast-messages.js';
import { createRatingsElement, createStarsElement } from '../components/ratings.js';
import { PrimaryButton } from '../components/buttons.js';
import { isAuthenticated } from '../utils/authentication.js';

const main = document.querySelector('main');
async function init() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
        try {
            const product = await getProductById(id);
            setTimeout(() => {
                renderProduct(product);
            }, 2000);
        } catch {
            ToastMessage.apiDataLoadError();
            renderNotFound();
        }
    } else renderNotFound();
}

function renderNotFound() {
    const wrapper = document.createElement('div');
    const errorText = document.createElement('h1');
    const backToHomeLink = document.createElement('a');

    wrapper.appendChild(errorText);
    wrapper.appendChild(backToHomeLink);
    errorText.textContent = 'Product not found';
    backToHomeLink.textContent = 'Back to home';
    backToHomeLink.href = new URL('index.html', window.location.href).toString();

    main.replaceChildren(wrapper);
}

function renderProduct(product) {
    const section = document.createElement('section');
    section.classList.add('product-info-wrapper');
    
    const image = document.createElement('img');
    image.src = product.image.url;
    image.alt = product.image.alt;
    section.appendChild(image);
    
    const productInfoContent = document.createElement('div');
    productInfoContent.classList.add('product-info-content');
    section.appendChild(productInfoContent);
    
    const productName = document.createElement('h1');
    productName.textContent = product.title;
    productInfoContent.appendChild(productName);
    
    const productInfoPriceRatings = document.createElement('div');
    productInfoPriceRatings.classList.add('product-info-price-ratings');
    const price = createPriceElement(product.discountedPrice, product.price);
    productInfoPriceRatings.appendChild(price);
    productInfoContent.appendChild(productInfoPriceRatings);
    
    const reviewRow = createRatingsElement(product.rating, product.reviews);
    productInfoPriceRatings.appendChild(reviewRow);
    main.replaceChildren(section);
    
    const description = document.createElement('p');
    description.textContent = product.description;
    description.classList.add('product-description');
    productInfoContent.appendChild(description);

    const tags = productTagsElements(product.tags);
    productInfoContent.appendChild(tags);
    
    if (product.reviews.length > 0) renderProductReviews(product.rating, product.reviews);
    
    if (!isAuthenticated())
    {
        const button = addToCart();
        productInfoContent.appendChild(button);
    }
    
    const share = shareLinkElement(product.id);
    productInfoContent.appendChild(share);
}

function productTagsElements(tags) {
    const tagsElement = document.createElement('div');
    tagsElement.classList.add('product-tags');

    for (let i = 0; i < tags.length; i++) {
        const tag = document.createElement('span');
        tag.textContent = tags[i];
        tag.classList.add('product-tags__tag');
        tagsElement.appendChild(tag);
    }
    
    return tagsElement;
}

function addToCart() {
    const button = PrimaryButton('Add to Cart', 'button', 'add-to-cart');
    
    button.addEventListener('click', () => {
        ToastMessage.success('Added to cart', 'Product has been added to your cart');
    });
    
    return button;
}

function shareLinkElement(productId) {
    const share = document.createElement('button');
    share.classList.add('share-link');
    const titleAndAriaLabel = 'Copy product link to clipboard';
    share.setAttribute('aria-label', titleAndAriaLabel);
    share.title = titleAndAriaLabel;

    const shareIcon = document.createElement('i');
    shareIcon.classList.add('fa-solid', 'fa-link');
    
    share.appendChild(shareIcon);
    const shareText = document.createTextNode('Share');
    share.appendChild(shareText);

    share.addEventListener('click', () => {
        const url = new URL(`product.html?id=${productId}`, window.location.href).toString();
        navigator.clipboard.writeText(url).then(() => {
            share.classList.add('share-link--copied');
            shareText.nodeValue = 'Copied to clipboard';
            setTimeout(() => {
                shareText.nodeValue = 'Share';
                share.classList.remove('share-link--copied');
            }, 3000);
        }).catch(() => {
            ToastMessage.error('Copy failed','Failed to copy link to clipboard');
        });
    });
    
    return share;
}

function renderProductReviews(rating, reviews) {
    const main = document.querySelector('main');
    const reviewsSection = document.createElement('section');
    reviewsSection.classList.add('product-reviews');
    main.appendChild(reviewsSection);
    
    const reviewsTitle = document.createElement('h2');
    reviewsTitle.textContent = 'Product Reviews';
    reviewsSection.appendChild(reviewsTitle);
    
    for (let i = 0; i < reviews.length; i++) {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('product-review');
        reviewsSection.appendChild(reviewElement);
        
        const reviewRow = document.createElement('div');
        reviewRow.classList.add('product-review__row');
        reviewElement.appendChild(reviewRow);
        
        const reviewer = document.createElement('p');
        reviewer.textContent = reviews[i].username;
        reviewRow.appendChild(reviewer);
        
        const ratings = createStarsElement(rating);
        reviewRow.appendChild(ratings);
        
        const comment = document.createElement('p');
        comment.textContent = reviews[i].description;
        reviewsSection.appendChild(comment);
    }
}

function createPriceElement(discountedPrice, price) {
    const priceElement = document.createElement('p');
    if (discountedPrice < price) {
        const discountedPriceElement = document.createElement('span');
        discountedPriceElement.textContent = `${discountedPrice},- `;
        discountedPriceElement.classList.add('discounted-price');
        const originalPriceElement = document.createElement('span');
        originalPriceElement.textContent = `${price}`;
        originalPriceElement.classList.add('original-price');
        priceElement.appendChild(discountedPriceElement);
        priceElement.appendChild(originalPriceElement);
    } else priceElement.textContent = `${price},-`;
    
    return priceElement;
}

await init();