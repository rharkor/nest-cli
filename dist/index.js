#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_utils_1 = require("./src/utils/template.utils");
function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error('Usage: crud [path to folder] [path to entity]');
        process.exit(1);
    }
    const folder = args[0];
    const entity = args[1];
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
