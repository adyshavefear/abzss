import type {OracleCredentials} from '../core/contracts/oracle-connection.contract.js'

import {loadConfig} from './config-loader.js'

export function resolveOracleCredentials(name?: string): OracleCredentials {
  const config = loadConfig()
  if (!name && config.oracle) return config.oracle
  const profile = config.connections?.[name ?? 'default']
  if (!profile) throw new Error(`Conexão ${name ?? 'default'} não configurada em .abzssrc.json`)
  const variable = profile.passwordEnv ?? 'ABZ_ORACLE_PASSWORD'
  const password = process.env[variable]
  if (!password) throw new Error(`Defina a variável de ambiente ${variable}`)
  return {connectString: profile.connectString, password, user: profile.user}
}
