// ══════════════════════════════════════════
//  N. AKSHIT VINAY — PORTFOLIO SCRIPTS
// ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar scroll effect ─── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
    handleBackToTop();
    animateSkillBars();
  });

  /* ─── Hamburger Menu ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });
  
  // Close menu on nav link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });

  /* ─── Active nav link highlight ─── */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  /* ─── Typed Text Animation ─── */
  const roles = [
    'Remote Sensing & GIS Specialist',
    'Earth Observation Analyst',
    'Precision Agriculture Technologist',
    'Drone & UAV Specialist',
    'Geospatial Data Analyst',
    'Hydroponic Systems Expert',
    'Organic Research Scientist'
  ];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  const typedEl = document.getElementById('typedText');

  function typeNext() {
    if (!typedEl) return;
    const current = roles[roleIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeNext, 400);
        return;
      }
      setTimeout(typeNext, 60);
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeNext, 2000);
        return;
      }
      setTimeout(typeNext, 90);
    }
  }
  setTimeout(typeNext, 800);

  /* ─── Particle Generator ─── */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 8}s;
        animation-duration: ${6 + Math.random() * 6}s;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  /* ─── Scroll Animation Observer ─── */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, ms);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  
  animatedEls.forEach(el => observer.observe(el));

  /* ─── Skill Bars Animation ─── */
  let skillsAnimated = false;
  function animateSkillBars() {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const top = skillsSection.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.8) {
      skillsAnimated = true;
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
      });
    }
  }
  // Trigger on load too (in case already in view)
  animateSkillBars();

  /* ─── Hero Image Fallback ─── */
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    heroPhoto.addEventListener('error', () => {
      // If the photo doesn't load, show a styled initials placeholder
      const circle = heroPhoto.closest('.hero-image-circle');
      if (circle) {
        circle.innerHTML = `
          <div style="
            width: 100%; height: 100%; background: linear-gradient(135deg, #0d2b1f, #2d6a4f);
            display: flex; align-items: center; justify-content: center;
            font-size: 4rem; font-weight: 800; color: #c9a84c; font-family: 'Outfit', sans-serif;
            letter-spacing: 3px;
          ">AV</div>
        `;
      }
    });
  }

  /* ─── Smooth scroll for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Back to Top ─── */
  const backToTop = document.getElementById('backToTop');
  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Certificate Modal ─── */
  window.showCertModal = function (title, issuer, date) {
    const modal = document.getElementById('certModal');
    const modalTitle = document.getElementById('modalCertTitle');
    const modalIssuer = document.getElementById('modalCertIssuer');
    const modalDate = document.getElementById('modalCertDate');
    if (modalTitle && title) modalTitle.textContent = title;
    if (modalIssuer && issuer) modalIssuer.textContent = issuer;
    if (modalDate && date) modalDate.textContent = date;
    if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.closeCertModal = function () {
    const modal = document.getElementById('certModal');
    if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeCertModal();
  });

  /* ─── Contact Form (mailto fallback) ─── */
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Open mailto link as a fallback
    const mailtoLink = `mailto:akshitvinay4636@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
    window.open(mailtoLink, '_blank');

    // Show success message
    if (success) {
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  };

  /* ─── Card hover tilt effect ─── */
  document.querySelectorAll('.cert-card, .exp-timeline-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 6;
      const tiltY = -(x / rect.width) * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── Counter animation for stats ─── */
  function animateCounter(el, target) {
    let current = 0;
    const originalText = el.getAttribute('data-original') || el.textContent;
    const hasPlus = originalText.includes('+');
    const hasDot = originalText.includes('.');
    const decimalPlaces = hasDot ? (originalText.split('.')[1]?.replace('+', '').length || 1) : 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        let finalVal = hasDot ? target.toFixed(decimalPlaces) : Math.ceil(target);
        if (hasPlus) finalVal += '+';
        el.textContent = finalVal;
        clearInterval(timer);
      } else {
        let displayVal = hasDot ? current.toFixed(decimalPlaces) : Math.floor(current);
        if (hasPlus) displayVal += '+';
        el.textContent = displayVal;
      }
    }, 20);
  }

  const heroSection = document.getElementById('home');
  if (heroSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(el => {
          el.setAttribute('data-original', el.textContent.trim());
          const val = parseFloat(el.textContent);
          if (!isNaN(val)) animateCounter(el, val);
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroSection);
  }
});
