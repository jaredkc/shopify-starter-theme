if (!customElements.get('variant-select')) {
  class VariantSelect extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.addEventListener('change', (event) => {
        const target = this.getInputForEventTarget(event.target);
        publish(PUB_SUB_EVENTS.variantSelectChange, {
          data: { event, target },
        });
      });
    }

    getInputForEventTarget(target) {
      return target.tagName === 'SELECT' ? target.selectedOptions[0] : target;
    }
  }

  customElements.define('variant-select', VariantSelect);
}

if (!customElements.get('product-info')) {
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

    handleOptionValueChange({ data: { event, target } }) {
      if (!this.contains(event.target)) return;

      const productUrl = target.dataset.productUrl || this.pendingRequestUrl || this.dataset.url;

      this.updateURL(productUrl, target.value);
    }

    updateURL(url, variantId) {
      if (this.dataset.updateUrl === 'false') return;
      window.history.replaceState({}, '', `${url}${variantId ? `?variant=${variantId}` : ''}`);
    }
  }

  customElements.define('product-info', ProductPurchase);
}
