import { getAllProducts } from '../api/productApi.js';
import { ToastMessage } from '../components/toast-messages.js';
import { createRatingsElement } from '../components/ratings.js';
import { createPriceElement } from '../components/productPrice.js';
import { Button } from '../components/buttons.js';

function createNavigationButton(iconName, classNameSuffix) {
    const button = document.createElement('button');
    button.classList.add(`carousel-wrapper__btn--${classNameSuffix}`);
    const arrow = document.createElement('span');
    arrow.className = 'material-icons-outlined';
    arrow.textContent = iconName;
    button.append(arrow);
    return button;
}

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

    const mobileNav = document.createElement('div');
    mobileNav.classList.add('carousel-wrapper__item__mobile-nav');
    const mobilePrev = createNavigationButton('arrow_circle_left', 'mobile-prev');
    const mobileNext = createNavigationButton('arrow_circle_right', 'mobile-next');
    const mobileDots = document.createElement('div');
    mobileDots.classList.add('carousel-wrapper__item__mobile-nav__dots');
    
    for (let i = 0; i < carouselProducts.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-wrapper__inner__dot');
        if (i === 0) dot.classList.add('carousel-wrapper__inner__dot--active');
        mobileDots.append(dot);
    }
    
    mobileNav.append(mobilePrev, mobileDots, mobileNext);

    const carouselItems = carouselProducts.map((product) => {
        const item = document.createElement('div');
        item.classList.add('carousel-wrapper__item');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('carousel-wrapper__item__image-container');

        const productLink = document.createElement('a');
        productLink.href = new URL(`product.html?id=${product.id}`, window.location.href).toString();

        const image = document.createElement('img');
        image.alt = product.image.alt;
        image.onload = () => {
            if (image.naturalWidth < 600 || image.naturalHeight < 600)
                image.style.objectFit = 'none';
        };
        image.src = product.image.url;

        productLink.appendChild(image);
        imageContainer.append(productLink);

        const content = document.createElement('div');
        content.classList.add('carousel-wrapper__item__content');

        const productName = document.createElement('h2');
        productName.textContent = product.title;
        content.append(productName);

        const description = document.createElement('p');
        description.classList.add('product-description');
        description.textContent = product.description;
        content.append(description);

        const price = createPriceElement(product.discountedPrice, product.price);
        price.children[0].classList.add('discounted-price');
        content.append(price);

        const button = Button('View Product', 'primary-btn carousel-wrapper__item__btn');
        button.dataset.productId = product.id;
        content.append(button);

        item.append(imageContainer, content);
        return item;
    });
    
    const desktopDots = document.createElement('div');
    desktopDots.classList.add('carousel-wrapper__inner__dots--desktop');
    for (let i = 0; i < carouselProducts.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-wrapper__inner__dot');
        if (i === 0) dot.classList.add('carousel-wrapper__inner__dot--active');
        desktopDots.append(dot);
    }

    carouselInner.replaceChildren(...carouselItems);
    carouselWrapper.appendChild(carouselInner);
    carouselWrapper.appendChild(desktopDots);

    carouselNavigationButtons(carouselItems, carouselWrapper, mobileNav);
    return carouselWrapper;
}

function renderGrid(products) {
    const section = document.createElement('section');
    section.classList.add('grid-wrapper', 'content-gutters');

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

function carouselNavigationButtons(items, carousel, mobileNav) {
    let currentIndex = 0;

    items[0].classList.add('carousel-wrapper__item--active');
    items[0].insertBefore(mobileNav, items[0].querySelector('.carousel-wrapper__item__content'));

    const allDots = carousel.getElementsByClassName('carousel-wrapper__inner__dot');

    function goTo(index) {
        items[currentIndex].classList.remove('carousel-wrapper__item--active');
        allDots[currentIndex].classList.remove('carousel-wrapper__inner__dot--active');
        allDots[currentIndex + items.length].classList.remove('carousel-wrapper__inner__dot--active');

        currentIndex = (index + items.length) % items.length;

        items[currentIndex].classList.add('carousel-wrapper__item--active');
        allDots[currentIndex].classList.add('carousel-wrapper__inner__dot--active');
        allDots[currentIndex + items.length].classList.add('carousel-wrapper__inner__dot--active');
        items[currentIndex].insertBefore(mobileNav, items[currentIndex].querySelector('.carousel-wrapper__item__content'));
    }

    const buttonLeft = createNavigationButton('arrow_circle_left', 'prev');
    const buttonRight = createNavigationButton('arrow_circle_right', 'next');
    carousel.append(buttonLeft, buttonRight);

    const [mobilePrev, mobileNext] = mobileNav.querySelectorAll('button');

    buttonLeft.addEventListener('click', (e) => { e.preventDefault(); goTo(currentIndex - 1); });
    buttonRight.addEventListener('click', (e) => { e.preventDefault(); goTo(currentIndex + 1); });
    mobilePrev.addEventListener('click', (e) => { e.preventDefault(); goTo(currentIndex - 1); });
    mobileNext.addEventListener('click', (e) => { e.preventDefault(); goTo(currentIndex + 1); });
}

await init();