export type UserRole = "owner" | "analyst" | "auditor"

export type AlertSeverity = "low" | "medium" | "high" | "critical"

export type AlertStatus = "new" | "investigating" | "resolved" | "false_positive"

export interface Business {
  id: string
  name: string
  segment: string
  timezone: string
  createdAt: string
}

export interface AppUser {
  id: string
  businessId: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface Transaction {
  id: string
  businessId: string
  timestamp: string
  amount: number
  category: string
  source: string
  normalized: boolean
}

export interface BaselineSummary {
  businessId: string
  lastUpdatedAt: string
  maturityDays: number
  status: "insufficient_data" | "learning" | "active"
  seasonalityEnabled: boolean
}

export interface AlertStatusHistory {
  status: AlertStatus
  changedBy: string
  changedAt: string
  note?: string
}

export interface Alert {
  id: string
  businessId: string
  severity: AlertSeverity
  status: AlertStatus
  explanation: string
  transactionIds: string[]
  createdAt: string
  score: number
  history: AlertStatusHistory[]
}

export interface ImportIssue {
  row: number
  column: string
  issue: string
}

export interface ImportJob {
  id: string
  fileName: string
  delimiter: "," | ";" | "|"
  encoding: "utf-8" | "latin1"
  mappedColumns: Record<string, string>
  progress: number
  status: "queued" | "validating" | "normalizing" | "done" | "failed"
  issues: ImportIssue[]
  createdAt: string
}

export interface DashboardKpis {
  alerts24h: number
  totalTransactions: number
  anomalyRate: number
  averageDetectionLagHours: number
}
