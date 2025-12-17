import TableEditor from "@/components/layout/table-editor"

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
