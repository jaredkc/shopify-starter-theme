/**
 * Variant select
 */
if (!customElements.get('variant-select')) {
  class VariantSelect extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantChange(event) {
      const target = this.getInputForEventTarget(event.target);
      this.setCurrentVariant(event.target.value);

      publish(PUB_SUB_EVENTS.variantSelectChange, {
        data: { event, target, variant: this.currentVariant },
      });
    }

    getInputForEventTarget(target) {
      return target.tagName === 'SELECT' ? target.selectedOptions[0] : target;
    }

    setCurrentVariant(selectedVariantId) {
      this.currentVariant = this.getVariantData().find((variant) => {
        return variant.id === parseInt(selectedVariantId);
      });
    }

    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  }

  customElements.define('variant-select', VariantSelect);
}

/**
 * Product gallery
 */
if (!customElements.get('product-gallery')) {
  class ProductGallery extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.gallery = this.querySelector('.product-gallery');
    }

    setActiveMedia(mediaId) {
      const activeMedia = this.querySelector(`[data-media-id="${mediaId}"]`);
      if (!activeMedia) return;
      activeMedia.parentElement.firstChild !== activeMedia && activeMedia.parentElement.prepend(activeMedia);
      this.gallery.scrollTo({ left: activeMedia.offsetLeft, behavior: 'smooth' });
    }
  }

  customElements.define('product-gallery', ProductGallery);
}

/**
 * Product purchase
 */
if (!customElements.get('product-purchase')) {
  class ProductPurchase extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.onVariantChangeUnsubscriber = subscribe(
        PUB_SUB_EVENTS.variantSelectChange,
        this.handleOptionValueChange.bind(this)
      );
    }

    handleOptionValueChange({ data: { event, target, variant } }) {
      if (!this.contains(event.target)) return;

      this.updateVariantId(variant.id);
      this.updateURL(this.dataset.url, target.value);
      this.updateMedia(variant.featured_media.id);
    }

    updateVariantId(variantId) {
      document.querySelectorAll('[name="id"]').forEach((input) => {
        input.value = variantId;
      });
    }

    updateURL(url, variantId) {
      if (this.dataset.updateUrl === 'false') return;
      window.history.replaceState({}, '', `${url}${variantId ? `?variant=${variantId}` : ''}`);
    }

    updateMedia(mediaId) {
      const productGallery = this.querySelector('product-gallery');
      if (productGallery) {
        productGallery.setActiveMedia(mediaId);
      }
    }
  }

  customElements.define('product-purchase', ProductPurchase);
}
