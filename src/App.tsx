import * as React from "react";

import { Store } from "./Store.js";
import { Debug } from "./components/Debug.js";
import { Output } from "./components/Output.js";
import { StreamCompletion } from "./components/StreamCompletion.js";

export function App() {
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
    <React.Fragment>
      <Debug />
      <Output />

      <StreamCompletion />
    </React.Fragment>
  );
}
