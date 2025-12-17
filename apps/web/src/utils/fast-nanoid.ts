import { customAlphabet } from "nanoid";

// --- FAST NANOID GENERATOR ---
// Set length to 10 for speed, using non-secure Math.random
const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ID_SIZE = 10;
export const fastNanoid = customAlphabet(ALPHABET, ID_SIZE);
