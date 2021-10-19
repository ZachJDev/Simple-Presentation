// Automatically sets  slide IDs
const setSlideIds = (slideDeck) => {
    Array.from(slideDeck.children)
        .filter(element => {return element.classList.contains('row');})
        .map(row => {return Array.from(row.children);})
        .forEach((rowSlides, rowNum) => {
            rowSlides
                .forEach((slide, slideNum) => {slide.id = `slide-${rowNum + 1}-${slideNum + 1}`})
        })
}

const getMaxSlidesPerRow = (slideDeck) => {
    return Array.from(slideDeck.children)
        .filter(element => {
            return element.classList.contains('row');
        })
        .reduce((prev,element) => {
            return Math.max(element.children.length, prev)
        },0)
}
// Create room for correct bouncing animation
const setBodyWidth = (numOfSlides) => {
    document.body.style.width = `${(numOfSlides + 1) * 100}vw`
}

(() => {
    let slideDeck = document.querySelector('#slide-deck');
    setSlideIds(slideDeck);
    setBodyWidth(getMaxSlidesPerRow(slideDeck))
})();
