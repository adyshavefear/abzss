import oracledb from 'oracledb'

import type {OracleConnection, OracleCredentials} from '../../core/contracts/oracle-connection.contract.js'

import {oracleNetDirectory} from '../../config/oracle-net.js'

export class OracleConnectionAdapter implements OracleConnection {
  private connection: oracledb.Connection | undefined

  constructor(private readonly credentials: OracleCredentials) {}

  async close(): Promise<void> {
    await this.connection?.close()
    this.connection = undefined
  }

  async connect(): Promise<oracledb.Connection> {
    if (!this.connection) {
      this.connection = await oracledb.getConnection({...this.credentials, configDir: oracleNetDirectory(), connectTimeout: 10})
      this.connection.callTimeout = 30_000
    }

    return this.connection
  }

  async query<T>(sql: string, binds: Record<string, unknown> = {}): Promise<T[]> {
    const connection = await this.connect()
    const result = await connection.execute<T>(sql, binds as oracledb.BindParameters, {
      autoCommit: false, outFormat: oracledb.OUT_FORMAT_OBJECT,
    })
    return result.rows ?? []
  }
}
