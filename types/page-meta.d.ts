declare module '#app' {
  interface PageMeta {
    /** Shown in the dashboard header */
    title?: string
    /** Show the right-hand card (#layout-aside) on large screens */
    aside?: boolean
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    aside?: boolean
  }
}

export {}
