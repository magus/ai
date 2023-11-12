/* eslint-disable no-console */
import * as React from "react";

import clipboard from "clipboardy";
import * as Ink from "ink";
import OpenAI from "openai";

import { Store } from "../Store.js";
import { cli } from "../core/cli.js";

import { YesNoPrompt } from "./YesNoPrompt.js";

export function StreamCompletion() {
  const actions = Store.useActions();

  const argv = Store.useState((state) => state.argv);
  const description = argv?._.join(" ");

  React.useEffect(
    function stream_completion() {
      actions.set((state) => {
        state.chunk_list = [];
        state.done = false;
      });

      if (!description) {
        return;
      }

      command_completion({
        description,
        onChunk: (chunk) => {
          actions.set((state) => {
            state.chunk_list.push(chunk);
          });
        },
        onEnd: () => {
          actions.set((state) => {
            state.done = true;
          });
        },
      }).catch((err) => {
        actions.output(<Ink.Text color="#ef4444">{err.message}</Ink.Text>);
      });
    },
    [description]
  );

  const chunk_list = Store.useState((state) => state.chunk_list);
  const done = Store.useState((state) => state.done);
  const command = chunk_list.join("");
  const [copied, set_copied] = React.useState(false);
  const [output, set_output] = React.useState("");

  return (
    <Ink.Box flexDirection="column">
      <Ink.Text bold>✨ {command}</Ink.Text>
      {!done ? null : (
        <YesNoPrompt message="   Run?" onNo={onNo} onYes={onYes} />
      )}

      {!output ? null : (
        <React.Fragment>
          <Ink.Box height={1} />
          <Ink.Text>{output}</Ink.Text>
        </React.Fragment>
      )}

      {!copied ? null : (
        <React.Fragment>
          <Ink.Box height={1} />
          <Ink.Text dimColor>Command copied to clipboard.</Ink.Text>
        </React.Fragment>
      )}
    </Ink.Box>
  );

  function onNo() {
    handle_clipboard();
    actions.exit(0, false);
  }

  async function onYes() {
    const result = await cli(command);
    set_output(result.output);
    handle_clipboard();
    actions.exit(0, false);
  }

  function handle_clipboard() {
    clipboard.writeSync(command);
    set_copied(true);
  }
}

async function command_completion(args: {
  description: string;
  onChunk(chunk: string): void;
  onEnd(): void;
}) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: args.description },
    ],
    stream: true,
  });

  for await (const chunk of completion) {
    const content = chunk.choices[0].delta.content;

    if (content) {
      args.onChunk(content);
    }
  }

  args.onEnd();
}

const openai = new OpenAI();

const SYSTEM = `
You are an expert at craft CLI one liners.
The user will explain what they want you to do, and you will respond with the command to do it.
Never respond with anyting more than the exact command to run.
Do not explain it, do not make excuses, only return the command.
If you cannot, return --ERROR--.
Do NOT use markdown, just the command text please.
`.trim();
