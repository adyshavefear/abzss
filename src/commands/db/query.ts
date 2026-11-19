import {Flags} from '@oclif/core'
import {readFile} from 'node:fs/promises'

import {OracleCommand} from '../../cli/oracle-command.js'
import {DatabaseService} from '../../services/database/database.service.js'

export default class DbQuery extends OracleCommand {
  static override description = 'Consulta Oracle (máximo de 1000 linhas)'
  static override flags = {
    file: Flags.string({description: 'Arquivo com uma instrução SQL ou bloco PL/SQL', required: true}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DbQuery)
    const sql = await readFile(flags.file, 'utf8')
    await this.withConnection(flags.connection, async (adapter) => {
      const result = await new DatabaseService(adapter).query(sql)
      this.log(JSON.stringify(result, null, 2))
    })
  }
}
