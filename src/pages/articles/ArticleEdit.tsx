import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getArticle, updateArticle } from "@/services/articles";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const articleSchema = z.object({
  title: z.string().min(20, "Judul minimal 20 karakter"),
  content: z.string().min(200, "Konten minimal 200 karakter"),
  category: z.string().min(3, "Kategori minimal 3 karakter"),
  status: z.enum(["publish", "draft", "thrash"]),
});

type ArticleForm = z.infer<typeof articleSchema>;

export default function ArticleEdit() {
  const { id } = useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const form = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { title: "", content: "", category: "", status: "draft" },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticle(Number(id)),
    enabled: !!id,
  });

  const updateMut = useMutation({
    mutationFn: (payload: ArticleForm) => updateArticle(Number(id), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      navigate("/dashboard/articles");
    },
  });

  // Prefill ketika data tersedia
  if (data?.data && !isLoading && !isError) {
    const a = data.data;
    // set nilai form ketika pertama kali data didapat
    form.setValue("title", a.title);
    form.setValue("category", a.category);
    form.setValue("status", a.status as ArticleForm["status"]);
    form.setValue("content", a.content);
  }

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Artikel</h1>
        <NavLink to="/dashboard/articles">
          <Button variant="outline">Kembali ke List</Button>
        </NavLink>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Memuat data...</p>}
      {isError && <p className="text-sm text-destructive">{(error as Error)?.message || "Gagal memuat"}</p>}

      {!isLoading && !isError && (
        <div className="rounded-lg border p-4">
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => updateMut.mutate(values))}>
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" {...form.register("title")} placeholder="Judul artikel" />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" {...form.register("category")} placeholder="Kategori" />
              {form.formState.errors.category && (
                <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...form.register("status")} defaultValue="draft">
                <option value="publish">publish</option>
                <option value="draft">draft</option>
                <option value="thrash">thrash</option>
              </Select>
              {form.formState.errors.status && (
                <p className="text-xs text-destructive">{form.formState.errors.status.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Konten</Label>
              <Textarea id="content" {...form.register("content")} placeholder="Tulis konten artikel" rows={10} />
              {form.formState.errors.content && (
                <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={updateMut.isPending}>Simpan</Button>
              {updateMut.isError && (
                <p className="text-sm text-destructive">{(updateMut.error as Error)?.message || "Gagal menyimpan"}</p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}