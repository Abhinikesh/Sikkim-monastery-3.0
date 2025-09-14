// Monastery360 — Sikkim JavaScript Functionality
// Modular implementation with clear separation of concerns

// ============================================================================
// GLOBAL VARIABLES AND UTILITIES
// ============================================================================

// DOM Elements
const navbar = document.getElementById("navbar");
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.getElementById("nav-menu");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Modal system
let currentModal = null;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Create modal element
function createModal(content, className = '') {
  const modal = document.createElement('div');
  modal.className = `modal ${className}`;
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <button class="modal-close" aria-label="Close modal">&times;</button>
      ${content}
    </div>
  `;
  return modal;
}

// Show modal
function showModal(modal) {
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  currentModal = modal;
  
  // Animate in
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

// Hide modal
function hideModal(modal) {
  modal.classList.remove('active');
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
    document.body.style.overflow = '';
    currentModal = null;
  }, 300);
}

// ============================================================================
// VIDEO FUNCTIONALITY
// ============================================================================

function initVideos() {
  console.log('Initializing video functionality...');
  
  // Intersection Observer for video autoplay
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (video) {
        if (entry.isIntersecting) {
          video.play().catch(e => console.log('Video autoplay prevented:', e));
        } else {
          video.pause();
        }
      }
    });
  }, { threshold: 0.5 });

  // Observe monastery video cards
  const monasteryCards = document.querySelectorAll('.monastery-card');
  monasteryCards.forEach(card => {
    videoObserver.observe(card);
  });

  // Video modal functionality
  const exploreButtons = document.querySelectorAll('[data-action="explore-360vt"]');
  exploreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = button.closest('.monastery-card');
      const video = card.querySelector('video');
      const title = card.querySelector('.monastery-title').textContent;
      
      if (video) {
        const videoSrc = video.querySelector('source')?.src || video.src;
        const poster = video.poster;
        
        const videoModal = createModal(`
          <div class="video-player">
            <video controls autoplay poster="${poster}">
              <source src="${videoSrc}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <h3>${title}</h3>
            <p>Experience the 360° virtual tour of ${title}</p>
          </div>
        `, 'video-modal');
        
        showModal(videoModal);
        
        // Handle modal close
        videoModal.querySelector('.modal-close').addEventListener('click', () => {
          hideModal(videoModal);
        });
        
        videoModal.querySelector('.modal-backdrop').addEventListener('click', () => {
          hideModal(videoModal);
        });
      }
    });
  });
}

// ============================================================================
// MODAL SYSTEM
// ============================================================================

function initModals() {
  console.log('Initializing modal system...');
  
  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentModal) {
      hideModal(currentModal);
    }
  });
  
  // Close modal when clicking backdrop
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop') && currentModal) {
      hideModal(currentModal);
    }
  });
}

// ============================================================================
// MAP FUNCTIONALITY
// ============================================================================

function initMap() {
  console.log('Initializing map functionality...');
  
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;
  
  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    console.warn('Leaflet.js not loaded. Loading from CDN...');
    loadLeaflet();
    return;
  }
  
  // Initialize map
  const map = L.map('map').setView([27.3389, 88.6065], 10); // Sikkim coordinates
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Monastery data with coordinates
  const monasteries = [
    {
      name: 'Rumtek Monastery',
      lat: 27.3389,
      lng: 88.6065,
      description: 'The largest monastery in Sikkim, known for its stunning architecture and spiritual significance as the seat of the Karmapa.'
    },
    {
      name: 'Enchey Monastery',
      lat: 27.3331,
      lng: 88.6122,
      description: 'A 200-year-old monastery with beautiful murals and traditional architecture, offering panoramic views of Gangtok.'
    },
    {
      name: 'Pemayangtse Monastery',
      lat: 27.3000,
      lng: 88.2500,
      description: 'One of the oldest monasteries in Sikkim, famous for its intricate wood carvings and ancient Buddhist artifacts.'
    },
    {
      name: 'Tashiding Monastery',
      lat: 27.4000,
      lng: 88.5000,
      description: 'A sacred monastery known for its annual Bumchu festival and the holy water ceremony.'
    },
    {
      name: 'Phodong Monastery',
      lat: 27.3500,
      lng: 88.5500,
      description: 'A beautiful monastery with stunning murals and traditional architecture, offering a peaceful retreat.'
    }
  ];
  
  // Add markers
  monasteries.forEach(monastery => {
    const marker = L.marker([monastery.lat, monastery.lng]).addTo(map);
    
    marker.bindPopup(`
      <div class="map-popup">
        <h3>${monastery.name}</h3>
        <p>${monastery.description}</p>
        <button class="lets-go-btn" data-lat="${monastery.lat}" data-lng="${monastery.lng}">
          Let's go
        </button>
      </div>
    `);
  });
  
  // Handle "Let's go" button clicks
  map.on('popupopen', () => {
    const letsGoBtn = document.querySelector('.lets-go-btn');
    if (letsGoBtn) {
      letsGoBtn.addEventListener('click', () => {
        const lat = letsGoBtn.dataset.lat;
        const lng = letsGoBtn.dataset.lng;
        openGoogleMapsDirections(lat, lng);
      });
    }
  });
}

// Load Leaflet from CDN
function loadLeaflet() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
  
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = () => {
    console.log('Leaflet loaded, initializing map...');
    initMap();
  };
  document.head.appendChild(script);
}

// Open Google Maps directions
function openGoogleMapsDirections(lat, lng) {
  // Get current location if available
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lat},${lng}`;
        window.open(url, '_blank');
      },
      () => {
        // Fallback to current location text
        const url = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${lat},${lng}`;
        window.open(url, '_blank');
      }
    );
  } else {
    // Fallback to current location text
    const url = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${lat},${lng}`;
    window.open(url, '_blank');
  }
}

