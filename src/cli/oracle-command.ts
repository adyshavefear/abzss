import {Command, Flags} from '@oclif/core'

import {resolveOracleCredentials} from '../config/oracle-profile.js'
import {OracleConnectionAdapter} from '../integrations/oracle/oracle-connection.adapter.js'

export abstract class OracleCommand extends Command {
  static baseFlags = {
    connection: Flags.string({description: 'Nome da conexão em .abzssrc.json'}),
  }

  protected async withConnection<T>(name: string | undefined, action: (adapter: OracleConnectionAdapter) => Promise<T>): Promise<T> {
    const credentials = resolveOracleCredentials(name)
    this.logToStderr(`Conexão: ${name ?? 'default'} (${credentials.user}@${credentials.connectString})`)
    const adapter = new OracleConnectionAdapter(credentials)
    try {
      return await action(adapter)
    } finally {
      await adapter.close()
    }
  }
}
