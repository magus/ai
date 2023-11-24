import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export type Argv = Awaited<ReturnType<typeof command>>;

export async function command() {
  return yargs(hideBin(process.argv))
    .command("[description..]", "convert description into command")
    .option("debug", {
      type: "boolean",
      alias: ["verbose", "v", "d"],
      description: "Enable debug mode",
    })

    .help().argv;
}
