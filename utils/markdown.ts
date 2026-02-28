import { marked } from 'marked'

export function markdownToHtml(markdown: string): string {
  try {
    return marked(markdown)
  } catch (error) {
    console.error('Error parsing markdown:', error)
    return '<p>Error rendering content</p>'
  }
}
