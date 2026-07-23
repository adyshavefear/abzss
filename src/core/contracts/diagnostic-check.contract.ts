export interface DiagnosticResult {
  message: string
  name: string
  status: 'error' | 'ok' | 'warning'
}

export interface DiagnosticCheck {
  readonly name: string
  run(): Promise<DiagnosticResult>
}