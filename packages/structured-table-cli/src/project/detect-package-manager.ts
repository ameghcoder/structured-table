import fs from "fs-extra";
import type { PackageManager } from "../types.js";

export function detectPackageManager(): PackageManager {
  try {
    if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
    if (fs.existsSync("yarn.lock")) return "yarn";
    return "npm";
  } catch (e) {
    console.log("❌ Failed to detect package manager. Error: ", e);
    return "npm";
  }
}
