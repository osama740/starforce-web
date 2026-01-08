document.addEventListener("DOMContentLoaded", () => {

  const cartIcon = document.querySelector(".cart-icon");
  const cartPanel = document.getElementById("cart-panel");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const modal = document.getElementById("confirm-modal");
  const modalMessage = document.getElementById("modal-message");
  const confirmBtn = document.getElementById("confirm-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let currentProduct = null; // Product currently being confirmed

  updateCart();

  // Toggle cart panel
  cartIcon.addEventListener("click", () => {
    cartPanel.classList.toggle("active");
  });

  // Click on product
  document.addEventListener("click", (e) => {
    const product = e.target.closest(".product-card");
    if (!product) return;

    let name = product.dataset.name || product.querySelector("h3")?.innerText;
    let priceText = product.dataset.price || product.querySelector("p")?.innerText;
    let price = parseFloat(priceText.replace("$", ""));
    if (!name || isNaN(price)) return;

    // Show confirmation modal
    currentProduct = { name, price };
    modalMessage.textContent = `Do you want to purchase "${name}" for $${price}?`;
    modal.classList.add("active");
  });

  // Confirm purchase
  confirmBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    cart.push(currentProduct);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    modal.classList.remove("active");
    currentProduct = null;
  });

  // Cancel purchase
  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    currentProduct = null;
  });

  function updateCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;
      cartItems.innerHTML += `
        <div class="cart-item">
          <span>${item.name}</span>
          <span>$${item.price}</span>
          <button class="remove-item" data-index="${index}">×</button>
        </div>
      `;
    });

    if (cartCount) cartCount.textContent = cart.length;
    if (cartTotal) cartTotal.textContent = total.toFixed(2);

    // Remove item buttons
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      });
    });
  }

  // Send order to WhatsApp
  document.getElementById("send-order-btn").addEventListener("click", () => {
    const whatsappNumber = "96178924553";
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    let message = "Hello, I want to order the following items:\n";
    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.name} - $${item.price}\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `Total: $${total.toFixed(2)}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });

  // Mobile hover effect
  document.querySelectorAll(".product-card").forEach(card => {
    let tapped = false;
    card.addEventListener("touchstart", (e) => {
      if (!tapped) {
        e.preventDefault();
        document.querySelectorAll(".product-card").forEach(c => c.classList.remove("hovered"));
        card.classList.add("hovered");
        tapped = true;
        setTimeout(() => tapped = false, 600);
      }
    });
  });

});
