const scriptURL = "https://script.google.com/macros/s/AKfycbzFoKr8LP43f1MpoTCZucPqrQNWkOK2lWXHZbKe1eFokq39ZOI-bMAz7YYgBD0d1iKJ/exec";

// --- 1. NEW SECTION: Load Cart Summary on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Only run this cart logic if we are on the checkout page
    // (This check prevents errors on the contact page)
    if (document.getElementById('checkout-form')) {
        loadCartSummary();
    }
});

function loadCartSummary() {
    const itemsList = document.getElementById('summary-items-list');
    const totalElement = document.getElementById('summary-total');
    const form = document.getElementById('checkout-form');

    // Get cart from our global cartSystem (from cart.js)
    const cart = window.cartSystem.getCart();
    
    if (cart.length === 0) {
        itemsList.innerHTML = '<p>Your cart is empty.</p>';
        form.style.display = 'none'; // Hide form if cart is empty
        return;
    }

    let total = 0;

    cart.forEach(item => {
        // Use (|| 0) for safety
        const safePrice = item.price || 0;
        const safeQuantity = item.quantity || 1;
        const itemTotal = safePrice * safeQuantity;
        
        //
        // --- 🔻🔻 CHANGE HERE 🔻🔻 ---
        // We no longer multiply by 1.07
        total += itemTotal; 
        //
        // --- 🔺🔺 END OF CHANGE 🔺🔺 ---
        //

        const itemHTML = `
            <li class="summary-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="summary-item-details">
                    <h3>${item.name}</h3>
                    <p>Qty: ${safeQuantity}</p>
                </div>
                <strong>$${itemTotal.toFixed(2)}</strong>
            </li>
        `;
        itemsList.innerHTML += itemHTML;
    });

    // Display the final total
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// --- 2. MODIFIED ORDER FORM HANDLER ---
const orderForm = document.getElementById("checkout-form");
if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    // Get the submit button to disable it
    const submitButton = document.getElementById('submit-order-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const form = e.target;
    // This gets 'name' and 'email' from the form
    const formData = new FormData(form); 

    // --- Now, we manually add the cart data ---
    const cart = window.cartSystem.getCart();
    let total = 0;
    
    // 1. Create the 'message' field
    const itemsMessage = cart.map(item => {
        const safePrice = item.price || 0;
        const safeQuantity = item.quantity || 1;
        const itemTotal = safePrice * safeQuantity;
        
        //
        // --- 🔻🔻 CHANGE HERE 🔻🔻 ---
        // We no longer multiply by 1.07
        total += itemTotal; // Calculate total again (no tax)
        //
        // --- 🔺🔺 END OF CHANGE 🔺🔺 ---
        //

        let desc = `${item.name} (Qty: ${safeQuantity}) - $${itemTotal.toFixed(2)}`;
        
        // Check for any custom designs
        const customDesign = sessionStorage.getItem(`customDesign_${item.id}`);
        if (customDesign) {
            desc += ' [Custom Design Uploaded]';
        }
        return desc;
    }).join('\n'); // Newline for each item
    
    // 2. Create the 'subject' field
    const subject = `New Order Placed - Total: $${total.toFixed(2)}`;

    // 3. Add the new fields to the FormData
    formData.append("type", "order");
    formData.append("subject", subject);
    formData.append("message", itemsMessage);

    console.log("Sending order data as FormData:", [...formData.entries()]);

    // This is your working fetch logic
    fetch(scriptURL, {
      method: "POST",
      body: formData 
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response from Apps Script:", data);
        if (data.result === "success") {
          // data.message is the 'name'
          alert("Order placed successfully for " + data.message + "!"); 
          
          // --- NEW: Clear cart and redirect ---
          window.cartSystem.saveCart([]); // Empty the cart
          cart.forEach(item => {
              // Clear any saved custom designs
              sessionStorage.removeItem(`customDesign_${item.id}`);
          });
          // Send user to the homepage
          window.location.href = 'index.html'; 
          
        } else {
          alert("Error placing order: " + data.message);
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Order';
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Failed to place order. Check console for details.");
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Order';
      });
  });
}

// --- 3. UNCHANGED CONTACT FORM HANDLER ---
// (Your contact form logic is perfect, no changes needed)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    formData.append("type", "contact");

    console.log("Sending contact data as FormData:", [...formData.entries()]);

    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response from Apps Script:", data);
        if (data.result === "success") {
          alert("Message sent successfully!");
          form.reset();
        } else {
          alert("Error sending message: " + data.message);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Failed to send message. Check console for details.");
      });
  });
}