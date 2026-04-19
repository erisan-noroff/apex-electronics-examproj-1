import { getAllProducts } from '../api/productApi.js';
import { ToastMessage } from '../components/toast-messages.js';
import { createRatingsElement } from '../components/ratings.js';
import { createPriceElement } from '../components/productPrice.js';
import { Button } from '../components/buttons.js';

async function init() {
    try {
        const products = await getAllProducts();

        setTimeout(() => {
            const carouselWrapper = renderCarousel(products);
            const gridSection = renderGrid(products);

            document.querySelector('main').replaceChildren(carouselWrapper, gridSection);
        }, 2000);
    } catch (error) {
        ToastMessage.apiDataLoadError();
    }
}

function renderCarousel(products) {
    const carouselWrapper = document.createElement('section');
    carouselWrapper.classList.add('carousel-wrapper');
    const carouselInner = document.createElement('div');
    carouselInner.classList.add('carousel-wrapper__inner');
    const discounted = products.filter(p => p.discountedPrice < p.price);
    const carouselProducts = discounted.slice(0, 3);

    const carouselItems = carouselProducts.map((product) => {
        const item = document.createElement('div');
        item.classList.add('carousel-wrapper__item');
        
        const anchorElement = document.createElement('a');
        anchorElement.href = new URL(`product.html?id=${product.id}`, window.location.href).toString();
        item.append(anchorElement);
        
        const image = document.createElement('img');
        image.src = product.image.url;
        image.alt = product.image.alt;
        anchorElement.appendChild(image);
        
        const content = document.createElement('div');
        content.classList.add('carousel-wrapper__item__content');
        item.append(content);
        
        const productName = document.createElement('h2');
        productName.textContent = product.title;
        content.append(productName);
        
        const description = document.createElement('p');
        description.textContent = product.description;
        content.append(description);
        
        const price = createPriceElement(product.discountedPrice, product.price);
        price.children[0].classList.add('carousel-wrapper__item__content__discounted-price');
        content.append(price);
        
        const button = Button('View Product', 'primary-btn carousel-wrapper__item__btn');
        button.dataset.productId = product.id;
        content.append(button);
        
        return item;
    });

    carouselInner.replaceChildren(...carouselItems);
    carouselWrapper.appendChild(carouselInner);
    
    requestAnimationFrame(() => carouselNavigationButtons(carouselItems, carouselWrapper));
    return carouselWrapper;
}

function renderGrid(products) {
    const section = document.createElement('section');
    section.classList.add('grid-wrapper');
    
    const h1 = document.createElement('h1');
    h1.textContent = 'What We Offer';
    section.append(h1);
    
    const divGrid = document.createElement('div');
    divGrid.classList.add('grid');
    section.append(divGrid);

    
    const cards = products.map((product) => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        
        const productUrl = document.createElement('a');
        productUrl.href = new URL(`product.html?id=${product.id}`, window.location.href).toString();

        const image = document.createElement('img');
        image.src = product.image.url;
        image.alt = product.image.alt;
        productUrl.append(image);

        const title = document.createElement('p');
        title.classList.add('product-card__title');
        title.textContent = product.title;
        
        const reviews = createRatingsElement(product.rating, product.reviews);
        const price = createPriceElement(product.discountedPrice, product.price);

        card.append(productUrl, title, reviews, price);
        return card;
    });

    divGrid.append(...cards);

    return section;
}

function carouselNavigationButtons(items, carousel) {
    let currentIndex = 0;

    items[0].classList.add('carousel-wrapper__item--active');

    function goTo(index) {
        items[currentIndex].classList.remove('carousel-wrapper__item--active');
        currentIndex = (index + items.length) % items.length;
        items[currentIndex].classList.add('carousel-wrapper__item--active');
    }

    function createNavigationButton(iconName, classNameSuffix) {
        const button = document.createElement('button');
        button.classList.add(`carousel-wrapper__btn--${classNameSuffix}`);
        const arrow = document.createElement('span');
        arrow.className = 'material-icons-outlined';
        arrow.textContent = iconName;
        button.append(arrow);
        return button;
    }

    const buttonLeft = createNavigationButton('arrow_circle_left', 'prev');
    const buttonRight = createNavigationButton('arrow_circle_right', 'next');
    carousel.append(buttonLeft, buttonRight);

    buttonLeft.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(currentIndex - 1);
    });

    buttonRight.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(currentIndex + 1);
    });
}

await init();