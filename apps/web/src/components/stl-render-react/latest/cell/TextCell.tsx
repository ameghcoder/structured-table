import React from "react";
import { TextCellProps } from "structured-table";

const TextCell = React.memo(({ data }: { data: TextCellProps }) => {
    return (<p>{data.value}</p>)
})
TextCell.displayName = "TextCell";

export { TextCell };