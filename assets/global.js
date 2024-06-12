// JS is enabled
document.querySelector('html').classList.add('js');

//
// Site search in dialog modal
//
const searchDialog = document.querySelector('.search-dialog');
const openSearch = document.querySelectorAll('.open-search');

openSearch.forEach((element) => {
  element.addEventListener('click', () => {
    searchDialog.showModal();
  });
});

searchDialog.addEventListener('click', (event) => {
  if (event.target === searchDialog) {
    searchDialog.close();
  }
});

/**
 * StickyHeader
 * Shows the header when scrolling up
 */
class StickyHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.header = document.querySelector('.section-header');
    this.height = this.header.offsetHeight;
    this.currentScrollTop = 0;
    this.stuckClass = 'sticky-header-stuck';
    this.hiddenClass = 'sticky-header-hidden';
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop === 0) {
      window.requestAnimationFrame(this.reset.bind(this));
    }

    if (scrollTop < this.height) return;

    if (scrollTop < this.currentScrollTop) {
      window.requestAnimationFrame(this.show.bind(this));
    } else {
      window.requestAnimationFrame(this.hide.bind(this));
    }

    this.currentScrollTop = scrollTop;
  }

  reset() {
    this.header.classList.remove(this.stuckClass);
    this.header.classList.remove(this.hiddenClass);
  }

  hide() {
    this.header.classList.add(this.hiddenClass);
    this.header.classList.remove(this.stuckClass);
  }

  show() {
    this.header.classList.remove(this.hiddenClass);
    this.header.classList.add(this.stuckClass);
  }
}

customElements.define('sticky-header', StickyHeader);
