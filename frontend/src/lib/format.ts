export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(date)
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}
