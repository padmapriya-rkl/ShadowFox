document.addEventListener('DOMContentLoaded', function() {
  // Load cart items from localStorage
  const cart = JSON.parse(localStorage.getItem('farmfresh-cart')) || [];
  const cartItemsContainer = document.querySelector('.cart-items');
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  const cartCount = document.querySelector('.cart-count');
  const subtotalElement = document.querySelector('.subtotal');
  const totalElement = document.querySelector('.total-amount');
  
  // Update cart count in header
  updateCartCount();
  
  // Display cart items
  if (cart.length > 0) {
    emptyCartMessage.style.display = 'none';
    renderCartItems();
    updateTotals();
  } else {
    emptyCartMessage.style.display = 'block';
  }
  
  function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.dataset.id = item.id;
      
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">₹${item.price}/kg</div>
          <div class="cart-item-actions">
            <div class="cart-item-quantity">
              <button class="quantity-btn minus">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus">+</button>
              <span class="unit">kg</span>
            </div>
            <span class="remove-item">Remove</span>
          </div>
        </div>
      `;
      
      cartItemsContainer.appendChild(cartItem);
      
      // Add event listeners for quantity buttons
      const minusBtn = cartItem.querySelector('.minus');
      const plusBtn = cartItem.querySelector('.plus');
      const quantityElement = cartItem.querySelector('.quantity');
      const removeBtn = cartItem.querySelector('.remove-item');
      
      minusBtn.addEventListener('click', () => {
        updateQuantity(item.id, parseFloat(quantityElement.textContent) - 0.5);
      });
      
      plusBtn.addEventListener('click', () => {
        updateQuantity(item.id, parseFloat(quantityElement.textContent) + 0.5);
      });
      
      removeBtn.addEventListener('click', () => {
        removeItem(item.id);
      });
    });
  }
  
  function updateQuantity(id, newQuantity) {
    if (newQuantity < 0.5) {
      removeItem(id);
      return;
    }
    
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      cart[itemIndex].quantity = newQuantity;
      saveCart();
      renderCartItems();
      updateTotals();
    }
  }
  
  function removeItem(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
      saveCart();
      renderCartItems();
      updateTotals();
      updateCartCount();
      
      if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
      }
    }
  }
  
  function updateTotals() {
    const subtotal = cart.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);
    
    const delivery = 50; // Fixed delivery charge
    const total = subtotal + delivery;
    
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
  }
  
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems.toFixed(1);
  }
  
  function saveCart() {
    localStorage.setItem('farmfresh-cart', JSON.stringify(cart));
  }
  
  // Checkout button
  document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
      alert('Proceeding to checkout! In a real app, this would redirect to payment.');
    } else {
      alert('Your cart is empty. Please add some items first.');
    }
  });
});