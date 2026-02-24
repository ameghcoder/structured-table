<script setup lang="ts">
import { LinkCellProps } from "structured-table";

defineProps<{
  data: LinkCellProps;
}>();
</script>

<template>
  <a
    :href="data.href"
    :target="data.newTab ? '_blank' : '_self'"
    rel="noopener noreferrer"
  >
    {{ data.text }}
  </a>
</template>
