import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createArticle } from "@/services/articles";
import { NavLink, useNavigate } from "react-router-dom";

const articleSchema = z.object({
  title: z.string().min(20, "Judul minimal 20 karakter"),
  content: z.string().min(200, "Konten minimal 200 karakter"),
  category: z.string().min(3, "Kategori minimal 3 karakter"),
  status: z.enum(["publish", "draft", "thrash"]),
});

type ArticleForm = z.infer<typeof articleSchema>;

export default function ArticleCreate() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const form = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { title: "", content: "", category: "", status: "draft" },
  });

  const createMut = useMutation({
    mutationFn: (payload: ArticleForm) => createArticle(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      navigate("/dashboard/articles");
    },
  });

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Buat Artikel</h1>
        <NavLink to="/dashboard/articles">
          <Button variant="outline">Kembali ke List</Button>
        </NavLink>
      </div>

      <div className="rounded-lg border p-4">
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => createMut.mutate(values))}>
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
            <Button type="submit" disabled={createMut.isPending}>Simpan</Button>
            {createMut.isError && (
              <p className="text-sm text-destructive">{(createMut.error as Error)?.message || "Gagal menyimpan"}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}