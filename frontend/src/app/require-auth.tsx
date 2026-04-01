import type { ReactElement } from "react"
import { Navigate, useLocation } from "react-router-dom"

import { useAppState } from "./app-state"

export function RequireAuth({ children }: { children: ReactElement }) {
  const { session } = useAppState()
  const location = useLocation()

  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
