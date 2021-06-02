<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { trapFocus, removeTrapFocus } from '@shopify/theme-a11y';
  import { updateItem } from '@shopify/theme-cart';
  import { formatMoney } from '@shopify/theme-currency';
  import CartItem from '../components/CartItem.svelte';

  let cartData = { item_count: 0, items: [] };
  let loading = false;
  let showCart = false;
  const body = document.body;

  async function cartFetch() {
    const response = await fetch('/cart.js');
    return response.json();
  }

  export function cartLoad() {
    showCart = true;
    loading = true;

    body.classList.add('overflow-hidden');

    cartFetch()
      .then((res) => (cartData = res))
      .then(() => {
        loading = false
        trapFocus(document.getElementById('modal-content'));
      });
  }

  function hideCart() {
    showCart = false;
    body.classList.remove('overflow-hidden');
    removeTrapFocus();
  }

  function handleUpdateQty(e) {
    loading = true;
    updateItem(e.detail.key, { quantity: e.detail.qty }).then((res) => {
      cartData = res;
      loading = false;
    });
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) hideCart();
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
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

{#if showCart}

  <div class="modal-bg overflow-hidden" transition:fade="{{ duration: 250 }}" on:click={hideCart} />

  <div id="modal-content" class="modal-content" transition:fly="{{ x: 200, duration: 250, delay: 100 }}">

    <div class="flex flex-col justify-between h-full relative">

      <div class="cart-header p-4 md:px-8 border-b">
        <div class="flex justify-between items-center">
          <div class="text-caps">Shopping Cart</div>
          <button class="btn-icon" on:click={hideCart}><i class="material-icons-outlined">close</i></button>
        </div>
      </div>

      <div class="cart-contents flex-grow overflow-y-scroll px-4 md:px-8">

        {#if cartData.item_count === 0}
          <div class="py-24 text-center">Wah, your cart is empty</div>
        {:else}
          {#each cartData.items as product (product.id)}
            <CartItem on:updateQty={handleUpdateQty} {product} />
          {/each}
        {/if}

      </div>

      <div class="cart-footer p-4 md:p-8 border-t bottom-0 left-0 right-0 {loading ? 'loading' : ''}">
        {#if cartData.item_count > 0}
          <div class="flex justify-between items-center mb-4">
            <div>Subtotal</div>
            <div><b>{formatMoney(cartData.items_subtotal_price, window.theme.moneyFormat)}</b></div>
          </div>

          <form action="/cart" method="post" class="mt-6 grid grid-cols-2 gap-4">
            <a href="/cart" class="btn-outlined">View Cart</a>
            <input type="submit" name="checkout" value="Check Out" class="btn" />
          </form>
        {/if}
      </div>

    </div>

  </div>

{/if}
