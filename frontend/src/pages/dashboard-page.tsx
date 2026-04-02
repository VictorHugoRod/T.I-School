import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { useAppState } from "../app/app-state"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { formatCurrencyBRL, formatDateTime, formatNumber, formatPercentage } from "../lib/format"
import { getSeverityColor } from "../types/domain"

export function DashboardPage() {
  const { alerts, dashboardKpis, transactions } = useAppState()

  const chartData = useMemo(
    () =>
      transactions
        .slice()
        .reverse()
        .map((transaction) => ({
          data: new Date(transaction.timestamp).toLocaleDateString("pt-BR"),
          valor: transaction.amount,
        })),
    [transactions],
  )

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de indicadores</h1>
        <p className="text-sm text-muted-foreground">
          Consulta otimizada para feedback instantaneo e leitura em ate 2 segundos.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" role="region" aria-label="Indicadores principais">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alertas (24h)</CardDescription>
            <CardTitle className="text-3xl">{formatNumber(dashboardKpis.alerts24h)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transacoes normalizadas</CardDescription>
            <CardTitle className="text-3xl">{formatNumber(dashboardKpis.totalTransactions)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de anomalia</CardDescription>
            <CardTitle className="text-3xl">{formatPercentage(dashboardKpis.anomalyRate)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lag medio de deteccao</CardDescription>
            <CardTitle className="text-3xl">{dashboardKpis.averageDetectionLagHours}h</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Evolucao de valores transacionados</CardTitle>
            <CardDescription>Base historica utilizada para baseline sazonal.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary-hsl))" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="hsl(var(--primary-hsl))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary-hsl))" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas recentes</CardTitle>
            <CardDescription>Priorize criticidade alta/critica.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <article key={alert.id} className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{alert.id}</p>
                  <Badge 
                    variant={alert.severity === "critical" || alert.severity === "high" ? "destructive" : "secondary"}
                    className={getSeverityColor(alert.severity)}
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{alert.explanation}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(alert.createdAt)}</p>
              </article>
            ))}
            <article className="rounded-lg border border-dashed border-border p-3">
              <p className="text-sm font-medium">Ticket medio</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrencyBRL(
                  transactions.reduce((acc, current) => acc + current.amount, 0) / Math.max(transactions.length, 1),
                )}
              </p>
            </article>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
