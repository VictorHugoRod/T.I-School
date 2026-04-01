import { useMemo, useState, type FormEvent } from "react"

import { useAppState } from "../app/app-state"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Progress } from "../components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import type { ImportIssue } from "../types/domain"

const requiredTemplateColumns = ["data", "valor", "categoria"]

export function ImportWizardPage() {
  const { addImportJob, importJobs } = useAppState()
  const [fileName, setFileName] = useState("transacoes-novo.csv")
  const [delimiter, setDelimiter] = useState<"," | ";" | "|">(";")
  const [encoding, setEncoding] = useState<"utf-8" | "latin1">("utf-8")
  const [mapping, setMapping] = useState<Record<string, string>>({
    data: "data_hora",
    valor: "vl_total",
    categoria: "tipo_operacao",
  })
  const [simulateError, setSimulateError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const issues = useMemo<ImportIssue[]>(
    () =>
      simulateError
        ? [
            { row: 5, column: "valor", issue: "Valor invalido ou vazio." },
            { row: 8, column: "data", issue: "Formato de data nao reconhecido." },
          ]
        : [],
    [simulateError],
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    await addImportJob({
      fileName,
      delimiter,
      encoding,
      mappedColumns: mapping,
      issues,
    })
    setSubmitting(false)
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Pipeline de importacao CSV</h2>
        <p className="text-sm text-muted-foreground">
          UC-04 a UC-09: upload, validacao, mapeamento, normalizacao e relatorio de erros.
        </p>
      </header>

      <Tabs defaultValue="wizard" className="space-y-4">
        <TabsList aria-label="Abas do pipeline de importacao">
          <TabsTrigger value="wizard">Assistente</TabsTrigger>
          <TabsTrigger value="jobs">Historico</TabsTrigger>
        </TabsList>

        <TabsContent value="wizard">
          <Card>
            <CardHeader>
              <CardTitle>Configurar importacao</CardTitle>
              <CardDescription>Somente arquivos CSV sao aceitos nesta etapa (RF-04 e RNF-09).</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={onSubmit}>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="csv-file">Nome do arquivo</Label>
                  <Input
                    id="csv-file"
                    value={fileName}
                    required
                    onChange={(event) => setFileName(event.target.value)}
                    placeholder="exemplo.csv"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delimiter">Delimitador</Label>
                  <select
                    id="delimiter"
                    value={delimiter}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    onChange={(event) => setDelimiter(event.target.value as "," | ";" | "|")}
                  >
                    <option value=",">Virgula (,)</option>
                    <option value=";">Ponto e virgula (;)</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encoding">Codificacao</Label>
                  <select
                    id="encoding"
                    value={encoding}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    onChange={(event) => setEncoding(event.target.value as "utf-8" | "latin1")}
                  >
                    <option value="utf-8">UTF-8</option>
                    <option value="latin1">Latin-1</option>
                  </select>
                </div>
                {requiredTemplateColumns.map((columnKey) => (
                  <div className="space-y-2" key={columnKey}>
                    <Label htmlFor={`mapping-${columnKey}`}>Mapear coluna: {columnKey}</Label>
                    <Input
                      id={`mapping-${columnKey}`}
                      value={mapping[columnKey]}
                      onChange={(event) => setMapping((prev) => ({ ...prev, [columnKey]: event.target.value }))}
                      required
                    />
                  </div>
                ))}
                <label className="flex items-center gap-2 text-sm md:col-span-2">
                  <input
                    className="h-4 w-4"
                    type="checkbox"
                    checked={simulateError}
                    onChange={(event) => setSimulateError(event.target.checked)}
                  />
                  Simular inconsistencias e gerar relatorio de erros
                </label>
                <Button type="submit" className="md:col-span-2" disabled={submitting}>
                  {submitting ? "Processando..." : "Executar pipeline"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Execucoes assicronas</CardTitle>
              <CardDescription>Feedback de progresso com estados visuais imediatos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {importJobs.map((job) => (
                <article key={job.id} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{job.fileName}</p>
                      <p className="text-xs text-muted-foreground">Job {job.id}</p>
                    </div>
                    <Badge variant={job.status === "failed" ? "destructive" : "secondary"}>{job.status}</Badge>
                  </div>
                  <Progress value={job.progress} aria-label={`Progresso do job ${job.id}`} />
                  {job.issues.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Linha</TableHead>
                          <TableHead>Coluna</TableHead>
                          <TableHead>Erro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {job.issues.map((issue, index) => (
                          <TableRow key={`${job.id}-${index}`}>
                            <TableCell>{issue.row}</TableCell>
                            <TableCell>{issue.column}</TableCell>
                            <TableCell>{issue.issue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem inconsistencias neste processamento.</p>
                  )}
                </article>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
