// CLI Types for structured-table-cli

/** Package manager types */
export type PackageManager = "npm" | "pnpm" | "yarn";

/** Parsed renderer info from user input */
export interface ParsedRenderer {
  name: string;
  version: string | null;
}

/** Dependency to install */
export interface Dependency {
  package: string;
  version?: string;
}

/** Package.json structure (partial) */
export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/** Registry meta.json structure */
export interface RendererMeta {
  name: string;
  version: string;
  files: string[];
  dependencies: Dependency[];
  rendererVersion: Record<string, string>;
  constraints: {
    ssr: boolean;
    requiresClientComponents?: string[];
  };
}

/** Supported frameworks response */
export interface SupportedFrameworks {
  supported: string[];
}

/** Add command options */
export interface AddCommandOptions {
  path?: string;
}

/** Registry configuration */
export interface RegistryConfig {
  owner: string;
  repo: string;
  branch: string;
  registryPath: string;
  baseUrl(): string;
}
