// ==========================
// UPPER DECK KL - MAIN SCRIPT
// ==========================

// ==========================
// DOM ELEMENTS
// ==========================
const navbar = document.querySelector('.navbar');
const scrollProgress = document.getElementById('scrollProgress');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const liveStatus = document.getElementById('liveStatus');
const floatingReserve = document.getElementById('floatingReserve');

// Reservation Sheet
const reservationSheet = document.getElementById('reservationSheet');
const sheetBackdrop = document.getElementById('sheetBackdrop');
const closeSheet = document.getElementById('closeSheet');
const reservationForm = document.getElementById('reservationForm');
const reservationSuccess = document.getElementById('reservationSuccess');
const occasionBtns = document.querySelectorAll('.occasion-btn');
const backToStep1 = document.getElementById('backToStep1');

// Menu Modal
const menuModal = document.getElementById('menuModal');
const openMenuBtn = document.getElementById('open-menu-btn');
const viewFullMenuBtn = document.getElementById('view-full-menu');
const closeModal = document.getElementById('closeModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const reserveFromMenu = document.getElementById('reserveFromMenu');

// Review Modal
const reviewModal = document.getElementById('reviewModal');
const addReviewBtn = document.getElementById('addReviewBtn');
const closeReviewModal = document.getElementById('closeReviewModal');
const reviewBackdrop = document.getElementById('reviewBackdrop');
const reviewForm = document.getElementById('reviewForm');
const starRating = document.getElementById('starRating');

// Testimonials
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialDots = document.getElementById('testimonialDots');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');

// ==========================
// SCROLL PROGRESS BAR
// ==========================
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
}

// ==========================
// NAVBAR SCROLL EFFECT
// ==========================
function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// ==========================
// FLOATING RESERVE BUTTON (Mobile)
// ==========================
function handleFloatingReserve() {
  const heroHeight = document.querySelector('.hero').offsetHeight;
  const footerTop = document.querySelector('.footer').getBoundingClientRect().top;
  const windowHeight = window.innerHeight;
  
  // Show only after scrolling past hero and before footer
  if (window.scrollY > heroHeight && footerTop > windowHeight) {
    floatingReserve.classList.add('visible');
  } else {
    floatingReserve.classList.remove('visible');
  }
}

// ==========================
// SCROLL EVENT HANDLER
// ==========================
window.addEventListener('scroll', () => {
  updateScrollProgress();
  handleNavbarScroll();
  handleFloatingReserve();
  handleFadeAnimations();
});

// ==========================
// FADE IN ANIMATIONS
// ==========================
function handleFadeAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up');
  
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const delay = el.dataset.delay || 0;
    
    if (rect.top < window.innerHeight - 100) {
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
    }
  });
}

// Initial check for elements in view
document.addEventListener('DOMContentLoaded', () => {
  handleFadeAnimations();
  initLiveStatus();
  initTestimonials();
  setMinDate();
});


function updateLiveStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  // Restaurant hours: Tue-Sun 11:00 AM - 3:00 PM and 5:30 PM - 10:00 PM (Closed Monday)
  const lunchOpen = 11 * 60; // 11:00 AM in minutes
  const lunchClose = 15 * 60; // 3:00 PM in minutes
  const dinnerOpen = 17 * 60 + 30; // 5:30 PM in minutes
  const dinnerClose = 22 * 60; // 10:00 PM in minutes
  
  const isClosed = day === 1; // Monday
  const isLunchTime = !isClosed && currentTime >= lunchOpen && currentTime < lunchClose;
  const isDinnerTime = !isClosed && currentTime >= dinnerOpen && currentTime < dinnerClose;
  const isOpen = isLunchTime || isDinnerTime;
  
  const statusDot = liveStatus.querySelector('.status-dot');
  const statusText = liveStatus.querySelector('.status-text');
  
  if (isClosed) {
    liveStatus.classList.remove('open');
    liveStatus.classList.add('closed');
    statusText.textContent = 'Closed Today';
  } else if (isOpen) {
    liveStatus.classList.remove('closed');
    liveStatus.classList.add('open');
    let closesIn;
    if (isLunchTime) {
      closesIn = lunchClose - currentTime;
    } else {
      closesIn = dinnerClose - currentTime;
    }
    const closesHours = Math.floor(closesIn / 60);
    const closesMinutes = closesIn % 60;
    statusText.textContent = `Open · Closes in ${closesHours}h ${closesMinutes}m`;
  } else {
    liveStatus.classList.remove('open');
    liveStatus.classList.add('closed');
    // Determine next opening time
    if (currentTime < lunchOpen) {
      const opensIn = lunchOpen - currentTime;
      const opensHours = Math.floor(opensIn / 60);
      const opensMinutes = opensIn % 60;
      statusText.textContent = `Opens in ${opensHours}h ${opensMinutes}m`;
    } else if (currentTime < dinnerOpen) {
      const opensIn = dinnerOpen - currentTime;
      const opensHours = Math.floor(opensIn / 60);
      const opensMinutes = opensIn % 60;
      statusText.textContent = `Opens in ${opensHours}h ${opensMinutes}m`;
    } else {
      statusText.textContent = 'Closed · Opens tomorrow at 11 AM';
    }
  }
  
  // Update mobile status too
  const mobileStatus = document.getElementById('mobileStatus');
  if (mobileStatus) {
    mobileStatus.innerHTML = liveStatus.innerHTML;
    mobileStatus.className = liveStatus.className;
  }
}

