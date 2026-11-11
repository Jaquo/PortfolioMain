const revealTargets = document.querySelectorAll(
  '.profile-text > *, .profile-image, ' +
  '.skills-column > h2, .skillrow, .skillrowc, ' +
  '.projects-column > h2, .project, ' +
  '.container > h2, .container > p, .log-entry, .githubimg'
);

if (
  revealTargets.length > 0 &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  document.documentElement.classList.add('scroll-reveal');
  revealTargets.forEach(element => element.classList.add('reveal-on-scroll'));

  let observer;
  const pendingReveals = new WeakSet();
  const reveal = element => {
    if (pendingReveals.has(element) || element.classList.contains('is-visible')) {
      return;
    }

    pendingReveals.add(element);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        element.classList.add('is-visible');
        observer?.unobserve(element);
      });
    });
  };

  const checkVisibleTargets = () => {
    revealTargets.forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        reveal(element);
      }
    });
  };

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(element => observer.observe(element));
  }

  let checkScheduled = false;
  const scheduleVisibilityCheck = () => {
    if (!checkScheduled) {
      checkScheduled = true;
      requestAnimationFrame(() => {
        checkScheduled = false;
        checkVisibleTargets();
      });
    }
  };

  window.addEventListener('scroll', scheduleVisibilityCheck, { passive: true });
  window.addEventListener('resize', scheduleVisibilityCheck);
  scheduleVisibilityCheck();
}