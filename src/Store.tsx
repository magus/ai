import * as React from "react";

import * as Ink from "ink";
import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

import { Exit } from "./components/Exit.js";

import type { Argv } from "./command.js";
import type { Instance as InkInstance } from "ink";

type Setter = (state: State) => void;

export type State = {
  argv: null | Argv;
  ink: null | InkInstance;
  cwd: null | string;

  chunk_list: Array<string>;
  done: boolean;

  output: Array<React.ReactNode>;

  actions: {
    exit(code: number, clear?: boolean): void;
    clear(): void;
    unmount(): void;
    newline(): void;
    output(node: React.ReactNode): void;
    debug(node: React.ReactNode): void;

    set(setter: Setter): void;
  };

  mutate: {
    output(state: State, node: React.ReactNode): void;
  };
};

const BaseStore = createStore<State>()(
  immer((set, get) => ({
    argv: null,
    ink: null,
    cwd: null,

    chunk_list: [],
    done: false,

    output: [],

    pr: {},

    actions: {
      exit(code, clear = true) {
        set((state) => {
          state.mutate.output(state, <Exit clear={clear} code={code} />);
        });
      },

      clear() {
        get().ink?.clear();
      },

      unmount() {
        get().ink?.unmount();
      },

      newline() {
        set((state) => {
          state.mutate.output(state, <Ink.Text>‎</Ink.Text>);
        });
      },

      output(node: React.ReactNode) {
        set((state) => {
          state.mutate.output(state, node);
        });
      },

      debug(node: React.ReactNode) {
        set((state) => {
          if (state.argv?.debug) {
            state.mutate.output(state, node);
          }
        });
      },

      set(setter) {
        set((state) => {
          setter(state);
        });
      },
    },

    mutate: {
      output(state, node) {
        state.output.push(node);
      },
    },
  }))
);

function useState<R>(selector: (state: State) => R): R {
  return useStore(BaseStore, selector);
}

function useActions() {
  return useState((state) => state.actions);
}

const getState = BaseStore.getState;
const setState = BaseStore.setState;
const subscribe = BaseStore.subscribe;

export const Store = { useActions, useState, getState, setState, subscribe };
