/**
 * StickyHeader
 * Shows the header when scrolling up, keeps measurements in sync, and
 * preserves focus while hiding only when safe.
 */
class StickyHeader extends HTMLElement {
  constructor() {
    super();

    this.onScroll = this.onScroll.bind(this);
    this.reset = this.reset.bind(this);
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

    if (scrollTop === 0) {
      window.requestAnimationFrame(this.reset);
    }

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

  reset() {
    if (!this.header) return;

    this.header.classList.remove(this.stuckClass);
    this.header.classList.remove(this.hiddenClass);
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
