import { HelpPrinter } from "../internal/cli/HelpPrinter";
import { task } from "../internal/core/config/config-env";
import { BUIDLER_PARAM_DEFINITIONS } from "../internal/core/params/buidler-params";
import { getPackageJson } from "../internal/util/packageInfo";

task("help", "Prints this message")
  .addOptionalPositionalParam(
    "task",
    "An optional task to print more info about"
  )
  .setAction(async ({ task: taskName }: { task?: string }, { tasks }) => {
    const packageJson = await getPackageJson();

    const helpPrinter = new HelpPrinter(
      packageJson.name,
      packageJson.version,
      BUIDLER_PARAM_DEFINITIONS,
      tasks
    );

    if (taskName !== undefined) {
      helpPrinter.printTaskHelp(taskName);
      return;
    }

    helpPrinter.printGlobalHelp();
  });
