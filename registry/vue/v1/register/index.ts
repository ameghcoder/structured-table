import { registerRenderer } from "structured-table";
import TableView from "../table/TableView.vue";

registerRenderer("vue", {
  Table: TableView,
});
