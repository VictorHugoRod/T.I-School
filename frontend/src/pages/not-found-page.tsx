import { Link } from "react-router-dom"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Página não encontrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link to="/" className="block">
            <Button className="w-full">Voltar ao dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
