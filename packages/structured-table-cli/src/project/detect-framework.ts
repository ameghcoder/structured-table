import fs from "fs-extra";

export function detectFramework() {
  try{
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  
    if (pkg.dependencies?.react) return "react";
    return null;
  } catch(e){
    console.log("❌ Failed to detect framework. Error: ", e);
    return null;
  }
}
