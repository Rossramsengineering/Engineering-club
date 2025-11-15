// cart.js
// Manages the shopping cart using Local Storage

(function () {
    'use strict';

    const CART_KEY = 'engineeringClubCart';

    /**
     * Retrieves the cart from Local Storage.
     * @returns {Array} The cart as an array of objects.
     */
    function getCart() {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    /**
     * Saves the cart to Local Storage.
     * @param {Array} cart - The cart array to save.
     */
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    /**
     * Adds an item to the cart.
     * @param {object} product - The product object to add.
     */
    function addItem(product) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // If item already in cart, increment quantity
            existingItem.quantity += 1;
        } else {
            // If new item, add to cart with quantity 1
            product.quantity = 1;
            cart.push(product);
        }

        saveCart(cart);
        updateCartIcon(); // Update the header
        
        // Optional: Give user feedback
        alert(`${product.name} added to cart!`);
    }

    /**
     * Updates the cart icon in the header with the total item count.
     */
    function updateCartIcon() {
        const cart = getCart();
        // Sum the quantity of all items in the cart
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        const cartButton = document.getElementById('cart-button');
        if (!cartButton) return;

        // Find the text part of the button, excluding the icon
        const cartText = cartButton.lastChild; 
        
        if (totalItems > 0) {
            cartText.textContent = ` Cart (${totalItems})`;
        } else {
            cartText.textContent = ' Cart';
        }
    }

    /**
     * Initializes the cart system.
     * Attaches click listeners to "Add to Cart" buttons.
     */
    function init() {
        // Update cart icon on every page load
        updateCartIcon();

        // Find all "Add to Cart" buttons on the current page
        const addButtons = document.querySelectorAll('.add-to-cart-btn');
        
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Stop any default link behavior
                
                // Get product data from the button's data attributes
                const product = {
                    id: button.dataset.productId,
                    name: button.dataset.productName,
                    price: parseFloat(button.dataset.productPrice),
                    image: button.dataset.productImage,
                };
                
                addItem(product);
            });
        });
    }

    //
    // --- Public API ---
    // We make these functions globally available for other scripts
    // (like the one we'll build for cart.html)
    //
    window.cartSystem = {
        addItem: addItem,
        getCart: getCart,
        saveCart: saveCart,
        updateCartIcon: updateCartIcon,
        removeItem: (productId) => {
            let cart = getCart();
            cart = cart.filter(item => item.id !== productId);
            saveCart(cart);
            updateCartIcon();
        },
        updateQuantity: (productId, quantity) => {
            let cart = getCart();
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = parseInt(quantity, 10);
                if (item.quantity <= 0) {
                    // If quantity is 0, remove the item
                    cart = cart.filter(item => item.id !== productId);
                }
            }
            saveCart(cart);
            updateCartIcon();
        }
    };
    
    // Run the initialization function when the page is loaded
    document.addEventListener('DOMContentLoaded', init);

})();