declare module '#app' {
  interface PageMeta {
    /** Shown in the dashboard header */
    title?: string
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

export {}
