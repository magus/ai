import * as React from "react";

import * as Ink from "ink";

import { Store } from "../Store.js";

export function Debug() {
  const argv = Store.useState((state) => state.argv);

  if (!argv?.debug) {
    return null;
  }

  return (
    <Ink.Box flexDirection="column">
      <Ink.Text color="yellow">Debug mode enabled</Ink.Text>
      <Ink.Text dimColor>{JSON.stringify(argv, null, 2)}</Ink.Text>
    </Ink.Box>
  );
}
