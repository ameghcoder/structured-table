<script lang="ts">
  import type { LinkCellProps } from "structured-table";

  let { data }: { data: LinkCellProps } = $props();
</script>

<a href={data.href} target={data.newTab ? "_blank" : "_self"} rel="noopener noreferrer">
  {data.text}
</a>
