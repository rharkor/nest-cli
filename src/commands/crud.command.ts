import { CommandLoader } from "@nestjs/cli/commands";
import { CommanderStatic } from "commander";
import { generateCrud } from "../utils/template.utils";

export class CrudCommand extends CommandLoader {
  public async execute(folder: string, entity: string): Promise<void> {
    await generateCrud(folder, entity);
  }
}

export function registerCrudCommand(cli: CommanderStatic): void {
  cli
    .command("crud")
    .option("--folder [folder]", "Path to the target folder")
    .option("--entity [entity]", "Path to the entity file")
    .action(async (args: any) => {
      const command = new CrudCommand();
      await command.execute(args.folder, args.entity);
    });
}
