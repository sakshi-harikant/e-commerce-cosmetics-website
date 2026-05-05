// 🔒 PAGE PROTECTION
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ checkOut.js loaded");
    
    const user = localStorage.getItem("loggedInUser");
    console.log("👤 Logged in user:", user);

    if (!user) {
        console.log("⛔ No user found, redirecting to index.html");
        window.location.href = "index.html";
        return;
    }

    // User is logged in, initialize checkout
    initializeCheckout();
});

function initializeCheckout() {
    console.log("🔄 Initializing checkout...");
    
    // Load cart data
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("🛒 Cart items:", cart);
    
    // Update cart count in navbar
    const cartCountElement = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
    }

    // Get elements
    const orderItemsContainer = document.getElementById("order-items-container");
    const orderTotalsContainer = document.getElementById("order-totals-container");
    const placeOrderBtn = document.getElementById("place-order-btn");
    const form = document.getElementById("checkout-form");

    // Check if elements exist
    if (!orderItemsContainer || !orderTotalsContainer || !placeOrderBtn || !form) {
        console.error("❌ Required elements not found!");
        return;
    }

    // Handle empty cart
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = "<p style='text-align:center; padding:20px;'>Your cart is empty</p>";
        orderTotalsContainer.innerHTML = `
            <div class="order-row"><span>Subtotal</span><span>₹0.00</span></div>
            <div class="order-row"><span>Shipping</span><span>₹0.00</span></div>
            <div class="order-row order-total"><span>Total</span><span>₹0.00</span></div>
        `;
        placeOrderBtn.disabled = true;
        return;
    }

    // Render order items
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">₹${item.price.toFixed(2)}</div>
                <div class="order-item-qty">Qty: ${item.quantity}</div>
            </div>
        </div>
    `).join("");

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 499 ? 0 : 99;
    const total = subtotal + shipping;

    // Render totals
    orderTotalsContainer.innerHTML = `
        <div class="order-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
        <div class="order-row"><span>Shipping</span><span>${shipping === 0 ? "FREE" : "₹" + shipping.toFixed(2)}</span></div>
        <div class="order-row order-total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
    `;

    // ===== SIMPLE VALIDATION =====
    
    // Get all required fields
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const zip = document.getElementById("zip");
    const country = document.getElementById("country");

    // Function to check if form is valid
    function checkFormValidity() {
        let isValid = true;
        
        // Check each field
        if (!firstName.value.trim()) { isValid = false; firstName.style.borderColor = "red"; }
        else { firstName.style.borderColor = "#ddd"; }
        
        if (!lastName.value.trim()) { isValid = false; lastName.style.borderColor = "red"; }
        else { lastName.style.borderColor = "#ddd"; }
        
        if (!email.value.trim() || !email.value.includes('@')) { isValid = false; email.style.borderColor = "red"; }
        else { email.style.borderColor = "#ddd"; }
        
        if (!phone.value.trim() || phone.value.length < 10) { isValid = false; phone.style.borderColor = "red"; }
        else { phone.style.borderColor = "#ddd"; }
        
        if (!address.value.trim()) { isValid = false; address.style.borderColor = "red"; }
        else { address.style.borderColor = "#ddd"; }
        
        if (!city.value.trim()) { isValid = false; city.style.borderColor = "red"; }
        else { city.style.borderColor = "#ddd"; }
        
        if (!state.value.trim()) { isValid = false; state.style.borderColor = "red"; }
        else { state.style.borderColor = "#ddd"; }
        
        if (!zip.value.trim() || zip.value.length < 6) { isValid = false; zip.style.borderColor = "red"; }
        else { zip.style.borderColor = "#ddd"; }
        
        if (!country.value) { isValid = false; country.style.borderColor = "red"; }
        else { country.style.borderColor = "#ddd"; }
        
        // Enable/disable button
        placeOrderBtn.disabled = !isValid;
        
        // Button style
        if (isValid) {
            placeOrderBtn.style.opacity = "1";
            placeOrderBtn.style.cursor = "pointer";
            placeOrderBtn.style.backgroundColor = "var(--primary)";
        } else {
            placeOrderBtn.style.opacity = "0.5";
            placeOrderBtn.style.cursor = "not-allowed";
            placeOrderBtn.style.backgroundColor = "#cccccc";
        }
        
        console.log("Form valid:", isValid);
        return isValid;
    }

    // Add event listeners to all fields
    const allFields = [firstName, lastName, email, phone, address, city, state, zip, country];
    allFields.forEach(field => {
        if (field) {
            field.addEventListener("input", checkFormValidity);
            field.addEventListener("blur", checkFormValidity);
            field.addEventListener("change", checkFormValidity);
        }
    });

    // Phone number - only digits
    if (phone) {
        phone.addEventListener("input", function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }

    // ZIP code - only digits
    if (zip) {
        zip.addEventListener("input", function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
        });
    }

    // Place order button click
    placeOrderBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        if (!checkFormValidity()) {
            alert("Please fill all required fields");
            
            // Find first empty field and focus it
            for (let field of allFields) {
                if (field && !field.value.trim()) {
                    field.focus();
                    break;
                }
            }
            return;
        }

        // Create order
        const order = {
            id: "ORD" + Date.now(),
            date: new Date().toISOString(),
            items: cart,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            status: "Processing",
            shippingInfo: {
                name: firstName.value + " " + lastName.value,
                email: email.value,
                phone: phone.value,
                address: address.value,
                city: city.value,
                state: state.value,
                zip: zip.value,
                country: country.value,
                notes: document.getElementById("notes")?.value || ""
            }
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        
        // Save for payment page
        localStorage.setItem("currentOrder", JSON.stringify(order));

        // Redirect
        window.location.href = "paymentPage.html";
    });

    // Initial check
    checkFormValidity();
    
    console.log("✅ Checkout initialized");
}