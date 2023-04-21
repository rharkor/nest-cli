"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCrud = void 0;
const ejs = __importStar(require("ejs"));
const ts = __importStar(require("typescript"));
const path = __importStar(require("path"));
const utils_1 = require("@rharkor/utils");
const file_utils_1 = require("./file.utils");
async function generateCrud(folder, entity) {
    const folderPath = (0, file_utils_1.resolvePath)(folder);
    const entityPath = (0, file_utils_1.resolvePath)(entity);
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
    (0, file_utils_1.ensureDirectory)(folderPath);
    (0, file_utils_1.ensureDirectory)(`${folderPath}/dtos`);
    for (const file of files) {
        const templatePath = `${templatesDir}/${file.template}`;
        const outputPath = `${folderPath}/${file.output}`;
        const templateContent = (0, file_utils_1.readFile)(templatePath);
        const outputContent = await ejs.render(templateContent, { fileName, fileNameCut, entityName, entityClassName, entityColumns });
        (0, file_utils_1.writeFile)(outputPath, outputContent);
    }
}
exports.generateCrud = generateCrud;
function getEntityName(entityPath) {
    const fileNameFull = entityPath.split("/").pop() || "";
    const fileName = fileNameFull.replace(/\.ts$/, "");
    const fileNameCut = fileNameFull.replace(/.*$/i, "");
    const name = (0, utils_1.snakeToCamelCase)(fileNameCut);
    const className = name[0].toUpperCase() + name.slice(1);
    return [fileName, fileNameCut, name, className];
}
function getEntityColumns(entityPath) {
    const entityFileContent = (0, file_utils_1.readFile)(entityPath);
    const sourceFile = ts.createSourceFile(entityPath, entityFileContent, ts.ScriptTarget.Latest, true);
    const columns = [];
    function visit(node) {
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
function hasColumnDecorator(node) {
    const decorators = ts.getDecorators(node);
    if (!decorators) {
        return false;
    }
    return decorators.some(decorator => {
        const expression = decorator.expression;
        return (ts.isCallExpression(expression) &&
            ts.isIdentifier(expression.expression) &&
            expression.expression.getText() === 'Column');
    });
}
