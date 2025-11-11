export type Article = {
  id: number
  title: string
  content: string
  category: string
  status: 'publish' | 'draft' | 'thrash'
  created_at: string
  updated_at: string
}

export type PaginationMeta = {
  limit: number
  page: number
  total: number
  has_next: boolean
}

export type ListArticlesResponse = {
  success: boolean
  data: {
    items: Article[]
    meta: PaginationMeta
  }
  message?: string
  error?: string
}

export type CreateArticleResponse = {
  success: boolean
  data: Article
  message?: string
  error?: string
}

export type DeleteArticleResponse = {
  success: boolean
  data: null
  message?: string
  error?: string
}

export type GetArticleResponse = {
  success: boolean
  data: Article
  message?: string
  error?: string
}