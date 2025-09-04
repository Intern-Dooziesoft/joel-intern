// ===== ANIMATIONS JAVASCRIPT FILE =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initScrollAnimations();
    initTimelineAnimations();
    initHighlightAnimations();
    initParallaxEffects();
    initCounterAnimations();
    initHoverEffects();
    initPageTransitions();
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .rotate-in'
    );
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationClass = getAnimationClass(element);
                
                if (animationClass) {
                    element.classList.add('animate');
                    
                    // Add staggered animation for child elements
                    const children = element.querySelectorAll('[data-animate-delay]');
                    children.forEach(child => {
                        const delay = parseFloat(child.dataset.animateDelay) || 0;
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, delay);
                    });
                }
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        // Set initial state
        setInitialAnimationState(element);
        animationObserver.observe(element);
    });
}

// Get animation class from element
function getAnimationClass(element) {
    const classes = element.className.split(' ');
    return classes.find(cls => 
        cls.includes('fade-in-up') || 
        cls.includes('slide-in-left') || 
        cls.includes('slide-in-right') || 
        cls.includes('scale-in') || 
        cls.includes('rotate-in')
    );
}

// Set initial animation state
function setInitialAnimationState(element) {
    const animationClass = getAnimationClass(element);
    
    if (animationClass.includes('fade-in-up')) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    } else if (animationClass.includes('slide-in-left')) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
    } else if (animationClass.includes('slide-in-right')) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
    } else if (animationClass.includes('scale-in')) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
    } else if (animationClass.includes('rotate-in')) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-5deg) scale(0.9)';
    }
    
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
}

// ===== TIMELINE ANIMATIONS =====
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                animateTimelineItem(item);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    timelineItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
        
        timelineObserver.observe(item);
    });
}

// Animate timeline item
function animateTimelineItem(item) {
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
    
    // Animate marker
    const marker = item.querySelector('.timeline-marker');
    if (marker) {
        marker.style.animation = 'timelineMarkerPulse 0.6s ease 0.3s both';
    }
    
    // Animate content
    const content = item.querySelector('.timeline-content');
    if (content) {
        content.style.animation = 'timelineContentSlide 0.8s ease 0.4s both';
    }
}

// ===== HIGHLIGHT ANIMATIONS =====
function initHighlightAnimations() {
    const highlightCards = document.querySelectorAll('.highlight-card');
    
    if (highlightCards.length === 0) return;
    
    // Add staggered entrance animation
    highlightCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Trigger animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(card);
    });
    
    // Add hover animations
    highlightCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = 'var(--shadow-heavy)';
            
            // Animate icon
            const icon = this.querySelector('.highlight-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-light)';
            
            // Reset icon
            const icon = this.querySelector('.highlight-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16)); // 60fps
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (counters.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.counter);
                const duration = parseInt(counter.dataset.duration) || 2000;
                
                animateCounter(counter, target, duration);
                counterObserver.unobserve(counter); // Only animate once
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate counter
function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number based on type
        const formattedValue = formatCounterValue(current, element.dataset.format);
        element.textContent = formattedValue;
        
    }, 16);
}

// Format counter value
function formatCounterValue(value, format) {
    if (format === 'currency') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    } else if (format === 'percentage') {
        return Math.round(value) + '%';
    } else if (format === 'number') {
        return new Intl.NumberFormat('en-IN').format(Math.round(value));
    }
    
    return Math.round(value);
}

// ===== HOVER EFFECTS =====
function initHoverEffects() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.01)';
            this.style.boxShadow = 'var(--shadow-heavy)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-light)';
        });
    });
    
    // Navigation link hover effects
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== PAGE TRANSITIONS =====
function initPageTransitions() {
    // Add page transition class to body
    document.body.classList.add('page-loaded');
    
    // Smooth page transitions for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"], a[href^="./"], a[href^="/"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip external links and anchor links
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Add transition class
            document.body.classList.add('page-transitioning');
            
            // Simulate page transition (replace with actual routing if needed)
            setTimeout(() => {
                document.body.classList.remove('page-transitioning');
            }, 300);
        });
    });
}

// ===== ADVANCED ANIMATIONS =====

// Staggered text animation
function animateText(element, delay = 0) {
    const text = element.textContent;
    element.textContent = '';
    
    const chars = text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        span.style.display = 'inline-block';
        return span;
    });
    
    chars.forEach((char, index) => {
        element.appendChild(char);
        
        setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0)';
        }, delay + (index * 50));
    });
}

// Morphing animation between elements
function morphElement(fromElement, toElement, duration = 600) {
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    
    const deltaX = fromRect.left - toRect.left;
    const deltaY = fromRect.top - toRect.top;
    const deltaW = fromRect.width / toRect.width;
    const deltaH = fromRect.height / toRect.height;
    
    fromElement.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    fromElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
    
    setTimeout(() => {
        fromElement.style.transform = 'translate(0, 0) scale(1, 1)';
    }, 50);
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Throttle function for scroll events
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

// Debounce function for resize events
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

// Request animation frame wrapper
function requestAnimationFrameWrapper(callback) {
    if (window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
    } else {
        return setTimeout(callback, 1000 / 60);
    }
}

// ===== ANIMATION UTILITIES =====

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

// Get element position relative to viewport
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset,
        right: rect.right + window.pageXOffset
    };
}

// Calculate distance between two elements
function getDistanceBetweenElements(element1, element2) {
    const pos1 = getElementPosition(element1);
    const pos2 = getElementPosition(element2);
    
    const deltaX = pos1.left - pos2.left;
    const deltaY = pos1.top - pos2.top;
    
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// ===== CSS ANIMATION HELPERS =====

// Add CSS animation
function addCSSAnimation(element, animationName, duration = 1000, delay = 0) {
    element.style.animation = `${animationName} ${duration}ms ease ${delay}ms both`;
}

// Remove CSS animation
function removeCSSAnimation(element) {
    element.style.animation = '';
}

// Pause CSS animation
function pauseCSSAnimation(element) {
    element.style.animationPlayState = 'paused';
}

// Resume CSS animation
function resumeCSSAnimation(element) {
    element.style.animationPlayState = 'running';
}

// ===== ANIMATION PRESETS =====

// Fade in animation
function fadeIn(element, duration = 500, delay = 0) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease ${delay}ms`;
    
    setTimeout(() => {
        element.style.opacity = '1';
    }, delay);
}

// Slide in from left
function slideInLeft(element, duration = 500, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-50px)';
    element.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`;
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    }, delay);
}

// Slide in from right
function slideInRight(element, duration = 500, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(50px)';
    element.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`;
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    }, delay);
}

// Scale in animation
function scaleIn(element, duration = 500, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`;
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    }, delay);
}

// ===== EXPORT ANIMATION FUNCTIONS =====
window.TIEIAnimations = {
    fadeIn,
    slideInLeft,
    slideInRight,
    scaleIn,
    animateText,
    morphElement,
    addCSSAnimation,
    removeCSSAnimation,
    pauseCSSAnimation,
    resumeCSSAnimation,
    isInViewport,
    getElementPosition,
    getDistanceBetweenElements
};
