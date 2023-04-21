import * as ejs from "ejs";
import * as ts from 'typescript';
import * as path from "path";
import {snakeToCamelCase} from "@rharkor/utils"
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
  const [fileName, fileNameCut, entityName, entityClassName] = getEntityName(entityPath);
  const entityColumns = getEntityColumns(entityPath);
  const templatesDir = path.join(__dirname, '../templates');
  const files = [
    { template: "module.ts.ejs", output: `${fileNameCut}.module.ts` },
    { template: "controller.ts.ejs", output: `${fileNameCut}.controller.ts` },
    { template: "service.ts.ejs", output: `${fileNameCut}.service.ts` },
    { template: "dto-create.ts.ejs", output: `dtos/${fileNameCut}-create.dto.ts` },
    { template: "dto-update.ts.ejs", output: `dtos/${fileNameCut}-update.dto.ts` },
  ];

  ensureDirectory(folderPath);

  // Create dirrectory for dtos
  ensureDirectory(`${folderPath}/dtos`);

  for (const file of files) {
    const templatePath = `${templatesDir}/${file.template}`;
    const outputPath = `${folderPath}/${file.output}`;

    const templateContent = readFile(templatePath);
    const outputContent = await ejs.render(templateContent, { fileName, fileNameCut, entityName, entityClassName, entityColumns });

    writeFile(outputPath, outputContent);
  }
}

/**
 * Extracts the entity name from the given entity file path.
 * @param {string} entityPath - The path to the entity file.
 * @returns {string[]} - The entity names.
 */
function getEntityName(entityPath: string): string[] {
  const fileNameFull = entityPath.split("/").pop() || "";
  const fileName = fileNameFull.replace(/\.ts$/, "");
  const fileNameCut = fileNameFull.replace(/.*$/i, "");
  const name = snakeToCamelCase(fileNameCut);
  const className = name[0].toUpperCase() + name.slice(1);
  return [fileName, fileNameCut, name, className];
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
        if (ts.isPropertyDeclaration(member) && hasColumnDecorator(member)) {
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

function hasColumnDecorator(node: ts.PropertyDeclaration): boolean {
  const decorators = ts.getDecorators(node);
  if (!decorators) {
    return false;
  }

  return decorators.some(decorator => {
    const expression = decorator.expression;
    return (
      ts.isCallExpression(expression) &&
      ts.isIdentifier(expression.expression) &&
      expression.expression.getText() === 'Column'
    );
  });
}
