document.addEventListener("DOMContentLoaded", () => {

  const cartIcon = document.querySelector(".cart-icon");
  const cartPanel = document.getElementById("cart-panel");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  // 🔥 تحميل السلة من التخزين
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  updateCart();

  cartIcon.addEventListener("click", () => {
    cartPanel.classList.toggle("active");
  });

  // Event Delegation لكل الصفحات
  document.addEventListener("click", (e) => {
    const product = e.target.closest(".product-card");
    if (!product) return;

    // إذا الصفحة فيها data-attributes
    let name = product.dataset.name;
    let price = parseFloat(product.dataset.price);

    // fallback إذا ما في data
    if (!name || isNaN(price)) {
      name = product.querySelector("h3")?.innerText;
      const priceText = product.querySelector("p")?.innerText;
      price = parseFloat(priceText.replace("$", ""));
    }

    if (!name || isNaN(price)) return;

    cart.push({ name, price });

    // 💾 حفظ السلة
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
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

    // 🔹 إضافة Event لكل زر حذف
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        cart.splice(idx, 1);

        // 💾 حفظ السلة
        localStorage.setItem("cart", JSON.stringify(cart));

        updateCart();
      });
    });
  }

});
document.getElementById("send-order-btn").addEventListener("click", () => {
  // رقم WhatsApp بدون +
  const whatsappNumber = "96178924553";

  // توليد رسالة بالسلة
  let message = "Hello, I want to order the following items:\n";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - $${item.price}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  message += `Total: $${total.toFixed(2)}`;

  // فتح WhatsApp في نافذة جديدة
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});


//للتلفون
document.querySelectorAll(".product-card").forEach(card => {

  let tapped = false;

  card.addEventListener("touchstart", (e) => {
    if (!tapped) {
      e.preventDefault(); // يمنع الكليك
      document.querySelectorAll(".product-card")
        .forEach(c => c.classList.remove("hovered"));

      card.classList.add("hovered");
      tapped = true;

      setTimeout(() => tapped = false, 600);
    }
  });

});
