import { registerRenderer } from "structured-table";
import TableView from "../table/TableView";

registerRenderer("react", {
  Table: TableView,
});
