import { getAllProducts } from '../api/productApi.js';
import { ToastMessage } from '../components/toast-messages.js';

async function init() {
    try {
        const products = await getAllProducts();
        setTimeout(() => {
            const h1 = document.createElement('h1');
            h1.textContent = 'What We Offer';
            document.querySelector('.products-carousel-wrapper').prepend(h1);
            renderCarousel(products);
        }, 2000);
    } catch (error) {
        ToastMessage.apiDataLoadError();
    }
}

function renderCarousel(products) {
    const carousel = document.querySelector('.products-carousel');
    
    let carouselItems = [];
    for (let i = 0; i < products.length - 1; i++) {
        const carouselItem = document.createElement('a');
        carouselItem.classList.add('product-carousel-item');
        carouselItem.href = new URL(`product.html?id=${products[i].id}`, window.location.href).toString();
        
        const image = document.createElement('img');
        image.src = products[i].image.url;
        image.alt = products[i].image.alt;
        carouselItem.appendChild(image);
        carouselItems.push(carouselItem);
    }
    
    carouselItems.unshift(carouselItems[0].cloneNode(true));
    carouselItems.push(carouselItems[products.length - 1].cloneNode(true))
    carousel.replaceChildren(...carouselItems);
}

await init();