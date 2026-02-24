import { SanityTableProps } from "structured-table";
import TableView from "./table/TableView.vue";
import { DefineComponent } from "vue";

/**
 * STLVue: Namespace for utilities that return Vue components.
 */
export const STLVue = {
  /**
   * The Table component renders the table in Vue.
   */
  Table: TableView as unknown as DefineComponent<
    SanityTableProps & { className?: string }
  >,
};
