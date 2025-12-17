import React from "react";
import { LinkCellProps } from "structured-table";

const LinkCell = React.memo(({ data }: { data: LinkCellProps }) => {
    return (
        <a href={data.href} target={data.newTab ? '_blank' : '_self'} rel="noopener noreferrer">{data.text}</a>
    )
})
LinkCell.displayName = "LinkCell";

export { LinkCell };