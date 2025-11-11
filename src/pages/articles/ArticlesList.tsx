import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { listArticles, deleteArticle } from "@/services/articles";
import type { Article, PaginationMeta } from "@/types/article";
import { NavLink, useSearchParams } from "react-router-dom";

export default function ArticlesList() {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTitle = searchParams.get("title") || undefined;
  const initialCategory = searchParams.get("category") || undefined;
  const initialStatus =
    (searchParams.get("status") as "publish" | "draft" | "thrash" | null) ||
    undefined;
  const initialLimit = parseInt(searchParams.get("limit") || "10", 10);
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState<{
    title?: string;
    category?: string;
    status?: "publish" | "draft" | "thrash";
  }>(() => ({
    title: initialTitle,
    category: initialCategory,
    status: initialStatus,
  }));
  const [limit, setLimit] = useState<number>(initialLimit);
  const [page, setPage] = useState<number>(initialPage);

  // sinkronkan state dengan perubahan URL (back/forward atau manual edit)
  useEffect(() => {
    const t = searchParams.get("title") || undefined;
    const c = searchParams.get("category") || undefined;
    const s =
      (searchParams.get("status") as "publish" | "draft" | "thrash" | null) ||
      undefined;
    const l = parseInt(searchParams.get("limit") || String(limit), 10);
    const p = parseInt(searchParams.get("page") || String(page), 10);
    setFilters({ title: t, category: c, status: s });
    setLimit(l);
    setPage(p);
  }, [searchParams]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["articles", { filters, limit, page }],
    queryFn: () =>
      listArticles({
        limit,
        page,
        title: filters.title,
        category: filters.category,
        status: filters.status,
      }),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const items: Article[] = data?.data?.items ?? [];
  const meta: PaginationMeta | undefined = data?.data?.meta;
  const totalPages = meta
    ? Math.max(1, Math.ceil(Number(meta.total) / Number(meta.limit)))
    : 1;

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Articles</h1>
          <p className="text-muted-foreground">
            Kelola artikel yang anda buat.
          </p>
        </div>
        <NavLink to="/dashboard/articles/new">
          <Button>Buat Artikel</Button>
        </NavLink>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-medium">Filter</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="filter-title">Judul</Label>
            <Input
              id="filter-title"
              placeholder="Cari judul"
              value={filters.title ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                const nextTitle = v || undefined;
                const nextFilters = { ...filters, title: nextTitle };
                setFilters(nextFilters);
                const params = new URLSearchParams(searchParams);
                if (nextTitle) params.set("title", nextTitle);
                else params.delete("title");
                if (nextFilters.category)
                  params.set("category", nextFilters.category);
                else params.delete("category");
                if (nextFilters.status)
                  params.set("status", nextFilters.status);
                else params.delete("status");
                params.set("limit", String(limit));
                params.set("page", "1");
                setSearchParams(params);
                setPage(1);
              }}
            />
          </div>
          <div>
            <Label htmlFor="filter-category">Kategori</Label>
            <Input
              id="filter-category"
              placeholder="Kategori"
              value={filters.category ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                const nextCategory = v || undefined;
                const nextFilters = { ...filters, category: nextCategory };
                setFilters(nextFilters);
                const params = new URLSearchParams(searchParams);
                if (nextFilters.title) params.set("title", nextFilters.title);
                else params.delete("title");
                if (nextCategory) params.set("category", nextCategory);
                else params.delete("category");
                if (nextFilters.status)
                  params.set("status", nextFilters.status);
                else params.delete("status");
                params.set("limit", String(limit));
                params.set("page", "1");
                setSearchParams(params);
                setPage(1);
              }}
            />
          </div>
          <div>
            <Label htmlFor="filter-status">Status</Label>
            <Select
              id="filter-status"
              value={filters.status ?? ""}
              onChange={(e) => {
                const val = e.target.value as
                  | "publish"
                  | "draft"
                  | "thrash"
                  | "";
                const nextStatus = val
                  ? (val as "publish" | "draft" | "thrash")
                  : undefined;
                const nextFilters = { ...filters, status: nextStatus };
                setFilters(nextFilters);
                const params = new URLSearchParams(searchParams);
                if (nextFilters.title) params.set("title", nextFilters.title);
                else params.delete("title");
                if (nextFilters.category)
                  params.set("category", nextFilters.category);
                else params.delete("category");
                if (nextStatus) params.set("status", nextStatus);
                else params.delete("status");
                params.set("limit", String(limit));
                params.set("page", "1");
                setSearchParams(params);
                setPage(1);
              }}
            >
              <option value="">Semua</option>
              <option value="publish">publish</option>
              <option value="draft">draft</option>
              <option value="thrash">thrash</option>
            </Select>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (filters.title) params.set("title", filters.title);
              else params.delete("title");
              if (filters.category) params.set("category", filters.category);
              else params.delete("category");
              if (filters.status) params.set("status", filters.status);
              else params.delete("status");
              params.set("limit", String(limit));
              params.set("page", "1");
              setSearchParams(params);
              setPage(1);
              refetch();
            }}
          >
            Terapkan
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setFilters({});
              const params = new URLSearchParams(searchParams);
              params.delete("title");
              params.delete("category");
              params.delete("status");
              params.set("limit", String(limit));
              params.set("page", "1");
              setSearchParams(params);
              setPage(1);
              refetch();
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Daftar Artikel</h2>
        </div>
        {isLoading && (
          <p className="text-sm text-muted-foreground mt-3">Memuat...</p>
        )}
        {isError && (
          <p className="text-sm text-destructive mt-3">
            {(error as Error)?.message || "Gagal memuat"}
          </p>
        )}
        {!isLoading && items.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3">Tidak ada data</p>
        )}
        <ul className="mt-3 space-y-3">
          {items.map((a) => (
            <li key={a.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{a.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Kategori: {a.category} • Status: {a.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <NavLink to={`/dashboard/articles/${a.id}/edit`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </NavLink>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Hapus artikel ini?")) delMut.mutate(a.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {new Date(a.updated_at).toLocaleString()}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {a.content}
              </p>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            disabled={(meta?.page ?? page) <= 1}
            onClick={() => {
              const nextPage = Math.max(1, (meta?.page ?? page) - 1);
              setPage(nextPage);
              const params = new URLSearchParams(searchParams);
              params.set("page", String(nextPage));
              params.set("limit", String(limit));
              if (filters.title) params.set("title", filters.title);
              else params.delete("title");
              if (filters.category) params.set("category", filters.category);
              else params.delete("category");
              if (filters.status) params.set("status", filters.status);
              else params.delete("status");
              setSearchParams(params);
              refetch();
            }}
          >
            Previous
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Page {meta?.page ?? page} / {totalPages}
            </div>
            <Select
              id="limit"
              defaultValue={String(limit)}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                setLimit(newLimit);
                const params = new URLSearchParams(searchParams);
                params.set("limit", String(newLimit));
                params.set("page", "1");
                if (filters.title) params.set("title", filters.title);
                else params.delete("title");
                if (filters.category) params.set("category", filters.category);
                else params.delete("category");
                if (filters.status) params.set("status", filters.status);
                else params.delete("status");
                setSearchParams(params);
                setPage(1);
                refetch();
              }}
            >
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Select>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={!meta?.has_next}
            onClick={() => {
              const nextPage = (meta?.page ?? page) + 1;
              setPage(nextPage);
              const params = new URLSearchParams(searchParams);
              params.set("page", String(nextPage));
              params.set("limit", String(limit));
              if (filters.title) params.set("title", filters.title);
              else params.delete("title");
              if (filters.category) params.set("category", filters.category);
              else params.delete("category");
              if (filters.status) params.set("status", filters.status);
              else params.delete("status");
              setSearchParams(params);
              refetch();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
