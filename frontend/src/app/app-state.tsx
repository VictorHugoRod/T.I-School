/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

import { alertsSeed, baselineSeed, businessesSeed, importJobsSeed, transactionsSeed, usersSeed } from "../mocks/data"
import type { Alert, AlertStatus, AppUser, BaselineSummary, Business, DashboardKpis, ImportJob, Transaction, UserRole } from "../types/domain"

interface SessionState {
  isAuthenticated: boolean
  userName: string
  userEmail: string
  businessId: string
}

interface AppStateContextValue {
  session: SessionState
  businesses: Business[]
  users: AppUser[]
  transactions: Transaction[]
  baseline: BaselineSummary
  alerts: Alert[]
  importJobs: ImportJob[]
  dashboardKpis: DashboardKpis
  login: (name: string, email: string) => void
  logout: () => void
  addBusiness: (payload: Pick<Business, "name" | "segment" | "timezone">) => void
  addUser: (payload: Pick<AppUser, "name" | "email" | "role" | "businessId">) => void
  addImportJob: (payload: Pick<ImportJob, "fileName" | "delimiter" | "encoding" | "mappedColumns" | "issues">) => Promise<void>
  refreshBaseline: () => Promise<void>
  updateAlertStatus: (alertId: string, status: AlertStatus, note: string) => void
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    userName: "",
    userEmail: "",
    businessId: "biz-1",
  })
  const [businesses, setBusinesses] = useState<Business[]>(businessesSeed)
  const [users, setUsers] = useState<AppUser[]>(usersSeed)
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsSeed)
  const [baseline, setBaseline] = useState<BaselineSummary>(baselineSeed)
  const [alerts, setAlerts] = useState<Alert[]>(alertsSeed)
  const [importJobs, setImportJobs] = useState<ImportJob[]>(importJobsSeed)

  const login = useCallback((name: string, email: string) => {
    setSession({
      isAuthenticated: true,
      userName: name || "Operador",
      userEmail: email,
      businessId: businesses[0]?.id ?? "biz-1",
    })
  }, [businesses])

  const logout = useCallback(() => {
    setSession({
      isAuthenticated: false,
      userName: "",
      userEmail: "",
      businessId: "biz-1",
    })
  }, [])

  const addBusiness = useCallback((payload: Pick<Business, "name" | "segment" | "timezone">) => {
    const business: Business = {
      id: `biz-${crypto.randomUUID().slice(0, 6)}`,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    setBusinesses((prev) => [business, ...prev])
  }, [])

  const addUser = useCallback((payload: Pick<AppUser, "name" | "email" | "role" | "businessId">) => {
    const normalizedRole: UserRole = payload.role
    const user: AppUser = {
      id: `usr-${crypto.randomUUID().slice(0, 6)}`,
      createdAt: new Date().toISOString(),
      ...payload,
      role: normalizedRole,
    }
    setUsers((prev) => [user, ...prev])
  }, [])

  const addImportJob = useCallback(async (payload: Pick<ImportJob, "fileName" | "delimiter" | "encoding" | "mappedColumns" | "issues">) => {
    const id = `job-${crypto.randomUUID().slice(0, 6)}`
    const queued: ImportJob = {
      id,
      progress: 15,
      status: "queued",
      createdAt: new Date().toISOString(),
      ...payload,
    }

    setImportJobs((prev) => [queued, ...prev])
    await sleep(250)
    setImportJobs((prev) => prev.map((job) => (job.id === id ? { ...job, status: "validating", progress: 45 } : job)))
    await sleep(250)
    setImportJobs((prev) => prev.map((job) => (job.id === id ? { ...job, status: "normalizing", progress: 78 } : job)))
    await sleep(250)
    const failed = payload.issues.length > 0
    setImportJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: failed ? "failed" : "done", progress: 100 } : job)),
    )

    if (!failed) {
      const generated: Transaction = {
        id: `txn-${crypto.randomUUID().slice(0, 6)}`,
        businessId: session.businessId,
        timestamp: new Date().toISOString(),
        amount: 299,
        category: "Mensalidade",
        source: "CSV",
        normalized: true,
      }
      setTransactions((prev) => [generated, ...prev])
    }
  }, [session.businessId])

  const refreshBaseline = useCallback(async () => {
    await sleep(400)
    setBaseline((prev) => ({
      ...prev,
      maturityDays: Math.max(prev.maturityDays + 1, 30),
      lastUpdatedAt: new Date().toISOString(),
      status: "active",
    }))
  }, [])

  const updateAlertStatus = useCallback((alertId: string, status: AlertStatus, note: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status,
              history: [
                ...alert.history,
                {
                  status,
                  changedBy: session.userName || "Operador",
                  changedAt: new Date().toISOString(),
                  note,
                },
              ],
            }
          : alert,
      ),
    )
  }, [session.userName])

  const dashboardKpis = useMemo<DashboardKpis>(() => {
    const referenceTime = alerts.length
      ? Math.max(...alerts.map((alert) => new Date(alert.createdAt).getTime()))
      : 0
    const alerts24h = alerts.filter((alert) => referenceTime - new Date(alert.createdAt).getTime() <= 24 * 60 * 60 * 1000).length
    const totalTransactions = transactions.length
    const anomalyRate = totalTransactions > 0 ? (alerts.length / totalTransactions) * 100 : 0
    const averageDetectionLagHours = 4.2
    return { alerts24h, totalTransactions, anomalyRate, averageDetectionLagHours }
  }, [alerts, transactions])

  const value = useMemo<AppStateContextValue>(
    () => ({
      session,
      businesses,
      users,
      transactions,
      baseline,
      alerts,
      importJobs,
      dashboardKpis,
      login,
      logout,
      addBusiness,
      addUser,
      addImportJob,
      refreshBaseline,
      updateAlertStatus,
    }),
    [
      session,
      businesses,
      users,
      transactions,
      baseline,
      alerts,
      importJobs,
      dashboardKpis,
      login,
      logout,
      addBusiness,
      addUser,
      addImportJob,
      refreshBaseline,
      updateAlertStatus,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState deve ser usado dentro de AppStateProvider")
  }
  return context
}
