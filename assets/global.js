// JS is enabled
document.querySelector('html').classList.add('js');

/**
 * Modals with the native <dialog> element
 *
 * Allows to load content from an external URL when opened,
 * which works well with the Shopify Section Rendering API.
 */
class DialogOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const dialog = document.querySelector(this.getAttribute('data-dialog'));
      if (dialog) dialog.show(button);
    });
  }
}

customElements.define('dialog-opener', DialogOpener);

class DialogModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    this.content = this.querySelector('.dialog-content');
    this.load = this.getAttribute('data-load');
    this.loaded = false;
    this.loadingClass = 'loading';

    this.dialog.addEventListener('click', this.handleClose.bind(this));
  }

  show() {
    this.dialog.showModal();
    this.loadContent();
  }

  // Close when clicked outside the dialog.
  // <form method="dialog"> used for close button.
  handleClose(event) {
    const x = event.clientX;
    const y = event.clientY;
    const dialog = this.dialog.getBoundingClientRect();

    // X and Y are 0 if keyboard navigation is used,
    // which can result in unwanted closing of modal.
    // The close button will still work with <form>.
    if (x === 0 && y === 0) return;

    if (x < dialog.left || x > dialog.right || y < dialog.top || y > dialog.bottom) {
      this.dialog.close();
    }
  }

  // Load content from URL if data-load attribute is set and not yet loaded
  loadContent() {
    if (this.content && this.load && !this.loaded) {
      this.content.classList.add(this.loadingClass);
      fetch(this.load)
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.text();
        })
        .then((text) => {
          this.content.innerHTML = text;
          this.loaded = true;
        })
        .catch((error) => {
          this.content.innerHTML = 'Failed to load content';
          console.error(error);
        })
        .finally(() => {
          this.content.classList.remove(this.loadingClass);
        });
    }
  }
}

customElements.define('dialog-modal', DialogModal);

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
