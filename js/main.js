/**
 * Gold Fishing - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initCounterAnimation();
  initContactForm();
  initFadeInAnimations();
});

/**
 * Mobile navigation toggle
 */
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.getElementById('header');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/**
 * Smooth scroll for anchor links
 */
function initScrollEffects() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Animated counter for hero stats
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.hero__stat-number[data-count]');
  let animated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      const start = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        counter.textContent = formatNumber(current, target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) {
    observer.observe(heroStats);
  }
}

/**
 * Format numbers with K suffix for large values
 */
function formatNumber(current, target) {
  if (target >= 1000) {
    if (current >= 1000) {
      return Math.floor(current / 1000) + 'K';
    }
    return current.toLocaleString('tr-TR');
  }
  return current.toString();
}

/**
 * Contact form - redirect to WhatsApp
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject');
    const subjectText = subject.options[subject.selectedIndex].text;
    const message = document.getElementById('message').value.trim();

    const whatsappMessage = encodeURIComponent(
      `Merhaba Gold Fishing,\n\n` +
      `Ad Soyad: ${name}\n` +
      `Telefon: ${phone}\n` +
      `Konu: ${subjectText}\n\n` +
      `Mesaj:\n${message}`
    );

    const whatsappUrl = `https://wa.me/905303091907?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');

    form.reset();
    showNotification('Mesajınız WhatsApp\'a yönlendirildi!');
  });
}

/**
 * Simple notification toast
 */
function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: #0c4a6e;
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 9999;
    font-weight: 500;
    transition: transform 0.3s ease;
  `;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/**
 * Fade-in animations on scroll
 */
function initFadeInAnimations() {
  const elements = document.querySelectorAll(
    '.about__grid, .product-card, .facility__grid, .news-card, .contact__grid, .instagram__content'
  );

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Stagger product cards
  document.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  document.querySelectorAll('.news-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
}
