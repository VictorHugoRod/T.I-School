import { useState } from "react"

import { useAppState } from "../app/app-state"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { formatDateTime } from "../lib/format"

export function BaselinePage() {
  const { baseline, refreshBaseline, transactions } = useAppState()
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    await refreshBaseline()
    setLoading(false)
  }

  const minimumSamples = 30
  const hasEnoughHistory = transactions.length >= minimumSamples

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Baseline estatistico</h2>
        <p className="text-sm text-muted-foreground">
          UC-11 e UC-12: baseline recalculado periodicamente, com padroes temporais e sazonais.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estado atual</CardTitle>
            <CardDescription>Regras RB-04, RB-05, RB-06 e RB-15 representadas no frontend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={baseline.status === "active" ? "default" : "secondary"}>{baseline.status}</Badge>
              <Badge variant={baseline.seasonalityEnabled ? "outline" : "secondary"}>
                Sazonalidade {baseline.seasonalityEnabled ? "ativa" : "inativa"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Ultima atualizacao: {formatDateTime(baseline.lastUpdatedAt)}</p>
            <p className="text-sm text-muted-foreground">Maturidade do baseline: {baseline.maturityDays} dias de historico validado.</p>
            <Button onClick={handleRefresh} disabled={loading}>
              {loading ? "Recalculando..." : "Atualizar baseline"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prontidao</CardTitle>
            <CardDescription>Bloqueio de deteccao sem historico minimo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              Amostras normalizadas: <strong>{transactions.length}</strong>
            </p>
            <p className="text-sm">
              Minimo recomendado: <strong>{minimumSamples}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              {hasEnoughHistory
                ? "Historico suficiente para deteccao de anomalias."
                : "Dados insuficientes para liberar deteccao automatica."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
