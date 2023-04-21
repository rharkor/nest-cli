import * as fs from "fs";
import * as path from "path";

/**
 * Reads a file and returns its content as a string.
 * @param {string} filePath - The path of the file to read.
 * @returns {string} - The content of the file.
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Writes content to a file.
 * @param {string} filePath - The path of the file to write.
 * @param {string} content - The content to write to the file.
 */
export function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content);
}

/**
 * Ensures the existence of the specified directory. If it doesn't exist, it will be created.
 * @param {string} dirPath - The path of the directory to ensure.
 */
export function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Resolves the given path relative to the project root.
 * @param {string} filePath - The path to resolve.
 * @returns {string} - The resolved path.
 */
export function resolvePath(filePath: string): string {
  return path.resolve(process.cwd(), filePath);
}
