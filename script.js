document.addEventListener('DOMContentLoaded', async () => {
  const slides = document.querySelectorAll('.slide');
  
  // Enhanced preloader with loading feedback
  await preloadImages(slides);
  
  let current = 0;
  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  };
  
  // Initial display
  showSlide(0);
  
  // Auto-rotate with adjusted timing
  const slideInterval = 3500; // 3.5 seconds per slide
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, slideInterval);
  
  // Touch/swipe support for mobile
  setupTouchNavigation(slides);
});

// Improved preloading with error handling
async function preloadImages(slides) {
  const promises = Array.from(slides).map(slide => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = extractUrl(slide.style.backgroundImage);
      img.onload = resolve;
      img.onerror = resolve; // Resolve even if fails
    });
  });
  
  await Promise.all(promises);
}

function extractUrl(bgImage) {
  return bgImage.match(/url\(["']?(.*?)["']?\)/)[1];
}

// Optional touch support
function setupTouchNavigation(slides) {
  let touchStartX = 0;
  let currentIndex = 0;
  
  document.querySelector('.slideshow').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});
  
  document.querySelector('.slideshow').addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const threshold = 50;
    
    if (touchStartX - touchEndX > threshold) {
      // Swipe left - next
      currentIndex = (currentIndex + 1) % slides.length;
    } else if (touchEndX - touchStartX > threshold) {
      // Swipe right - previous
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }
    
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
  }, {passive: true});
}
// Product Page Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Quantity buttons
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
      const container = this.closest('.product-actions');
      const quantityElement = container.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
      
      if (this.classList.contains('minus') && quantity > 1) {
        quantity--;
      } else if (this.classList.contains('plus')) {
        quantity++;
      }
      
      quantityElement.textContent = quantity;
    });
  });
  
  // Add to cart functionality
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const quantity = parseInt(productCard.querySelector('.quantity').textContent);
      
      // Update cart count
      const cartCount = document.querySelector('.cart-count');
      let currentCount = parseInt(cartCount.textContent) || 0;
      cartCount.textContent = currentCount + quantity;
      
      // Visual feedback
      this.textContent = 'Added!';
      setTimeout(() => {
        this.textContent = 'Add to Cart';
      }, 2000);
    });
  });
  
  // Filter functionality
  document.getElementById('category').addEventListener('change', filterProducts);
  document.getElementById('sort').addEventListener('change', filterProducts);
});

function filterProducts() {
  // Implement your filtering/sorting logic here
  console.log('Filters changed - implement your logic');
}
// Enhanced Product Page Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Quantity control
  document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
      const container = this.closest('.quantity-control');
      const input = container.querySelector('.quantity');
      let value = parseFloat(input.value);
      const step = parseFloat(input.step) || 0.5;
      
      if (this.classList.contains('minus') && value > step) {
        value -= step;
      } else if (this.classList.contains('plus')) {
        value += step;
      }
      
      input.value = value.toFixed(1);
    });
  });

  // Add to cart functionality
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const quantity = parseFloat(productCard.querySelector('.quantity').value);
      
      // Update cart count
      const cartCount = document.querySelector('.cart-count');
      let currentCount = parseFloat(cartCount.textContent) || 0;
      cartCount.textContent = (currentCount + quantity).toFixed(1);
      
      // Visual feedback
      const originalText = this.textContent;
      this.textContent = 'Added!';
      this.style.backgroundColor = '#2E7D32';
      
      setTimeout(() => {
        this.textContent = originalText;
        this.style.backgroundColor = '';
      }, 2000);
    });
  });

  // Review submission
  document.querySelectorAll('.submit-review').forEach(button => {
    button.addEventListener('click', function() {
      const reviewForm = this.closest('.review-form');
      const textarea = reviewForm.querySelector('textarea');
      
      if (textarea.value.trim() === '') {
        alert('Please write your review before submitting');
        return;
      }
      
      // In a real app, you would send this to your server
      alert('Thank you for your review!');
      textarea.value = '';
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const categorySelect = document.getElementById('category');
  const productCards = document.querySelectorAll('.product-card');

  categorySelect.addEventListener('change', function () {
    const selectedCategory = categorySelect.value;

    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');

      if (selectedCategory === 'All' || cardCategory === selectedCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
// Add to cart functionality (update existing code)
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    const productCard = this.closest('.product-card');
    const productId = productCard.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
    const productName = productCard.querySelector('h3').textContent;
    const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('₹', '').replace('/kg', ''));
    const productImage = productCard.querySelector('img').src;
    const quantity = parseFloat(productCard.querySelector('.quantity').value);
    
    // Get or initialize cart
    let cart = JSON.parse(localStorage.getItem('farmfresh-cart')) || [];
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity
      });
    }
    
    // Save to localStorage
    localStorage.setItem('farmfresh-cart', JSON.stringify(cart));
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    let currentCount = parseFloat(cartCount.textContent) || 0;
    cartCount.textContent = (currentCount + quantity).toFixed(1);
    
    // Visual feedback
    const originalText = this.textContent;
    this.textContent = 'Added!';
    this.style.backgroundColor = '#2E7D32';
    
    setTimeout(() => {
      this.textContent = originalText;
      this.style.backgroundColor = '';
    }, 2000);
  });
});
