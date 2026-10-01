/**
 * NexusTech – Modern Landing Page Interactive Logic
 * Author: Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderAndScrollSpy();
  initMobileMenu();
  initStatsCounter();
  initAboutTabs();
  initFeaturesFilter();
  initCopyButtons();
  initContactForm();
  initBackToTop();
});

/* ========================================================
   1. Theme Toggle (Dark / Light Mode)
   ======================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or prefer dark
  const savedTheme = localStorage.getItem('nexustech-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('nexustech-theme', newTheme);
      
      showToast(`გააქტიურდა ${newTheme === 'dark' ? 'მუქი' : 'ნათელი'} თემა`, 'info');
    });
  }
}

/* ========================================================
   2. Sticky Header & Active Link Scroll Spy
   ======================================================== */
function initHeaderAndScrollSpy() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Header blur/shadow on scroll
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy for active nav link
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ========================================================
   3. Mobile Navigation Drawer
   ======================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu || !mobileOverlay) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !navMenu.classList.contains('open');
    mobileToggle.classList.toggle('active', isOpen);
    navMenu.classList.toggle('open', isOpen);
    mobileOverlay.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  mobileToggle.addEventListener('click', () => toggleMenu());
  mobileOverlay.addEventListener('click', () => toggleMenu(true));

  // Close drawer when any nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}

/* ========================================================
   4. Live Animated Statistics Counter (IntersectionObserver)
   ======================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach((el) => animateNumber(el));
      }
    });
  }, { threshold: 0.35 });

  const statsStrip = document.querySelector('.hero-stats-strip');
  if (statsStrip) {
    observer.observe(statsStrip);
  }

  function animateNumber(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = (target * easeOut);

      element.textContent = (isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ========================================================
   5. About Section Tabs
   ======================================================== */
function initAboutTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${tabKey}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ========================================================
   6. Features Section Filtering
   ======================================================== */
function initFeaturesFilter() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const featureCards = document.querySelectorAll('.feature-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const category = pill.getAttribute('data-category');

      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      featureCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ========================================================
   7. Copy to Clipboard Utility
   ======================================================== */
function initCopyButtons() {
  const copyables = document.querySelectorAll('.copyable');

  copyables.forEach((item) => {
    item.addEventListener('click', (e) => {
      const copyText = item.getAttribute('data-copy');
      if (copyText) {
        navigator.clipboard.writeText(copyText).then(() => {
          showToast(`დაკოპირდა: ${copyText}`, 'success');
        }).catch(() => {
          // Fallback
          showToast(`მისამართი: ${copyText}`, 'info');
        });
      }
    });
  });
}

/* ========================================================
   8. Connect Form Validation & Submission
   ======================================================== */
function initContactForm() {
  const form = document.getElementById('connectForm');
  if (!form) return;

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const termsCheckbox = document.getElementById('userTerms');
  const submitBtn = document.getElementById('submitBtn');

  // Real-time error removal on input
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    }
  });

  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      termsCheckbox.closest('.form-checkbox-group').classList.remove('has-error');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      nameInput.closest('.form-group').classList.remove('has-error');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      emailInput.closest('.form-group').classList.remove('has-error');
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      messageInput.closest('.form-group').classList.remove('has-error');
    }

    // Validate Terms
    if (!termsCheckbox.checked) {
      termsCheckbox.closest('.form-checkbox-group').classList.add('has-error');
      isValid = false;
    } else {
      termsCheckbox.closest('.form-checkbox-group').classList.remove('has-error');
    }

    if (!isValid) return;

    // Submit Simulation
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();

      showToast('მადლობა! თქვენი შეტყობინება წარმატებით გაიგზავნა. მალე დაგიკავშირდებით!', 'success');
    }, 1200);
  });
}

/* ========================================================
   9. Back to Top Button
   ======================================================== */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ========================================================
   Toast Notification Helper
   ======================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : 'ℹ';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3.8s
  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3800);
}
