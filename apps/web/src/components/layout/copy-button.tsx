'use client'
import { Copy } from "lucide-react";
import { Button } from "../ui/button";

export function CopyButton({ data }: { data: React.ReactNode | string }) {
    const hanldeCopyButton = () => {
        try {
            const stringData = new String(data);
            navigator.clipboard.writeText(stringData.toString());
            alert("Code Copied to clipboard")
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Button size={'icon'} className="inset-0 cursor-pointer hover:bg-transparent!" variant="ghost" onClick={hanldeCopyButton}>
            <Copy className="size-3.5" />
        </Button>
    )
}