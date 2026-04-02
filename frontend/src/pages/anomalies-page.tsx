import { useMemo, useState } from "react"

import { useAppState } from "../app/app-state"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Textarea } from "../components/ui/textarea"
import { formatCurrencyBRL, formatDateTime } from "../lib/format"
import { ALERT_SEVERITY_LABELS, ALERT_STATUS_LABELS, type Alert, type AlertStatus } from "../types/domain"

const statusOptions: AlertStatus[] = ["new", "investigating", "resolved", "false_positive"]

export function AnomaliesPage() {
  const { alerts, transactions, updateAlertStatus } = useAppState()
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id ?? "")
  const [nextStatus, setNextStatus] = useState<AlertStatus>("investigating")
  const [note, setNote] = useState("")

  const selectedAlert = useMemo<Alert | undefined>(
    () => alerts.find((alert) => alert.id === selectedAlertId),
    [alerts, selectedAlertId],
  )

  const linkedTransactions = useMemo(
    () => transactions.filter((transaction) => selectedAlert?.transactionIds.includes(transaction.id)),
    [selectedAlert?.transactionIds, transactions],
  )

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Deteccao de anomalias e alertas</h2>
        <p className="text-sm text-muted-foreground">
          UC-13 a UC-18: severidade, explicacao, transacoes vinculadas e historico de status.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Alertas ativos</CardTitle>
            <CardDescription>Cada alerta referencia uma transacao ou conjunto relacionado (RB-09).</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow
                    key={alert.id}
                    className="cursor-pointer"
                    data-state={selectedAlertId === alert.id ? "selected" : undefined}
                    onClick={() => setSelectedAlertId(alert.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setSelectedAlertId(alert.id)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Selecionar alerta ${alert.id}`}
                  >
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>
                      <Badge variant={alert.severity === "critical" || alert.severity === "high" ? "destructive" : "secondary"}>
                        {ALERT_SEVERITY_LABELS[alert.severity]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ALERT_STATUS_LABELS[alert.status]}</Badge>
                    </TableCell>
                    <TableCell>{Math.round(alert.score * 100)}%</TableCell>
                    <TableCell>{formatDateTime(alert.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atualizar acompanhamento</CardTitle>
            <CardDescription>Historico de alteracoes preservado (RB-11).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="alert-select">Alerta</Label>
              <select
                id="alert-select"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedAlertId}
                onChange={(event) => setSelectedAlertId(event.target.value)}
              >
                {alerts.map((alert) => (
                  <option key={alert.id} value={alert.id}>
                    {alert.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-next">Novo status</Label>
              <select
                id="status-next"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value as AlertStatus)}

                aria-label="Selecionar novo status"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {ALERT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-note">Observacao</Label>
              <Textarea
                id="status-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Explique o motivo da alteracao"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!selectedAlert) return
                updateAlertStatus(selectedAlert.id, nextStatus, note)
                setNote("")
              }}
            >
              Registrar alteracao
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedAlert ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do alerta {selectedAlert.id}</CardTitle>
              <CardDescription>{selectedAlert.explanation}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Status atual: <strong>{ALERT_STATUS_LABELS[selectedAlert.status]}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Transacoes associadas: <strong>{selectedAlert.transactionIds.length}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Pontuacao de risco: <strong>{Math.round(selectedAlert.score * 100)}%</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transacoes associadas</CardTitle>
              <CardDescription>UC-17: visualize os detalhes das transacoes do alerta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {linkedTransactions.map((transaction) => (
                <article key={transaction.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{transaction.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(transaction.timestamp)}</p>
                  <p className="mt-1 text-sm">{transaction.category}</p>
                  <p className="text-sm font-semibold">{formatCurrencyBRL(transaction.amount)}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Historico de status</CardTitle>
              <CardDescription>Rastreabilidade completa da investigacao do alerta.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsavel</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Observacao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedAlert.history.map((historyItem, index) => (
                    <TableRow key={`${historyItem.changedAt}-${index}`}>
                      <TableCell>
                        <Badge variant="outline">{ALERT_STATUS_LABELS[historyItem.status]}</Badge>
                      </TableCell>
                      <TableCell>{historyItem.changedBy}</TableCell>
                      <TableCell>{formatDateTime(historyItem.changedAt)}</TableCell>
                      <TableCell>{historyItem.note || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  )
}
