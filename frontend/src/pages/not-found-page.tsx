import { Link } from "react-router-dom"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Pagina nao encontrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Verifique a rota ou volte para o dashboard.</p>
          <Link to="/">
            <Button>Voltar ao inicio</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
