import AppCart from './AppCart.svelte';

export default () => {
  if (window.cartApp) {
    window.cartApp.cartLoad();
  } else {
    const cartApp = new AppCart({
      target: document.getElementById('app-cart'),
    });

    window.cartApp = cartApp;
  }
};
