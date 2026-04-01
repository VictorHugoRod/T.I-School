import { useState, type FormEvent } from "react"

import { useAppState } from "../app/app-state"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { formatDateTime } from "../lib/format"

export function BusinessPage() {
  const { businesses, addBusiness } = useAppState()
  const [name, setName] = useState("")
  const [segment, setSegment] = useState("")
  const [timezone, setTimezone] = useState("America/Sao_Paulo")

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addBusiness({ name, segment, timezone })
    setName("")
    setSegment("")
    setTimezone("America/Sao_Paulo")
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Cadastro de negocios</h2>
        <p className="text-sm text-muted-foreground">
          UC-01 e RF-01: cada usuario deve atuar apenas no negocio ao qual foi vinculado.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Novo negocio</CardTitle>
            <CardDescription>Preencha os dados obrigatorios para monitoramento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="business-name">Nome</Label>
                <Input id="business-name" value={name} required onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-segment">Segmento</Label>
                <Input id="business-segment" value={segment} required onChange={(event) => setSegment(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-timezone">Fuso horario</Label>
                <Input id="business-timezone" value={timezone} required onChange={(event) => setTimezone(event.target.value)} />
              </div>
              <Button className="w-full" type="submit">
                Cadastrar negocio
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Negocios monitorados</CardTitle>
            <CardDescription>Registro atualizado para governanca e auditoria.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Fuso</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>{business.segment}</TableCell>
                    <TableCell>{business.timezone}</TableCell>
                    <TableCell>{formatDateTime(business.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
