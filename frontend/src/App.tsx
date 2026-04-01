import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "./app/app-shell"
import { RequireAuth } from "./app/require-auth"
import { Skeleton } from "./components/ui/skeleton"
import { LoginPage } from "./pages/login-page"
import { NotFoundPage } from "./pages/not-found-page"

const DashboardPage = lazy(() => import("./pages/dashboard-page").then((module) => ({ default: module.DashboardPage })))
const BusinessPage = lazy(() => import("./pages/business-page").then((module) => ({ default: module.BusinessPage })))
const UsersPage = lazy(() => import("./pages/users-page").then((module) => ({ default: module.UsersPage })))
const ImportWizardPage = lazy(() => import("./pages/import-wizard-page").then((module) => ({ default: module.ImportWizardPage })))
const BaselinePage = lazy(() => import("./pages/baseline-page").then((module) => ({ default: module.BaselinePage })))
const AnomaliesPage = lazy(() => import("./pages/anomalies-page").then((module) => ({ default: module.AnomaliesPage })))

function PageFallback() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/negocios" element={<BusinessPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="/importacao" element={<ImportWizardPage />} />
            <Route path="/baseline" element={<BaselinePage />} />
            <Route path="/anomalias" element={<AnomaliesPage />} />
          </Route>
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
