/**
 * Carousel Component
 *
 * A simple carousel component using CSS scroll-snap and native scrolling.
 * Features horizontal scrolling with prev/next buttons and accessibility support.
 */
export class CarouselComponent extends HTMLElement {
  constructor() {
    super();

    this.track = this.querySelector('[data-carousel-track]');
    this.leftBtn = this.querySelector('[data-carousel-direction="left"]');
    this.rightBtn = this.querySelector('[data-carousel-direction="right"]');
    this.timer = null;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  connectedCallback() {
    if (!this.track || !this.leftBtn || !this.rightBtn) return;

    // Button event listeners
    this.leftBtn.addEventListener('click', (event) => this.handleButtonClick(event));
    this.rightBtn.addEventListener('click', (event) => this.handleButtonClick(event));

    // Scroll event listener with debouncing
    this.track.addEventListener('scroll', () => this.handleDisabledBtns());

    // Resize event listener
    window.addEventListener('resize', () => this.handleDisabledBtns());

    // Touch/swipe support
    this.addEventListener('touchstart', (e) => this.handleSwipeStart(e));
    this.addEventListener('touchend', (e) => this.handleSwipeEnd(e));

    // Mouse drag support
    this.addEventListener('mousedown', (e) => this.handleDragStart(e));
    this.addEventListener('mousemove', (e) => this.handleDragMove(e));
    document.addEventListener('mouseup', (e) => this.handleDragEnd(e));
    this.addEventListener('selectstart', (e) => e.preventDefault());

    // Keyboard navigation
    this.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Initial button state update
    this.handleDisabledBtns();
  }

  disconnectedCallback() {
    if (this.timer !== null) clearTimeout(this.timer);
    document.removeEventListener('mouseup', this.handleDragEnd);
  }

  calcDistance() {
    const firstChild = this.track.firstElementChild;
    if (!firstChild) return 0;

    const secondChild = firstChild.nextElementSibling;

    if (!secondChild) {
      return firstChild.offsetWidth || this.track.offsetWidth;
    }

    const distance = secondChild.offsetLeft - firstChild.offsetLeft;

    if (distance > 0) return distance;

    const firstRect = firstChild.getBoundingClientRect();
    const secondRect = secondChild.getBoundingClientRect();

    return Math.abs(secondRect.left - firstRect.left) || secondRect.width || firstChild.offsetWidth;
  }

  handleButtonClick(event) {
    const eventTarget = event.currentTarget.dataset.carouselDirection;
    this.scrollByDirection(eventTarget);
  }

  handleDisabledBtns() {
    if (this.timer !== null) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      const maxLeft = Math.max(this.track.scrollWidth - this.track.offsetWidth, 0);

      if (this.track.scrollLeft < 0) {
        this.track.scrollTo({ left: 0, behavior: 'auto' });
      } else if (this.track.scrollLeft > maxLeft) {
        this.track.scrollTo({ left: maxLeft, behavior: 'auto' });
      }

      const isAtStart = this.track.scrollLeft <= 0;
      const isAtEnd = maxLeft - this.track.scrollLeft <= 32;

      this.leftBtn.disabled = isAtStart;
      this.rightBtn.disabled = isAtEnd;
    }, 250);
  }

  handleSwipeStart(e) {
    this.startX = e.touches[0].clientX;
  }

  handleSwipeEnd(e) {
    const endX = e.changedTouches[0].clientX;

    if (this.startX - endX > 50) {
      // Swipe left - go to next
      this.scrollByDirection('right');
    } else if (endX - this.startX > 50) {
      // Swipe right - go to previous
      this.scrollByDirection('left');
    }
  }

  handleDragStart(e) {
    e.preventDefault();
    this.isDragging = true;
    this.startX = e.clientX;
  }

  handleDragMove(e) {
    e.preventDefault();
    if (!this.isDragging) return;
    this.currentX = e.clientX;
  }

  handleDragEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const endX = e.clientX;

    if (this.startX - endX > 50) {
      // Drag left - go to next
      this.scrollByDirection('right');
    } else if (endX - this.startX > 50) {
      // Drag right - go to previous
      this.scrollByDirection('left');
    }
  }

  handleKeydown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.scrollByDirection('right');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.scrollByDirection('left');
    }
  }

  scrollByDirection(direction) {
    const distance = this.calcDistance();
    if (distance <= 0) return;

    const behavior = this.prefersReducedMotion ? 'auto' : 'smooth';
    const offset = direction === 'right' ? distance : -distance;
    const maxLeft = Math.max(this.track.scrollWidth - this.track.offsetWidth, 0);
    const target = Math.min(Math.max(this.track.scrollLeft + offset, 0), maxLeft);

    this.track.scrollTo({ left: target, behavior });
    this.handleDisabledBtns();
  }
}

// Auto-register the component if not already registered
if (!customElements.get('carousel-component')) {
  customElements.define('carousel-component', CarouselComponent);
}
