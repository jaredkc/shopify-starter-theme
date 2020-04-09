<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';
  import { updateItem } from '@shopify/theme-cart';
  import CartItem from '../components/CartItem.svelte';

  let cartData = { item_count: 0, items: [] };
  let loading = false;
  let showCart = false;

  async function cartFetch() {
    const response = await fetch('/cart.js');
    return response.json();
  }

  export function cartLoad() {
    showCart = true;
    loading = true;
    cartFetch()
      .then((res) => (cartData = res))
      .then(() => {
        loading = false
        trapFocus(document.getElementById('modal-content'));
      });
  }

  function hideCart() {
    console.log('hide');
    removeTrapFocus();
    showCart = false;
  }

  function handleUpdateQty(e, quantity = 0) {
    updateItem(e.detail.key, { quantity }).then((res) => {
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

  <div id="modal-content" class="modal-content" transition:fly="{{ x: 200, duration: 250, delay: 100 }}">

    <div class="flex justify-between items-center mb-4">
      <div class="text-caps">Shopping Cart</div>
      <button class="btn-icon" on:click={hideCart}><i class="material-icons-outlined">close</i></button>
    </div>

    {#if loading}
      <div class="py-24 loading border-t border-b"></div>
    {/if}

    {#if cartData.item_count === 0}
      <div class="text-center py-24 border-t border-b">Wah, your cart is empty</div>
    {:else}
      <div class="border-t">
        {#each cartData.items as product (product.id)}
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
