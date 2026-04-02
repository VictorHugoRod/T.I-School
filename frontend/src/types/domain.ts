export type UserRole = "owner" | "analyst" | "auditor"

export type AlertSeverity = "low" | "medium" | "high" | "critical"

export type AlertStatus = "new" | "investigating" | "resolved" | "false_positive"

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner: "Proprietário",
  analyst: "Analista",
  auditor: "Auditor",
}

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
}

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  new: "Novo",
  investigating: "Investigando",
  resolved: "Resolvido",
  false_positive: "Falso Positivo",
}

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

export function isAlertCritical(alert: Alert): boolean {
  return alert.severity === "critical" || alert.severity === "high"
}

export function getAlertStatusColor(status: AlertStatus): string {
  const colors: Record<AlertStatus, string> = {
    new: "text-blue-600",
    investigating: "text-yellow-600",
    resolved: "text-green-600",
    false_positive: "text-gray-600",
  }
  return colors[status]
}

export function getSeverityColor(severity: AlertSeverity): string {
  const colors: Record<AlertSeverity, string> = {
    low: "text-blue-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    critical: "text-red-500",
  }
  return colors[severity]
}
