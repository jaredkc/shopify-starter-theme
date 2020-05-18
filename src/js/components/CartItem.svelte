<script>
  import { formatMoney } from '@shopify/theme-currency';
  import { createEventDispatcher } from 'svelte';
  import CartImage from '../components/CartImage.svelte';

  const dispatch = createEventDispatcher();

  export let product;

  const updateQty = (key, qty) => {
    dispatch('updateQty', { key, qty })
  };
</script>

<div class="flex justify-between py-4 border-b">
  <div>
    <a href={product.url}>
      <CartImage bind:image={product.featured_image} />
    </a>
  </div>
  <div class="flex-1 px-4">
    <div class="mb-6">
      <a href={product.url}>{product.title}</a>
      {#if product.message}
        <div class="mt-1 text-sm text-green-700">
          {product.message}
        </div>
      {/if}

    </div>
    <div class="qty-wrapper">
      <button class="qty-increment" role="button" on:click={() => updateQty(product.key, product.quantity - 1)}>
      {#if product.quantity === 1}
        <i class="material-icons-outlined qty-icon qty-icon-delete">delete</i>
      {:else}
        <i class="material-icons-outlined qty-icon">remove</i>
      {/if}

      </button>
      <div class="qty-count">
        {product.quantity}
      </div>
      <button class="qty-increment" role="button" on:click={() => updateQty(product.key, product.quantity + 1)}>
        <i class="material-icons-outlined qty-icon">add</i>
      </button>
    </div>
  </div>
  <div>
    {formatMoney(product.price, window.theme.moneyFormat)}
  </div>
</div>
