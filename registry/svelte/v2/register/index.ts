import { registerRenderer } from "structured-table";
import TableView from "../table/TableView.svelte";

registerRenderer("svelte", {
  Table: TableView,
});
