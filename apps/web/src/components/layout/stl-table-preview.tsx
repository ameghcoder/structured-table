import { STL } from "structured-table";
import { STLReact } from "../stl-render-react/latest";
import STLTableClient from "./stl-table-client";

export function STLTablePreview({
    data,
    theme,
}: {
    data: string;
    theme: string;
}) {

    const table = STL.parse(data)
    return (
        <>
            <STLTableClient />
            <div className=" bg-background">
                <div className="overflow-x-auto">
                    <STLReact.Table
                        data={table}
                        className={theme}
                    />
                </div>
            </div>
        </>
    )
}