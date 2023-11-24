import * as React from "react";

import { Store } from "./Store.js";
import { AutoUpdate } from "./components/AutoUpdate.js";
import { Debug } from "./components/Debug.js";
import { Output } from "./components/Output.js";
import { Providers } from "./components/Providers.js";
import { StreamCompletion } from "./components/StreamCompletion.js";

export function App() {
  const actions = Store.useActions();

  const ink = Store.useState((state) => state.ink);
  const argv = Store.useState((state) => state.argv);

  if (!ink || !argv) {
    return null;
  }

  // // debug component
  // return (
  //   <React.Fragment>
  //     <Debug />
  //     <Output />

  //     <GithubApiError />
  //   </React.Fragment>
  // );

  return (
    <Providers>
      <Debug />
      <Output />

      <AutoUpdate name="hakase" verbose={argv.debug} onOutput={actions.output}>
        <StreamCompletion />
      </AutoUpdate>
    </Providers>
  );
}
