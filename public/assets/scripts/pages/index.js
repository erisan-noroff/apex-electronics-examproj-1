import { getAllProducts } from '../api/productApi.js';
import { ToastMessage } from '../components/toast-messages.js';
import { ButtonType } from '../components/buttons.js';

async function init() {
    try {
        const products = await getAllProducts();
        setTimeout(() => {
            const h1 = document.createElement('h1');
            h1.textContent = 'What We Offer';
            document.querySelector('.carousel-wrapper').prepend(h1);
            renderCarousel(products);
        }, 2000);
    } catch (error) {
        ToastMessage.apiDataLoadError();
    }
}

function renderCarousel(products) {
    const carousel = document.querySelector('.carousel');
    
    let carouselItems = [];
    for (let i = 0; i < products.length - 1; i++) {
        const carouselItem = document.createElement('a');
        carouselItem.classList.add('carousel-item');
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
    
    carouselNavigationButtons();
}

function carouselNavigationButtons() {
    const window = document.querySelector('.carousel-window');

    const buttonLeft = document.createElement('button');
    buttonLeft.type = ButtonType.Button;
    buttonLeft.classList.add('carousel-btn-prev');
    const arrowLeft = document.createElement('i');
    arrowLeft.classList.add('fa-solid', 'fa-arrow-down', 'fa-xl', 'fa-rotate-90');
    buttonLeft.append(arrowLeft);

    const buttonRight = document.createElement('button');
    buttonRight.type = ButtonType.Button;
    buttonRight.classList.add('carousel-btn-next');
    const arrowRight = document.createElement('i');
    arrowRight.classList.add('fa-solid', 'fa-arrow-down', 'fa-xl', 'fa-rotate-270');
    buttonRight.append(arrowRight);

    window.append(buttonLeft, buttonRight);
}


await init();