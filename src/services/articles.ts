import { apiFetch } from "@/lib/api";
import type {
  CreateArticleResponse,
  ListArticlesResponse,
  DeleteArticleResponse,
  GetArticleResponse,
} from "@/types/article";

export type CreateArticlePayload = {
  title: string;
  content: string;
  category: string;
  status: "publish" | "draft" | "thrash";
};

export async function listArticles(params?: {
  limit?: number;
  page?: number;
  status?: "publish" | "draft" | "thrash";
  category?: string;
  title?: string;
}): Promise<ListArticlesResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));
  if (params?.status) query.set("status", params.status);
  if (params?.category) query.set("category", params.category);
  if (params?.title) query.set("title", params.title);
  const qs = query.toString();
  const path = `/articles${qs ? `?${qs}` : ""}`;
  return apiFetch<ListArticlesResponse>(path);
}

export async function createArticle(
  payload: CreateArticlePayload
): Promise<CreateArticleResponse> {
  return apiFetch<CreateArticleResponse>("/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateArticle(
  id: number,
  payload: Partial<CreateArticlePayload>
): Promise<CreateArticleResponse> {
  return apiFetch<CreateArticleResponse>(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteArticle(
  id: number
): Promise<DeleteArticleResponse> {
  return apiFetch<DeleteArticleResponse>(`/articles/${id}`, {
    method: "DELETE",
  });
}

export async function getArticle(id: number): Promise<GetArticleResponse> {
  return apiFetch<GetArticleResponse>(`/articles/${id}`);
}
