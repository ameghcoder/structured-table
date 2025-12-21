import fs from "fs-extra";
import path from "path";
import { detectFramework } from "../project/detect-framework.js";
import resolveComponentDir from "../project/resolve-component-dir.js";
import { fetchFile } from "../registry/fetch.js";
import { installDependencies } from "../utils/install-dependencies.js";
import parseRenderer from "../utils/parse-renderer.js";
import type {
  AddCommandOptions,
  RendererMeta,
  SupportedFrameworks,
} from "../types.js";

export async function add(rendererInput: string, options?: { path?: string }) {
  try {
    // 1. Parse input (e.g. react or react@v2)
    const { name: renderer, version: requiredVersion } =
      parseRenderer(rendererInput);

    // 2. Fetch supported frameworks from registry
    const supportedRaw = await fetchFile("supported.json");
    const supported = JSON.parse(supportedRaw).supported as string[];

    if (!supported.includes(renderer)) {
      throw new Error(
        `Framework "${renderer}" is not supported. \nSupported frameworks: ${supported.join(
          ", "
        )}`
      );
    }

    // 3. Detect project framework based on registry candidates
    const framework = detectFramework(supported);
    if (!framework) {
      throw new Error(
        "Framework could not be detected. Please ensure you have a supported framework (react, vue, etc.) installed in your package.json dependencies."
      );
    }

    if (renderer !== framework) {
      throw new Error(
        `Renderer "${renderer}" does not match detected framework "${framework}". Please install the match renderer for your project.`
      );
    }

    // 4. Fetch meta.json
    const metaRaw = await fetchFile(`${framework}/meta.json`);
    const metaJson = JSON.parse(metaRaw);

    // 5. Install dependencies
    const isInstalled = await installDependencies(metaJson.dependencies);
    if (!isInstalled) {
      throw new Error("Failed to install dependencies");
    }

    // 6. Copy files and create a folder
    const targetRoot = resolveComponentDir(
      options?.path,
      renderer,
      requiredVersion
    );
    console.log("\nInstalling renderer into: ", targetRoot);

    // 7. Copy files
    const sourceBase = `${framework}/${
      metaJson.rendererVersion[requiredVersion || "latest"]
    }`;
    for (const file of metaJson.files) {
      const sourcePath = `${sourceBase}/${file}`;
      const content = await fetchFile(sourcePath);

      if (!content) {
        console.warn(`\n⚠️  Could not find file: ${sourcePath}`);
        continue;
      }

      const destinationPath = path.join(targetRoot, file);

      if (fs.existsSync(destinationPath)) {
        console.warn(`⚠️  File already exists: ${destinationPath}`);
        continue;
      }

      await fs.ensureDir(path.dirname(destinationPath + "/"));
      await fs.writeFile(destinationPath, content, "utf8");
    }

    // 8. Post-install warnings
    if (metaJson.constraints?.requiresClientComponents?.length) {
      console.warn("\n This renderer includes client components:");
      for (const c of metaJson.constraints.requiresClientComponents) {
        console.warn(`- ${c}`);
      }
    }

    if (!metaJson.constraints.ssr) {
      console.warn(
        `\n⚠️  Please note that this renderer does not support server-side rendering.`
      );
    }

    console.log("\n✅ Renderer installed successfully.");
  } catch (e) {
    console.log("❌ Failed to Install Renderer. Error: ", e);
  }
}
