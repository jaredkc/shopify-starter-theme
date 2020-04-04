/**
 * Scripts and styles used globally
 */
import '../css/theme.css';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';

import App from './AppCart.svelte';

function showCart() {
  if (window.cartApp) {
    window.cartApp.cartLoad('Reloading...');
  } else {
    const cartApp = new App({
      target: document.getElementById('app-cart'),
      props: {
        showCart: true,
      },
    });

    window.cartApp = cartApp;
  }
}

const cartLinks = document.querySelectorAll('.open-cart');
if (cartLinks) {
  cartLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      showCart();
    });
  });
}
