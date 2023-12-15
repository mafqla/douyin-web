/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module '*.html'
declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  const src: string
  export default src
}
