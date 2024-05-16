// JS is enabled
document.querySelector('html').classList.add('js');

class VariantSelect extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onChange);
  }

  onChange(event) {
    this.setCurrentVariant(event.target.value);

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      // this.setUnavailable();
    } else {
      this.updateURL();
      this.updateVariantInput();
      // this.renderProductInfo();
    }
  }

  setCurrentVariant(selectedVariantId) {
    this.currentVariant = this.getVariantData().find((variant) => {
      return variant.id === parseInt(selectedVariantId);
    });
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  /**
   * Get the variant data from the JSON script tag
   * @returns {Array} Array of variant objects [https://shopify.dev/docs/api/liquid/objects#variant]
   */
  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-select', VariantSelect);
