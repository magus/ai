import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export type Argv = Awaited<ReturnType<typeof command>>;

export async function command() {
  return yargs(hideBin(process.argv))
    .option("debug", {
      type: "boolean",
      description: "debug",
    })

    .help()
    .parse();
}
