/**
 * =========================================
 * PROFESSIONAL DOCTOR WEBSITE TEMPLATE JS
 * =========================================
 * Lightweight vanilla JavaScript handling interactions:
 * - Sticky Header scroll effect
 * - Mobile navigation menu drawer
 * - Scroll spy for active navigation links
 * - Animated stats counters (runs once when scrolled into view)
 * - Testimonial slide deck (auto-play + dots selection)
 * - Appointment booking form validation & feedback
 */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. STICKY HEADER SCROLL EFFECT */
  const header = document.querySelector('.main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once on load to set initial state


  /* 2. MOBILE MENU DRAWER Toggle (with body scroll lock) */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll', isOpen);
      
      const icon = hamburger.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.className = 'fa-solid fa-xmark'; // Close icon
        } else {
          icon.className = 'fa-solid fa-bars'; // Hamburger icon
        }
      }
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
        const icon = hamburger.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }


  /* 3. DYNAMIC ACTIVE NAV HIGHLIGHT (Based on current page filename) */
  const pathname = window.location.pathname;
  let currentFile = pathname.split('/').pop() || 'index.html';
  
  if (currentFile === '' || currentFile === '/' || !currentFile.includes('.')) {
    currentFile = 'index.html';
  }

  const subPages = ['pregnancy.html', 'infertility.html', 'menstrual.html', 'fibroids.html', 'cervical.html', 'family.html'];
  const isActiveLink = (linkHref) => {
    if (linkHref === currentFile) {
      return true;
    }
    if (linkHref === 'services.html' && subPages.includes(currentFile)) {
      return true;
    }
    return false;
  };
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (isActiveLink(linkHref)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });


  /* 4. ANIMATED STATS COUNTER */
  const statsSection = document.querySelector('.stats');
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const startCounting = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // Animation duration in ms
      const startTime = performance.now();
      
      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function: easeOutQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        counter.textContent = currentValue + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      };
      
      requestAnimationFrame(updateCount);
    });
  };

  // Intersection Observer to run animation only when visible
  if (statsSection && counters.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          startCounting();
          animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsSection);
  }


  /* 5. DYNAMIC TESTIMONIALS SLIDER & RATINGS SUMMARY */
  const testimonials = [
    {
      name: "Ramya S.",
      category: "Maternity Patient",
      rating: 5,
      text: "Heartily thank God for bringing Dr. Jayashree mam into my life. My first meeting with the doctor gave me immense confidence. She explained the medicine, offered morale-boosting advice, and guided me seamlessly. I was blessed to undergo normal vaginal delivery with a healthy baby.",
      date: "2 weeks ago",
      verified: true
    },
    {
      name: "Usha Srinivasan",
      category: "Regular Patient",
      rating: 5,
      text: "I really like Dr. Jayashree Sharma because she is extremely friendly. Unlike other doctors nowadays, she answers phone calls of patients directly and responds immediately. That personal care makes all the difference when you are undergoing treatments. A wonderful human being.",
      date: "3 weeks ago",
      verified: true
    },
    {
      name: "Sandhiya Vani Aravind",
      category: "Gynaecology Consultation",
      rating: 5,
      text: "We felt very satisfied and happy. She is always positive, which builds high confidence. She is always available to answer doubts and queries, and treats patients like a family member next door. I recommend her clinic for any gynecological issues.",
      date: "1 month ago",
      verified: true
    },
    {
      name: "Meera Krishnan",
      category: "Pregnancy Care",
      rating: 5,
      text: "Exceptional guidance throughout my pregnancy journey. Dr. Jayashree is incredibly patient-centric, answers all queries with warmth, and avoids unnecessary tests. The clinic is well-maintained and very hygienic.",
      date: "1 month ago",
      verified: true
    },
    {
      name: "Priya Rajan",
      category: "Infertility Treatment",
      rating: 4,
      text: "Highly professional and experienced doctor. We had a great counseling experience, she explained the entire treatment process step-by-step. The staff is polite, and waiting times are minimal.",
      date: "2 months ago",
      verified: true
    }
  ];

  // Helper function to generate rating stars HTML
  const generateStarsHTML = (rating) => {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        starsHTML += '<i class="fa-regular fa-star"></i>';
      }
    }
    return starsHTML;
  };

  // Calculate and render Google-style ratings summary dynamically
  const renderRatingSummary = () => {
    // Baseline reviews count to simulate 500+ reviews
    const baseline = {
      5: 450,
      4: 38,
      3: 8,
      2: 3,
      1: 1
    };
    
    // Add local testimonials to summary counts
    testimonials.forEach(t => {
      if (baseline[t.rating] !== undefined) {
        baseline[t.rating]++;
      }
    });
    
    // Calculate total count and average rating
    let totalReviews = 0;
    let weightedSum = 0;
    
    Object.keys(baseline).forEach(star => {
      const count = baseline[star];
      totalReviews += count;
      weightedSum += count * parseInt(star);
    });
    
    const avgScore = (weightedSum / totalReviews).toFixed(1);
    
    // Update summary UI text elements
    const avgScoreEl = document.getElementById('summaryAvgScore');
    const headerStarsEl = document.getElementById('summaryHeaderStars');
    const totalCountEl = document.getElementById('summaryTotalCount');
    
    if (avgScoreEl) avgScoreEl.textContent = avgScore;
    if (headerStarsEl) headerStarsEl.innerHTML = generateStarsHTML(avgScore);
    if (totalCountEl) totalCountEl.textContent = `${totalReviews} Patient Reviews`;
    
    // Render rating distribution histogram rows
    const histogramContainer = document.getElementById('ratingHistogram');
    if (histogramContainer) {
      histogramContainer.innerHTML = '';
      
      for (let star = 5; star >= 1; star--) {
        const count = baseline[star];
        const percentage = Math.round((count / totalReviews) * 100);
        
        const row = document.createElement('div');
        row.className = 'histogram-row';
        row.innerHTML = `
          <div class="histogram-label">${star} <i class="fa-solid fa-star"></i></div>
          <div class="histogram-track">
            <div class="histogram-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="histogram-percentage">${percentage}%</div>
        `;
        histogramContainer.appendChild(row);
      }
    }
  };

  // Render testimonial slide cards and indicators
  const renderSlider = () => {
    const track = document.getElementById('testimonialTrack');
    const controls = document.getElementById('sliderControls');
    
    if (!track || !controls) return;
    
    track.innerHTML = '';
    controls.innerHTML = '';
    
    // Populate slides
    testimonials.forEach(t => {
      // Get author initials for fallback avatar
      const initials = t.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide';
      slide.innerHTML = `
        <div class="testimonial-meta-row">
          <div class="verified-badge">
            <i class="fa-solid fa-circle-check"></i> Verified Patient
          </div>
          <div class="source-indicator">
            <i class="fa-brands fa-google"></i> Google Review
          </div>
        </div>
        <div class="testimonial-rating">
          ${generateStarsHTML(t.rating)}
        </div>
        <blockquote class="testimonial-text">
          "${t.text}"
        </blockquote>
        <div class="testimonial-author">
          <div class="author-avatar">${initials}</div>
          <div class="author-info">
            <h4>${t.name}</h4>
            <p>${t.category}</p>
          </div>
        </div>
      `;
      track.appendChild(slide);
    });
    
    // Populate navigation dots
    testimonials.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      controls.appendChild(dot);
    });
  };

  // Initialize and bind slide controls
  renderRatingSummary();
  renderSlider();
  
  const track = document.getElementById('testimonialTrack');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const dots = Array.from(document.querySelectorAll('.slider-dot'));
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoPlayInterval;
    
    const goToSlide = (index) => {
      currentIndex = index;
      const amountToMove = -100 * currentIndex;
      track.style.transform = `translateX(${amountToMove}%)`;
      
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };
    
    const nextSlide = () => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      goToSlide(nextIndex);
    };
    
    const prevSlide = () => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = slides.length - 1;
      goToSlide(prevIndex);
    };
    
    // Dot navigation events
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
    });
    
    // Arrow navigation events
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }
    
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    };
    
    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };
    
    startAutoPlay();
    
    // Pause auto-sliding on hover
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }
  }


  /* 6. APPOINTMENT BOOKING FORM */
  const bookingForm = document.getElementById('appointmentForm');
  const formAlert = document.getElementById('formAlert');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get field values
      const nameVal = document.getElementById('bookingName').value.trim();
      const phoneVal = document.getElementById('bookingPhone').value.trim();
      const emailVal = document.getElementById('bookingEmail').value.trim();
      const dateVal = document.getElementById('bookingDate').value;
      const deptVal = document.getElementById('bookingDept').value;
      const msgVal = document.getElementById('bookingMessage').value.trim();
      
      // Validation Check
      if (!nameVal || !phoneVal || !emailVal || !dateVal) {
        showAlert('Please fill in all required fields.', 'error');
        return;
      }
      
      // Validate Phone Format (basic check: digits only, length 10+)
      const cleanPhone = phoneVal.replace(/[\s()-]/g, '');
      if (cleanPhone.length < 10 || isNaN(cleanPhone)) {
        showAlert('Please enter a valid phone number (at least 10 digits).', 'error');
        return;
      }
      
      // Validate Email Format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
      }

      // If validation succeeds, trigger submit feedback
      showAlert('Requesting appointment...', 'success');
      
      // Mock API call simulation
      setTimeout(() => {
        // Success Message
        showAlert(`Thank you, ${nameVal}! Your appointment request for ${dateVal} has been sent. We will contact you shortly to confirm your booking.`, 'success');
        
        // Reset the form
        bookingForm.reset();
      }, 1500);
    });

    const showAlert = (message, type) => {
      formAlert.textContent = message;
      formAlert.className = `form-alert ${type}`;
      formAlert.style.display = 'block';
      
      // Auto-hide alert after 8 seconds (if it's a success message)
      if (type === 'success' && !message.includes('Requesting')) {
        setTimeout(() => {
          formAlert.style.display = 'none';
        }, 8000);
      }
    };
  }

  /* 7. MOBILE DROPDOWN TOGGLER */
  const dropdownToggle = document.querySelector('.nav-item-dropdown > .nav-link');
  const dropdownMenu = document.querySelector('.nav-item-dropdown .dropdown-menu');
  const dropdownContainer = document.querySelector('.nav-item-dropdown');
  
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = dropdownMenu.classList.toggle('open');
        dropdownContainer.classList.toggle('active-arrow', isOpen);
      }
    });
  }

  /* 8. HERO TYPEWRITER ANIMATION */
  const heroTitleElement = document.getElementById('hero-typewriter-title');
  if (heroTitleElement) {
    // Define the typewriter text segments
    const segments = [
      { text: "Expert Care for ", class: "" },
      { text: "Women's Health", class: "highlight" },
      { text: " Needs", class: "" }
    ];

    // Clear initial HTML and replace with typing element and blinking cursor
    heroTitleElement.innerHTML = '<span id="typewriter"></span><span class="typewriter-cursor">|</span>';
    
    const typewriter = document.getElementById('typewriter');
    
    // Create elements for each segment
    segments.forEach((seg, i) => {
      const span = document.createElement('span');
      if (seg.class) span.className = seg.class;
      span.id = `type-seg-${i}`;
      typewriter.appendChild(span);
    });

    let segmentIndex = 0;
    let charIndex = 0;

    const typeChar = () => {
      if (segmentIndex < segments.length) {
        const currentSegment = segments[segmentIndex];
        const span = document.getElementById(`type-seg-${segmentIndex}`);
        
        if (charIndex < currentSegment.text.length) {
          span.textContent += currentSegment.text.charAt(charIndex);
          charIndex++;
          // Randomize typing speed slightly for natural typewriter look (60ms to 110ms)
          setTimeout(typeChar, 60 + Math.random() * 50);
        } else {
          segmentIndex++;
          charIndex = 0;
          setTimeout(typeChar, 100);
        }
      } else {
        // Typing is complete, apply slower cursor blink
        const cursor = heroTitleElement.querySelector('.typewriter-cursor');
        if (cursor) {
          cursor.classList.add('finished');
        }
      }
    };

    // Run typewriter animation after a small initial load buffer
    setTimeout(typeChar, 400);
  }
});
