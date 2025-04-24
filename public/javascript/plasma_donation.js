// JavaScript to trigger animations when elements enter the viewport

document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('.animated');

    function checkScroll() {
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight) {
                element.classList.add('active');
            }
        });
    }

    // Initial check when the page loads
    checkScroll();

    // Check every time the user scrolls
    window.addEventListener('scroll', checkScroll);
});
