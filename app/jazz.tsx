"use client";

import {JazzInspector} from "jazz-tools/inspector";
import {JazzReactProvider} from "jazz-tools/react";
import {JazzAccount} from "./schema";
import {ReactNode} from 'react';

export function Jazz({children}: { children: ReactNode }) {
  return (
      <JazzReactProvider
          AccountSchema={JazzAccount}
          sync={{
            peer: `wss://cloud.jazz.tools/?key=${process.env.NEXT_PUBLIC_APP_JAZZ_API_KEY}`,
          }}
      >
        <JazzInspector/>
        {children}
      </JazzReactProvider>
  );
}