<script setup lang="ts">
import { TextCellProps } from "structured-table";

defineProps<{
  data: TextCellProps;
}>();
</script>

<template>
  <p>
    <template v-if="Array.isArray(data.value)">
      <template v-for="node in data.value" :key="node.uid">
        <template v-if="node.type === 'string'">{{ node.data }}</template>
        <br v-else-if="node.type === 'html' && node.tag === 'br'" />
      </template>
    </template>
    <template v-else>{{ data.value }}</template>
  </p>
</template>
