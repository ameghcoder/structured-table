'use client'
import { useEffect } from 'react'

const STLTableClient = () => {
    useEffect(() => {
        const handleTableAction = (e: any) => {
            const { action, targetId } = e.detail;
            alert(`Action: ${action}\nID: ${targetId}`)
        };

        // Add listener to window or specific container
        window.addEventListener('st-action', handleTableAction);

        return () => {
            window.removeEventListener('st-action', handleTableAction);
        };
    }, []);
    return null
}

export default STLTableClient

