// Product data
const products = [
    {
        id: 1,
        name: "Mechanical Keyboard",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=500&q=80",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Minimalist Desk Lamp",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Leather Messenger Bag",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
        category: "Clothing"
    },
    {
        id: 4,
        name: "Ceramic Coffee Mug",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80",
        category: "Home"
    },
    {
        id: 5,
        name: "Wireless Mouse",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
        category: "Electronics"
    },
    {
        id: 6,
        name: "Succulent Plant Set",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&q=80",
        category: "Home"
    },
    {
        id: 7,
        name: "Vintage Polaroid Camera",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80",
        category: "Electronics"
    },
    {
        id: 8,
        name: "Canvas Backpack",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
        category: "Clothing"
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productList = document.getElementById('productList');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const emptyCartBtn = document.getElementById('emptyCart');

// Initialize the app
function init() {
    renderProducts();
    renderCart();
    updateCartCount();
    
    // Event listeners
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    overlay.addEventListener('click', toggleCart);
    emptyCartBtn.addEventListener('click', emptyCart);
}

// Render products
function renderProducts() {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showAddedToCartFeedback();
}

// Show feedback when item is added
function showAddedToCartFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = 'Added to cart!';
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.375rem;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Update cart
function updateCart() {
    saveCart();
    renderCart();
    updateCartCount();
}

// Render cart items
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Update quantity
window.updateQuantity = function(productId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    
    updateCart();
}

// Empty cart
function emptyCart() {
    cart = [];
    updateCart();
}

// Toggle cart panel
function toggleCart() {
    cartPanel.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartPanel.classList.contains('open') ? 'hidden' : '';
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize the app
init();

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);