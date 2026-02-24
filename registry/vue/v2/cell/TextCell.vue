<script setup lang="ts">
import { TextCellProps } from "structured-table";

defineProps<{
  data: TextCellProps;
}>();
</script>

<template>
  <p>{{ data.value }}</p>
</template>
