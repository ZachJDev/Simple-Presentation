class ScrollHandler {
    constructor(x = 0, y = 0) {
        this.xOffset = x;
        this.yOffset = y;
    }
    scrollLeft () {
        this.xOffset--
    }
    scrollRight () {
        this.xOffset++
    }
    scrollUp () {
        this.yOffset--
    }
    scrollDown (){
        this.yOffset++
    }
    getScrollOffset () {

        return {
            xOffset: this.xOffset,
            yOffset: this.yOffset
        }
    }
    setScrollState(x,y) {
        this.xOffset = x;
        this.yOffset = y;
    }
}

//Returns an Array: [y,x], of ordinal slide numbers
const getSlideNumbers = (slideId) => slideId.split('-').slice(1)

// Retrieves the current scroll position from localStorage or resets it
const currentScroll = JSON.parse(localStorage.getItem('scrollPos')) || {xOffset: 0, yOffset: 0};

const scrollHandler = new ScrollHandler(currentScroll.xOffset, currentScroll.yOffset);

// Corresponds to different CSS class names to animate the bounce at the edges.
const animationDirectionByXYChange =  {
    '0-1': 'bounce-right',
    '0--1': 'bounce-left',
    '1-0':'bounce-down',
    '-1-0':  'bounce-up'
}
// Hardcoded scroll handling. Keys are keyboard keys.
const scrollByKey = {
    'ArrowLeft': scrollHandler.scrollLeft,
    'ArrowRight': scrollHandler.scrollRight,
    'ArrowUp': scrollHandler.scrollUp,
    'ArrowDown': scrollHandler.scrollDown,
    '1': () => scrollHandler.setScrollState(0, 0),
    '2':  () => scrollHandler.setScrollState(0, 1),
    '3':  () => scrollHandler.setScrollState(0, 2),
    '4':  () => scrollHandler.setScrollState(0, 3),
    '5':  () => scrollHandler.setScrollState(0, 4),
    '6': () => scrollHandler.setScrollState(0, 5),
    '7':  () => scrollHandler.setScrollState(0, 6),
    '8':  () => scrollHandler.setScrollState(0, 7),
    '9': () => scrollHandler.setScrollState(0, 8)
}

const setScrollStorage = () => {
    localStorage.setItem('scrollPos', JSON.stringify(scrollHandler.getScrollOffset()))
}


const getClientSlideHeightWidth = () => {
    const slide1 = document.getElementById(`slide-1-1`)
    return {
        slideHeight: slide1.clientHeight,
        slideWidth: slide1.clientWidth
    }
}

const getParentSlide = (element) => {
    if (element === document.body) {return false}
    else if(element.classList.contains('slide')){return element}
    else {return getParentSlide(element.parentElement);}
}

const getSlideByOffset = (slideOffsets) => {
    // + 1 for offset vs ordinal numbers
    return document
        .getElementById(`slide-${slideOffsets.yOffset + 1}-${slideOffsets.xOffset + 1}`)
}

const isValidSlide = (slideOffsets) => {return getSlideByOffset(slideOffsets) !== null;}

const scrollTo = (slideXOffset, slideYOffset) => {
    // Check size every time in case window is resized
    let {slideHeight, slideWidth} = getClientSlideHeightWidth()
    window.scroll({
        top: slideYOffset * slideHeight,
        left: slideXOffset * slideWidth,
        behavior: 'smooth',
    })
    setScrollStorage()
}

const scrollToCurrent = () => {scrollTo(scrollHandler.xOffset, scrollHandler.yOffset)}


const handleKeyNav =  (e) => {
   let prevState = scrollHandler.getScrollOffset();
   try {
       scrollByKey[e.key].bind(scrollHandler)()
   } catch (error) {} // Fail silently for any other keys.
    if (isValidSlide(scrollHandler.getScrollOffset())) {
        scrollTo(scrollHandler.xOffset, scrollHandler.yOffset);
    } else {
        animateBounce(scrollHandler.yOffset - prevState.yOffset, scrollHandler.xOffset - prevState.xOffset);
        scrollHandler.setScrollState(prevState.xOffset, prevState.yOffset);
    }
};


const handleTabScroll = () => {
        let [y, x] = getSlideNumbers(getParentSlide(document.activeElement).id)
        scrollHandler.setScrollState(
            parseInt(x) - 1, // offsets are zero-based, while slide ids are ordinal; -1 to rectify.
            parseInt(y) - 1)
        scrollTo(scrollHandler.xOffset, scrollHandler.yOffset)
}

const animateBounce = (x, y) => {
    let animationClass = animationDirectionByXYChange[`${x}-${y}`]
    document.body.classList.add(animationClass);
    setTimeout(() => {
        document.body.classList.remove(animationClass);
    }, 200);
}

///// Event Listeners /////

document.addEventListener('keyup', (e) => {
        if(e.key === 'Tab') {
            handleTabScroll();
        }
})

document.addEventListener('keydown', (e) => {
   if (e.target.tagName !== 'INPUT') { // Don't want to move when someone is typing something!
       handleKeyNav(e);
   }
})

/*
* Handle setting the scroll state when following in-page anchor tags.
* This all requires following the naming conventions carefully!
* */

document.querySelectorAll('a').forEach(el => {
    el.addEventListener('click', (e) => {
        let [y, x] = getSlideNumbers(e.currentTarget.attributes.href.value);
        scrollHandler.setScrollState(parseInt(x) - 1, parseInt(y) - 1) // Ordinal vs offset
    })
})

window.addEventListener('resize', () => {
    scrollToCurrent()
})

