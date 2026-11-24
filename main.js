/**
 * ============================================================================
 * BAFOOD - CLIENT INTERACTION ENGINE (BASED ON BOLDLY ARCHITECTURE)
 * Brand: BaFood (Delicious, Practical & Better Food Choices)
 * Pure Vanilla JavaScript (No External Libraries)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. Header Sticky Effect & Scroll Detection
   * Menambahkan efek bayangan elegan saat pengguna melakukan scroll
   * -------------------------------------------------------------------------- */
  const siteHeader = document.querySelector('.site-header');
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
   * 2. Fullscreen Mobile Navigation Drawer
   * Membuka dan menutup navigasi mobile layar penuh dengan transisi halus
   * -------------------------------------------------------------------------- */
  const menuTrigger = document.querySelector('.menu-trigger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (forceState) => {
    if (!menuTrigger || !mobileDrawer) return;
    const shouldOpen = forceState !== undefined 
      ? forceState 
      : !mobileDrawer.classList.contains('is-open');

    menuTrigger.classList.toggle('is-active', shouldOpen);
    mobileDrawer.classList.toggle('is-open', shouldOpen);

    // Kunci scroll background saat drawer menu aktif
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (menuTrigger) {
    menuTrigger.addEventListener('click', () => toggleMobileMenu());
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  /* --------------------------------------------------------------------------
   * 3. Hero Carousel / Slider Engine
   * Autoplay 5 detik, kontrol pagination dot, swipe gesture untuk mobile
   * -------------------------------------------------------------------------- */
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const progressBar = document.querySelector('.carousel-progress__bar');

  let currentSlide = 0;
  const totalSlides = carouselSlides.length;
  let autoplayTimer = null;
  const slideInterval = 5000;

  const goToSlide = (index) => {
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${(currentSlide * 100) / totalSlides}%)`;
    }

    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
    });

    if (progressBar) {
      progressBar.style.transform = `translateX(${currentSlide * 100}%)`;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, slideInterval);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  carouselDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const slideIndex = parseInt(e.target.dataset.slide, 10);
      if (!isNaN(slideIndex)) {
        goToSlide(slideIndex);
        startAutoplay();
      }
    });
  });

  // Touch Swipe Gesture Support
  let touchStartX = 0;
  let touchEndX = 0;

  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
      }
      startAutoplay();
    }, { passive: true });
  }

  if (totalSlides > 0) {
    goToSlide(0);
    startAutoplay();
  }

  /* --------------------------------------------------------------------------
   * 4. Product Catalog Filter System
   * Filter kategori produk BaFood secara interaktif
   * -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetCategory = e.currentTarget.dataset.filter;

      filterButtons.forEach((b) => b.classList.remove('is-active'));
      e.currentTarget.classList.add('is-active');

      productCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(1.5rem)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
   * 5. Interactive Quick Order Form -> WhatsApp Integration
   * Mengirim data pesanan langsung ke nomor WhatsApp resmi BaFood 085777038202
   * -------------------------------------------------------------------------- */
  const sampleForm = document.querySelector('.bafood-form');
  const toastNotice = document.querySelector('.toast-notice');

  const showToast = (message) => {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('is-visible');

    setTimeout(() => {
      toastNotice.classList.remove('is-visible');
    }, 4500);
  };

  if (sampleForm) {
    sampleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const phoneInput = document.getElementById('phone');
      const productInput = document.getElementById('productChoice');
      const addressInput = document.getElementById('address');

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        showToast('⚠️ Silakan lengkapi nama dan nomor WhatsApp Anda.');
        return;
      }

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const product = productInput ? productInput.value : 'Informasi Produk BaFood';
      const address = addressInput && addressInput.value.trim() ? addressInput.value.trim() : 'Kota Tasikmalaya / Sekitarnya';

      // Format Pesan WhatsApp otomatis sesuai brief
      const message = `Halo BaFood, saya tertarik untuk memesan produk.\n\n*Nama:* ${name}\n*No. HP/WA:* ${phone}\n*Pilihan Produk:* ${product}\n*Alamat/Catatan:* ${address}\n\nBoleh minta informasi lebih lanjut dan total pembayarannya? Terima kasih!`;
      
      const whatsappUrl = `https://wa.me/6285777038202?text=${encodeURIComponent(message)}`;

      showToast(`✨ Membuka WhatsApp untuk memproses pesanan ${name}...`);

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        sampleForm.reset();
      }, 800);
    });
  }

  /* --------------------------------------------------------------------------
   * 6. Scroll Reveal Observer
   * -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.hero-card, .editorial-card, .order-card, .why-card, .product-card, .contact-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
});
