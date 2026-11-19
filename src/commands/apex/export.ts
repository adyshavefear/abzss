import {Flags} from '@oclif/core'
import {writeFile} from 'node:fs/promises'
import oracledb from 'oracledb'

import {OracleCommand} from '../../cli/oracle-command.js'

export default class ApexExport extends OracleCommand {
  static override description = 'Exporta uma aplicação APEX para um arquivo SQL sem sobrescrever arquivos existentes'
  static override flags = {
    app: Flags.integer({description: 'ID da aplicação', min: 1, required: true}),
    output: Flags.string({description: 'Caminho do arquivo SQL de destino'}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(ApexExport)
    await this.withConnection(flags.connection, async (adapter) => {
      const connection = await adapter.connect()
      const result = await connection.execute<{contents: oracledb.Lob}>(
        `declare
           files apex_t_export_files;
         begin
           files := apex_export.get_application(p_application_id => :app);
           :contents := files(1).contents;
         end;`,
        {app: flags.app, contents: {dir: oracledb.BIND_OUT, type: oracledb.CLOB}},
      )
      const lob = result.outBinds?.contents
      if (!lob) throw new Error('APEX não retornou o conteúdo da aplicação')
      try {
        const path = flags.output ?? `f${flags.app}.sql`
        await writeFile(path, await lob.getData(), {flag: 'wx'})
        this.log(`Exportado: ${path}`)
      } finally {
        await lob.close()
      }
    })
  }
}
