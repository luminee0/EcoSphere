// Global Variables
let currentTheme = 'light';
let isLoading = true;
let scrollPosition = 0;
let currentActiveCards = null;
let currentProject = 1;
let testimonialsAnimated = false;
let videoExpanded = false;

// DOM Elements
const loader = document.getElementById('loader');
const themeToggle = document.getElementById('theme-toggle');
const navbar = document.querySelector('.navbar');
const heroSection = document.getElementById('hero');
const keywords = document.querySelectorAll('.keyword');
const dataCards = document.querySelectorAll('.data-card');
const statNumbers = document.querySelectorAll('.stat-number');
const videoTrigger = document.querySelector('.video-trigger');
const videoFullscreen = document.querySelector('.video-fullscreen');
const closeVideo = document.querySelector('.close-video');
const comparisonImages = document.querySelectorAll('.comparison-image');
const workShowcase = document.querySelector('.work-showcase');
const projectNumber = document.querySelector('.project-number');
const projectInfo = document.querySelector('.project-info');
const projectImage = document.querySelector('.project-image img');
const testimonialsSection = document.getElementById('testimonials');
const splitText = document.querySelector('.split-text');
const testimonialsContainer = document.querySelector('.testimonials-container');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeLoader();
    initializeTheme();
    initializeScrollEffects();
    initializeAnimations();
    initializeInteractions();
    initializeRippleEffect();
    initializeCarousels();
    initializeNavigation();
    initializeComparisonCarousel();
    initializeVideoSection();
    randomizeDataCards();
});

// Loader Animation
function initializeLoader() {
    const counter = document.querySelector('.counter');
    const loadingBar = document.querySelector('.loading-bar');
    let count = 0;
    
    const counterInterval = setInterval(() => {
        count++;
        counter.textContent = count.toString().padStart(3, '0');
        loadingBar.style.width = count + '%';
        
        if (count >= 100) {
            clearInterval(counterInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                isLoading = false;
                animateOnLoad();
            }, 500);
        }
    }, 30);
}

// Theme Toggle
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Randomize Data Cards Positions
function randomizeDataCards() {
    const cards = document.querySelectorAll('.data-card');
    const container = document.querySelector('.data-cards');
    
    cards.forEach((card, index) => {
        // Random position within the container
        const randomTop = Math.random() * 70 + 10; // 10% to 80% from top
        const randomLeft = Math.random() * 70 + 10; // 10% to 80% from left
        
        // Random size variations
        const randomScale = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 scale
        const randomWidth = 180 + Math.random() * 80; // 180px to 260px
        const randomHeight = 130 + Math.random() * 60; // 130px to 190px
        
        card.style.position = 'absolute';
        card.style.top = `${randomTop}%`;
        card.style.left = `${randomLeft}%`;
        card.style.width = `${randomWidth}px`;
        card.style.height = `${randomHeight}px`;
        card.style.transform = `scale(${randomScale})`;
    });
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        scrollPosition = window.pageYOffset;
        
        // Navbar scroll effect with glassmorphism background
        if (scrollPosition > 100) {
          navbar.style.background = currentTheme === 'light' 
          ? 'rgba(255, 255, 255, 0.4)' 
          : 'rgba(15, 23, 42, 0.2)';
        } else {
          navbar.style.background = currentTheme === 'light' 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'rgba(15, 23, 42, 0.15)';
        }

        // Optional: Ensure blur always applies (in case inline styles override it)
        navbar.style.backdropFilter = 'blur(12px)';
        navbar.style.webkitBackdropFilter = 'blur(12px)';
        
        // Video section scroll animation
        handleVideoScroll();
        
        // Work showcase scroll animation
        handleWorkShowcaseScroll();
        
        // Testimonials scroll animation
        handleTestimonialsScroll();
        
        // Animate elements on scroll
        animateOnScroll();
    });
}

function handleVideoScroll() {
    const videoSection = document.querySelector('.video-section');
    if (!videoSection) return;
    
    const sectionTop = videoSection.offsetTop;
    const sectionHeight = videoSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const thumbnail = document.querySelector('.video-thumbnail');
    
    if (scrollPosition >= sectionTop - windowHeight && scrollPosition <= sectionTop + sectionHeight) {
        const progress = (scrollPosition - (sectionTop - windowHeight)) / windowHeight;
        
        if (progress > 0.3 && !videoExpanded) {
            // Expand video thumbnail
            thumbnail.style.transition = 'all 1s ease';
            thumbnail.style.position = 'fixed';
            thumbnail.style.top = '2rem';
            thumbnail.style.left = '2rem';
            thumbnail.style.right = '2rem';
            thumbnail.style.bottom = '2rem';
            thumbnail.style.width = 'calc(100vw - 4rem)';
            thumbnail.style.height = 'calc(100vh - 4rem)';
            thumbnail.style.zIndex = '1000';
            thumbnail.style.filter = 'none'; // Remove blue filter
            
            // Start video
            setTimeout(() => {
                const video = videoFullscreen.querySelector('video');
                if (video) {
                    videoFullscreen.classList.add('active');
                    video.play();
                }
            }, 1000);
            
            videoExpanded = true;
        }
    }
}

