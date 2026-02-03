export interface BookAndChapterData {
  book: string
  chapters: string[]
}

export type MenuProps = {
  tableOfContents?: string;
  allChapters?: string[]; // or string, depending on your data
  chapterName?: string
  handleChapterClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  handleTableOfContentClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}


export type TableOfContentsProps = {
  chapters: string[]
  onSelectChapter: (chapter: string) => void
}

export type MenuLinkProps = {
  onToggle: () => void
}

export type LayoutProps = React.PropsWithChildren<{
  active: boolean
}>