/**
 * StickyHeader
 * Shows the header when scrolling up, keeps measurements in sync, and
 * preserves focus while hiding only when safe.
 */
class StickyHeader extends HTMLElement {
  constructor() {
    super();

    this.onScroll = this.onScroll.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.updateMeasurements = this.updateMeasurements.bind(this);
  }

  connectedCallback() {
    // The section schema enforces `.section-sticky-header` on the wrapper around this component.
    // Keep this lookup in sync with `sections/header.liquid` to avoid breaking sticky behaviour.
    this.header =
      this.querySelector('.section-sticky-header') ||
      this.closest('.section-sticky-header') ||
      document.querySelector('.section-sticky-header');

    if (!this.header) {
      console.warn('StickyHeader: .section-sticky-header element not found.');
      return;
    }

    this.height = this.header.offsetHeight;
    this.currentScrollTop = 0;
    this.stuckClass = 'sticky-header-stuck';
    this.hiddenClass = 'sticky-header-hidden';
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.updateMeasurements, { passive: true });

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(this.updateMeasurements);
      this.resizeObserver.observe(this.header);
    }
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.updateMeasurements);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  onScroll() {
    if (!this.header) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.updateMeasurements();

    if (scrollTop < this.height) return;

    if (scrollTop < this.currentScrollTop) {
      window.requestAnimationFrame(this.show);
    } else {
      window.requestAnimationFrame(this.hide);
    }

    this.currentScrollTop = scrollTop;
  }

  updateMeasurements() {
    if (!this.header) return;

    const height = this.header.offsetHeight;
    if (height !== this.height) {
      this.height = height;
    }
  }

  hide() {
    if (!this.header) return;
    if (this.header.contains(document.activeElement)) return;

    this.header.classList.add(this.hiddenClass);
    this.header.classList.remove(this.stuckClass);
  }

  show() {
    if (!this.header) return;

    this.header.classList.remove(this.hiddenClass);
    this.header.classList.add(this.stuckClass);
  }
}

customElements.define('sticky-header', StickyHeader);

/**
 * Returns focusable elements within a container (for focus trap).
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
  if (!container) return [];
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  return Array.from(container.querySelectorAll(selector));
}

/**
 * Traps focus within the container. Call removeTrapFocus to release.
 * @param {HTMLElement} container - Element that contains the focusable region
 */
function trapFocus(container) {
  const focusable = getFocusableElements(container);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first.focus();

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  container._trapFocusHandler = handleKeyDown;
}

/**
 * Removes focus trap and optionally returns focus to an element.
 * @param {HTMLElement} [returnElement] - Element to focus when releasing trap
 */
function removeTrapFocus(returnElement) {
  const container = returnElement?.closest('header-navigation') || document.querySelector('header-navigation');
  if (container?._trapFocusHandler) {
    container.removeEventListener('keydown', container._trapFocusHandler);
    container._trapFocusHandler = null;
  }
  if (returnElement && typeof returnElement.focus === 'function') {
    returnElement.focus();
  }
}

/**
 * HeaderNavigation
 * Handles the mobile menu toggle, keyboard (Escape), focus trap, and ARIA.
 */
class HeaderNavigation extends HTMLElement {
  constructor() {
    super();
    this.toggleMenu = this.toggleMenu.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  connectedCallback() {
    this.menuToggle = this.querySelector('.menu-btn');
    this.menu =
      this.querySelector('#main-menu') ||
      this.querySelector('.header__nav') ||
      this.querySelector('.header__site-nav');

    if (!this.menuToggle || !this.menu) return;

    this.menuToggle.addEventListener('click', this.toggleMenu);
    this.addEventListener('keyup', this.onKeyUp);
    this.menu.setAttribute('aria-hidden', 'true');
  }

  disconnectedCallback() {
    if (this.menuToggle) this.menuToggle.removeEventListener('click', this.toggleMenu);
    this.removeEventListener('keyup', this.onKeyUp);
    removeTrapFocus(null);
  }

  onKeyUp(event) {
    if (event.code?.toUpperCase() !== 'ESCAPE') return;
    if (document.body.classList.contains('mobile-menu-open')) this.closeMenu();
  }

  toggleMenu() {
    document.body.classList.contains('mobile-menu-open') ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    const header = document.getElementById('header');
    if (header) {
      const headerBottom = header.getBoundingClientRect().bottom;
      this.menu.style.height = `${window.innerHeight - headerBottom + 1}px`;
    }
    this.menu.style.height = this.menu.style.height || '100vh';
    document.body.classList.add('mobile-menu-open');
    this.menu.setAttribute('aria-hidden', 'false');
    this.menuToggle.setAttribute('aria-expanded', 'true');
    const closeLabel = this.menuToggle.getAttribute('data-close-label');
    if (closeLabel) this.menuToggle.setAttribute('aria-label', closeLabel);
    trapFocus(this);
  }

  closeMenu() {
    document.body.classList.remove('mobile-menu-open');
    this.menu.style.height = '';
    this.menu.setAttribute('aria-hidden', 'true');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    const menuLabel = this.menuToggle.getAttribute('data-menu-label');
    if (menuLabel) this.menuToggle.setAttribute('aria-label', menuLabel);
    removeTrapFocus(this.menuToggle);
  }
}

customElements.define('header-navigation', HeaderNavigation);