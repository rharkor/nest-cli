#!/usr/bin/env node
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
const template_utils_1 = require("./src/utils/template.utils");
const path = __importStar(require("path"));
function main() {
    const args = process.argv.slice(1);
    if (args.length !== 1) {
        console.error('Usage: crud [path to folder]');
        process.exit(1);
    }
    const folder = args[0];
    const entity = path.join(args[0], "entities");
    (0, template_utils_1.generateCrud)(folder, entity)
        .then(() => {
        console.log('CRUD module generated successfully.');
        console.log("Don't forget to add the module to the imports of the AppModule.");
    })
        .catch((error) => {
        console.error('Error generating CRUD module:', error.message);
        process.exit(1);
    });
}
main();
