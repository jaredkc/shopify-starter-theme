<script>
  import * as cart from '@shopify/theme-cart';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import CartItem from '../components/CartItem.svelte';

  let cartData = { item_count: 0, items: [] };
  let message;
  let showCart = false;

  async function cartFetch() {
    const response = await fetch('/cart.js');
    return response.json();
  }

  export function cartLoad() {
    showCart = true;
    message = 'Loading cart...';
    cartFetch()
      .then((res) => (cartData = res))
      .then((message = 'Cart loaded'));
  }

  function hideCart() {
    showCart = false;
  }

  function handleUpdateQty(e, quantity = 0) {
    message = 'Updating...';
    cart.updateItem(e.detail.key, { quantity }).then((res) => {
      message = 'Product removed';
      cartData = res;
    });
  }

  onMount(async () => cartLoad());
</script>

<style>
  .modal-bg {
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000;
  }

  .modal-content {
    background: #fff;
    bottom: 0;
    max-width: 500px;
    padding: 2rem;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
</style>

{#if showCart}

  <div class="modal-bg" transition:fade="{{ duration: 250 }}" on:click={hideCart} />

  <div class="modal-content" transition:fly="{{ x: 200, duration: 250, delay: 100 }}">

    {#if message}
      <div class="bg-orange-100 text-orange-700 p-4" role="alert">
        {message}
      </div>
    {/if}

    {#if cartData.item_count === 0}
      <div class="text-center py-16">Your cart is empty 😢</div>
    {:else}
      <div class="border-t">
        {#each cartData.items as product}
          <CartItem on:updateQty={handleUpdateQty} {product} />
        {/each}
      </div>

      <form action="/cart" method="post" class="mt-6 grid grid-cols-2 gap-4">
        <a href="/cart" class="btn">View Cart</a>
        <input
          type="submit"
          name="checkout"
          value="Check Out"
          class="btn btn--primary" />
      </form>
    {/if}

  </div>

{/if}
