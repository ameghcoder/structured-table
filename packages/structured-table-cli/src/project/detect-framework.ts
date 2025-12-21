import fs from "fs-extra";
import { PackageJson } from "../types.js";

export function detectFramework(candidates: string[]) {
  try {
    const pkg: PackageJson = JSON.parse(
      fs.readFileSync("package.json", "utf-8")
    );

    for (const framework of candidates) {
      if (pkg.dependencies?.[framework] || pkg.devDependencies?.[framework]) {
        return framework;
      }
    }
    return null;
  } catch (e) {
    console.log("❌ Failed to detect framework. Error: ", e);
    return null;
  }
}
