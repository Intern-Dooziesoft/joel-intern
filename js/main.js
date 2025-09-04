// ===== MAIN JAVASCRIPT FILE =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initSearch();
    initMobileNav();
    initSmoothScrolling();
    initFormValidation();
    initAccessibility();
    
    // Add page load animation
    addPageLoadAnimation();
});

// ===== HEADER FUNCTIONALITY =====
function initHeader() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth header transition
    header.style.transition = 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease';
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.querySelector('.search-input');
    const searchSubmit = document.querySelector('.search-submit');
    
    if (!searchToggle || !searchBar) return;
    
    // Toggle search bar
    searchToggle.addEventListener('click', function() {
        searchBar.classList.toggle('active');
        
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
            // Update aria-expanded for accessibility
            searchToggle.setAttribute('aria-expanded', 'true');
        } else {
            searchInput.blur();
            searchToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Handle search submission
    if (searchSubmit) {
        searchSubmit.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
    
    // Handle Enter key in search input
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
    
    // Close search on outside click
    document.addEventListener('click', function(e) {
        if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
            searchBar.classList.remove('active');
            searchToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Perform search function
function performSearch(query) {
    if (!query.trim()) return;
    
    // Log search query (replace with actual search implementation)
    console.log('Searching for:', query);
    
    // You can implement actual search functionality here
    // For now, we'll just show a message
    showNotification(`Searching for: ${query}`, 'info');
    
    // Close search bar
    const searchBar = document.getElementById('searchBar');
    const searchToggle = document.getElementById('searchToggle');
    if (searchBar && searchToggle) {
        searchBar.classList.remove('active');
        searchToggle.setAttribute('aria-expanded', 'false');
    }
}

// ===== MOBILE NAVIGATION =====
function initMobileNav() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const body = document.body;
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Open mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        mobileNav.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent body scroll
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Focus management for accessibility
        const firstNavLink = mobileNav.querySelector('.mobile-nav-link');
        if (firstNavLink) {
            firstNavLink.focus();
        }
    });
    
    // Close mobile menu
    function closeMobileNav() {
        mobileNav.classList.remove('active');
        body.style.overflow = ''; // Restore body scroll
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus(); // Return focus to toggle button
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileNav();
        }
    });
    
    // Handle mobile nav link clicks
    const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile nav when a link is clicked
            closeMobileNav();
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error on input
                clearFieldError(this);
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Form is valid, proceed with submission
                submitForm(this);
            }
        });
        
        // Update submit button state
        if (submitButton) {
            updateSubmitButtonState(form, submitButton);
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    // Insert error after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    
    // Add error class to field
    field.classList.add('error');
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Update submit button state
function updateSubmitButtonState(form, submitButton) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    function checkFormValidity() {
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
            }
        });
        
        submitButton.disabled = !isValid;
        submitButton.style.opacity = isValid ? '1' : '0.6';
        submitButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }
    
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('blur', checkFormValidity);
    });
    
    // Initial check
    checkFormValidity();
}

// Submit form function
function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    submitButton.style.opacity = '0.6';
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Show success message
        showNotification('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
        
        // Restore button state
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.opacity = '1';
        
        // Clear any remaining errors
        const errors = form.querySelectorAll('.form-error');
        errors.forEach(error => error.remove());
        
        // Remove error classes
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => input.classList.remove('error'));
        
    }, 2000);
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Skip to main content link
    createSkipLink();
    
    // Focus management
    initFocusManagement();
    
    // Keyboard navigation
    initKeyboardNavigation();
    
    // ARIA live regions
    initAriaLive();
}

// Create skip to main content link
function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-navy);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Focus management
function initFocusManagement() {
    // Trap focus in mobile navigation
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        const focusableElements = mobileNav.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        mobileNav.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

// Keyboard navigation
function initKeyboardNavigation() {
    // Arrow key navigation for highlights
    const highlightsContainer = document.querySelector('.highlights-container');
    if (highlightsContainer) {
        const highlightCards = highlightsContainer.querySelectorAll('.highlight-card');
        
        highlightCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Highlight ${index + 1}: ${card.querySelector('h3').textContent}`);
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
}

// ARIA live regions
function initAriaLive() {
    // Create live region for notifications
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    
    document.body.appendChild(liveRegion);
    
    // Store reference for use in notifications
    window.ariaLiveRegion = liveRegion;
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <span class="material-icons-outlined">close</span>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#198754' : type === 'error' ? '#dc3545' : '#0d6efd'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
    
    // Announce to screen readers
    if (window.ariaLiveRegion) {
        window.ariaLiveRegion.textContent = message;
    }
}

// Remove notification
function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== PAGE LOAD ANIMATION =====
function addPageLoadAnimation() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // Trigger animation after a short delay
        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.TIEI = {
    showNotification,
    scrollToElement,
    formatPhoneNumber,
    isValidEmail,
    debounce,
    throttle
};
