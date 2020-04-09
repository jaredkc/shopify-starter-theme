/**
 * Product specific scripts and styles
 */
import '../css/product.css';
import './utility/public-path';
import openCart from './utility/open-cart';

// TODO handle file uploads
function logSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('AddToCart');
  const loadingClass = 'loading';

  btn.classList.add(loadingClass);

  fetch(e.target.action, {
    method: 'POST',
    body: new URLSearchParams(new FormData(e.target)),
  }).then((res) => {
    btn.classList.remove(loadingClass);
    if (res.status === 200) {
      openCart();
    } else {
      // TODO handle bad requests
      alert('Oh no! There was an problem.');
    }
  }).catch((error) => {
    btn.classList.remove(loadingClass);
    // TODO handle error
    console.log(error);
  });
}

const form = document.getElementById('AddToCartForm');
form.addEventListener('submit', logSubmit);
