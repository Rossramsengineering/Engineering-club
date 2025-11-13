// Carousel data
const carouselProducts = [
    {
        image: 'Images/product/LedSign.png',
        title: 'Custom LED Sign',
        description: 'Personalize your space with a unique, laser-engraved LED sign.',
        price: '$20.00',
        url: 'product/led.html'
    },
    {
        image: 'Images/product/octopus.png',
        title: '3D Printed Octopus',
        description: 'A cute and colorful 3D-printed fidget octopus in your choice of colors.',
        price: '$5.00',
        url: 'product/octopus.html'
    },
    {
        image: 'Images/product/Cuttingboard.png',
        title: 'Custom Chopping Board',
        description: 'Handcrafted laser-engraved chopping board with your custom design.',
        price: '$30.00',
        url: 'product/choppingboard.html'
    },
    {
        image: 'Images/product/spiralBall.png',
        title: 'Fidget Ball',
        description: 'Stress-relief spiral fidget ball available in multiple color combinations.',
        price: '$2.00',
        url: 'product/fidgetBall.html'
    },
    {
        image: 'Images/product/Christmastree.png',
        title: 'Christmas Tree Ornament',
        description: 'Festive 3D-printed ornament perfect for holiday decorations.',
        price: '$5.00',
        url: 'product/christmasTree.html'
    },
    {
        image: 'Images/product/custom3dprint.png',
        title: 'Custom 3D Print',
        description: 'Bring your ideas to life with custom 3D printing services.',
        price: '$10.00',
        url: 'product/custom3dPrint.html'
    }
];

let currentSlide = 0;

// Initialize carousel
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');

    carouselProducts.forEach((product, index) => {
        // Create carousel item
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.innerHTML = `
                    <div class="carousel-item-content">
                        <img src="${product.image}" alt="${product.title}" class="carousel-item-image">
                        <div class="carousel-item-info">
                            <div>
                                <h3>${product.title}</h3>
                                <p class="m3-body-medium">${product.description}</p>
                            </div>
                            <div>
                                <div class="carousel-item-price">${product.price}</div>
                               <a href="${product.url}" class="m3-button filled">View Details</a>
                            </div>
                        </div>
                    </div>
                `;
        track.appendChild(item);

        // Create dot
        const dot = document.createElement('button'); // <-- CHANGE to a <button>
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`); // <-- ADD aria-label
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselProducts.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + carouselProducts.length) % carouselProducts.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Auto-rotate carousel every 5 seconds
setInterval(nextSlide, 5000);

document.addEventListener('DOMContentLoaded', initCarousel);