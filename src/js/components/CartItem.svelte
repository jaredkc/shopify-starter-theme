<script>
  import { formatMoney } from '@shopify/theme-currency';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let product;

  const updateQty = (key) => dispatch('updateQty', { key });
</script>

<div class="flex justify-between py-4 border-b text-sm">
  <div>
    <img
      src={product.featured_image.url}
      alt={product.featured_image.alt}
      class="w-16" />
  </div>
  <div class="flex-1 px-4">
    <div>
      {product.title}
      <div class="mt-1 mb-4 text-sm text-gray-700">
        Qty: {product.quantity}
      </div>
    </div>
    <button class="btn-icon" on:click={() => updateQty(product.key)}><i class="material-icons-outlined">delete</i></button>
  </div>
  <div>
    {formatMoney(product.price)}
  </div>
</div>
