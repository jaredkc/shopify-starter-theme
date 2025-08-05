class CollectionLinks extends HTMLElement {
  constructor() {
    super();

    this.sectionLinks = this.querySelectorAll('a');
    this.initPath = window.location.href;
    this.bindEvents();
  }

  connectedCallback() {
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
    this.sectionLinks.forEach((link) => {
      link.addEventListener('click', this.onLinkClick.bind(this));
    });
  }

  setActiveClass(elm) {
    this.sectionLinks.forEach((link) => {
      link.classList.remove('collection-link--active');
    });
    elm.classList.add('collection-link--active');
  }

  onLinkClick(event) {
    event.preventDefault();
    this.renderSectionFromFetch(event.currentTarget);
  }

  renderSectionFromFetch(linkElement, updateHistory = true) {
    linkElement.classList.add('loading');
    fetch(linkElement.dataset.section)
      .then((response) => response.text())
      .then((html) => {
        document.querySelector(linkElement.dataset.target).innerHTML = html;
      })
      .catch(() => (window.location = linkElement.href))
      .finally(() => {
        linkElement.classList.remove('loading');
        this.setActiveClass(linkElement);
      });
    if (updateHistory) {
      history.pushState({ path: linkElement.href }, '', linkElement.href);
    }
  }
}

customElements.define('collection-links', CollectionLinks);
