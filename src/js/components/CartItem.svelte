<script>
  import { formatMoney } from '@shopify/theme-currency';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let loading = false;

  export let product;

  const updateQty = (key) => {
    loading = true;
    dispatch('updateQty', { key })
  };
</script>

<div class="flex justify-between py-4 border-b text-sm {loading ? 'loading' : ''}">
  <div>
    <a href={product.url}><img src={product.featured_image.url} alt={product.featured_image.alt} class="w-16" /></a>
  </div>
  <div class="flex-1 px-4">
    <div class="mb-4">
      <a href={product.url}>{product.title}</a>
      <div class="mt-1 text-sm text-gray-700">
        Qty: {product.quantity}
      </div>
    </div>
    <button class="btn-text" role="button" on:click={() => updateQty(product.key)}>Remove</button>
  </div>
  <div>
    {formatMoney(product.price)}
  </div>
</div>
