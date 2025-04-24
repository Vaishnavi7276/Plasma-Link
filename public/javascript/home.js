
// Function to check if an element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle scrolling
function handleScroll() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        if (isInViewport(box)) {
            box.classList.add('slide-in');
        } else {
            box.classList.remove('slide-in');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

// Initial check on page load
handleScroll();

