import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { Options as ExplorerOptions } from "./quartz/components/Explorer"

const explorerOptions: Partial<ExplorerOptions> = {
  mapFn: (node) => {
    // Explorer serializes this function: keep the labels inside it.
    // Override only the menu label, preserving the article title and URL.
    const titles: Record<string, string> = {
      "evergreen/agency-without-mind": "Агентность и разум",
      "evergreen/log-more-rationale-wont-help": "Кто здесь принимает решение",
      "evergreen/censorship": "Цензура и кровь",
      "evergreen/freedom": "Пространство свободы",
      "evergreen/storypoints": "Сложность и сторипоинты",
      "evergreen/life-is-strange": "Life is Strange: идеология",
    }
    const title = titles[node.slug]
    if (title) node.displayName = title
  },
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.Comments({
        provider: "giscus",
        options: {
          repo: "uthunderbird/garden-site",
          repoId: "R_kgDOSf0Xag",
          category: "Announcements",
          categoryId: "DIC_kwDOSf0Xas4C9SW8",
          mapping: "pathname",
          strict: false,
          reactionsEnabled: true,
          inputPosition: "bottom",
          loading: "lazy",
        },
      }),
      condition: (page) => {
        const type = page.fileData.frontmatter?.type
        return type === "essay" || type === "note" || type === "poem"
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/uthunderbird",
      Telegram: "https://t.me/dustories",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(explorerOptions),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.RecentNotes({
      title: "Свежее",
      limit: 5,
      showTags: false,
      filter: (f) => {
        const type = f.frontmatter?.type
        return type === "essay" || type === "note" || type === "poem"
      },
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(explorerOptions),
  ],
  right: [],
}
