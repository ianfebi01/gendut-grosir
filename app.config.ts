export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand', // brand-500 = #0a0a0a
      secondary: 'violet', // "Mobile" tag
      info: 'sky',         // "Web" tag, To Do bar
      warning: 'amber',    // "Saas" tag, In Progress bar
      neutral: 'ink'
    },

    // Search field: soft grey fill, no ring
    input: {
      slots: { base: 'rounded-(--radius-control)' },
      defaultVariants: { variant: 'soft', color: 'neutral' }
    },

    button: {
      slots: { base: 'rounded-(--radius-control) font-normal' },
      defaultVariants: { color: 'primary' }
    },

    // "Web", "Saas", "Mobile" chips
    badge: {
      slots: { base: 'rounded-md font-normal' },
      defaultVariants: { variant: 'soft', size: 'md' }
    },

    // Board cards: header strip ("Client: Stellar") + body
    card: {
      slots: {
        root: 'rounded-(--radius-card) shadow-(--shadow-lift)',
        header: 'px-4 py-2.5 sm:px-4 text-sm text-muted',
        body: 'p-4 sm:p-4',
        footer: 'px-4 py-3 sm:px-4 text-xs text-muted'
      },
      variants: {
        variant: {
          outline: { root: 'ring-muted divide-muted' }
        }
      }
    },

    // Sidebar: active item is a white lifted pill, inactive is grey text
    navigationMenu: {
      slots: {
        link: 'rounded-(--radius-control) px-3 py-2.5 text-[15px] font-normal gap-3',
        linkLeadingIcon: 'size-5',
        label: 'text-sm text-dimmed px-3'
      },
      compoundVariants: [
        {
          orientation: 'vertical',
          variant: 'pill',
          active: true,
          class: {
            link: 'text-highlighted before:bg-default before:shadow-(--shadow-lift) before:ring before:ring-muted before:rounded-(--radius-control)',
            linkLeadingIcon: 'text-highlighted'
          }
        },
        {
          orientation: 'vertical',
          variant: 'pill',
          active: false,
          class: {
            link: 'text-toned hover:text-highlighted hover:before:bg-accented/50',
            linkLeadingIcon: 'text-toned group-hover:text-highlighted'
          }
        }
      ],
      defaultVariants: { color: 'neutral', variant: 'pill', highlight: false }
    },

    // Board / List / Timeline / Due Tasks
    tabs: {
      slots: {
        list: 'rounded-(--radius-card) p-1 bg-elevated',
        indicator: 'rounded-(--radius-control)',
        trigger: 'font-normal px-4'
      },
      compoundVariants: [
        {
          color: 'neutral',
          variant: 'pill',
          class: {
            indicator: 'bg-default shadow-(--shadow-lift)',
            trigger: 'text-toned data-[state=active]:text-highlighted'
          }
        }
      ],
      defaultVariants: { color: 'neutral', variant: 'pill' }
    },

    // Black "Tasks" tooltip on the icon rail
    tooltip: {
      slots: {
        content: 'bg-inverted text-inverted ring-0 rounded-md px-2.5 py-1.5 h-auto text-sm',
        arrow: 'fill-inverted'
      }
    },

    breadcrumb: {
      slots: {
        link: 'font-normal text-muted',
        separatorIcon: 'text-dimmed'
      },
      variants: {
        active: {
          true: { link: 'text-highlighted bg-elevated rounded-(--radius-control) px-2.5 py-1' }
        }
      }
    },

    avatar: {
      slots: { root: 'bg-accented' }
    },

    separator: {
      slots: { border: 'border-muted' }
    }
  }
})
