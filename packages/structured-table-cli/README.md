# Structured Table CLI

**The command-line interface for the Structured Table ecosystem.**

This tool automates the process of adding **Structured Table** renderers to your project. It acts like a scaffolding tool (similar to shadcn/ui), downloading the full source code of the table components directly into your project so you have full control over them.

## Installation

You can install this cli in your project use following command.

```bash
npm install -D structured-table-cli
```

You can run this CLI using `npx`, so no global installation is required.

```bash
npx stl-cli --help
```

If you prefer to install it globally:

```bash
npm install -g structured-table-cli
```

## Commands

### `add`

The `add` command is the main entry point. It installs a specific renderer (e.g., React, Vue) into your project.

```bash
npx stl-cli add <renderer> [flags]
```

**Arguments:**

- `<renderer>`: The name of the renderer to install (e.g., `react`). You can also specify a version tag (e.g., `react@beta`).

**Options:**

- `-p, --path <path>`: Specify a custom installation path for the components. By default, it looks for `src/components` or `components`.

**Examples:**

```bash
# Install the latest React renderer
npx stl-cli add react

# Install a specific version
npx stl-cli add react@v1

# Install to a custom directory
npx stl-cli add react --path ./src/ui/table
```

- Must include the (.) period sign in path starting otherwise it will install the component in the disk root path.

## How It Works

1.  **Dynamic Detection**: The CLI fetches the latest supported framework list from our central registry and automatically detects which one your project is using by scanning your `package.json`.
2.  **Validation**: It ensures the requested renderer is compatible with your project's framework.
3.  **Dependency Check**: It checks your `package.json` for required dependencies and installs them if missing.
4.  **Scaffolding**: It fetches the component source code from the remote registry and places it into your project.
    - Default location: `./src/components/` or `./components/`

## Supported Frameworks

We are constantly adding support for new frameworks. To see the most up-to-date list of supported frameworks, check the [supported.json](https://github.com/ameghcoder/structured-table/blob/main/registry/supported.json) in our main repository.

Any framework listed in that array can be installed directly using our CLI (e.g., `npx stl-cli add react`, `npx stl-cli add vue`).

## Registry

The CLI fetches components from the central registry (hosted in the main repository). This ensures you always get the most up-to-date and compliant components.
