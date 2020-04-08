/**
 * Scripts and styles used globally
 */
import '../css/theme.css';
import './utility/public-path';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';

const cartLinks = document.querySelectorAll('.open-cart');
if (cartLinks) {
  cartLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      import(/* webpackChunkName: "app-cart-init" */ './apps/app-cart-init').then((module) => {
        const appcart = module.default;
        appcart();
      });
    });
  });
}
