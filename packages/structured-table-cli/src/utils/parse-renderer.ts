import type { ParsedRenderer } from "../types.js";

export default function parseRenderer(input: string): ParsedRenderer {
  try {
    const [name, version] = input.split("@");
    return {
      name,
      version: version ?? null,
    };
  } catch (e) {
    console.log("❌ Failed to parse renderer. Error: ", e);
    return {
      name: "",
      version: null,
    };
  }
}
