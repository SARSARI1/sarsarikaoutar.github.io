document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNavigation();
    initSmoothScrolling();
    initActiveSectionObserver();
    initCarousels();
    initImageModals();
    initScrollAnimations();
    initFloatingElements(); // Kept simple floating effects without 3D
});

// ==================== COMPONENT INITIALIZERS ====================

function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (!mobileToggle || !navMenu) return;
    
    mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.innerHTML = isActive 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('nav ul');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.querySelector('.mobile-toggle').innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
}

function initActiveSectionObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(currentId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function initCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        if (!inner || items.length === 0) return;
        
        let currentIndex = 0;
        let interval;
        let isHovering = false;
        let touchStartX = 0;

        // Convert background images to proper img elements
        items.forEach(item => {
            if (item.style.backgroundImage) {
                const bgUrl = item.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)[1];
                item.innerHTML = `<img src="${bgUrl}" alt="Carousel image" loading="lazy">`;
                item.style.backgroundImage = 'none';
            }
        });

        function goToSlide(index) {
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            
            inner.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }

        function startAutoRotation() {
            if (!isHovering) {
                interval = setInterval(() => {
                    goToSlide(currentIndex + 1);
                }, 5000);
            }
        }

        function stopAutoRotation() {
            clearInterval(interval);
        }

        // Initialize
        goToSlide(0);
        startAutoRotation();

        // Event listeners
        carousel.addEventListener('mouseenter', () => {
            isHovering = true;
            stopAutoRotation();
        });

        carousel.addEventListener('mouseleave', () => {
            isHovering = false;
            startAutoRotation();
        });

        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoRotation();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            
            if (difference > 50) { // Swipe left
                goToSlide(currentIndex + 1);
            } else if (difference < -50) { // Swipe right
                goToSlide(currentIndex - 1);
            }
            
            startAutoRotation();
        }, { passive: true });

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoRotation();
                goToSlide(index);
                startAutoRotation();
            });
        });
    });
}

function initImageModals() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'img-modal';
    modal.innerHTML = `
        <button class="close-zoom" aria-label="Close zoomed image">&times;</button>
        <img src="" alt="" loading="lazy">
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.close-zoom');

    function openModal(imgSrc, imgAlt) {
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEscapeKey);
    }

    function closeModal() {
        modal.classList.remove('active');
        modalImg.src = '';
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscapeKey);
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }

    // Add click event to all gallery images
    document.querySelectorAll('.timeline-images img').forEach(img => {
        img.addEventListener('click', () => {
            openModal(img.src, img.alt || '');
        });

        // Error handling
        img.addEventListener('error', () => {
            img.style.display = 'none';
        });
    });

    // Close events
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll(
        '.timeline-item, .philosophy-container, .personal-philosophy-container, .skill-item, .portfolio-item'
    );
    
    if (elementsToAnimate.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elementsToAnimate.forEach(element => {
        element.classList.add('scroll-animate');
        observer.observe(element);
    });
}

function initFloatingElements() {
    // Simple floating animation without 3D
    document.querySelectorAll('.floating').forEach(element => {
        element.style.animation = `float 4s ease-in-out infinite`;
        element.style.animationDelay = `${Math.random() * 2}s`;
    });
}
// Add this to your existing JavaScript code
function initDownloadButton() {
    const downloadBtn = document.querySelector('a.btn[href="#"]');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = 'kaoutar_sarsari.pdf'; // Make sure this file exists in your root directory
            link.download = 'kaoutar_sarsari.pdf';
            
            // Trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Optional: Track the download
            console.log('CV download initiated');
        });
    }
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initialization code ...
    initDownloadButton(); // Add this line
});