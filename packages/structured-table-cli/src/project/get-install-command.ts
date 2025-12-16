import type { Dependency, PackageManager } from "../types.js";

export default function getInstallCommand(
  pm: PackageManager,
  deps: Dependency[]
) {
  try {
    const pkgs = deps.map((d) =>
      d.version ? `${d.package}@${d.version}` : d.package
    );

    switch (pm) {
      case "pnpm":
        return `pnpm add ${pkgs.join(" ")}`;
      case "yarn":
        return `yarn add ${pkgs.join(" ")}`;
      default:
        return `npm install ${pkgs.join(" ")}`;
    }
  } catch (e) {
    console.log("❌ Failed to get install command. Error: ", e);
    return "";
  }
}
