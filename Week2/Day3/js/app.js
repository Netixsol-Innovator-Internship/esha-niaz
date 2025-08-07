// Main application logic
class RestaurantApp {
  constructor() {
    this.cart = [];
    this.currentReviewIndex = 0;
    this.reviewInterval = null;
    this.init();
  }

  init() {
    this.renderProducts();
    this.setupEventListeners();
    this.startReviewSlider();
    this.renderSimilarRestaurants();
    this.updateCartUI();
  }

  // Render products dynamically
  renderProducts() {
    const categories = ['burgers', 'fries', 'drinks'];
    
    categories.forEach(category => {
      const products = restaurantData.products.filter(product => product.type === category);
      const container = document.querySelector(`[data-category="${category}"] .burgers`);
      
      if (container) {
        container.innerHTML = '';
        products.forEach(product => {
          const productHTML = this.createProductHTML(product);
          container.appendChild(productHTML);
        });
      }
    });
  }

  // Create product HTML element
  createProductHTML(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'burger-box';
    productDiv.innerHTML = `
      <div class="left">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <h3>GBP ${product.price.toFixed(2)}</h3>
      </div>
      <div class="right">
        <img src="${product.image}" alt="${product.name}" />
        <div class="plus-cont" data-product-id="${product.id}">
          <img class="plus-icon" src="images/Plus.png" alt="Add to cart" />
        </div>
      </div>
    `;
    return productDiv;
  }

  // Setup event listeners
  setupEventListeners() {
    // Cart functionality
    document.addEventListener('click', (e) => {
      if (e.target.closest('.plus-cont')) {
        const productId = parseInt(e.target.closest('.plus-cont').dataset.productId);
        this.addToCart(productId);
      }
      
      // Cart modal toggle
      if (e.target.closest('.cart')) {
        this.toggleCartModal();
      }
      
      // Close modal when clicking outside
      if (e.target.classList.contains('cart-modal')) {
        this.closeCartModal();
      }
      
      // Remove item from cart
      if (e.target.classList.contains('remove-item')) {
        const productId = parseInt(e.target.dataset.productId);
        this.removeFromCart(productId);
      }
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
      });
    }

    // Review navigation
    const prevArrow = document.querySelector('.arrows img:first-child');
    const nextArrow = document.querySelector('.arrows img:last-child');
    
    if (prevArrow) {
      prevArrow.addEventListener('click', () => this.previousReview());
    }
    
    if (nextArrow) {
      nextArrow.addEventListener('click', () => this.nextReview());
    }

