#!/usr/bin/env node
import { generateCrud } from './src/utils/template.utils';
import * as path from 'path';

function main() {
  const args = process.argv.slice(1);

  if (args.length !== 1) {
    console.error('Usage: crud [path to folder]');
    process.exit(1);
  }

  const folder = args[0];
  const entity = path.join(args[0], "entities");

  generateCrud(folder, entity)
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