function handleWorkShowcaseScroll() {
    if (!workShowcase) return;
    
    const sectionTop = workShowcase.offsetTop;
    const sectionHeight = workShowcase.offsetHeight;
    const windowHeight = window.innerHeight;
    
    if (scrollPosition >= sectionTop - windowHeight && scrollPosition <= sectionTop + sectionHeight) {
        const progress = (scrollPosition - (sectionTop - windowHeight)) / windowHeight;
        
        // Change project based on scroll progress
        const newProject = Math.min(Math.floor(progress * 3) + 1, 3);
        
        if (newProject !== currentProject) {
            updateProject(newProject);
            currentProject = newProject;
        }
    }
}

function updateProject(projectNum) {
    const projects = [
        {
            name: "Carbon Neutral Office",
            description: "Complete sustainability transformation for tech company headquarters",
            image: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=400",
            bg: "#0f172a"
        },
        {
            name: "Green Manufacturing Hub",
            description: "Zero-waste production facility with renewable energy integration",
            image: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=400",
            bg: "#1e293b"
        },
        {
            name: "Smart City Initiative",
            description: "Urban sustainability platform for municipal carbon management",
            image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
            bg: "#334155"
        }
    ];
    
    const project = projects[projectNum - 1];
    
    // Animate number change
    const digits = projectNumber.querySelectorAll('.number-digit');
    digits[1].style.transform = 'translateY(-100%)';
    
    setTimeout(() => {
        digits[1].textContent = projectNum;
        digits[1].style.transform = 'translateY(0)';
        
        // Update content
        projectInfo.querySelector('.project-name').textContent = project.name;
        projectInfo.querySelector('.project-description').textContent = project.description;
        projectImage.src = project.image;
        
        // Change background color
        workShowcase.style.backgroundColor = project.bg;
    }, 250);
}

function handleTestimonialsScroll() {
    if (!testimonialsSection || testimonialsAnimated) return;
    
    const sectionTop = testimonialsSection.offsetTop;
    const windowHeight = window.innerHeight;
    
    if (scrollPosition >= sectionTop - windowHeight * 0.7) {
        animateTestimonials();
        testimonialsAnimated = true;
    }
}

function animateTestimonials() {
    const wordLeft = document.querySelector('.word-left');
    const wordRight = document.querySelector('.word-right');
    const cards = document.querySelectorAll('.testimonial-card');
    
    // Split text animation
    wordLeft.classList.add('split');
    wordRight.classList.add('split');
    
    // Randomize card positions and show them
    setTimeout(() => {
        cards.forEach((card, index) => {
            // Random positions
            const randomTop = Math.random() * 200 + 50; // Random top position
            const randomLeft = Math.random() * 60 + 20; // Random left position
            const randomScale = 0.9 + Math.random() * 0.2; // Random scale
            
            card.style.position = 'absolute';
            card.style.top = `${randomTop}px`;
            card.style.left = `${randomLeft}%`;
            card.style.transform = `scale(${randomScale})`;
            
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 200);
        });
        
        // Start horizontal scroll after cards are visible
        setTimeout(() => {
            testimonialsContainer.classList.add('horizontal-scroll');
        }, 2000);
    }, 800);
}

// Animations
function initializeAnimations() {
    // Animate stats numbers
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                } else if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.classList.add('animate-in');
                }
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(num => observer.observe(num));
    document.querySelectorAll('.feature-card').forEach(card => observer.observe(card));
}

function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

function animateOnLoad() {
    // Fade in hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Animate review bar
    const reviewBar = document.querySelector('.review-bar');
    if (reviewBar) {
        reviewBar.style.opacity = '0';
        reviewBar.style.transform = 'translateY(-50px)';
        
        setTimeout(() => {
            reviewBar.style.transition = 'all 0.8s ease';
            reviewBar.style.opacity = '1';
            reviewBar.style.transform = 'translateY(0)';
        }, 800);
    }
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (scrollPosition > elementTop - windowHeight + elementHeight / 4) {
            element.classList.add('animated');
        }
    });
}

// Interactions
function initializeInteractions() {
    // Keyword hover effects for data cards
    keywords.forEach(keyword => {
        keyword.addEventListener('mouseenter', function() {
            const cardType = this.getAttribute('data-cards');
            showDataCards(cardType);
        });
        
        keyword.addEventListener('mouseleave', function() {
            hideDataCards();
        });
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = this.parentElement.querySelectorAll('.filter-btn');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart (placeholder functionality)
            updateChart(this.getAttribute('data-filter') || this.getAttribute('data-status'));
        });
    });
}

