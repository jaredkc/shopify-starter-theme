import AppCart from './AppCart.svelte';

export default () => {
  if (window.cartApp) {
    window.cartApp.cartLoad('Cart reloading...');
  } else {
    const cartApp = new AppCart({
      target: document.getElementById('app-cart'),
      props: {
        showCart: true,
      },
    });

    window.cartApp = cartApp;
  }
};
