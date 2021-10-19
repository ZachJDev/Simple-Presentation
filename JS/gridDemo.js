document.querySelectorAll('.fun-grid .circle').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        element.classList.add('circle-grow');
        element.classList.add('front');
    })
})

document.querySelectorAll('.fun-grid .circle').forEach(element => {
    element.addEventListener('mouseleave', (e) => {
        element.classList.remove('circle-grow');
        setTimeout(() =>element.classList.remove('front'), 400)
    })
})