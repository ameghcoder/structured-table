<script setup lang="ts">
import { ButtonCellProps } from "structured-table";
import { useId } from "vue";

const props = defineProps<{
  data: ButtonCellProps;
}>();

const stableId = useId();

const handleBtnClick = (e: MouseEvent) => {
  try {
    // 1. If URL is present, it opens the url in new tab
    if (props.data.url) {
      window.open(props.data.url, "_blank");
      return;
    }

    // 2. If action is present, it dispatches a custom event
    if (props.data.action) {
      const event = new CustomEvent("st-action", {
        detail: {
          action: props.data.action,
          targetId: props.data.targetId,
          text: props.data.text,
          originalEvent: e,
        },
        bubbles: true,
      });
      (e.currentTarget as HTMLElement).dispatchEvent(event);
      console.log(`[StructuredTable] Action triggered: ${props.data.action}`);
    }
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <button
    @click="handleBtnClick"
    :id="data.targetId ?? stableId"
    class="st-button"
    :data-action="data.action"
    :data-variant="data.variant"
  >
    {{ data.text }}
  </button>
</template>
