document.addEventListener('DOMContentLoaded', () => {
    const itemsList = document.getElementById('summary-items-list');
    const totalElement = document.getElementById('summary-total');
    const form = document.getElementById('checkout-form');
    const submitButton = document.getElementById('submit-order-btn');

    // --- 1. Load Cart Summary (Unchanged) ---
    const cart = window.cartSystem.getCart();
    
    if (cart.length === 0) {
        itemsList.innerHTML = '<p>Your cart is empty.</p>';
        form.style.display = 'none';
    }

    let total = 0;
    cart.forEach(item => {
        const safePrice = item.price || 0;
        const safeQuantity = item.quantity || 1;
        const itemTotal = safePrice * safeQuantity;
        total += itemTotal * 1.07; 

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
    totalElement.textContent = `$${total.toFixed(2)}`;

    
    // --- 2. Handle the Form Submission (MODIFIED) ---
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // --- A. Format the Order Data (Unchanged) ---
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        const itemsMessage = cart.map(item => {
            let desc = `${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
            const customDesign = sessionStorage.getItem(`customDesign_${item.id}`);
            if (customDesign) {
                desc += ' [Custom Design Uploaded]';
            }
            return desc;
        }).join('\n');
        
        const subject = `New Order Placed - Total: $${total.toFixed(2)}`;
        
        // --- 🔻🔻 THIS IS THE MAIN FIX 🔻🔻 ---
        // Instead of a JSON object, we create URLSearchParams
        const formData = new URLSearchParams();
        formData.append('type', 'order');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', itemsMessage);
        
        console.log("Sending order data as Form Data:", formData);

        // --- B. Send to Google Apps Script ---
        const scriptURL = "https://script.google.com/macros/s/AKfycbzFoKr8LP43f1MpoTCZucPqrQNWkOK2lWXHZbKe1eFokq39ZOI-bMAz7YYgBD0d1iKJ/exec";

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzFoKr8LP43f1MpoTCZucPqrQNWkOK2lWXHZbKe1eFokq39ZOI-bMAz7YYgBD0d1iKJ/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain'
  },
  body: new URLSearchParams(formData).toString()
});

            // --- 🔺🔺 END OF THE FIX 🔺🔺 ---

            const jsonResponse = await response.json();
            console.log("Response from Apps Script:", jsonResponse);

            // We now check for 'result' as defined in our new Code.gs
            if (jsonResponse.result === "success") {
                alert("Order placed successfully! We will contact you at your email address to confirm.");
                
                window.cartSystem.saveCart([]);
                cart.forEach(item => {
                    sessionStorage.removeItem(`customDesign_${item.id}`);
                });
                
                window.location.href = 'index.html';
                
            } else {
                alert("There was an error submitting your order. Please try again.");
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Order';
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit the order. Please try again later.");
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Order';
        }
    });
});