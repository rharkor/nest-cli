import * as ejs from "ejs";
import * as ts from 'typescript';
import * as path from "path";
import {
  readFile,
  writeFile,
  ensureDirectory,
  resolvePath,
} from "./file.utils";

/**
 * Generates the CRUD module based on the given folder and entity paths.
 * @param {string} folder - The path to the folder where the CRUD module will be generated.
 * @param {string} entity - The path to the entity file.
 */
export async function generateCrud(
  folder: string,
  entity: string
): Promise<void> {
  const folderPath = resolvePath(folder);
  const entityPath = resolvePath(entity);
  const entityName = getEntityName(entityPath);
  const entityColumns = getEntityColumns(entityPath);
  const templatesDir = path.join(__dirname, '../templates');
  const files = [
    { template: "module.ts.ejs", output: `${entityName}.module.ts` },
    { template: "controller.ts.ejs", output: `${entityName}.controller.ts` },
    { template: "service.ts.ejs", output: `${entityName}.service.ts` },
    { template: "dto-create.ts.ejs", output: `${entityName}-create.dto.ts` },
    { template: "dto-update.ts.ejs", output: `${entityName}-update.dto.ts` },
  ];

  ensureDirectory(folderPath);

  for (const file of files) {
    const templatePath = `${templatesDir}/${file.template}`;
    const outputPath = `${folderPath}/${file.output}`;

    const templateContent = readFile(templatePath);
    const outputContent = await ejs.render(templateContent, { entityName, entityColumns });

    writeFile(outputPath, outputContent);
  }
}

/**
 * Extracts the entity name from the given entity file path.
 * @param {string} entityPath - The path to the entity file.
 * @returns {string} - The entity name.
 */
function getEntityName(entityPath: string): string {
  const fileName = entityPath.split("/").pop() || "";
  return fileName.replace(/\.ts$/, "");
}

/**
 * Extracts the columns from the given entity file path.
 * @param {string} entityPath - The path to the entity file.
 * @returns {Array<{name: string, type: string}>} - The extracted columns.
 */
function getEntityColumns(entityPath: string): Array<{ name: string; type: string }> {
  const entityFileContent = readFile(entityPath);
  const sourceFile = ts.createSourceFile(entityPath, entityFileContent, ts.ScriptTarget.Latest, true);

  const columns: Array<{ name: string; type: string }> = [];

  function visit(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      node.members.forEach(member => {
        if (ts.isPropertyDeclaration(member)) {
          const nameNode = member.name;
          const typeNode = member.type;

          if (ts.isIdentifier(nameNode) && typeNode) {
            const name = nameNode.getText(sourceFile);
            const type = typeNode.getText(sourceFile);
            columns.push({ name, type });
          }
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return columns;
}
