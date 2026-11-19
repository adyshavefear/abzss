import oracledb from 'oracledb'

import {OracleConnectionAdapter} from '../../integrations/oracle/oracle-connection.adapter.js'

export function prepareStatement(source: string): string {
  const sql = source.trim().replace(/\r?\n\s*\/\s*$/, '').trim()
  if (!sql) throw new Error('O arquivo SQL está vazio')
  const start = sql.replace(/^(?:\s|--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)+/, '')
  // shortcut: um comando SQL ou bloco PL/SQL por arquivo; usar SQLcl para scripts SQL*Plus.
  return /^(?:declare|begin|create\s+(?:or\s+replace\s+)?(?:(?:editionable|noneditionable)\s+)?(?:procedure|function|package|trigger|type)\b)/i.test(start)
    ? sql : sql.replace(/;$/, '')
}

export class DatabaseService {
  constructor(private readonly adapter: OracleConnectionAdapter) {}

  async query(source: string): Promise<unknown[]> {
    const connection = await this.adapter.connect()
    const sql = prepareStatement(source)
    const info = await connection.getStatementInfo(sql)
    if (info.statementType !== oracledb.STMT_TYPE_SELECT) throw new Error('db query aceita somente SELECT; use db run --execute para alterações')
    await connection.execute('set transaction read only')
    try {
      const result = await connection.execute(sql, {}, {maxRows: 1000, outFormat: oracledb.OUT_FORMAT_OBJECT})
      return result.rows ?? []
    } finally {
      await connection.rollback()
    }
  }

  async run(source: string): Promise<number> {
    const connection = await this.adapter.connect()
    try {
      const result = await connection.execute(prepareStatement(source), {}, {autoCommit: false})
      await connection.commit()
      return result.rowsAffected ?? 0
    } catch (error) {
      await connection.rollback()
      throw error
    }
  }
}
