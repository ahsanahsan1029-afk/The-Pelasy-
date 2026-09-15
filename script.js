const products = [
    { id: 1, name: "Nike Air Max Running Shoes", category: "Shoes", price: 299, oldPrice: 5999, rating: 4.5, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-205525~2.png", desc: "Premium running shoes with excellent cushioning and breathable design." },
    { id: 2, name: "Adidas Ultraboost Sneakers", category: "Shoes", price: 199, oldPrice: 9999, rating: 4.7, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-205606~2.png", desc: "High performance sneakers for daily wear and sports." },
    { id: 3, name: "Puma Casual Sneakers", category: "Shoes", price: 199, oldPrice: 3999, rating: 4.3, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-205739~2.png", desc: "Stylish casual sneakers perfect for everyday use." },
    { id: 4, name: "Genuine Leather Formal Belt", category: "Belts", price: 99, oldPrice: 1299, rating: 4.4, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-205814~2.png", desc: "Premium genuine leather belt for formal occasions." },
    { id: 5, name: "Casual Canvas Belt", category: "Belts", price: 69, oldPrice: 799, rating: 4.1, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-205915~2.png", desc: "Comfortable canvas belt for casual wear." },
    { id: 6, name: "Cotton Printed Kurta", category: "Kurta", price: 179, oldPrice: 1899, rating: 4.6, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-210216.png?max-h=7524&fit=crop", desc: "Soft cotton kurta with beautiful prints. Perfect for festive occasions." },
    { id: 7, name: "Silk Embroidered Kurta", category: "Kurta", price: 229, oldPrice: 3499, rating: 4.8, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-210052~2.png", desc: "Elegant silk kurta with fine embroidery work." },
    { id: 8, name: "Linen Summer Kurta", category: "Kurta", price: 319, oldPrice: 1499, rating: 4.4, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=500&fit=crop", desc: "Breathable linen kurta ideal for summer." },
    { id: 9, name: "Wireless Bluetooth Earbuds", category: "Electronics", price: 99, oldPrice: 2999, rating: 4.5, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop", desc: "True wireless earbuds with long battery life and noise isolation." },
    { id: 10, name: "BMW Remote Control", category: "Electronics", price: 79, oldPrice: 4999, rating: 4.6, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-210441~2.png", desc: "Only for BMW lovers, a very shiny and Exllent physis based car, with premium Remote." },
    { id: 11, name: "Old Vibe Car Remote Control", category: "Electronics", price: 69, oldPrice: 2199, rating: 4.3, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-031449~2.png", desc: "High powered old vibe var with best remote for 2 to 3 years Babies" },
    { id: 12, name: "Thar Premium Hot Weals, in black shiny", category: "Electronics", price: 99, oldPrice: 6999, rating: 4.7, image: "https://6aa9629e9422e77b387feffc.imgix.net/sandbox/Screenshot_20260915-210653~2.png", desc: "Premium over-hand, shiny with active lighting, for hot wheels lovers." }
];

const categories = [
    { name: "Shoes", icon: "fa-shoe-prints" },
    { name: "Belts", icon: "fa-ring" },
    { name: "Kurta", icon: "fa-tshirt" },
    { name: "Electronics", icon: "fa-laptop" }
];

let cart = JSON.parse(localStorage.getItem('pelasy_cart')) || [];
let history = ['home'];
let currentBuyProduct = null;
let userDetails = {};
let pendingPage = null; // for interstitial

function saveCart() {
    localStorage.setItem('pelasy_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartCount').textContent = count;
}

// ========== INTERSTITIAL AD LOGIC ==========
function showPage(pageId) {
    if (!document.getElementById('interstitialAd').classList.contains('hidden')) return;
    
    pendingPage = pageId;
    
    const closeBtn = document.querySelector('.interstitial-close');
    closeBtn.style.display = 'none';
    
    document.getElementById('interstitialAd').classList.remove('hidden');
    
    setTimeout(() => {
        closeBtn.style.display = 'block';
    }, 5000);
}

function closeInterstitial() {
    document.getElementById('interstitialAd').classList.add('hidden');
    document.querySelector('.interstitial-close').style.display = 'none';
    
    if (pendingPage) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pendingPage).classList.add('active');
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (pendingPage === 'home') document.querySelectorAll('.nav-link')[0].classList.add('active');
        if (pendingPage === 'categories') document.querySelectorAll('.nav-link')[1].classList.add('active');
        if (pendingPage === 'cart') {
            document.querySelectorAll('.nav-link')[6].classList.add('active');
            renderCart();
        }
        
        if (history[history.length - 1] !== pendingPage) history.push(pendingPage);
        window.scrollTo(0, 0);
        pendingPage = null;
    }
}

function goBack() {
    if (history.length > 1) {
        history.pop();
        showPage(history[history.length - 1]);
    } else {
        showPage('home');
    }
}

function renderHomeCategories() {
    document.getElementById('homeCategories').innerHTML = categories.map(c => `
        <div class="cat-card" onclick="openCategory('${c.name}')">
            <i class="fas ${c.icon}"></i>
            <span>${c.name}</span>
        </div>
    `).join('');
}

function renderAllCategories() {
    document.getElementById('allCategories').innerHTML = categories.map(c => `
        <div class="cat-list-item" onclick="openCategory('${c.name}')">
            <i class="fas ${c.icon}"></i>
            <div><h3>${c.name}</h3><p>Explore collection</p></div>
        </div>
    `).join('');
}

function renderProducts(list, containerId) {
    document.getElementById(containerId).innerHTML = list.map(p => `
        <div class="product-card" onclick="openProduct(${p.id})">
            <img src="${p.image}" class="product-img" alt="${p.name}" loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'">
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="price-row">
                    <span class="product-price">₹${p.price.toLocaleString()}</span>
                    <span class="old-price">₹${p.oldPrice.toLocaleString()}</span>
                </div>
                <div class="rating">★ ${p.rating}</div>
                <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function openCategory(name) {
    document.getElementById('catTitle').textContent = name;
    const filtered = products.filter(p => p.category === name);
    renderProducts(filtered, 'catProducts');
    showPage('categoryProducts');
}

function openProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    currentBuyProduct = p;
    document.getElementById('productContent').innerHTML = `
        <img src="${p.image}" class="detail-img" alt="${p.name}">
        <div class="detail-name">${p.name}</div>
        <div class="price-row" style="margin:10px 0">
            <span class="detail-price">₹${p.price.toLocaleString()}</span>
            <span class="old-price">₹${p.oldPrice.toLocaleString()}</span>
        </div>
        <div class="rating">★ ${p.rating} Rating</div>
        <div class="detail-desc">${p.desc}</div>
        <div class="detail-actions">
            <button class="btn-cart" onclick="addToCart(${p.id})">Add to Cart</button>
            <button class="btn-buy" onclick="startBuyFlow(${p.id})">Buy Now</button>
        </div>
    `;
    showPage('productDetail');
}

function addToCart(id) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else {
        const p = products.find(x => x.id === id);
        cart.push({...p, qty: 1});
    }
    saveCart();
    alert('Product added to cart!');
}

function renderCart() {
    const itemsDiv = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    const empty = document.getElementById('emptyCart');

    if (cart.length === 0) {
        itemsDiv.innerHTML = '';
        summary.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');
    summary.classList.remove('hidden');

    itemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div style="font-weight:600">${item.name}</div>
                <div class="price-row" style="margin:6px 0">
                    <span style="font-weight:700">₹${item.price.toLocaleString()}</span>
                    <span class="old-price">₹${item.oldPrice.toLocaleString()}</span>
                </div>
                <div class="qty-controls">
                    <button onclick="changeQty(${item.id}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>
                <div class="remove-btn" onclick="removeFromCart(${item.id})">Remove</div>
            </div>
        </div>
    `).join('');

    const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('subtotal').textContent = '₹' + sub.toLocaleString();
    document.getElementById('grandTotal').textContent = '₹' + (sub + 40).toLocaleString();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function searchProducts() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!q) {
        renderProducts(products.slice(0, 8), 'featuredProducts');
        return;
    }
    const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    renderProducts(filtered, 'featuredProducts');
    showPage('home');
}

/* ========== BUY FLOW ========== */
function startBuyFlow(productId = null) {
    if (productId) {
        currentBuyProduct = products.find(p => p.id === productId);
    } else if (cart.length > 0) {
        currentBuyProduct = cart[0];
    }
    if (!currentBuyProduct) {
        alert('No product selected');
        return;
    }
    document.getElementById('captchaCheck').checked = false;
    showPage('captchaPage');
}

function verifyCaptcha() {
    const checked = document.getElementById('captchaCheck').checked;
    if (!checked) {
        alert('Please confirm "I am not a robot"');
        return;
    }
    showPage('addressPage');
}

function submitAddress() {
    const name = document.getElementById('userName').value.trim();
    const number = document.getElementById('userNumber').value.trim();
    const address = document.getElementById('userAddress').value.trim();
    const colony = document.getElementById('userColony').value.trim();
    const city = document.getElementById('userCity').value.trim();
    const state = document.getElementById('userState').value.trim();
    const pincode = document.getElementById('userPincode').value.trim();

    if (!name || !number || !address || !colony || !city || !state || !pincode) {
        alert('Please fill all fields');
        return;
    }
    if (number.length < 10) {
        alert('Please enter valid 10 digit mobile number');
        return;
    }

    userDetails = { name, number, address, colony, city, state, pincode };

    document.getElementById('reviewDetails').innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>Mobile:</strong> ${number}<br>
        <strong>Address:</strong> ${address}<br>
        <strong>Colony:</strong> ${colony}<br>
        <strong>City:</strong> ${city}<br>
        <strong>State:</strong> ${state}<br>
        <strong>Pincode:</strong> ${pincode}
    `;
    showPage('reviewPage');
}

function selectPayment(method) {
    if (method === 'cod') {
        const p = currentBuyProduct;
        document.getElementById('codProductDetails').innerHTML = `
            <div style="text-align:center; margin-bottom:20px;">
                <img src="${p.image}" style="width:120px; height:120px; object-fit:cover; border-radius:10px; margin-bottom:12px;">
                <div style="font-weight:600; font-size:16px;">${p.name}</div>
                <div class="price-row" style="justify-content:center; margin:8px 0;">
                    <span class="product-price">₹${p.price.toLocaleString()}</span>
                    <span class="old-price">₹${p.oldPrice.toLocaleString()}</span>
                </div>
                <div style="color:#555; font-size:14px;">Payment: Cash on Delivery</div>
            </div>
        `;
        showPage('codConfirmPage');
    } else {
        showServerOverload();
    }
}

function confirmCOD() {
    showServerOverload();
}

function showServerOverload() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('home').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.nav-link')[0].classList.add('active');
    window.scrollTo(0, 0);

    const toast = document.getElementById('serverToast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
}

/* Init */
window.onload = function() {
    setTimeout(() => {
        document.getElementById('splash').style.opacity = '0';
        document.getElementById('splash').style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.getElementById('splash').classList.add('hidden');
            document.getElementById('website').classList.remove('hidden');
        }, 500);
    }, 2000);

    renderHomeCategories();
    renderAllCategories();
    renderProducts(products.slice(0, 8), 'featuredProducts');
    updateCartCount();
};
