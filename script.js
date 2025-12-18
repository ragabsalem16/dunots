// ======= LAOS DONUTS - Main JavaScript =======

// Global variables and configuration
const LAOS_CONFIG = {
    EMAILJS_SERVICE_ID: "service_9m858ii",
    EMAILJS_TEMPLATE_ID: "template_nuxmeti",
    EMAILJS_PUBLIC_KEY: "jHkdaZe3wQ4Bp00-z",
    DEFAULT_CURRENCY: "egp",
    TOAST_DURATION: 4000
};

// Global cart state
let cart = [];

// DOM elements cache
const DOM = {
    cartBtn: null,
    cartBadge: null,
    cartModal: null,
    closeCart: null,
    cartItemsDiv: null,
    cartTotalSpan: null,
    checkoutBtn: null,
    checkoutModal: null,
    closeCheckout: null,
    checkoutForm: null,
    checkoutSummary: null
};


// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for common elements to be loaded first
    setTimeout(() => {
        cacheDOMElements();
        initializeEmailJS();
        initializeCart();
        initializeMenuFilters();
        initializeToastSystem();
        console.log("LAOS DONUTS - All systems initialized successfully");
    }, 100);
});

// ======= EmailJS System =======
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(LAOS_CONFIG.EMAILJS_PUBLIC_KEY);
        console.log("EmailJS initialized successfully");
    } else {
        console.warn("EmailJS library not loaded");
    }
}

// ======= Cart Management System =======
function initializeCart() {
    // Cache cart DOM elements
    cacheCartElements();

    // Set up event listeners
    setupCartEventListeners();

    // Load cart from localStorage if available
    loadCartFromStorage();

    // Update cart display
    updateCart();
}

function cacheDOMElements() {
    DOM.cartBtn = document.getElementById('cartBtn');
    DOM.cartBadge = document.getElementById('cartBadge');
    DOM.cartModal = document.getElementById('cartModal');
    DOM.closeCart = document.getElementById('closeCart');
    DOM.cartItemsDiv = document.getElementById('cartItems');
    DOM.cartTotalSpan = document.getElementById('cartTotal');
    DOM.checkoutBtn = document.getElementById('checkoutBtn');
    DOM.checkoutModal = document.getElementById('checkoutModal');
    DOM.closeCheckout = document.getElementById('closeCheckout');
    DOM.checkoutForm = document.getElementById('checkoutForm');
    DOM.checkoutSummary = document.getElementById('checkoutSummary');
}

function cacheCartElements() {
    // These are already cached in cacheDOMElements
}

function setupCartEventListeners() {
    if (DOM.cartBtn) {
        DOM.cartBtn.addEventListener('click', openCart);
    }

    if (DOM.closeCart) {
        DOM.closeCart.addEventListener('click', closeCart);
    }

    if (DOM.checkoutBtn) {
        DOM.checkoutBtn.addEventListener('click', openCheckout);
    }

    if (DOM.closeCheckout) {
        DOM.closeCheckout.addEventListener('click', closeCheckout);
    }

    if (DOM.checkoutForm) {
        DOM.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.add-to-cart-btn, .add-to-cart-icon')) {
            e.preventDefault();
            const productElement = e.target.closest('[data-name]');
            if (productElement) {
                addToCart({
                    id: productElement.dataset.id,
                    name: productElement.dataset.name,
                    price: parseFloat(productElement.dataset.price)
                });
                showToast('تم إضافة المنتج للسلة بنجاح!', 'success');
            }
        }
    });

    // Close modals when clicking outside
    window.addEventListener('click', handleModalClicks);
}

function openCart() {
    if (DOM.cartModal) {
        DOM.cartModal.style.display = 'block';
    }
}

function closeCart() {
    if (DOM.cartModal) {
        DOM.cartModal.style.display = 'none';
    }
}

function openCheckout() {
    if (cart.length === 0) {
        showToast('السلة فارغة!', 'error');
        return;
    }

    closeCart();

    if (DOM.checkoutModal) {
        DOM.checkoutModal.style.display = 'block';
        updateCheckoutSummary();
    }
}

function closeCheckout() {
    if (DOM.checkoutModal) {
        DOM.checkoutModal.style.display = 'none';
    }
}

