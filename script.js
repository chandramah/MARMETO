
const apiUrl = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

document.addEventListener("DOMContentLoaded", () => {
    fetchCartData();
});

// Fetch the cart data from the API
async function fetchCartData() {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    document.body.appendChild(loader);

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderCartItems(data.items);
        updateCartTotals(data);
    } catch (error) {
        console.error("Error fetching cart data:", error);
        alert("Failed to load cart data. Please try again.");
    } finally {
        loader.remove();
    }
}

// Render Cart Items
function renderCartItems(items) {
    const cartItemsContainer = document.getElementById("cart-items");

    items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-info">
                <h4>${item.title}</h4>
                <p>${item.product_description}</p>
                <input type="number" value="${item.quantity}" min="1" class="quantity" data-id="${item.id}">
            </div>
            <div class="item-actions">
                <span class="item-price">₹${(item.final_line_price / 100).toFixed(2)}</span>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    // Add event listeners for quantity change and item removal
    document.querySelectorAll('.quantity').forEach(input => {
        input.addEventListener('input', handleQuantityChange);
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

// Handle quantity change
function handleQuantityChange(event) {
    const quantity = parseInt(event.target.value);
    const itemId = event.target.dataset.id;

    // Update the subtotal for this item
    updateCart();
}

// Handle item removal
function handleRemoveItem(event) {
    const itemId = event.target.dataset.id;

    // Remove the item from the cart
    removeCartItem(itemId);
}

// Update Cart Totals
function updateCartTotals(data) {
    const subtotal = data.items_subtotal_price / 100; // Convert from paise to INR
    const total = data.original_total_price / 100; // Convert from paise to INR

    document.getElementById("cart-subtotal").innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById("cart-total").innerText = `₹${total.toFixed(2)}`;
}

// Remove item from cart
function removeCartItem(itemId) {
    // Remove the item from the DOM (in a real app, this would update the cart on the server)
    const itemElement = document.querySelector(`.remove-item[data-id="${itemId}"]`).closest('.cart-item');
    itemElement.remove();

    // Update the cart totals again
    updateCart();
}

// Update the entire cart after quantity changes or item removal
function updateCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const quantity = item.querySelector('.quantity').value;
        const price = parseFloat(item.querySelector('.item-price').innerText.replace('₹', ''));
        subtotal += quantity * price;
    });

    // Update totals
    document.getElementById("cart-subtotal").innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById("cart-total").innerText = `₹${subtotal.toFixed(2)}`;
}
