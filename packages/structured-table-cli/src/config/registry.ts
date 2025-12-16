export const REGISTRY_CONFIG = {
  owner: "ameghcoder",
  repo: "structured-table",
  branch: "main",
  registryPath: "registry",

  baseUrl() {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/refs/heads/${this.branch}/${this.registryPath}`;
  }
};