// ============================================================================
// SHOP FUNCTIONALITY
// ============================================================================

function initShop() {
  console.log('Initializing shop functionality...');
  
  const buyButtons = document.querySelectorAll('[data-action="add-to-cart"]');
  buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productCard = button.closest('.product-card');
      const productName = productCard.querySelector('.product-name').textContent;
      const productPrice = productCard.querySelector('.product-price').textContent;
      const productDescription = productCard.querySelector('.product-description').textContent;
      
      const shopModal = createModal(`
        <div class="shop-modal">
          <h3>${productName}</h3>
          <p class="product-price">${productPrice}</p>
          <p class="product-description">${productDescription}</p>
          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <select id="quantity">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" onclick="this.closest('.modal').querySelector('.modal-close').click()">
              Continue Shopping
            </button>
            <button class="btn-primary" onclick="proceedToCheckout('${productName}', ${productPrice.replace('₹', '').replace(',', '')})">
              Proceed to Checkout
            </button>
          </div>
        </div>
      `, 'shop-modal');
      
      showModal(shopModal);
      
      // Handle modal close
      shopModal.querySelector('.modal-close').addEventListener('click', () => {
        hideModal(shopModal);
      });
    });
  });
}

// Proceed to checkout (placeholder function)
function proceedToCheckout(productName, price) {
  console.log(`Proceeding to checkout for ${productName} at ₹${price}`);
  alert(`Checkout functionality would be implemented here.\n\nProduct: ${productName}\nPrice: ₹${price}`);
  
  // Close modal
  if (currentModal) {
    hideModal(currentModal);
  }
}

// ============================================================================
// GALLERY FUNCTIONALITY
// ============================================================================

function initGallery() {
  console.log('Initializing gallery functionality...');
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const isVideo = item.dataset.type === 'video';
      const image = item.querySelector('.gallery-image img');
      const video = item.querySelector('.gallery-video');
      
      if (isVideo && video) {
        // Video modal
        const videoSrc = video.querySelector('source')?.src || video.src;
        const poster = video.poster;
        
        const videoModal = createModal(`
          <div class="video-player">
            <video controls autoplay poster="${poster}">
              <source src="${videoSrc}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `, 'video-modal');
        
        showModal(videoModal);
      } else if (image) {
        // Image lightbox
        const imageSrc = image.src;
        const imageAlt = image.alt;
        
        const imageModal = createModal(`
          <div class="image-lightbox">
            <img src="${imageSrc}" alt="${imageAlt}" />
            <p>${imageAlt}</p>
          </div>
        `, 'image-modal');
        
        showModal(imageModal);
      }
      
      // Handle modal close
      if (currentModal) {
        currentModal.querySelector('.modal-close').addEventListener('click', () => {
          hideModal(currentModal);
        });
      }
    });
  });
}

// ============================================================================
// NAVBAR FUNCTIONALITY
// ============================================================================

function initNavbar() {
  console.log('Initializing navbar functionality...');
  
  // Mobile menu toggle
  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('active');
      }
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
      }
    });
  });
  
  // Sticky navbar effect
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
  
  // Smooth scrolling for navigation links
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    });
  });
}

// ============================================================================
// CULTURAL CALENDAR FUNCTIONALITY
// ============================================================================

function initCulturalCalendar() {
  console.log('Initializing cultural calendar functionality...');
  
  // Handle "Explore more festivals" button
  const exploreFestivalsBtn = document.querySelector('.explore-festivals-btn');
  if (exploreFestivalsBtn) {
    exploreFestivalsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'festivals.html';
    });
  }
}

