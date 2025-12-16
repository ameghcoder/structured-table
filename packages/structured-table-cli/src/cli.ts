#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";

// Create the main program
const program = new Command();

// CLI metadata
program
    .name("structured-table")
    .description("CLI for installing Structured Table Language (STL) renderers")
    .version("0.1.0")
    .addHelpCommand();

// Add command - installs a renderer (using `add` command)
program
    .command("add <renderer>")
    .description("Add a renderer (e.g., react, vue, svelte)")
    .option("-p, --path <path>", "Custom installation path for components")
    .action(async (rendererInput: string, options: { path?: string }) => {
        try {
            await add(rendererInput, { path: options.path });
        } catch (error) {
            console.error("❌ Command failed:", error);
            process.exit(1);
        }
    });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command is provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
