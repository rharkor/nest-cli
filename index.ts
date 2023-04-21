#!/usr/bin/env node
import { generateCrud } from './src/utils/template.utils';

function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: crud [path to folder] [path to entity]');
    process.exit(1);
  }

  const folder = args[0];
  const entity = args[1];

  generateCrud(folder, entity)
    .then(() => {
      console.log('CRUD module generated successfully.');
    })
    .catch((error) => {
      console.error('Error generating CRUD module:', error.message);
      process.exit(1);
    });
}

main();
