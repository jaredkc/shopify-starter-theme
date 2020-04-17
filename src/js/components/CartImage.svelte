<script>
  import { getSizedImageUrl } from "@shopify/theme-images";

  export let image;
</script>

{#if image.url}
  <img
    src={getSizedImageUrl(image.url, 'small')}
    alt={image.alt}
    class="w-20" />
{:else}
  <div class="flex items-center justify-center w-20 h-20 bg-gray-200 text-gray-400">
    <i class="material-icons-outlined">insert_photo</i>
  </div>
{/if}
