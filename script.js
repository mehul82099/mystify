document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('open');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('open');
      });
    });
  }

  // 3. Navigation Active Highlight
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // 4. Portfolio Filter Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.classList.add('show');
        } else {
          item.classList.remove('show');
        }
      });
    });
  });

  // 5. Skills.sh Directory Search Filter Logic (NEW)
  const skillsSearchInput = document.getElementById('skills-search-input');
  const skillTags = document.querySelectorAll('.skill-tag');

  if (skillsSearchInput) {
    skillsSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      skillTags.forEach(tag => {
        const text = tag.textContent.toLowerCase();
        if (text.includes(query)) {
          tag.style.display = 'block';
        } else {
          tag.style.display = 'none';
        }
      });
    });
  }

  // 6. Interactive Cost Calculator Logic
  const pageSlider = document.getElementById('page-slider');
  const pageCountVal = document.getElementById('page-count-val');
  const compBasic = document.getElementById('comp-basic');
  const compCustom = document.getElementById('comp-custom');
  const addonSeo = document.getElementById('addon-seo');
  const addonEcommerce = document.getElementById('addon-ecommerce');
  const addonBooking = document.getElementById('addon-booking');
  const addonSpeed = document.getElementById('addon-speed');
  const totalPriceEl = document.getElementById('total-price');
  const calcCta = document.getElementById('calc-cta-btn');

  function calculatePrice() {
    if (!pageSlider || !totalPriceEl) return;

    const pages = parseInt(pageSlider.value);
    pageCountVal.textContent = `${pages} Page${pages > 1 ? 's' : ''}`;

    // Base Calculation: ₹2,000 per page (minimum ₹5,000 base design value)
    let basePrice = pages * 2000;
    if (basePrice < 5000) basePrice = 5000;

    // Complexity Factor
    let complexityMultiplier = 1.0;
    if (compCustom && compCustom.checked) {
      complexityMultiplier = 1.5;
    }

    // Subtotal
    let subtotal = basePrice * complexityMultiplier;

    // Addons
    let addonsTotal = 0;
    if (addonSeo && addonSeo.checked) addonsTotal += parseInt(addonSeo.value);
    if (addonEcommerce && addonEcommerce.checked) addonsTotal += parseInt(addonEcommerce.value);
    if (addonBooking && addonBooking.checked) addonsTotal += parseInt(addonBooking.value);
    if (addonSpeed && addonSpeed.checked) addonsTotal += parseInt(addonSpeed.value);

    const grandTotal = subtotal + addonsTotal;
    
    // Animate Price Count-Up
    animatePrice(parseInt(totalPriceEl.textContent.replace(/,/g, '')), grandTotal);
  }

  function animatePrice(start, end) {
    const duration = 400; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentPrice = Math.round(start + (end - start) * easeProgress);

      totalPriceEl.textContent = currentPrice.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Bind Events for Calculator
  if (pageSlider) {
    pageSlider.addEventListener('input', calculatePrice);
    [compBasic, compCustom].forEach(radio => {
      if (radio) radio.addEventListener('change', calculatePrice);
    });
    [addonSeo, addonEcommerce, addonBooking, addonSpeed].forEach(cb => {
      if (cb) cb.addEventListener('change', calculatePrice);
    });

    // Initial Calculation
    calculatePrice();
  }

  // Customize CTA link from Calculator to pre-fill or guide target message
  if (calcCta) {
    calcCta.addEventListener('click', (e) => {
      e.preventDefault();
      const pages = pageSlider.value;
      const complexity = compCustom.checked ? 'Custom Web App' : 'Standard';
      const estimatedPrice = totalPriceEl.textContent;
      
      const detailsField = document.getElementById('client-goal');
      if (detailsField) {
        detailsField.value = `I calculated my project estimate using your tool:\n- Pages: ${pages}\n- Complexity: ${complexity}\n- Estimated Cost: ₹${estimatedPrice}\nLet's discuss this project!`;
        detailsField.focus();
      }

      // Scroll to Contact
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 7. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = question.nextElementSibling;

      // Close other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      item.classList.toggle('active');

      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

  // 8. Contact Form Handler
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value;
      const email = document.getElementById('client-email').value;

      // Simulate sending inquiry
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i data-lucide="loader-2" class="spin"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        alert(`Thank you, ${name}! Your inquiry has been sent to Mystify me. We will get back to you shortly at ${email}.`);
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    });
  }

  // 9. Vibe Coded Scroll Progress & HTML5 Canvas Frame Scrubbing Engine
  const canvas = document.getElementById('scrolly-canvas');
  let ctx, frames = [], frameSources = [], currentFrameIndex = 0;

  if (canvas) {
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderCanvasFrame(currentFrameIndex);
    }

    const frameCount = 240;
    frameSources = [];
    for (let i = 1; i <= frameCount; i++) {
      const numStr = String(i).padStart(3, '0');
      frameSources.push(`assets/ezgif-frame-${numStr}.jpg`);
    }

    frameSources.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        if (index === 0 || currentFrameIndex === index) {
          renderCanvasFrame(currentFrameIndex);
        }
      };
      img.src = src;
      frames.push(img);
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  function renderCanvasFrame(frameIndex) {
    if (!ctx || !canvas || frames.length === 0) return;
    
    let img = frames[frameIndex];
    if (!img || !img.complete || !img.naturalWidth) {
      for (let i = frameIndex; i >= 0; i--) {
        if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) {
          img = frames[i];
          break;
        }
      }
    }
    if (!img || !img.complete || !img.naturalWidth) {
      for (let i = frameIndex; i < frames.length; i++) {
        if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) {
          img = frames[i];
          break;
        }
      }
    }

    if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const imgRatio = w / h;
    const canvasRatio = canvas.width / canvas.height;
    let drawW, drawH, drawX, drawY;

    // Use Contain-Fit Scaling so the entire subject and all 3D exploded layers fit 100% inside screen without cropping
    if (canvasRatio > imgRatio) {
      drawH = canvas.height * 0.92;
      drawW = drawH * imgRatio;
      drawX = (canvas.width - drawW) / 2;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawW = canvas.width * 0.92;
      drawH = drawW / imgRatio;
      drawX = (canvas.width - drawW) / 2;
      drawY = (canvas.height - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  const scrollProgress = document.getElementById('scroll-progress');
  const scrollVal = document.getElementById('scroll-val');

  function updateScrollEffects() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const progress = Math.min(Math.max((scrollPosition / (totalHeight || 1)) * 100, 0), 100);

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
    if (scrollVal) {
      scrollVal.textContent = `3D SCROLL ${Math.round(progress)}%`;
    }

    // HTML5 Canvas Frame Scrubbing on Scroll (Full Website 240-Frame Background)
    if (frames.length > 0) {
      const targetFrame = Math.min(Math.floor((progress / 100) * frames.length), frames.length - 1);
      if (targetFrame !== currentFrameIndex) {
        currentFrameIndex = targetFrame;
        renderCanvasFrame(currentFrameIndex);
      }
    }

    // Hero 3D depth camera scale on scroll
    if (heroImg && scrollPosition < 900) {
      const scaleVal = 1 - (scrollPosition / 3500);
      heroImg.style.transform = `scale(${Math.max(scaleVal, 0.92)}) translateY(${scrollPosition * 0.1}px)`;
    }

    // Atmospheric Hill Station Fog Shift based on Altitude (Scroll Progress)
    if (ambientFog) {
      if (progress < 20) {
        ambientFog.style.background = 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.05), transparent 70%)';
      } else if (progress < 45) {
        ambientFog.style.background = 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.05), transparent 70%)';
      } else if (progress < 75) {
        ambientFog.style.background = 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.05), transparent 70%)';
      } else {
        ambientFog.style.background = 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.05), transparent 70%)';
      }
    }

    // Waypoints Journey Active Tracker
    let currentSectionId = '';
    journeySections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (scrollPosition >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    journeySteps.forEach(step => {
      step.classList.remove('active');
      if (step.getAttribute('data-section') === currentSectionId) {
        step.classList.add('active');
      }
    });

    // Continuous Cinematic Reveal Observer
    const revealElements = document.querySelectorAll('.cinematic-reveal, .reveal');
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 70;

      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  }

  // 10. Initial reveal class assignment for video-like cinematic focus
  const targetElements = document.querySelectorAll('.section-header, .glass-card, .service-card, .portfolio-card, .calc-container, .faq-item, .stat-item');
  targetElements.forEach((el, index) => {
    el.classList.add('cinematic-reveal');
    if (index % 3 === 1) el.classList.add('delay-1');
    if (index % 3 === 2) el.classList.add('delay-2');
  });

  window.addEventListener('scroll', updateScrollEffects);
  window.addEventListener('load', updateScrollEffects);
  setTimeout(updateScrollEffects, 100);
});
