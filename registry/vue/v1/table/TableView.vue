<script setup lang="ts">
import { SanityTable, TableCell } from "structured-table";
import { ButtonCell, LinkCell, TextCell } from "../cell";
import "../style.css";

interface Props {
  data: SanityTable;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  className: "border",
});

const getComponent = (type: TableCell["type"]) => {
  switch (type) {
    case "text":
      return TextCell;
    case "link":
      return LinkCell;
    case "button":
      return ButtonCell;
    default:
      return null;
  }
};
</script>

<template>
  <div :class="`st-theme-${className}`">
    <table>
      <thead v-if="data.header">
        <tr>
          <th v-if="data.showSerialIndex">#</th>
          <th
            v-for="dh in data.header.cells"
            :key="dh.uid"
            :colSpan="dh.colSpan ?? 1"
            :rowSpan="dh.rowSpan ?? 1"
            :style="{ textAlign: dh.align || 'left' }"
          >
            <component :is="getComponent(dh.type)" :data="dh" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in data.body" :key="row.uid">
          <td v-if="data.showSerialIndex">{{ idx + 1 }}</td>
          <td
            v-for="cell in row.cells"
            :key="cell.uid"
            :colSpan="cell.colSpan ?? 1"
            :rowSpan="cell.rowSpan ?? 1"
            :style="{ textAlign: cell.align || 'left' }"
          >
            <component :is="getComponent(cell.type)" :data="cell" />
          </td>
        </tr>
      </tbody>
      <tfoot v-if="data.footer && data.footer.cells.length > 0">
        <tr>
          <th v-if="data.showSerialIndex">#</th>
          <th
            v-for="df in data.footer.cells"
            :key="df.uid"
            :colSpan="df.colSpan ?? 1"
            :rowSpan="df.rowSpan ?? 1"
            :style="{ textAlign: df.align || 'left' }"
          >
            <component :is="getComponent(df.type)" :data="df" />
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
