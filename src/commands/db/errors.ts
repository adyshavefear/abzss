import {Flags} from '@oclif/core'

import {OracleCommand} from '../../cli/oracle-command.js'

export default class DbErrors extends OracleCommand {
  static override description = 'Lista erros de compilação dos objetos visíveis em um schema Oracle'
  static override flags = {
    schema: Flags.string({description: 'Dono do objeto, com a grafia do catálogo (padrão: usuário conectado)'}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DbErrors)
    await this.withConnection(flags.connection, async (adapter) => {
      const rows = await adapter.query(`
        select name, type, line, position, text
          from all_errors
         where owner = coalesce(:owner, user)
           and attribute = 'ERROR'
         order by name, type, sequence`, {owner: flags.schema ?? null})
      this.log(JSON.stringify(rows, null, 2))
      if (rows.length > 0) this.exit(1)
    })
  }
}