function showDataCards(type) {
    // Hide all cards first
    dataCards.forEach(card => {
        card.classList.remove('visible');
    });
    
    // Show cards of the specified type
    const targetCards = document.querySelectorAll(`[data-type="${type}"]`);
    targetCards.forEach(card => {
        card.classList.add('visible');
    });
    
    currentActiveCards = type;
}

function hideDataCards() {
    dataCards.forEach(card => {
        card.classList.remove('visible');
    });
    currentActiveCards = null;
}

function updateChart(filter) {
    // Placeholder function for chart updates
    console.log('Updating chart with filter:', filter);
    
    // Add visual feedback
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.transform = 'scaleY(0.8)';
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
            }, 100);
        }, index * 50);
    });
}

// Comparison Carousel
function initializeComparisonCarousel() {
    comparisonImages.forEach(image => {
        const img = image.querySelector('img');
        const defaultSrc = image.getAttribute('data-default');
        const hoverSrc = image.getAttribute('data-hover');
        
        image.addEventListener('mouseenter', function() {
            if (hoverSrc) {
                img.src = hoverSrc;
            }
            img.style.transform = 'scale(1.1)';
        });
        
        image.addEventListener('mouseleave', function() {
            if (defaultSrc) {
                img.src = defaultSrc;
            }
            img.style.transform = 'scale(1)';
        });
    });
}

// Video Section
function initializeVideoSection() {
    if (videoTrigger && videoFullscreen) {
        videoTrigger.addEventListener('click', function() {
            videoFullscreen.classList.add('active');
            const video = videoFullscreen.querySelector('video');
            if (video) video.play();
        });
    }
    
    if (closeVideo) {
        closeVideo.addEventListener('click', function() {
            videoFullscreen.classList.remove('active');
            const video = videoFullscreen.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
            
            // Reset video thumbnail
            const thumbnail = document.querySelector('.video-thumbnail');
            thumbnail.style.position = 'relative';
            thumbnail.style.top = 'auto';
            thumbnail.style.left = 'auto';
            thumbnail.style.right = 'auto';
            thumbnail.style.bottom = 'auto';
            thumbnail.style.width = '200px';
            thumbnail.style.height = '150px';
            thumbnail.style.zIndex = 'auto';
            thumbnail.style.filter = 'hue-rotate(200deg) saturate(2)';
            
            videoExpanded = false;
        });
    }
}

// Ripple Effect
function initializeRippleEffect() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('keyword') || 
            e.target.classList.contains('cta-primary') || 
            e.target.classList.contains('cta-secondary')) {
            createRipple(e);
        }
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// Carousels
function initializeCarousels() {
    // Logo carousel
    const logoRows = document.querySelectorAll('.logo-row');
    logoRows.forEach(row => {
        // Clone logos for infinite scroll effect
        const logos = row.querySelectorAll('.logo-item');
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            row.appendChild(clone);
        });
    });
    
    // Auto-change logo content
    const logoItems = document.querySelectorAll('.logo-item span');
    const companies = [
        'TechCorp', 'GreenEnergy', 'EcoTech', 'SustainableCo', 
        'CleanPower', 'FutureGreen', 'EcoSolutions', 'GreenTech',
        'CleanEnergy', 'SolarPower', 'WindTech', 'EcoFriendly'
    ];
    
    setInterval(() => {
        logoItems.forEach(item => {
            const randomCompany = companies[Math.floor(Math.random() * companies.length)];
            item.textContent = randomCompany;
        });
    }, 2000);
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Utility Functions
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

// Performance optimizations
const debouncedScroll = debounce(initializeScrollEffects, 10);
const throttledScroll = throttle(() => {}, 16);

window.addEventListener('scroll', throttledScroll);
window.addEventListener('resize', debouncedScroll);

// Additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Smooth reveal animations for cards
    const cards = document.querySelectorAll('.feature-card, .stat-card, .testimonial-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Intersection Observer for card animations
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => cardObserver.observe(card));
    
    // Enhanced hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.cta-btn, .filter-btn, .add-dashboard, .meet-customers');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Error handling and fallbacks
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Fallback behavior
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Escape key closes video
    if (e.key === 'Escape' && videoFullscreen && videoFullscreen.classList.contains('active')) {
        closeVideo.click();
    }
    
    // Enter key on interactive elements
    if (e.key === 'Enter' && e.target.classList.contains('keyword')) {
        e.target.click();
    }
});

// Focus management
const focusableElements = document.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

console.log('EcoSphere website initialized successfully!');