<script>
  import { formatMoney } from "@shopify/theme-currency";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let product;

  const updateQty = (key) => dispatch('updateQty', { key });
</script>

<div class="flex justify-between py-4 border-b">
  <div>
    <img
      src={product.featured_image.url}
      alt={product.featured_image.alt}
      class="w-16" />
  </div>
  <div class="flex-1 px-6">
    <p class="mt-0">{product.title} - Qty: {product.quantity}</p>
    <button on:click={() => updateQty(product.key)}>Remove</button>
  </div>
  <div>
    <p class="mt-0">{formatMoney(product.price)}</p>
  </div>
</div>
