export function createStarsElement(rating) {
    const stars = document.createElement('div');
    stars.classList.add('ratings');

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= Math.floor(rating))
            star.classList.add('fa-solid', 'fa-star');
        else
            star.classList.add('fa-regular', 'fa-star');
        stars.appendChild(star);
    }

    return stars;
}

export function createRatingsElement(rating, reviews) {
    const reviewRow = document.createElement('div');
    reviewRow.classList.add('review-row');

    const ratingsCount = document.createElement('p');
    ratingsCount.textContent = `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`;
    ratingsCount.classList.add('text-secondary');

    reviewRow.appendChild(createStarsElement(rating));
    reviewRow.appendChild(ratingsCount);

    return reviewRow;
}