updateLiveStatus();
// Update every minute
setInterval(updateLiveStatus, 60000);

// ==========================
// RESERVATION SHEET
// ==========================
let selectedOccasion = '';

// Open reservation buttons
document.querySelectorAll('#open-reservation-hero, #floatingReserve').forEach(btn => {
  btn.addEventListener('click', openReservationSheet);
});

function openReservationSheet() {
  reservationSheet.classList.add('active');
  document.body.style.overflow = 'hidden';
  resetReservationForm();
}

function closeReservationSheet() {
  reservationSheet.classList.remove('active');
  document.body.style.overflow = '';
}

closeSheet.addEventListener('click', closeReservationSheet);
sheetBackdrop.addEventListener('click', closeReservationSheet);

// Occasion Selection
occasionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    occasionBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedOccasion = btn.dataset.occasion;
    
    // Go to step 2
    setTimeout(() => {
      document.querySelector('[data-step="1"]').classList.remove('active');
      document.querySelector('[data-step="2"]').classList.add('active');
    }, 200);
  });
});

// Back button
backToStep1.addEventListener('click', () => {
  document.querySelector('[data-step="2"]').classList.remove('active');
  document.querySelector('[data-step="1"]').classList.add('active');
});

// Form submission
reservationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('guestName').value;
  const guests = document.getElementById('guestCount').value;
  const date = document.getElementById('reserveDate').value;
  const time = document.getElementById('reserveTime').value;
  const requests = document.getElementById('specialRequests').value;
  
  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate WhatsApp message
  let message = `🍽️ *Reservation Request - Upper Deck KL*\n\n`;
  message += `👤 Name: ${name}\n`;
  message += `🎉 Occasion: ${selectedOccasion}\n`;
  message += `👥 Guests: ${guests}\n`;
  message += `📅 Date: ${formattedDate}\n`;
  message += `🕐 Time: ${time}\n`;
  if (requests) {
    message += `📝 Special Requests: ${requests}\n`;
  }
  message += `\n_Sent via Upper Deck KL Website_`;
  
  // Encode for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  
  // TODO: Change this to the actual restaurant WhatsApp number
  const whatsappNumber = '60163170924';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  // Show success animation
  reservationForm.style.display = 'none';
  reservationSuccess.classList.add('active');
  createSparkles();
  
  // Redirect to WhatsApp after animation
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    closeReservationSheet();
  }, 1500);
});

// Reset form
function resetReservationForm() {
  reservationForm.style.display = 'block';
  reservationSuccess.classList.remove('active');
  reservationForm.reset();
  occasionBtns.forEach(b => b.classList.remove('selected'));
  selectedOccasion = '';
  document.querySelector('[data-step="2"]').classList.remove('active');
  document.querySelector('[data-step="1"]').classList.add('active');
}

