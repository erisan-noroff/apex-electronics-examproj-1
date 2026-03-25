import { getAllProducts } from '../api/productApi.js';
import { ToastMessage } from '../components/toast-messages.js';
import { createRatingsElement } from '../components/ratings.js';
import { createPriceElement } from '../components/productPrice.js';

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
    const h1 = document.createElement('h1');
    h1.textContent = 'What We Offer';

    const carouselWrapper = document.createElement('section');
    carouselWrapper.classList.add('carousel-wrapper');
    const carouselWindow = document.createElement('div');
    carouselWindow.classList.add('carousel-window');
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');
    carouselWindow.appendChild(carousel);
    carouselWrapper.append(h1, carouselWindow);


    const carouselItems = products.map((product) => {
        const item = document.createElement('a');
        item.classList.add('carousel__item');
        item.href = new URL(`product.html?id=${product.id}`, window.location.href).toString();

        const image = document.createElement('img');
        image.src = product.image.url;
        image.alt = product.image.alt;
        item.appendChild(image);
        return item;
    });

    const cloneFirst = carouselItems[0].cloneNode(true);
    const cloneSecond = carouselItems[1].cloneNode(true);
    const cloneThird = carouselItems[2].cloneNode(true);
    const cloneSecondLast = carouselItems[carouselItems.length - 2].cloneNode(true);
    const cloneLast = carouselItems[carouselItems.length - 1].cloneNode(true);

    products.forEach(p => { new Image().src = p.image.url; });
    carousel.replaceChildren(cloneSecondLast, cloneLast, ...carouselItems, cloneFirst, cloneSecond, cloneThird);

    requestAnimationFrame(() => carouselNavigationButtons(carouselItems, carousel, carouselWindow));

    return carouselWrapper;
}

function renderGrid(products) {
    const section = document.createElement('section');
    section.classList.add('grid-wrapper');
    
    const h2 = document.createElement('h2');
    h2.textContent = 'Shop the Range';
    section.append(h2);
    
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

function carouselNavigationButtons(items, carousel, carouselWindow) {
    const count = items.length;
    let currentIndex = 0;
    let isAnimating = false;

    const getItemStep = () =>
        items[0].offsetWidth + parseFloat(getComputedStyle(items[0]).marginRight);

    function goTo(domIndex, animate) {
        const step = getItemStep();
        const peekOffset = (carouselWindow.offsetWidth % step) / 2;
        carousel.classList.toggle('carousel--animating', animate);
        if (!animate) void carousel.offsetWidth;
        carousel.style.setProperty('--offset', `${-(domIndex * step) + peekOffset}px`);
    }

    function onTransitionEnd(callback) {
        let settled = false;
        const settle = () => {
            if (settled) return;
            settled = true;
            callback();
        };

        const handler = (e) => {
            if (e.propertyName !== 'transform') return;
            carousel.removeEventListener('transitionend', handler);
            settle();
        };

        carousel.addEventListener('transitionend', handler);
        setTimeout(settle, 300);
    }

    goTo(2, false);

    window.addEventListener('resize', () => goTo(currentIndex + 2, false));

    function createNavigationButton(rotation, classNameSuffix) {
        const button = document.createElement('button');
        button.classList.add(`carousel__btn--${classNameSuffix}`);
        const arrow = document.createElement('i');
        arrow.classList.add('fa-solid', 'fa-arrow-down', 'fa-lg', `fa-rotate-${rotation}`);
        button.append(arrow);
        return button;
    }

    const buttonLeft = createNavigationButton(90, 'prev');
    const buttonRight = createNavigationButton(270, 'next');
    carouselWindow.append(buttonLeft, buttonRight);

    buttonLeft.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAnimating) return;
        isAnimating = true;
        if (currentIndex === 0) {
            goTo(1, true);
            onTransitionEnd(() => {
                goTo(count + 1, false);
                currentIndex = count - 1;
                isAnimating = false;
            });
            return;
        }

        currentIndex--;
        goTo(currentIndex + 2, true);
        onTransitionEnd(() => { isAnimating = false; });
    });

    buttonRight.addEventListener('click', (e) => {
        e.preventDefault();
        if (isAnimating) return;
        isAnimating = true;
        if (currentIndex === count - 1) {
            goTo(count + 2, true);
            onTransitionEnd(() => {
                goTo(2, false);
                currentIndex = 0;
                isAnimating = false;
            });
            return;
        }

        currentIndex++;
        goTo(currentIndex + 2, true);
        onTransitionEnd(() => { isAnimating = false; });
    });
}

await init();