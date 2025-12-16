import { REGISTRY_CONFIG } from "../config/registry.js";

export async function fetchFile(path: string) {
    try{
        const rawBasePath = REGISTRY_CONFIG.baseUrl();
        const res = await fetch(`${rawBasePath}/${path}`);
        if (!res.ok) throw new Error("Failed to fetch " + path);
        return res.text();
    } catch(e){
        console.log("❌ Failed to fetch file. Error: ", e);
        return "";
    }
}