    // Category filtering
    document.querySelectorAll('.offers-options a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterByCategory(e.target.textContent.toLowerCase());
      });
    });

    // Search functionality
    const searchInput = document.querySelector('.search input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchProducts(e.target.value);
      });
    }
  }

  // Add product to cart
  addToCart(productId) {
    const product = restaurantData.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }

    this.updateCartUI();
    this.showAddToCartAnimation();
  }

  // Remove product from cart
  removeFromCart(productId) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      if (this.cart[itemIndex].quantity > 1) {
        this.cart[itemIndex].quantity -= 1;
      } else {
        this.cart.splice(itemIndex, 1);
      }
    }
    this.updateCartUI();
    this.renderCartModal();
  }

  // Update cart UI
  updateCartUI() {
    const cartElement = document.querySelector('.cart');
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update cart badge
    let badge = cartElement.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      cartElement.appendChild(badge);
    }
    
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
  }

  // Show cart modal
  toggleCartModal() {
    let modal = document.querySelector('.cart-modal');
    
    if (!modal) {
      modal = this.createCartModal();
      document.body.appendChild(modal);
    }
    
    this.renderCartModal();
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  }

  // Close cart modal
  closeCartModal() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Create cart modal
  createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-header">
          <h2>Your Cart</h2>
          <span class="close-modal">&times;</span>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer">
          <div class="cart-total">
            <strong>Total: GBP <span class="total-amount">0.00</span></strong>
          </div>
          <button class="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    `;

    // Close modal event
    modal.querySelector('.close-modal').addEventListener('click', () => {
      this.closeCartModal();
    });

    return modal;
  }

  // Render cart modal content
  renderCartModal() {
    const modal = document.querySelector('.cart-modal');
    if (!modal) return;

    const cartItems = modal.querySelector('.cart-items');
    const totalAmount = modal.querySelector('.total-amount');
    
    if (this.cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      totalAmount.textContent = '0.00';
      return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    this.cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>GBP ${item.price.toFixed(2)} each</p>
        </div>
        <div class="item-controls">
          <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
        </div>
        <div class="item-total">
          GBP ${itemTotal.toFixed(2)}
        </div>
        <button class="remove-item" data-product-id="${item.id}">Remove</button>
      `;
      cartItems.appendChild(cartItem);
    });

    totalAmount.textContent = total.toFixed(2);

    // Add quantity control events
    cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        if (e.target.classList.contains('plus')) {
          this.addToCart(productId);
        } else {
          this.removeFromCart(productId);
          }
                  // Re-render the modal to update quantities
        this.renderCartModal();
      });
    });
  }

  // Show add to cart animation
  showAddToCartAnimation() {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fc8a06;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  // Customer reviews slider
  startReviewSlider() {
    this.renderCurrentReview();
    this.reviewInterval = setInterval(() => {
      this.nextReview();
    }, 5000); // Auto-slide every 5 seconds
  }

  nextReview() {
    this.currentReviewIndex = (this.currentReviewIndex + 1) % restaurantData.reviews.length;
    this.renderCurrentReview();
  }

  previousReview() {
    this.currentReviewIndex = this.currentReviewIndex === 0 
      ? restaurantData.reviews.length - 1 
      : this.currentReviewIndex - 1;
    this.renderCurrentReview();
  }

  renderCurrentReview() {
    const reviewArea = document.querySelector('.review-area');
    if (!reviewArea) return;

    const review = restaurantData.reviews[this.currentReviewIndex];
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    reviewArea.innerHTML = `
      <div class="reviews active">
        <div class="profile-rating">
          <div class="profile">
            <img class="dp" src="${review.avatar}" alt="${review.name}" />
            <img src="images/hr.png" alt="" />
            <p>
              ${review.name} <br />
              <span>${review.location}</span>
            </p>
          </div>
          <div class="rating">
            <div class="stars">
              <span class="star-rating">${stars}</span>
            </div>
            <div class="time">
              <img src="images/Time Span.png" alt="Time" />
              <p>${review.date}</p>
            </div>
          </div>
        </div>
        <div class="para">
          ${review.comment}
        </div>
      </div>
    `;
  }

  // Render similar restaurants
  renderSimilarRestaurants() {
    const restaurantsContainer = document.querySelector('.similar-Restaurants .restaurants');
    if (!restaurantsContainer) return;

    restaurantsContainer.innerHTML = '';
    
    restaurantData.similarRestaurants.forEach(restaurant => {
      const restaurantElement = document.createElement('div');
      restaurantElement.className = 'restaurant-item';
      restaurantElement.innerHTML = `
        <img src="${restaurant.image}" alt="${restaurant.name}" />

      `;
      restaurantsContainer.appendChild(restaurantElement);
    });
  }

  // Filter products by category
  filterByCategory(category) {
    const allContainers = document.querySelectorAll('.container-burgers');
    
    allContainers.forEach(container => {
      if (category === 'offers' || category === 'all') {
        container.style.display = 'block';
      } else {
        const containerCategory = container.querySelector('h1').textContent.toLowerCase();
        container.style.display = containerCategory.includes(category) ? 'block' : 'none';
      }
    });

    // Update active link
    document.querySelectorAll('.offers-options a').forEach(link => {
      link.classList.remove('offer_border');
    });
    event.target.classList.add('offer_border');
  }

  // Search products
  searchProducts(query) {
    const allProducts = document.querySelectorAll('.burger-box');
    const searchTerm = query.toLowerCase();

    allProducts.forEach(product => {
      const productName = product.querySelector('h3').textContent.toLowerCase();
      const productDescription = product.querySelector('p').textContent.toLowerCase();
      
      if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
        product.style.display = 'flex';
      } else {
        product.style.display = 'none';
      }
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new RestaurantApp();
});
