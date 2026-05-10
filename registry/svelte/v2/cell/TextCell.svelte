<script lang="ts">
  import type { TextCellProps } from "structured-table";

  let { data }: { data: TextCellProps } = $props();
</script>

<p>
  {#if Array.isArray(data.value)}
    {#each data.value as node (node.uid)}
      {#if node.type === "string"}{node.data}{/if}{#if node.type === "html" && node.tag === "br"}<br />{/if}
    {/each}
  {:else}
    {data.value}
  {/if}
</p>
