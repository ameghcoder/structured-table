import TableEditor from "@/components/layout/table-editor"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Playground",
    description: "Try out the Structured Table Language (STL) in our interactive playground. Write STL code and see the table render in real-time.",
};

const Page = async () => {
    return (
        <div className="w-full mx-auto">
            <div className="w-full h-full min-h-screen p-2 md:p-4 lg:p-8">
                <TableEditor />
            </div>
        </div>
    )
}

export default Page
