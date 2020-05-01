/**
 * Scripts and styles used globally
 */
import '../css/theme.css';
import './utility/public-path';
import './utility/newsletter-subscribe';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes';
import openCart from './utility/open-cart';

const cartLinks = document.querySelectorAll('.open-cart');
if (cartLinks) {
  cartLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault();
      openCart().then((res) => {
        if (res === false) {
          window.location.href = e.currentTarget.getAttribute('href');
        }
      });
    });
  });
}
