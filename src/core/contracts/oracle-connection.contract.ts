export interface OracleCredentials {
  connectString: string
  password: string
  user: string
}

export interface OracleConnection {
  close(): Promise<void>
  query<T>(sql: string, binds?: Record<string, unknown>): Promise<T[]>
}