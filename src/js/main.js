// Navigation Toggle for Mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Collapsible widgets functionality
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const toggleIcon = this.querySelector('.toggle-icon');
            
            if (content && toggleIcon) {
                const isActive = content.classList.contains('active');
                
                // Handle nested collapsibles differently
                const isJWTSubHeader = this.classList.contains('jwt-sub-header');
                
                if (!isJWTSubHeader) {
                    // Close all other collapsible sections in the same container (for main sections)
                    const container = this.closest('.about-details, .skill-category, .experience-content, .tools-container');
                    if (container) {
                        const allContents = container.querySelectorAll('.collapsible-content:not(#jwt-encoder):not(#jwt-decoder)');
                        const allIcons = container.querySelectorAll('.toggle-icon');
                        
                        allContents.forEach(c => {
                            if (!c.id.includes('jwt-')) {
                                c.classList.remove('active');
                            }
                        });
                        allIcons.forEach(i => {
                            if (!i.closest('.jwt-subsection')) {
                                i.classList.remove('rotated');
                                i.textContent = '+';
                            }
                        });
                    }
                } else {
                    // For JWT sub-headers, only close other JWT subsections
                    const jwtContainer = this.closest('#jwt-tools');
                    if (jwtContainer) {
                        const otherJWTContents = jwtContainer.querySelectorAll('.jwt-subsection .collapsible-content');
                        const otherJWTIcons = jwtContainer.querySelectorAll('.jwt-subsection .toggle-icon');
                        
                        otherJWTContents.forEach(c => {
                            if (c !== content) {
                                c.classList.remove('active');
                            }
                        });
                        otherJWTIcons.forEach(i => {
                            if (i !== toggleIcon) {
                                i.classList.remove('rotated');
                                i.textContent = '+';
                            }
                        });
                    }
                }
                
                // Toggle current section
                if (!isActive) {
                    content.classList.add('active');
                    toggleIcon.classList.add('rotated');
                    toggleIcon.textContent = '−';
                } else {
                    content.classList.remove('active');
                    toggleIcon.classList.remove('rotated');
                    toggleIcon.textContent = '+';
                }
            }
        });
    });

    // Contact method interactions
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 50px rgba(0, 123, 255, 0.25)';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 15px 40px rgba(0, 123, 255, 0.2)';
        });
    });
    
    // Skill tag hover effects
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 11, 13, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 11, 13, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-section, .experience-section, .skills-section, .contact-section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero-section');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Experience item hover effects
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const content = this.querySelector('.experience-content');
            if (content) {
                content.style.transform = 'translateX(5px)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const content = this.querySelector('.experience-content');
            if (content) {
                content.style.transform = 'translateX(0)';
            }
        });
    });
    
    // Skill category hover effects
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 123, 255, 0.1)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Social icons hover effects
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Stats counter animation
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // Trigger counter animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // Typing effect for hero title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect after a delay
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 80);
        }
    }, 1000);
});

// Email validation utility function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function for smooth scrolling
function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animationStep(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smooth animation
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animationStep);
        }
    }
    
    requestAnimationFrame(animationStep);
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
});

// Add CSS class for JavaScript-enabled styling
document.documentElement.classList.add('js-enabled');