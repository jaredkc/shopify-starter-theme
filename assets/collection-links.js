/**
 * CollectionLinks - Custom element for handling collection navigation
 * Manages AJAX loading of collection sections and browser history
 */
class CollectionLinks extends HTMLElement {
  constructor() {
    super();

    // Initialize collection link elements and initial path
    this.sectionLinks = this.querySelectorAll('a');
    this.initPath = window.location.href;
    this.bindEvents();
  }

  connectedCallback() {
    // Handle browser back/forward navigation
    const onHistoryChange = (event) => {
      const path = event.state ? event.state.path : this.initPath;
      const pathName = new URL(path).pathname;
      const link = this.querySelector(`a[href="${pathName}"]`);
      if (link) {
        this.renderSectionFromFetch(link, false);
      } else {
        window.location = path;
      }
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  bindEvents() {
    // Attach click handlers to all collection links
    this.sectionLinks.forEach((link) => {
      link.addEventListener('click', this.onLinkClick.bind(this));
    });
  }

  setActiveClass(elm) {
    // Remove active class from all links and add to current
    this.sectionLinks.forEach((link) => {
      link.classList.remove('collection-link--active');
    });
    elm.classList.add('collection-link--active');
  }

  onLinkClick(event) {
    // Prevent default navigation and load section via AJAX
    event.preventDefault();
    this.renderSectionFromFetch(event.currentTarget);
  }

  renderSectionFromFetch(linkElement, updateHistory = true) {
    // Show loading state and fetch section content
    linkElement.classList.add('loading');
    fetch(linkElement.dataset.section)
      .then((response) => response.text())
      .then((html) => {
        // Update target element with fetched HTML
        document.querySelector(linkElement.dataset.target).innerHTML = html;
      })
      .catch(() => (window.location = linkElement.href)) // Fallback to full page load
      .finally(() => {
        // Remove loading state and update active link
        linkElement.classList.remove('loading');
        this.setActiveClass(linkElement);
      });

    // Update browser history if requested
    if (updateHistory) {
      history.pushState({ path: linkElement.href }, '', linkElement.href);
    }
  }
}

// Register custom element
customElements.define('collection-links', CollectionLinks);
