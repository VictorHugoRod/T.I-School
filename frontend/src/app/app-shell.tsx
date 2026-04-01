import { Menu, ShieldCheck, Siren, TableProperties, Users2 } from "lucide-react"
import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"

import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import { useAppState } from "./app-state"

const links = [
  { to: "/", label: "Dashboard", icon: ShieldCheck },
  { to: "/negocios", label: "Negocios", icon: TableProperties },
  { to: "/usuarios", label: "Usuarios", icon: Users2 },
  { to: "/importacao", label: "Importacao CSV", icon: Menu },
  { to: "/anomalias", label: "Alertas", icon: Siren },
]

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { session, logout } = useAppState()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menu de navegacao"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm text-muted-foreground">Monitoramento de Anomalias</p>
              <h1 className="text-lg font-semibold leading-tight">Plataforma Frontend</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{session.userName}</p>
              <p className="text-xs text-muted-foreground">{session.userEmail}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 md:grid-cols-[260px_1fr]">
        <aside
          className={cn(
            "border-b border-border bg-card p-3 md:min-h-[calc(100vh-64px)] md:border-b-0 md:border-r",
            menuOpen ? "block" : "hidden md:block",
          )}
        >
          <nav aria-label="Menu principal" className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/baseline"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              <ShieldCheck className="h-4 w-4" />
              Baseline
            </NavLink>
          </nav>
        </aside>
        <main className="min-h-[calc(100vh-64px)] p-4 sm:p-6">
          <a
            href="#conteudo-principal"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            Pular para o conteudo principal
          </a>
          <section id="conteudo-principal">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}
