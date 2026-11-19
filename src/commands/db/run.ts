import {Flags} from '@oclif/core'
import {readFile} from 'node:fs/promises'

import {OracleCommand} from '../../cli/oracle-command.js'
import {DatabaseService} from '../../services/database/database.service.js'

export default class DbRun extends OracleCommand {
  static override description = 'Executa e confirma uma instrução SQL ou bloco PL/SQL'
  static override flags = {
    execute: Flags.boolean({description: 'Autoriza alterações e commit; DDL pode fazer commit implícito', required: true}),
    file: Flags.string({description: 'Arquivo com uma instrução SQL ou bloco PL/SQL', required: true}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DbRun)
    if (!flags.execute) this.error('Use --execute para autorizar alterações')
    const sql = await readFile(flags.file, 'utf8')
    await this.withConnection(flags.connection, async (adapter) => {
      const result = await new DatabaseService(adapter).run(sql)
      this.log(JSON.stringify(result, null, 2))
    })
  }
}
