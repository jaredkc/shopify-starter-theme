/**
 * Product specific scripts and styles
 */
import { ProductForm } from '@shopify/theme-product-form';
import { formatMoney } from '@shopify/theme-currency';
import { addItem } from '@shopify/theme-cart';

import '../css/product.css';
import './utility/public-path'; // Needed for openCart
import openCart from './utility/open-cart';

const addToCartBtn = document.querySelector('[data-add-to-cart]');
const featuredImage = document.querySelector('[data-featured-image]');
const formElement = document.querySelector('[data-product-form]');
const stockMessages = document.querySelectorAll('[data-stock-message]');
const thumbnailLinks = document.querySelectorAll('[data-thumbnail-links]');
const themeStrings = window.theme.strings;
const themeMoneyFormat = window.theme.moneyFormat;

/**
 * Updating the featured image
 *
 * @param {string} imgSrc - Image src url
 * @param {string} imgAltText - Alt text for the image
 */
function handleFeaturedImage(imgSrc, imgAltText) {
  featuredImage.src = imgSrc;
  featuredImage.alt = imgAltText;
  // Unset srcset as it overrides src
  featuredImage.srcset = '';
}

// Update featured image when you click on thumbnails
if (thumbnailLinks) {
  thumbnailLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      handleFeaturedImage(event.currentTarget.href, event.target.alt);
    });
  });
}

/**
 * ProductForm callbacks
 *
 * onOptionChange - Callback for whenever an option input changes
 * onQuantityChange - Callback for whenever an quantity input changes
 * onPropertyChange - Callback for whenever a property input changes
 * onFormSubmit - Callback for whenever the product form is submitted
 */

function onOptionChange(event) {
  const { variant } = event.dataset;

  // Hide all stock message.
  stockMessages.forEach((stockMessage) => stockMessage.classList.add('hidden'));

  // Return and reset if we don't have a variant,
  if (!variant) {
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.unavailable;
    return;
  }

  // Show stock message for this variant.
  document.getElementById(`stock-message-${variant.id}`).classList.remove('hidden');

  // Update feature image
  if (variant.featured_image) {
    handleFeaturedImage(variant.featured_image.src, variant.featured_image.alt);
  }

  if (variant === null) {
    // The combination of selected options does not have a matching variant
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.unavailable;
  } else if (variant && !variant.available) {
    // The combination of selected options has a matching variant but it is currently unavailable
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = themeStrings.soldOut;
  } else if (variant && variant.available) {
    // The combination of selected options has a matching variant and it is available
    addToCartBtn.disabled = false;
    addToCartBtn.innerHTML = `${themeStrings.addToCart} &middot; ${formatMoney(variant.price, themeMoneyFormat)}`;
  }
}

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
      // Minimal error messages, so try standard form submit.
      formElement.submit();
    });
}

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
