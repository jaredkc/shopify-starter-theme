/**
 * Product specific scripts and styles
 */
import { ProductForm } from '@shopify/theme-product-form';
import { addItem } from '@shopify/theme-cart';

import '../css/product.css';
import './utility/public-path';
import openCart from './utility/open-cart';

const addToCartBtn = document.querySelector('[data-add-to-cart]');
const featuredImage = document.querySelector('[data-featured-image]');
const formElement = document.querySelector('[data-product-form]');
const stockMessages = document.querySelectorAll('[data-stock-message]');
const thumbnailLinks = document.querySelectorAll('[data-thumbnail-links]');

// Update the featured image
function handleFeaturedImage(imgSrc, imgAltText) {
  featuredImage.src = imgSrc;
  featuredImage.alt = imgAltText;
  // Unset srcset as it overrides src
  featuredImage.srcset = '';
}

// ProductForm callback to handle variants selection changes
function onOptionChange(event) {
  const { variant } = event.dataset;

  // Hide all stock message, then show for this variant
  stockMessages.forEach((stockMessage) => stockMessage.classList.add('hidden'));
  document.getElementById(`stock-message-${variant.id}`).classList.remove('hidden');

  // Update feature image
  if (variant.featured_image) {
    handleFeaturedImage(variant.featured_image.src, variant.featured_image.alt);
  }

  if (variant === null) {
    // The combination of selected options does not have a matching variant
    addToCartBtn.disabled = true;
  } else if (variant && !variant.available) {
    // The combination of selected options has a matching variant but it is currently unavailable
    addToCartBtn.disabled = true;
  } else if (variant && variant.available) {
    // The combination of selected options has a matching variant and it is available
    addToCartBtn.disabled = false;
  }
}

// ProductForm callback to handle AJAX form submit.
function onFormSubmit(event) {
  event.preventDefault();

  addToCartBtn.classList.add('loading');

  const { id } = event.dataset.variant;
  const { quantity } = event.dataset;
  const { properties } = event.dataset;

  addItem(id, { quantity, properties })
    .then(() => {
      addToCartBtn.classList.remove('loading');
      openCart().then((response) => {
        if (response === false) { window.location.href = '/cart'; }
      });
    })
    .catch(() => {
      addToCartBtn.classList.remove('loading');
      // Minimal error messages, so submit form
      // for server and template logic as fallback.
      formElement.submit();
    });
}

// Additional callbacks available
// function onQuantityChange(event) {}
// function onPropertyChange(event) {}

// Fetch the product data from the .js endpoint because it includes
// more data than the .json endpoint. Alternatively, you could inline the output
// of {{ product | json }} inside a <script> tag, with the downside that the
// data can never be cached by the browser.
//
// You will need to polyfill `fetch()` if you want to support IE11
fetch(`/products/${formElement.dataset.productHandle}.js`)
  .then((response) => response.json())
  .then((productJSON) => {
    const productForm = new ProductForm(formElement, productJSON, {
      onOptionChange, onFormSubmit,
    });
  });


// Update featured image when you click on thumbnails
if (thumbnailLinks) {
  thumbnailLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      handleFeaturedImage(event.currentTarget.href, event.target.alt);
    });
  });
}
