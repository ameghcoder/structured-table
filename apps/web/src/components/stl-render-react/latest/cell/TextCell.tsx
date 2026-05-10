import React from "react";
import { TextCellProps } from "structured-table";

const TextCell = React.memo(({ data }: { data: TextCellProps }) => {
    if (!Array.isArray(data.value)) {
        return <p>{data.value}</p>;
    }
    return (
        <p>
            {data.value.map((node) => {
                if (node.type === "string") return <React.Fragment key={node.uid}>{node.data}</React.Fragment>;
                if (node.type === "html" && node.tag === "br") return <br key={node.uid} />;
                return null;
            })}
        </p>
    );
});
TextCell.displayName = "TextCell";

export { TextCell };
