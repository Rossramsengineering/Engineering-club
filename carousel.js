let currentIndex = 0;
let products = []; // To store the fetched products
let featuredProducts = []; // To store just the ones we show
let track;
let dotsContainer;

// --- 1. Load Products from JSON ---
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        
        // Feature the first 4 products
        featuredProducts = products.slice(0, 4); 
        
        renderCarousel(featuredProducts);
        setupCarousel(); // Setup DOM references
    } catch (error) {
        console.error('Error loading products for carousel:', error);
    }
}

// --- 2. Build the HTML for the Carousel ---
function renderCarousel(productsToRender) {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    track.innerHTML = productsToRender.map(product => {
        const pageUrl = getProductPageUrl(product.id);
        
        //
        // 🔻🔻 FIX IS HERE 🔻🔻
        //
        // 1. Clean the string (remove $, commas, etc.)
        const cleanedPrice = String(product.price).replace(/[^\d.-]/g, '');
        // 2. Convert to a number
        const priceAsNumber = parseFloat(cleanedPrice);
        // 🔺🔺 END OF FIX 🔺🔺

        // This is the HTML for one slide
        return `
        <div class="carousel-item">
            <div class="carousel-item-content">
                <img src="${product.image}" alt="${product.name}" class="carousel-item-image">
                <div class="carousel-item-info">
                    <div>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                    <div>
                        <div class="carousel-item-price">$${isNaN(priceAsNumber) ? '?.??' : priceAsNumber.toFixed(2)}</div>
                        <a href="${pageUrl}" class="m3-button outlined">View Details</a>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// --- 3. Setup Dots and DOM References ---
function setupCarousel() {
    track = document.getElementById('carouselTrack');
    dotsContainer = document.getElementById('carouselDots');
    const items = document.querySelectorAll('.carousel-item');
    
    if (!items.length || !dotsContainer) return;

    dotsContainer.innerHTML = ''; // Clear any old dots
    items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    // Set initial track position
    updateTrack();
}

// --- 4. Carousel Controls (Unchanged) ---
function updateTrack() {
    if (!track) return;
    const items = document.querySelectorAll('.carousel-item');
    if (!items.length) return;
    
    const itemWidth = items[0].clientWidth;
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    updateDots();
}

function nextSlide() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;
    if (currentIndex < items.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back
    }
    updateTrack();
}

function prevSlide() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = items.length - 1; // Loop back
    }
    updateTrack();
}

function goToSlide(index) {
    currentIndex = index;
    updateTrack();
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// --- 5. Helper function for Product Links ---
function getProductPageUrl(id) {
    const stringId = String(id); 
    const productPageMap = {
        '1': 'product/octopus.html',
        '2': 'product/fidgetBall.html',
        '3': 'product/choppingboard.html',
        '4': 'product/customOrnament.html',
        '5': 'product/christmasTree.html',
        '6': 'product/christmasTree.html',
        '7': 'product/snowflake.html',
        '8': 'product/custom3dPrint.html',
        '9': 'product/choppingboard.html',
        '10': 'product/led.html',
        '11': 'product/fidgetBall.html',
        '12': 'product/custom3dPrint.html'
    };
    return productPageMap[stringId] || '#';
}

// --- 6. Initialize the Script ---
document.addEventListener('DOMContentLoaded', loadProducts);
window.addEventListener('resize', updateTrack);