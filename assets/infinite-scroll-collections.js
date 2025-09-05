/**
 * Simple Infinite Scroll for Shopify Collections
 */
class InfiniteScrollCollections extends HTMLElement {
  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = null;
    this.isLoading = false;
    this.hasMorePages = true;
    this.maxPages = 8; // Prevent too many infinite loads
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.grid = this.querySelector('#product-grid');
    this.pagination = this.querySelector('.pagination');
    this.loadingIndicator = this.querySelector('.infinite-scroll-loading');

    if (!this.grid) return;

    // Get initial state
    this.currentPage = parseInt(this.getAttribute('data-current-page')) || 1;
    this.totalPages = parseInt(this.getAttribute('data-total-pages')) || null;

    // Set up scroll listener
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (this.isLoading || !this.hasMorePages) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

    if (distanceFromBottom < 200) {
      // Prevent multiple rapid calls
      window.removeEventListener('scroll', this.handleScroll);
      this.loadNextPage();
    }
  }

  async loadNextPage() {
    if (this.isLoading) return;

    this.isLoading = true;
    const nextPage = this.currentPage + 1;

    console.log(`Loading page ${nextPage} of ${this.totalPages}`);

    // Check if we've reached the end
    if (this.totalPages && nextPage > this.totalPages || nextPage > this.maxPages) {
      console.log('Reached end of pages');
      this.hasMorePages = false;
      this.isLoading = false;
      this.reattachScrollListener();
      return;
    }

    try {
      this.showLoading();

      const url = `${window.location.pathname}?section_id=main-collection-product-grid&page=${nextPage}`;
      console.log('Fetching:', url);

      const response = await fetch(url);
      const htmlText = await response.text();

      if (htmlText && htmlText.trim()) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;

        const newProducts = tempDiv.querySelector('#product-grid');
        const newProductsList = newProducts.querySelectorAll('li');
        const newPagination = tempDiv.querySelector('.pagination');

        if (newProducts && newProductsList.length > 0) {
          console.log(`Found ${newProductsList.length} new products`);

          // Append new products
          Array.from(newProductsList).forEach(product => {
            this.grid.appendChild(product.cloneNode(true));
          });

          if (newPagination) {
            this.pagination.innerHTML = newPagination.innerHTML;
          }

          this.currentPage = nextPage;

          // Wait before reattaching scroll listener
          setTimeout(() => this.reattachScrollListener(), 500);
        } else {
          console.log('No more products found');
          this.hasMorePages = false;
          this.reattachScrollListener();
        }
      } else {
        console.log('Empty response');
        this.hasMorePages = false;
        this.reattachScrollListener();
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
      this.reattachScrollListener();
    } finally {
      this.hideLoading();
      this.isLoading = false;
    }
  }

  reattachScrollListener() {
    // Only reattach if we still have more pages
    if (this.hasMorePages) {
      setTimeout(() => {
        window.addEventListener('scroll', this.handleScroll);
      }, 100);
    }
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'block';
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'none';
    }
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// Register the custom element
customElements.define('infinite-scroll-collections', InfiniteScrollCollections);