import type { Alert, AppUser, BaselineSummary, Business, ImportJob, Transaction } from "../types/domain"

export const businessesSeed: Business[] = [
  {
    id: "biz-1",
    name: "Escola TI Labs",
    segment: "Educacao",
    timezone: "America/Sao_Paulo",
    createdAt: "2026-01-14T10:00:00Z",
  },
]

export const usersSeed: AppUser[] = [
  {
    id: "usr-1",
    businessId: "biz-1",
    name: "Ana Gestora",
    email: "ana@escolati.com",
    role: "owner",
    createdAt: "2026-01-14T10:30:00Z",
  },
  {
    id: "usr-2",
    businessId: "biz-1",
    name: "Bruno Analista",
    email: "bruno@escolati.com",
    role: "analyst",
    createdAt: "2026-01-20T09:00:00Z",
  },
]

export const transactionsSeed: Transaction[] = [
  { id: "txn-001", businessId: "biz-1", timestamp: "2026-03-24T08:12:00Z", amount: 260, category: "Mensalidade", source: "CSV", normalized: true },
  { id: "txn-002", businessId: "biz-1", timestamp: "2026-03-24T10:35:00Z", amount: 275, category: "Mensalidade", source: "CSV", normalized: true },
  { id: "txn-003", businessId: "biz-1", timestamp: "2026-03-25T15:04:00Z", amount: 12200, category: "Estorno", source: "CSV", normalized: true },
  { id: "txn-004", businessId: "biz-1", timestamp: "2026-03-25T15:06:00Z", amount: 11950, category: "Estorno", source: "CSV", normalized: true },
  { id: "txn-005", businessId: "biz-1", timestamp: "2026-03-26T11:19:00Z", amount: 240, category: "Mensalidade", source: "CSV", normalized: true },
]

export const baselineSeed: BaselineSummary = {
  businessId: "biz-1",
  lastUpdatedAt: "2026-03-25T23:10:00Z",
  maturityDays: 42,
  status: "active",
  seasonalityEnabled: true,
}

export const alertsSeed: Alert[] = [
  {
    id: "al-401",
    businessId: "biz-1",
    severity: "critical",
    status: "new",
    explanation: "Volume de estornos 18x acima do padrao horario da categoria.",
    transactionIds: ["txn-003", "txn-004"],
    createdAt: "2026-03-25T15:10:00Z",
    score: 0.97,
    history: [{ status: "new", changedBy: "Sistema", changedAt: "2026-03-25T15:10:00Z" }],
  },
  {
    id: "al-402",
    businessId: "biz-1",
    severity: "medium",
    status: "investigating",
    explanation: "Transacao unica fora da faixa sazonal para Mensalidade.",
    transactionIds: ["txn-002"],
    createdAt: "2026-03-24T10:36:00Z",
    score: 0.71,
    history: [
      { status: "new", changedBy: "Sistema", changedAt: "2026-03-24T10:36:00Z" },
      { status: "investigating", changedBy: "Ana Gestora", changedAt: "2026-03-24T10:40:00Z", note: "Em validacao com financeiro." },
    ],
  },
]

export const importJobsSeed: ImportJob[] = [
  {
    id: "job-31",
    fileName: "transacoes-marco.csv",
    delimiter: ";",
    encoding: "utf-8",
    mappedColumns: {
      data: "dt_transacao",
      valor: "vlr_total",
      categoria: "tipo",
    },
    progress: 100,
    status: "done",
    issues: [],
    createdAt: "2026-03-24T07:50:00Z",
  },
]
