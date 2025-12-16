import fs from "fs-extra";
import type { PackageJson } from "../types.js";

export function isInstalled(
  pkg: string,
  requiredVersion?: string
): boolean {
  try {
    const pkgJson = JSON.parse(
      fs.readFileSync("package.json", "utf-8")
    ) as PackageJson;

    const version =
      pkgJson.dependencies?.[pkg] ??
      pkgJson.devDependencies?.[pkg];

    if (!version) return false;

    if (!requiredVersion) return true;

    // Simple semver check (enough for CLI)
    return version === requiredVersion || version.includes(requiredVersion);
  } catch (e) {
    console.log("❌ Failed to check installed packages.\nError: ", e);
    return false;
  }
}