function updateCart() {
    if (DOM.cartBadge) {
        DOM.cartBadge.textContent = cart.length;
    }

    if (DOM.cartItemsDiv) {
        DOM.cartItemsDiv.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            DOM.cartItemsDiv.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        if (DOM.cartTotalSpan) {
            DOM.cartTotalSpan.textContent = `${total.toFixed(2)} ${LAOS_CONFIG.DEFAULT_CURRENCY}`;
        }
    }

    // Save to localStorage
    saveCartToStorage();
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-details">
            <strong>${item.name}</strong> - ${item.price.toFixed(2)} ${LAOS_CONFIG.DEFAULT_CURRENCY}
        </div>
        <div class="cart-item-controls">
            <div class="quantity-control">
                <button onclick="changeQuantity('${item.id}',-1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity('${item.id}',1)">+</button>
            </div>
            <button onclick="removeFromCart('${item.id}')">×</button>
        </div>
    `;
    return div;
}

function changeQuantity(id, delta) {
    cart = cart.map(item => {
        if (item.id === id) {
            item.quantity += delta;
            if (item.quantity < 1) item.quantity = 1;
        }
        return item;
    });
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showToast('تم حذف المنتج من السلة', 'info');
}

function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    updateCart();
}

// ======= Checkout System =======
function updateCheckoutSummary() {
    if (!DOM.checkoutSummary) return;

    let summaryHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        summaryHTML += `<p>${item.name} x${item.quantity} <strong>${itemTotal.toFixed(2)} ${LAOS_CONFIG.DEFAULT_CURRENCY}</strong></p>`;
        total += itemTotal;
    });

    summaryHTML += `<p><strong>الإجمالي: ${total.toFixed(2)} ${LAOS_CONFIG.DEFAULT_CURRENCY}</strong></p>`;
    DOM.checkoutSummary.innerHTML = summaryHTML;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const payment = document.getElementById('paymentMethod').value;

    if (!name || !phone || !address) {
        showToast('يرجى ملء جميع الحقول المطلوبة!', 'error');
        return;
    }

    if (cart.length === 0) {
        showToast('السلة فارغة!', 'error');
        return;
    }

    // Show loading state
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.textContent = 'جاري الإرسال...';
    placeOrderBtn.disabled = true;

    // Prepare order data
    const orderData = prepareOrderData(name, phone, address, payment);

    // Send order via EmailJS
    sendOrder(orderData)
        .then(() => {
            showToast('تم إرسال الطلب بنجاح! سنتواصل معك قريباً', 'success');
            resetOrder();
        })
        .catch((err) => {
            handleOrderError(err, orderData);
        })
        .finally(() => {
            placeOrderBtn.textContent = originalText;
            placeOrderBtn.disabled = false;
        });
}

function prepareOrderData(name, phone, address, payment) {
    let cartText = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartText += `• ${item.name} x${item.quantity} = ${itemTotal.toFixed(2)} ${LAOS_CONFIG.DEFAULT_CURRENCY}\n`;
        total += itemTotal;
    });

    return {
        to_email: "ragabsalem665@gmail.com",
        from_name: name,
        from_phone: phone,
        from_address: address,
        payment_method: payment,
        order_details: cartText,
        order_total: `${total.toFixed(2)} ${LAOS_CONFIG.DEFAULT_CURRENCY}`,
        reply_to: "ragabsalem665@gmail.com",
        subject: `طلب جديد من ${name}`
    };
}

function sendOrder(orderData) {
    return emailjs.send(
        LAOS_CONFIG.EMAILJS_SERVICE_ID,
        LAOS_CONFIG.EMAILJS_TEMPLATE_ID,
        orderData
    );
}

function handleOrderError(err, orderData) {
    console.error('EmailJS Error:', err);

    let errorMessage = "حدث خطأ أثناء إرسال الطلب";
    if (err.text) {
        errorMessage += `: ${err.text}`;
    }
    showToast(errorMessage, 'error');

    // Offer manual copy option
    setTimeout(() => {
        const manualOrder = `تفاصيل الطلب:\n\nالعميل: ${orderData.from_name}\nالهاتف: ${orderData.from_phone}\nالعنوان: ${orderData.from_address}\nطريقة الدفع: ${orderData.payment_method}\n\nالمنتجات:\n${orderData.order_details}\nالإجمالي: ${orderData.order_total}`;

        if (confirm(`${errorMessage}\n\nهل تريد نسخ تفاصيل الطلب لإرسالها يدوياً؟`)) {
            navigator.clipboard.writeText(manualOrder).then(() => {
                showToast('تم نسخ تفاصيل الطلب!', 'info');
            });
        }
    }, 1000);
}

function resetOrder() {
    cart = [];
    updateCart();
    closeCheckout();
    if (DOM.checkoutForm) {
        DOM.checkoutForm.reset();
    }
}

// ======= Menu Filter System =======
function initializeMenuFilters() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.menu-tabs .tab')) {
            handleMenuFilter(e.target);
        }
    });
}

function handleMenuFilter(activeTab) {
    const filter = activeTab.dataset.filter;

    // Update active tab
    document.querySelectorAll('.menu-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    activeTab.classList.add('active');

    // Filter menu items
    filterMenuItems(filter);
}

function filterMenuItems(filter) {
    document.querySelectorAll('.menu-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// ======= Toast Notification System =======
function initializeToastSystem() {
    // Toast system is ready
}

function showToast(message, type = 'info') {
    const toast = createToastElement(message, type);
    document.body.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentElement) {
            removeToastElement(toast);
        }
    }, LAOS_CONFIG.TOAST_DURATION);
}

function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    return toast;
}

function removeToastElement(toast) {
    toast.remove();
}

// ======= Modal Management =======
function handleModalClicks(e) {
    if (e.target === DOM.cartModal) {
        closeCart();
    }
    if (e.target === DOM.checkoutModal) {
        closeCheckout();
    }
}

// ======= Local Storage Management =======
function saveCartToStorage() {
    try {
        localStorage.setItem('laos_donuts_cart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Could not save cart to localStorage:', e);
    }
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('laos_donuts_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.warn('Could not load cart from localStorage:', e);
        cart = [];
    }
}

// ======= Contact Form Handler =======
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    if (contactForm && sendMessageBtn) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('يرجى ملء جميع الحقول المطلوبة!', 'error');
                return;
            }

            // Show loading state
            const originalText = sendMessageBtn.innerHTML;
            sendMessageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            sendMessageBtn.disabled = true;

            // Prepare contact data
            const contactData = {
                to_email: "ragabsalem665@gmail.com",
                from_name: name,
                from_email: email,
                from_phone: phone,
                subject: subject,
                message: message,
                reply_to: email,
                contact_type: "استفسار عام"
            };

            // Send contact message
            sendContactMessage(contactData)
                .then(() => {
                    showToast('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
                    contactForm.reset();
                })
                .catch((err) => {
                    console.error('Contact form error:', err);
                    showToast('حدث خطأ أثناء إرسال الرسالة', 'error');
                })
                .finally(() => {
                    sendMessageBtn.innerHTML = originalText;
                    sendMessageBtn.disabled = false;
                });
        });
    }
}

function sendContactMessage(contactData) {
    return emailjs.send(
        LAOS_CONFIG.EMAILJS_SERVICE_ID,
        LAOS_CONFIG.EMAILJS_TEMPLATE_ID,
        contactData
    );
}

// ======= Utility Functions =======
function testEmailJS() {
    const testParams = {
        to_email: "ragabsalem665@gmail.com",
        from_name: "اختبار",
        subject: "اختبار EmailJS",
        message: "هذا اختبار لتأكيد عمل EmailJS"
    };

    emailjs.send(
            LAOS_CONFIG.EMAILJS_SERVICE_ID,
            LAOS_CONFIG.EMAILJS_TEMPLATE_ID,
            testParams
        )
        .then(() => {
            showToast('اختبار EmailJS نجح!', 'success');
        })
        .catch(err => {
            console.error('EmailJS Test Failed:', err);
            showToast('فشل اختبار EmailJS: ' + (err.text || 'خطأ غير معروف'), 'error');
        });
}

// Initialize contact form when on contact page
if (window.location.pathname.includes('contact.html')) {
    document.addEventListener('DOMContentLoaded', initializeContactForm);
}

// Export functions to global scope for inline event handlers
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.testEmailJS = testEmailJS;

// Console message for developers
console.log('LAOS DONUTS JavaScript loaded successfully. Available functions: testEmailJS()');