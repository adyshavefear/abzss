import {existsSync} from 'node:fs'
import {homedir} from 'node:os'
import {join} from 'node:path'

export function oracleNetDirectory(): string | undefined {
  if (process.env.TNS_ADMIN) return process.env.TNS_ADMIN

  const localDirectory = join(homedir(), 'Oracle', 'network', 'admin')
  if (existsSync(join(localDirectory, 'tnsnames.ora'))) return localDirectory
}
