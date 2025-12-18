// ======= LAOS DONUTS - Common Elements Manager =======

class CommonElementsManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isInitialized = false;
    }

    // Initialize common elements
    init() {
        if (this.isInitialized) return;

        this.insertHeader();
        this.insertFooter();
        this.insertCartModals();
        this.setActiveNavigation();
        this.addCustomStyles();

        this.isInitialized = true;
        console.log('Common Elements Manager initialized');
    }

    // Get current page name
    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'home.html';
    }

    // Insert header element
    insertHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerHTML = this.getHeaderHTML();
            headerPlaceholder.outerHTML = headerHTML;
        }
    }

    // Get header HTML template
    getHeaderHTML() {
        return `
        <header class="header">
            <div class="container">
                <a href="home.html" class="logo">
                    <img src="https://i.postimg.cc/SQrQYyWS/1.jpg" alt="Logo"> Donuts Laos
                </a>
                <nav class="nav">
                    <ul>
                        <li><a href="home.html">الرئيسية</a></li>
                        <li><a href="menu.html">القائمة</a></li>
                        <li><a href="about.html">قصتنا</a></li>
                        <li><a href="contact.html">تواصل</a></li>
                    </ul>
                </nav>
            </div>
        </header>`;
    }

    // Insert footer element
    insertFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerHTML = this.getFooterHTML();
            footerPlaceholder.outerHTML = footerHTML;
        }
    }

    // Get footer HTML template
    getFooterHTML() {
        return `
        <footer class="footer">
            <div class="container">
                <div class="footer-col">
                    <h4>LAOS DONUTS</h4>
                    <p>دونات فاخرة.. المذاق الرفيع في كل قضمة!</p>
                    <p>نحن شغوفون بصنع الدونات الألذ والأكثر تميزاً، باستخدام مكونات طبيعية عالية الجودة.</p>
                </div>

                <div class="footer-col">
                    <h4>روابط سريعة</h4>
                    <p><a href="home.html"><i class="fas fa-home"></i> الرئيسية</a></p>
                    <p><a href="menu.html"><i class="fas fa-utensils"></i> القائمة</a></p>
                    <p><a href="about.html"><i class="fas fa-heart"></i> قصتنا</a></p>
                    <p><a href="contact.html"><i class="fas fa-phone"></i> تواصل معنا</a></p>
                </div>

                <div class="footer-col">
                    <h4>تابعنا</h4>
                    <p>اشترك في صفحاتنا للاطلاع على أحدث العروض والمنتجات الجديدة</p>
                    <div class="social-icons">
                        <a href="#" title="تابعنا على فيسبوك" aria-label="فيسبوك"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" title="تابعنا على إنستغرام" aria-label="إنستغرام"><i class="fab fa-instagram"></i></a>
                        <a href="#" title="تابعنا على تويتر" aria-label="تويتر"><i class="fab fa-twitter"></i></a>
                        <a href="#" title="تابعنا على سناب شات" aria-label="سناب شات"><i class="fab fa-snapchat"></i></a>
                    </div>
                </div>
            </div>

            <div class="copyright">
                <div class="container">
                    <p>&copy; 2025 DONUTS LAOS. جميع الحقوق محفوظة. | صُنع بـ <i class="fas fa-heart" style="color: var(--accent-pink);"></i> فى مصر </p>
                </div>
            </div>
        </footer>`;
    }

    // Insert cart modals
    insertCartModals() {
        const modalsPlaceholder = document.getElementById('modals-placeholder');
        if (modalsPlaceholder) {
            const modalsHTML = this.getCartModalsHTML();
            modalsPlaceholder.outerHTML = modalsHTML;
        }
    }

    // Get cart modals HTML template
    getCartModalsHTML() {
        return `
        <!-- Cart Icon -->
        <div class="cart-icon-btn" id="cartBtn">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-badge" id="cartBadge">0</span>
        </div>

        <!-- Cart Modal -->
        <div class="modal" id="cartModal">
            <div class="modal-content">
                <span class="close-btn" id="closeCart">&times;</span>
                <h3>السلة الخاصة بك</h3>
                <div id="cartItems"></div>
                <div class="cart-summary">
                    المجموع: <span id="cartTotal">0.00 egp</span>
                </div>
                <button class="btn" id="checkoutBtn">الدفع</button>
            </div>
        </div>

        <!-- Checkout Modal -->
        <div class="modal" id="checkoutModal">
            <div class="modal-content">
                <span class="close-btn" id="closeCheckout">&times;</span>
                <h3>بيانات الدفع</h3>
                <div class="checkout-summary" id="checkoutSummary"></div>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label for="customerName">الاسم:</label>
                        <input type="text" id="customerName" required>
                    </div>
                    <div class="form-group">
                        <label for="customerPhone">رقم الهاتف:</label>
                        <input type="text" id="customerPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="customerAddress">العنوان:</label>
                        <textarea id="customerAddress" rows="2" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="paymentMethod">طريقة الدفع:</label>
                        <select id="paymentMethod" required>
                            <option value="كاش عند الاستلام">كاش عند الاستلام</option>
                            <option value="تحويل بنكي">تحويل بنكي</option>
                        </select>
                    </div>
                    <button type="submit" class="btn" id="placeOrderBtn">إتمام الطلب</button>
                </form>
            </div>
        </div>`;
    }

    // Set active navigation based on current page
    setActiveNavigation() {
        const currentPage = this.currentPage;
        const navLinks = document.querySelectorAll('.nav ul li a');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Add custom styles for common elements
    addCustomStyles() {
        if (!document.getElementById('common-elements-styles')) {
            const style = document.createElement('style');
            style.id = 'common-elements-styles';
            style.textContent = this.getCustomStyles();
            document.head.appendChild(style);
        }
    }

    // Custom styles for enhanced common elements
    getCustomStyles() {
        return `
            /* Enhanced Navigation */
            .nav ul li a {
                position: relative;
                transition: all 0.3s ease;
            }
            
            .nav ul li a::after {
                content: '';
                position: absolute;
                bottom: -5px;
                right: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
                transition: width 0.3s ease;
            }
            
            .nav ul li a:hover::after,
            .nav ul li a.active::after {
                width: 100%;
            }
            
            .nav ul li a:hover,
            .nav ul li a.active {
                color: var(--accent-secondary);
                transform: translateX(-5px);
            }
            
            /* Enhanced Social Icons */
            .social-icons {
                margin-top: 20px;
            }
            
            .social-icons a {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .social-icons a::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.5s;
            }
            
            .social-icons a:hover::before {
                left: 100%;
            }
            
            /* Enhanced Cart Icon */
            .cart-icon-btn {
                position: fixed;
                bottom: 30px;
                left: 30px;
                background: linear-gradient(135deg, #ffd93d, #f39c12);
                color: var(--text-dark);
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4em;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(255, 217, 61, 0.4);
                z-index: 999;
                transition: all 0.3s ease;
                border: 3px solid rgba(255, 255, 255, 0.2);
            }
            
            .cart-icon-btn:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 12px 35px rgba(255, 217, 61, 0.6);
                background: linear-gradient(135deg, #f39c12, #ffd93d);
            }
            
            .cart-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: linear-gradient(135deg, #ff6b9d, #c44569);
                color: var(--text-light);
                border-radius: 50%;
                padding: 4px 8px;
                font-size: 0.7em;
                font-weight: 700;
                line-height: 1;
                transform: translate(50%, -50%);
                box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
            }
            
            /* Enhanced Footer */
            .footer {
                position: relative;
                overflow: hidden;
            }
            
            .footer::before {
                animation: footerGlow 3s ease-in-out infinite alternate;
            }
            
            @keyframes footerGlow {
                0% {
                    box-shadow: 0 -5px 20px rgba(99, 102, 241, 0.1);
                }
                100% {
                    box-shadow: 0 -5px 30px rgba(99, 102, 241, 0.2);
                }
            }
            
            .footer-col {
                transition: all 0.3s ease;
            }
            
            .footer-col:hover {
                transform: translateY(-8px);
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            }
        `;
    }

    // Update cart badge with animation
    updateCartBadge(count) {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.animation = 'none';
            badge.offsetHeight; // Trigger reflow
            badge.style.animation = 'bounce 0.5s ease';
        }
    }

    // Show loading state for buttons
    showButtonLoading(buttonId, loadingText) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
            button.disabled = true;
        }
    }

    // Reset button loading state
    resetButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button && button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            button.disabled = false;
            delete button.dataset.originalText;
        }
    }
}

// Create global instance
const commonElements = new CommonElementsManager();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    commonElements.init();
});

// Export to global scope
window.commonElements = commonElements;

// Add bounce animation for cart badge
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(bounceStyle);