<script lang="ts">
  import type { ButtonCellProps } from "structured-table";

  let { data }: { data: ButtonCellProps } = $props();

  const stableId = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

  function handleClick(e: MouseEvent) {
    try {
      if (data.url) {
        window.open(data.url, "_blank");
        return;
      }
      if (data.action) {
        const event = new CustomEvent("st-action", {
          detail: {
            action: data.action,
            targetId: data.targetId,
            text: data.text,
            originalEvent: e,
          },
          bubbles: true,
        });
        (e.currentTarget as HTMLButtonElement).dispatchEvent(event);
        console.log(`[StructuredTable] Action triggered: ${data.action}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
</script>

<button
  onclick={handleClick}
  id={data.targetId ?? stableId}
  class="st-button"
  data-action={data.action}
  data-variant={data.variant}
>
  {data.text}
</button>
