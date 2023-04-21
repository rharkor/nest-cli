"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCrudCommand = exports.CrudCommand = void 0;
const commands_1 = require("@nestjs/cli/commands");
const template_utils_1 = require("../utils/template.utils");
class CrudCommand extends commands_1.CommandLoader {
    async execute(folder, entity) {
        await (0, template_utils_1.generateCrud)(folder, entity);
    }
}
exports.CrudCommand = CrudCommand;
function registerCrudCommand(cli) {
    cli
        .command("crud")
        .option("--folder [folder]", "Path to the target folder")
        .option("--entity [entity]", "Path to the entity file")
        .action(async (args) => {
        const command = new CrudCommand();
        await command.execute(args.folder, args.entity);
    });
}
exports.registerCrudCommand = registerCrudCommand;
