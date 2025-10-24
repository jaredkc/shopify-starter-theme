class InfiniteScrollCollections extends HTMLElement {
  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = null;
    this.isLoading = false;
    this.hasMorePages = true;
    this.maxPages = 4; // Prevent too many infinite loads
    this.productCount = 0;

    // IntersectionObserver sentinel + observer instance
    this.sentinel = null;
    this.observer = null;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.grid = this.querySelector('#product-grid');
    this.loadingIndicator = this.querySelector('.infinite-scroll-loading');
    this.pagination = this.querySelector('.pagination');
    this.productCountAnnouncer = this.querySelector('#product-count-announcer');

    if (!this.grid) return;

    // Get initial state
    this.currentPage = parseInt(this.getAttribute('data-current-page')) || 1;
    this.productCount = this.grid.querySelectorAll('li').length;
    this.totalPages = parseInt(this.getAttribute('data-total-pages')) || null;

    // Create sentinel element (sibling after the grid)
    this.createSentinel();

    // Only set up IntersectionObserver-based infinite scroll if supported.
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    }
  }

  createSentinel() {
    // If a sentinel already exists (e.g., after reset), remove it so we create a fresh one
    if (this.sentinel && this.sentinel.parentNode) {
      this.sentinel.parentNode.removeChild(this.sentinel);
    }

    this.sentinel = document.createElement('div');
    this.sentinel.className = 'infinite-scroll-sentinel';
    this.sentinel.setAttribute('aria-hidden', 'true');
    // Place sentinel after the grid so IntersectionObserver will detect when the end is near
    this.grid.after(this.sentinel);
  }

  setupObserver() {
    // Disconnect any existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // rootMargin uses percentages relative to viewport size. 20% bottom margin causes the observer to
    // fire when the sentinel is within ~20% of the viewport bottom, which adapts well to mobile.
    const rootMargin = '0px 0px 20% 0px';

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Prevent multiple triggers while loading and when there are no more pages
          if (!this.isLoading && this.hasMorePages) {
            // Temporarily stop observing until load completes to avoid duplicate triggers
            this.observer.unobserve(this.sentinel);
            this.loadNextPage().then(() => {
              // Re-observe only if we still have pages to load
              if (this.observer && this.hasMorePages) {
                // small delay to avoid immediate re-trigger in some browsers
                setTimeout(() => this.observer.observe(this.sentinel), 200);
              }
            });
          }
        }
      });
    }, { root: null, rootMargin, threshold: 0 });

    // Start observing
    this.observer.observe(this.sentinel);
  }

  async loadNextPage() {
    if (this.isLoading) return;

    this.isLoading = true;
    const nextPage = this.currentPage + 1;

    // Check if we've reached the end
    if ((this.totalPages && nextPage > this.totalPages) || nextPage > this.maxPages) {
      this.hasMorePages = false;
      this.isLoading = false;
      return;
    }

    try {
      this.showLoading();

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('page')) urlParams.delete('page');
      const url = `${window.location.pathname}?section_id=main-collection-product-grid&page=${nextPage}&${urlParams.toString()}`;

      const response = await fetch(url);
      const htmlText = await response.text();

      if (htmlText && htmlText.trim()) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;

        const newProducts = tempDiv.querySelector('#product-grid');
        const newProductsList = newProducts ? newProducts.querySelectorAll('li') : [];
        const newPagination = tempDiv.querySelector('.pagination');

        if (newProducts && newProductsList.length > 0) {
          // Append new products
          Array.from(newProductsList).forEach((product) => {
            this.grid.appendChild(product.cloneNode(true));
          });

          // Update product count and announce to screen readers
          this.productCount += newProductsList.length;
          this.announceProductCount();

          if (newPagination && this.pagination) {
            this.pagination.innerHTML = newPagination.innerHTML;
          }

          this.currentPage = nextPage;
        } else {
          // No products found on this next page => end
          this.hasMorePages = false;
        }
      } else {
        // Empty response => stop
        this.hasMorePages = false;
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
      // Re-observe sentinel after a short delay to allow retry if desired
      if (this.observer && this.sentinel) {
        setTimeout(() => this.observer.observe(this.sentinel), 500);
      }
    } finally {
      this.hideLoading();
      this.isLoading = false;
    }
  }

  announceProductCount() {
    if (this.productCountAnnouncer) {
      this.productCountAnnouncer.textContent = `${this.productCount} ${this.getAttribute('data-products-count-label')}`;
    }
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'block';
      // Announce loading to screen readers using the single live region
      if (this.productCountAnnouncer) {
        this.productCountAnnouncer.textContent = this.getAttribute('data-loading-label');
      }
    }
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'none';
    }
    // Clear loading message from live region
    if (this.productCountAnnouncer) {
      // Small delay to ensure loading message was announced before clearing
      setTimeout(() => {
        this.announceProductCount();
      }, 100);
    }
  }

  // Call this externally to reset the infinite scroll state, as when filters are applied.
  reset() {
    this.currentPage = 1;
    this.isLoading = false;
    this.hasMorePages = true;

    // Re-find the grid element and pagination in case it was replaced
    this.grid = this.querySelector('#product-grid');
    this.pagination = this.querySelector('.pagination');
    this.productCount = this.grid ? this.grid.querySelectorAll('li').length : 0;

    this.announceProductCount();

    // Remove observer temporarily
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Recreate sentinel (in case grid was replaced) and re-attach observer if supported
    this.createSentinel();

    setTimeout(() => {
      if ('IntersectionObserver' in window) {
        this.setupObserver();
      }
      // otherwise do nothing
    }, 100);
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

customElements.define('infinite-scroll-collections', InfiniteScrollCollections);