// Set minimum date to today
function setMinDate() {
  const dateInput = document.getElementById('reserveDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// ==========================
// GOLD SPARKLE ANIMATION
// ==========================
function createSparkles() {
  const container = document.getElementById('sparkleContainer');
  container.innerHTML = '';
  
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random position from center
    const angle = (Math.PI * 2 * i) / 20;
    const distance = 50 + Math.random() * 80;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    sparkle.style.setProperty('--tx', tx + 'px');
    sparkle.style.setProperty('--ty', ty + 'px');
    sparkle.style.left = '50%';
    sparkle.style.top = '50%';
    sparkle.style.animationDelay = Math.random() * 0.3 + 's';
    
    container.appendChild(sparkle);
  }
}

// ==========================
// MENU MODAL & GALLERY
// ==========================
const menuGallery = document.querySelector('.menu-gallery');
const menuPages = document.querySelectorAll('.menu-page');
let currentMenuPage = 0; // track which menu page is active
const prevMenuPage = document.getElementById('prevMenuPage');
const nextMenuPage = document.getElementById('nextMenuPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const menuArrows = document.querySelectorAll('.menu-arrow');
const menuZoomBtns = document.querySelectorAll('.menu-zoom-btn');

// Zoom Overlay
const menuZoomOverlay = document.getElementById('menuZoomOverlay');
const zoomClose = document.getElementById('zoomClose');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const zoomReset = document.getElementById('zoomReset');
const zoomContainer = document.getElementById('zoomContainer');
const zoomedImage = document.getElementById('zoomedImage');
const zoomLevelSpan = document.getElementById('zoomLevel');

function openMenuModal() {
  menuModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Prevent background scrolling
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${window.scrollY}px`;
  
  updateMenuNav();
}

function closeMenuModal() {
  menuModal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Restore scroll position
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

function updateMenuNav() {
  currentPageSpan.textContent = currentMenuPage + 1;
  totalPagesSpan.textContent = menuPages.length;
  prevMenuPage.disabled = currentMenuPage === 0;
  nextMenuPage.disabled = currentMenuPage === menuPages.length - 1;
}

function goToMenuPage(index) {
  if (index < 0 || index >= menuPages.length) return;
  currentMenuPage = index;
  menuPages[currentMenuPage].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  updateMenuNav();
  updateMenuScrollHint();
}

// Arrow navigation
menuArrows.forEach((arrow, idx) => {
  arrow.addEventListener('click', (e) => {
    e.stopPropagation();
    if (arrow.classList.contains('next')) {
      goToMenuPage(currentMenuPage + 1);
    } else {
      goToMenuPage(currentMenuPage - 1);
    }
  });
});

// Keyboard accessibility for arrows
menuArrows.forEach(arrow => {
  arrow.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      arrow.click();
    }
  });
});

// Dedicated zoom button logic
menuZoomBtns.forEach((btn, idx) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = menuPages[idx].querySelector('img');
    if (img) openZoomView(img.src);
  });
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      btn.click();
    }
  });
});

// Pointer-based tap vs drag handling for menu pages
menuPages.forEach((page, idx) => {
  const img = page.querySelector('img');
  let startX = 0, startY = 0, startTime = 0, moved = false, startWasInteractive = false;

  page.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();
    moved = false;
    startWasInteractive = !!(e.target && e.target.closest && e.target.closest('button, .menu-arrow, .menu-zoom-btn, .menu-nav-btn'));
    if (page.setPointerCapture) page.setPointerCapture(e.pointerId);
  }, { passive: true });

  page.addEventListener('pointermove', (e) => {
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (dx > 10 || dy > 10) moved = true;
  }, { passive: true });

  page.addEventListener('pointerup', (e) => {
    if (page.releasePointerCapture) page.releasePointerCapture(e.pointerId);
    const dt = Date.now() - startTime;
    // Treat as tap only if no significant movement and short press
    if (!moved && dt < 300) {
      // ignore taps that originated on interactive controls (arrows, zoom buttons)
      if (startWasInteractive) return;
      // On small screens, open the full-screen zoom overlay instead of inline zoom
      if (img) {
        // remove zoomed class from other pages (keep clean)
        menuPages.forEach(p => {
          const otherImg = p.querySelector('img');
          if (otherImg && otherImg !== img) otherImg.classList.remove('zoomed');
        });

        if (window.innerWidth <= 768) {
          // mobile - open overlay for full-screen view
          openZoomView(img.src);
          return;
        }

        // desktop: cycle to next page instead of zooming
        goToMenuPage((idx + 1) % menuPages.length);
      }
    }
  });

  // Support keyboard activation on the page wrapper
  page.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (img) openZoomView(img.src);
    }
  });
});

// Vertical scroll hint logic
function updateMenuScrollHint() {
  const hint = document.querySelector('.menu-scroll-hint');
  if (!hint) return;
  // Show only if image is taller than container
  const page = menuPages[currentMenuPage];
  if (!page) return;
  const imgScroll = page.querySelector('.menu-img-scroll');
  const img = page.querySelector('img');
  if (img && imgScroll && img.naturalHeight > imgScroll.clientHeight + 10) {
    hint.style.display = 'block';
  } else {
    hint.style.display = 'none';
  }
}

// Update scroll hint on page change and window resize
// Debounced page detection on horizontal scroll
let menuScrollTimeout = null;
menuGallery.addEventListener('scroll', () => {
  if (menuScrollTimeout) clearTimeout(menuScrollTimeout);
  menuScrollTimeout = setTimeout(() => {
    const scrollLeft = menuGallery.scrollLeft;
    const pageWidth = menuGallery.clientWidth;
    const newPage = Math.round(scrollLeft / pageWidth);
    if (newPage !== currentMenuPage) {
      currentMenuPage = Math.max(0, Math.min(menuPages.length - 1, newPage));
      updateMenuNav();
    }
    updateMenuScrollHint();
  }, 80);
});
window.addEventListener('resize', updateMenuScrollHint);
menuPages.forEach(page => {
  page.querySelector('img').addEventListener('load', updateMenuScrollHint);
});

if (prevMenuPage) {
  prevMenuPage.addEventListener('click', () => goToMenuPage(currentMenuPage - 1));
}

if (nextMenuPage) {
  nextMenuPage.addEventListener('click', () => goToMenuPage(currentMenuPage + 1));
}

openMenuBtn.addEventListener('click', openMenuModal);
viewFullMenuBtn.addEventListener('click', openMenuModal);
closeModal.addEventListener('click', closeMenuModal);
modalBackdrop.addEventListener('click', closeMenuModal);

if (reserveFromMenu) {
  reserveFromMenu.addEventListener('click', () => {
    closeMenuModal();
    setTimeout(openReservationSheet, 300);
  });
}

// ==========================
// HAMBURGER MENU
// ==========================
function toggleMobileMenu() {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}

// Hamburger button click
hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.hamburger') && !e.target.closest('.mobile-menu')) {
    closeMobileMenu();
  }
});

// ==========================
// MENU ZOOM FUNCTIONALITY
// ==========================
// Zoom is triggered by tap (pointer handlers above) or by the dedicated zoom buttons.

function openZoomView(imageSrc) {
  zoomedImage.src = imageSrc;
  zoomScale = 1;
  panX = 0;
  panY = 0;
  updateZoomTransform();
  menuZoomOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeZoomView() {
  menuZoomOverlay.classList.remove('active');
  if (!menuModal.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function updateZoomTransform() {
  zoomedImage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
  zoomLevelSpan.textContent = Math.round(zoomScale * 100) + '%';
}

function handleZoomIn() {
  zoomScale = Math.min(zoomScale + 0.25, 4);
  updateZoomTransform();
}

function handleZoomOut() {
  zoomScale = Math.max(zoomScale - 0.25, 0.5);
  // Reset pan if zoomed out
  if (zoomScale <= 1) {
    panX = 0;
    panY = 0;
  }
  updateZoomTransform();
}

function handleZoomReset() {
  zoomScale = 1;
  panX = 0;
  panY = 0;
  updateZoomTransform();
}

if (zoomClose) zoomClose.addEventListener('click', closeZoomView);
if (zoomIn) zoomIn.addEventListener('click', handleZoomIn);
if (zoomOut) zoomOut.addEventListener('click', handleZoomOut);
if (zoomReset) zoomReset.addEventListener('click', handleZoomReset);

// Pan functionality
if (zoomContainer) {
  zoomContainer.addEventListener('mousedown', (e) => {
    if (zoomScale > 1) {
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      zoomContainer.style.cursor = 'grabbing';
    }
  });

  zoomContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateZoomTransform();
  });

  zoomContainer.addEventListener('mouseup', () => {
    isDragging = false;
    zoomContainer.style.cursor = 'grab';
  });

  zoomContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    zoomContainer.style.cursor = 'grab';
  });

  // Touch support
  let touchStartX, touchStartY;
  
  zoomContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1 && zoomScale > 1) {
      isDragging = true;
      touchStartX = e.touches[0].clientX - panX;
      touchStartY = e.touches[0].clientY - panY;
    }
  }, { passive: true });

  zoomContainer.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    panX = e.touches[0].clientX - touchStartX;
    panY = e.touches[0].clientY - touchStartY;
    updateZoomTransform();
  }, { passive: true });

  zoomContainer.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Scroll/wheel to zoom
  zoomContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  });
}

// Close zoom on backdrop click
if (menuZoomOverlay) {
  menuZoomOverlay.addEventListener('click', (e) => {
    if (e.target === menuZoomOverlay || e.target === zoomContainer) {
      closeZoomView();
    }
  });
}

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (menuZoomOverlay.classList.contains('active')) {
      closeZoomView();
    } else {
      closeMenuModal();
      closeReservationSheet();
      closeReviewModalFunc();
    }
  }
});

// ==========================
// TESTIMONIALS CAROUSEL
// ==========================
let currentTestimonial = 0;
let testimonialCards = [];

function initTestimonials() {
  testimonialCards = document.querySelectorAll('.testimonial-card');
  
  // Create dots
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToTestimonial(index));
    testimonialDots.appendChild(dot);
  });
  
  // Auto-rotate every 5 seconds
  setInterval(nextTestimonialSlide, 5000);
}

function goToTestimonial(index) {
  testimonialCards[currentTestimonial].classList.remove('active');
  testimonialDots.children[currentTestimonial].classList.remove('active');
  
  currentTestimonial = index;
  
  testimonialCards[currentTestimonial].classList.add('active');
  testimonialDots.children[currentTestimonial].classList.add('active');
}

function nextTestimonialSlide() {
  const next = (currentTestimonial + 1) % testimonialCards.length;
  goToTestimonial(next);
}

function prevTestimonialSlide() {
  const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  goToTestimonial(prev);
}

prevTestimonial.addEventListener('click', prevTestimonialSlide);
nextTestimonial.addEventListener('click', nextTestimonialSlide);

// ==========================
// REVIEW MODAL
// ==========================
let selectedRating = 0;

function openReviewModal() {
  reviewModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeReviewModalFunc() {
  reviewModal.classList.remove('active');
  document.body.style.overflow = '';
  resetReviewForm();
}

addReviewBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openReviewModal();
});

closeReviewModal.addEventListener('click', closeReviewModalFunc);
reviewBackdrop.addEventListener('click', closeReviewModalFunc);

// Star rating
starRating.querySelectorAll('i').forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.rating);
    updateStars();
  });
  
  star.addEventListener('mouseenter', () => {
    highlightStars(parseInt(star.dataset.rating));
  });
  
  star.addEventListener('mouseleave', () => {
    updateStars();
  });
});

function highlightStars(rating) {
  starRating.querySelectorAll('i').forEach((star, index) => {
    star.classList.toggle('fas', index < rating);
    star.classList.toggle('far', index >= rating);
    star.classList.toggle('active', index < rating);
  });
}

function updateStars() {
  highlightStars(selectedRating);
}

// Review form submission (stored locally for demo)
reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const review = {
    name: document.getElementById('reviewerName').value,
    rating: selectedRating,
    text: document.getElementById('reviewText').value,
    date: new Date().toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })
  };
  
  // Save to localStorage
  const reviews = JSON.parse(localStorage.getItem('udkl_reviews') || '[]');
  reviews.push(review);
  localStorage.setItem('udkl_reviews', JSON.stringify(reviews));
  
  // Show thank you message
  alert('Thank you for your review! 🎉');
  closeReviewModalFunc();
});

function resetReviewForm() {
  reviewForm.reset();
  selectedRating = 0;
  updateStars();
}

// ==========================
// PARALLAX EFFECT (subtle)
// ==========================
window.addEventListener('scroll', () => {
  const parallaxBg = document.querySelector('.parallax-bg');
  if (parallaxBg) {
    const scrolled = window.scrollY;
    const section = document.querySelector('.vibe-section');
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
      const yPos = (scrolled - sectionTop) * 0.3;
      parallaxBg.style.transform = `translateY(${yPos}px)`;
    }
  }
});

// ==========================
// SMOOTH ANCHOR SCROLLING
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==========================
// THEME TOGGLE
// ==========================
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeMenu = document.getElementById('themeMenu');
const themeOptions = document.querySelectorAll('.theme-option');

// Load saved theme or default to light
function loadTheme() {
  const savedTheme = localStorage.getItem('upperdeck-theme') || 'light';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  // Update active state on buttons
  themeOptions.forEach(option => {
    option.classList.toggle('active', option.dataset.theme === theme);
  });
  
  // Save to localStorage
  localStorage.setItem('upperdeck-theme', theme);
}

// Toggle menu visibility
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle('active');
  });
}

// Handle theme selection
themeOptions.forEach(option => {
  option.addEventListener('click', () => {
    const theme = option.dataset.theme;
    applyTheme(theme);
    themeMenu.classList.remove('active');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.theme-toggle-wrapper')) {
    themeMenu.classList.remove('active');
  }
});

// Initialize theme on page load
loadTheme();
