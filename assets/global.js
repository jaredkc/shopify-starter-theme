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
