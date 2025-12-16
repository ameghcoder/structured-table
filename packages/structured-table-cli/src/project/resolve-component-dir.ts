import fs from "fs-extra";
export default function resolveComponentDir(customPath?: string, renderer?: string, requiredVersion?: string | null) {
  try{
    if (customPath) return customPath;

    const finalPath = renderer ? `/stl-render-${renderer}/${requiredVersion ?? "latest"}` : "";
    const candidates = [
      `src/components/${finalPath}`,
      `components/${finalPath}`,
      `src/ui/${finalPath}`,
      `ui/${finalPath}`
    ];

    for (const dir of candidates) {
      if (fs.existsSync(dir)) return dir;
    }

    if (fs.existsSync("src")) return `src/components/${finalPath}`;

    return `components/${finalPath}`;
  } catch(e){
    console.log("❌ Failed to resolve component directory. Error: ", e);
    return "components";
  }
}
