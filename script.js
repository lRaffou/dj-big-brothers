(() => {
  'use strict';
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileNavigationQuery = window.matchMedia('(max-width: 63.999rem)');
  const scrollBehavior = () => reducedMotionQuery.matches ? 'instant' : 'smooth';

  // Coalesce repeated scroll/resize events without scheduling several updates per frame.
  function createFrameScheduler(update) {
    let frame = 0;
    return () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
  }

  function initContactForm() {
    const form = document.querySelector('#enquiry');
    if (form && typeof enquiryValidation !== 'undefined') {
      const fields = ['prenom', 'date', 'lieu', 'message'];
      const status = document.querySelector('#form-status');
      form.noValidate = true;
      form.elements.date.min = enquiryValidation.localDate();
      const setFieldError = (name, message = '') => {
        const field = form.elements[name];
        field.setCustomValidity(message);
        if (message) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
      };
      fields.forEach(name => form.elements[name].addEventListener('input', () => {
        setFieldError(name);
        status.textContent = '';
      }));
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.elements.date.min = enquiryValidation.localDate();
        const result = enquiryValidation.prepare(Object.fromEntries(new FormData(form)));
        fields.forEach(name => setFieldError(name, result.errors[name]));
        if (Object.keys(result.errors).length) {
          status.textContent = 'Vérifiez les champs indiqués avant de préparer votre e-mail.';
          form.reportValidity();
          return;
        }
        fields.forEach(name => { form.elements[name].value = result.values[name]; });
        status.textContent = `Votre brouillon est prêt dans votre messagerie. Si elle ne s’ouvre pas, écrivez à ${enquiryValidation.recipient} ou appelez le 06 98 96 46 79.`;
        window.location.href = result.href;
      });
      form.querySelector('button[type="submit"]').disabled = false;
    }
  }

  function initRibbon() {
    const ribbon = document.querySelector('.ribbon');
    const ribbonToggle = document.querySelector('.ribbon-toggle');
    if (!ribbon || !ribbonToggle) return;
    ribbonToggle.addEventListener('click', () => {
      const paused = ribbon.classList.toggle('is-paused');
      ribbonToggle.setAttribute('aria-pressed', String(paused));
      ribbonToggle.setAttribute('aria-label', paused ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
      ribbonToggle.querySelector('.icon-pause').toggleAttribute('hidden', paused);
      ribbonToggle.querySelector('.icon-play').toggleAttribute('hidden', !paused);
    });
  }

  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    const updateBackToTop = () => { backToTop.hidden = window.scrollY < 400; };
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('pageshow', updateBackToTop);
    updateBackToTop();
    backToTop.addEventListener('click', () => {
      document.querySelector('#haut')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
  }

  function initAwardImage() {
    // Keep the award label and destination available if the image fails.
    const awardImage = document.querySelector('.review-award-image');
    if (awardImage) {
      const hideUnavailableAwardImage = () => { awardImage.hidden = true; };
      awardImage.addEventListener('error', hideUnavailableAwardImage);
      if (awardImage.complete && awardImage.naturalWidth === 0) hideUnavailableAwardImage();
    }
  }

  function initNavigation() {
    // Preserve the header layout while the compact navigation pins to the viewport.
    const navigationBar = document.querySelector('.header-navigation');
    const navigationSlot = document.querySelector('.navigation-slot');
    if (navigationBar && navigationSlot) {
      const updateStickyNavigation = () => {
        const pinned = navigationSlot.getBoundingClientRect().top <= 0;
        navigationBar.classList.toggle('is-fixed', pinned);
      };
      const scheduleStickyNavigation = createFrameScheduler(updateStickyNavigation);
      const measureStickyNavigation = () => {
        navigationBar.classList.remove('is-fixed');
        navigationSlot.style.height = '';
        navigationSlot.style.height = navigationBar.getBoundingClientRect().height + 'px';
        navigationBar.classList.add('is-fixed');
        document.documentElement.style.setProperty('--navigation-offset', Math.ceil(navigationBar.getBoundingClientRect().height + 16) + 'px');
        updateStickyNavigation();
      };
      window.addEventListener('scroll', scheduleStickyNavigation, { passive: true });
      window.addEventListener('resize', measureStickyNavigation);
      window.addEventListener('pageshow', measureStickyNavigation);
      window.addEventListener('load', measureStickyNavigation);
      document.fonts.ready.then(measureStickyNavigation);
      measureStickyNavigation();
    }

    // Native horizontal navigation keeps touch scrolling and keyboard links intact.
    const mobileNavigation = document.querySelector('#main-navigation');
    const previousNavigation = document.querySelector('.nav-arrow-previous');
    const nextNavigation = document.querySelector('.nav-arrow-next');
    const navigationLinks = mobileNavigation ? [...mobileNavigation.querySelectorAll('a[href^="#"]')] : [];
    const centerNavigationLink = (link, { behavior = scrollBehavior(), onlyIfOutside = false } = {}) => {
      if (!link || !mobileNavigationQuery.matches) return;
      const bounds = mobileNavigation.getBoundingClientRect();
      const item = link.getBoundingClientRect();
      const padding = getComputedStyle(mobileNavigation);
      if (onlyIfOutside && item.left >= bounds.left + parseFloat(padding.paddingLeft) && item.right <= bounds.right - parseFloat(padding.paddingRight)) return;
      const centered = mobileNavigation.scrollLeft + item.left - bounds.left - (bounds.width - item.width) / 2;
      const maximum = Math.max(0, mobileNavigation.scrollWidth - mobileNavigation.clientWidth);
      const left = Math.max(0, Math.min(centered, maximum));
      if (Math.abs(mobileNavigation.scrollLeft - left) > 1) mobileNavigation.scrollTo({ left, behavior });
    };
    if (mobileNavigation && previousNavigation && nextNavigation) {
      const updateNavigationEdges = () => {
        const overflows = mobileNavigation.classList.contains('is-scrollable');
        const remaining = mobileNavigation.scrollWidth - mobileNavigation.clientWidth;
        previousNavigation.hidden = nextNavigation.hidden = !overflows;
        previousNavigation.disabled = !overflows || mobileNavigation.scrollLeft <= 2;
        nextNavigation.disabled = !overflows || mobileNavigation.scrollLeft >= remaining - 2;
        mobileNavigation.classList.toggle('can-scroll-back', overflows && mobileNavigation.scrollLeft > 2);
        mobileNavigation.classList.toggle('can-scroll-forward', overflows && mobileNavigation.scrollLeft < remaining - 2);
      };
      const updateNavigationOverflow = () => {
        const gap = parseFloat(getComputedStyle(mobileNavigation).columnGap) || 0;
        const contentWidth = navigationLinks.reduce((width, link) => width + link.getBoundingClientRect().width, 0) + gap * Math.max(0, navigationLinks.length - 1);
        // Match the two .25rem paddings of the compact CSS layout, including enlarged text.
        const compactPadding = parseFloat(getComputedStyle(document.documentElement).fontSize) * .5;
        const overflows = mobileNavigationQuery.matches && contentWidth > mobileNavigation.clientWidth - compactPadding;
        mobileNavigation.classList.toggle('is-scrollable', overflows);
        updateNavigationEdges();
      };
      const moveNavigation = (direction) => {
        const style = getComputedStyle(mobileNavigation);
        const available = mobileNavigation.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        mobileNavigation.scrollBy({ left: direction * Math.max(120, available), behavior: scrollBehavior() });
      };
      previousNavigation.addEventListener('click', () => moveNavigation(-1));
      nextNavigation.addEventListener('click', () => moveNavigation(1));
      mobileNavigation.addEventListener('focusin', (event) => {
        const link = event.target.closest('a');
        if (!link || !link.matches(':focus-visible') || !mobileNavigationQuery.matches) return;
        centerNavigationLink(link, { behavior: 'instant', onlyIfOutside: true });
      });
      mobileNavigation.addEventListener('scroll', updateNavigationEdges, { passive: true });
      mobileNavigationQuery.addEventListener('change', updateNavigationOverflow);
      const navigationSizeObserver = new ResizeObserver(createFrameScheduler(updateNavigationOverflow));
      navigationSizeObserver.observe(mobileNavigation);
      navigationLinks.forEach(link => navigationSizeObserver.observe(link));
      document.fonts.ready.then(updateNavigationOverflow);
      updateNavigationOverflow();
    }

    // Reflect the section currently in view without moving the document vertically.
    if (mobileNavigation) {
      const sectionLinks = navigationLinks.map(link => ({
        link,
        section: document.querySelector(link.getAttribute('href'))
      })).filter(entry => entry.section);
      let activeLink = null;
      let beforeSections = true;
      let previousPageScroll = window.scrollY;
      const updateCurrentSection = () => {
        const pinnedHeight = navigationBar?.classList.contains('is-fixed') ? navigationBar.getBoundingClientRect().height : 0;
        const marker = Math.max(pinnedHeight + 24, Math.min(window.innerHeight * 0.28, 180));
        const current = sectionLinks.find(({ section }) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= marker && bounds.bottom > marker;
        })?.link || null;
        const atStart = sectionLinks.every(({ section }) => section.getBoundingClientRect().top > marker);
        const returningToStart = (atStart && !beforeSections) || (window.scrollY <= 0 && previousPageScroll > 0);
        beforeSections = atStart;
        previousPageScroll = window.scrollY;
        const behavior = scrollBehavior();
        if (returningToStart) requestAnimationFrame(() => {
          if (beforeSections) mobileNavigation.scrollTo({ left: 0, behavior });
        });
        if (current === activeLink) return;
        sectionLinks.forEach(({ link }) => {
          if (link === current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
        activeLink = current;
        if (current && mobileNavigationQuery.matches) requestAnimationFrame(() => {
          if (current !== activeLink) return;
          centerNavigationLink(current, { behavior });
        });
      };
      const scheduleCurrentSection = createFrameScheduler(updateCurrentSection);
      const scheduleCurrentLayout = createFrameScheduler(() => {
        updateCurrentSection();
        centerNavigationLink(activeLink, { behavior: 'instant' });
      });
      window.addEventListener('scroll', scheduleCurrentSection, { passive: true });
      window.addEventListener('resize', scheduleCurrentLayout);
      window.addEventListener('hashchange', scheduleCurrentSection);
      window.addEventListener('pageshow', scheduleCurrentSection);
      window.addEventListener('load', scheduleCurrentSection);
      document.fonts.ready.then(scheduleCurrentSection);
      scheduleCurrentSection();
    }
  }

  initContactForm();
  initRibbon();
  initBackToTop();
  initAwardImage();
  initNavigation();
})();
