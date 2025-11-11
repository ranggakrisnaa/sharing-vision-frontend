import { createBrowserRouter, NavLink, Outlet } from "react-router-dom";
import ArticlesList from "@/pages/articles/ArticlesList";
import ArticleCreate from "@/pages/articles/ArticleCreate";
import ArticleEdit from "@/pages/articles/ArticleEdit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function RootLayout() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile top nav */}
      <aside className="md:hidden border-b">
        <div className="container flex items-center justify-between py-3">
          <div className="font-semibold">Dashboard</div>
          <nav className="flex items-center gap-2">
            <NavLink
              to="/dashboard/articles"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium rounded-md px-3 py-1.5 hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                )
              }
            >
              Articles
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 border-r sticky top-0 h-[100dvh]">
        <div className="flex h-full w-full flex-col p-4 gap-3">
          <div className="text-lg font-semibold">Dashboard</div>
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard/articles"
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                )
              }
            >
              Articles
            </NavLink>
          </nav>
          <div className="mt-auto">
            <Button size="sm" variant="outline">Support</Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <ArticlesList /> },
      { path: "dashboard/articles", element: <ArticlesList /> },
      { path: "dashboard/articles/new", element: <ArticleCreate /> },
      { path: "dashboard/articles/:id/edit", element: <ArticleEdit /> },
    ],
  },
]);
