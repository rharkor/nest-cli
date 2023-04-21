import { CommandLoader } from "@nestjs/cli/commands";
import { CommanderStatic } from "commander";
export declare class CrudCommand extends CommandLoader {
    execute(folder: string, entity: string): Promise<void>;
}
export declare function registerCrudCommand(cli: CommanderStatic): void;
