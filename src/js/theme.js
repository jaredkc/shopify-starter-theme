/**
 * Scripts and styles used globally
 */
import '../css/theme.css';
import './utility/public-path';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';

import AppCart from './AppCart.svelte';

function showCart() {
  if (window.cartApp) {
    window.cartApp.cartLoad('Reloading...');
  } else {
    const cartApp = new AppCart({
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

/**
 * Example of lazy loading with webpack.
 */
function component() {
  const element = document.createElement('div');
  const button = document.createElement('button');
  const br = document.createElement('br');

  button.innerHTML = 'Click me and look at the console!';
  element.innerHTML = 'Hello webpack';
  element.appendChild(br);
  element.appendChild(button);

  // Note that because a network request is involved, some indication
  // of loading would need to be shown in a production-level site/app.
  button.onclick = e => import(/* webpackChunkName: "print" */ './utility/print').then(module => {
    const print = module.default;

    print();
  });

  return element;
}

document.body.appendChild(component());