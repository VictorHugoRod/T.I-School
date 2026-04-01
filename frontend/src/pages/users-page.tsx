import { useState, type FormEvent } from "react"

import { useAppState } from "../app/app-state"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import type { UserRole } from "../types/domain"

export function UsersPage() {
  const { users, businesses, addUser, session } = useAppState()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("analyst")
  const [businessId, setBusinessId] = useState(session.businessId)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addUser({ name, email, role, businessId })
    setName("")
    setEmail("")
    setRole("analyst")
    setBusinessId(session.businessId)
  }

  const roleLabel: Record<UserRole, string> = {
    owner: "Owner",
    analyst: "Analyst",
    auditor: "Auditor",
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Usuarios e papeis</h2>
        <p className="text-sm text-muted-foreground">UC-02 e UC-03 com vinculo explicito de negocio (RB-01 e RB-02).</p>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar usuario</CardTitle>
            <CardDescription>Defina papel de acesso antes de salvar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="user-name">Nome</Label>
                <Input id="user-name" required value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">E-mail</Label>
                <Input id="user-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                >
                  <option value="owner">Owner</option>
                  <option value="analyst">Analyst</option>
                  <option value="auditor">Auditor</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business">Negocio</Label>
                <select
                  id="business"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={businessId}
                  onChange={(event) => setBusinessId(event.target.value)}
                >
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button className="w-full" type="submit">
                Salvar usuario
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Usuarios ativos</CardTitle>
            <CardDescription>Acesso segmentado por negocio e perfil.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Negocio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{roleLabel[user.role]}</Badge>
                    </TableCell>
                    <TableCell>{businesses.find((business) => business.id === user.businessId)?.name ?? "-"}</TableCell>
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