// ============================================================================
// PLAN YOUR VISIT FUNCTIONALITY
// ============================================================================

function initPlanYourVisit() {
  console.log('Initializing plan your visit functionality...');
  
  // Handle "Explore" buttons
  const planButtons = document.querySelectorAll('.plan-button');
  planButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const href = button.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    });
  });
}

// ============================================================================
// DARK MODE FUNCTIONALITY
// ============================================================================

function initDarkMode() {
  console.log('Initializing dark mode functionality...');
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      
      // Update icon with animation
      const icon = darkModeToggle.querySelector('i');
      darkModeToggle.style.transform = 'scale(0.8) rotateZ(180deg)';
      
      setTimeout(() => {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        darkModeToggle.style.transform = 'scale(1) rotateZ(0deg)';
      }, 150);
      
      // Save preference
      localStorage.setItem('darkMode', isDarkMode);
    });
  }
  
  // Load dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) {
      darkModeToggle.querySelector('i').className = 'fas fa-sun';
    }
  }
}

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

function initAnimations() {
  console.log('Initializing animation system...');
  
  // Enhanced Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Special handling for different elements
        if (entry.target.classList.contains('timeline-item')) {
          // Stagger timeline animations
          const items = entry.target.parentElement.querySelectorAll('.timeline-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate');
            }, index * 200);
          });
        }
        
        if (entry.target.tagName === 'SECTION') {
          // Animate section elements
          const cards = entry.target.querySelectorAll('.monastery-card, .info-card, .gallery-item, .product-card, .festival-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.animationDelay = `${index * 0.1}s`;
              card.classList.add('animate');
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);
  
  // Observe elements for animations
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => observer.observe(section));
  
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item) => observer.observe(item));
}

// ============================================================================
// PARALLAX EFFECTS
// ============================================================================

function initParallax() {
  console.log('Initializing parallax effects...');
  
  // Enhanced Parallax Effect
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxImage = document.querySelector('.parallax-image');
    if (parallaxImage) {
      const speed = scrolled * 0.5;
      parallaxImage.style.transform = `translateY(${speed}px)`;
    }
    
    // Parallax effect for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
      const heroSpeed = scrolled * 0.3;
      heroContent.style.transform = `translateY(${heroSpeed}px)`;
    }
  });
  
  // Mouse movement parallax effect
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Subtle parallax for hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle && window.scrollY < window.innerHeight) {
      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;
      heroTitle.style.transform = `translate(${moveX}px, ${moveY}px)`;
      if (heroSubtitle) {
        heroSubtitle.style.transform = `translate(${-moveX * 0.5}px, ${-moveY * 0.5}px)`;
      }
    }
  });
}

// ============================================================================
// HERO CTA FUNCTIONALITY
// ============================================================================

function initHeroCTA() {
  console.log('Initializing hero CTA functionality...');
  
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      ctaButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        ctaButton.style.transform = 'scale(1)';
        const featuredSection = document.querySelector('#featured-monasteries');
        if (featuredSection) {
          featuredSection.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }, 150);
    });
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Monastery360 — Sikkim: Initializing application...');
  
  // Initialize all modules
  initModals();
  initVideos();
  initMap();
  initShop();
  initGallery();
  initNavbar();
  initCulturalCalendar();
  initPlanYourVisit();
  initDarkMode();
  initAnimations();
  initParallax();
  initHeroCTA();
  
  // Add loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  console.log('Monastery360 — Sikkim: Application initialized successfully!');
});

// ============================================================================
// CSS FOR MODALS (injected dynamically)
// ============================================================================

// Inject modal styles
const modalStyles = `
<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal.active {
  opacity: 1;
  visibility: visible;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 15px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.modal.active .modal-content {
  transform: scale(1);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  z-index: 1;
}

.modal-close:hover {
  color: #000;
}

.video-player {
  padding: 2rem;
  text-align: center;
}

.video-player video {
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: 10px;
}

.video-player h3 {
  margin: 1rem 0 0.5rem;
  color: #333;
}

.video-player p {
  color: #666;
  margin-bottom: 0;
}

.image-lightbox {
  padding: 2rem;
  text-align: center;
}

.image-lightbox img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 10px;
}

.image-lightbox p {
  margin: 1rem 0 0;
  color: #666;
}

.shop-modal {
  padding: 2rem;
  max-width: 500px;
}

.shop-modal h3 {
  margin-bottom: 1rem;
  color: #333;
}

.shop-modal .product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.quantity-selector {
  margin: 1.5rem 0;
}

.quantity-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.quantity-selector select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.map-popup .lets-go-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.map-popup .lets-go-btn:hover {
  background: var(--secondary-color);
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
`;

// Inject styles into head
document.head.insertAdjacentHTML('beforeend', modalStyles);