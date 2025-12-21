
import React from 'react';
import { ButtonCell, LinkCell, TextCell } from '../cell';
import { SanityTable, SanityTableProps, TableCell } from 'structured-table';
import "../style.css"

const TableCellContent = React.memo(({ data }: { data: TableCell; }) => {
    switch (data.type) {
        case "text":
            return <TextCell data={data} />;
        case "link":
            return <LinkCell data={data} />;
        case "button":
            return <ButtonCell data={data} />;
        default:
            return <></>;
    }
})
TableCellContent.displayName = "TableCellContent";

// This component is only used here until it's npm package ready,
const TableView = ({
    data,
    className = 'border'
}: {
    data: SanityTable;
    className?: string;
}) => {

    return (
        <div className={`st-theme-${className}`} >
            <table>
                {
                    data.header && data.header.cells.length > 0 &&
                    <thead>
                        <tr>
                            {data.showSerialIndex && <th >#</th>}
                            {
                                data.header.cells.map(dh => {
                                    return <th key={dh.uid} colSpan={dh.colSpan ?? 1} rowSpan={dh.rowSpan ?? 1} style={{ textAlign: dh.align || 'left' }}>
                                        <TableCellContent data={dh} />
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                }
                <tbody>
                    {
                        data.body.map((row, idx) => {
                            return <tr key={row.uid}>
                                {data.showSerialIndex && <td>{idx + 1}</td>}
                                {
                                    row.cells.map(cell => {
                                        return <td key={cell.uid} colSpan={cell.colSpan ?? 1} rowSpan={cell.rowSpan ?? 1} style={{ textAlign: cell.align || 'left' }}>
                                            <TableCellContent data={cell} />
                                        </td>
                                    })
                                }
                            </tr>

                        })
                    }
                </tbody>
                {
                    data.footer && data.footer.cells.length > 0 &&
                    <tfoot>
                        <tr>
                            {data.showSerialIndex && <th>#</th>}
                            {
                                data.footer.cells.map(df => {
                                    return <th
                                        key={df.uid}
                                        colSpan={df.colSpan ?? 1}
                                        rowSpan={df.rowSpan ?? 1}
                                        style={{ textAlign: df.align || 'left' }}
                                    >
                                        <TableCellContent data={df} />
                                    </th>
                                })
                            }
                        </tr>
                    </tfoot>
                }
            </table>
        </div>
    )
}

export default TableView
