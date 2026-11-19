import {Flags} from '@oclif/core'

import {OracleCommand} from '../../cli/oracle-command.js'

export default class DbInvalid extends OracleCommand {
  static override description = 'Lista objetos inválidos visíveis em um schema Oracle'
  static override flags = {
    schema: Flags.string({description: 'Dono do objeto, com a grafia do catálogo (padrão: usuário conectado)'}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(DbInvalid)
    await this.withConnection(flags.connection, async (adapter) => {
      const rows = await adapter.query(`
        select owner, object_name, subobject_name, object_type
          from all_objects
         where owner = coalesce(:owner, user)
           and status = 'INVALID'
         order by object_type, object_name, subobject_name`, {owner: flags.schema ?? null})
      this.log(JSON.stringify(rows, null, 2))
      if (rows.length > 0) this.exit(1)
    })
  }
}
