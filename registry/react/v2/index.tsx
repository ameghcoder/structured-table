import React, { ReactElement } from "react";
import { SanityTableProps } from "structured-table";
import TableView from "./table/TableView";


/**
 * STLReact: Namespace for utilities that return React components.
 */
export const STLReact = {
    /**
     * The Table function returns a functional React component 
     * that renders the table.
     * @param props The component props containing data and optional className.
     * @returns A rendered ReactElement.
     */
    Table: (props: SanityTableProps & { className?: string }): ReactElement => <TableView {...props} />
}