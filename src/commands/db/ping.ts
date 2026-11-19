import {OracleCommand} from '../../cli/oracle-command.js'

export default class DbPing extends OracleCommand {
  static override description = 'Testa a conexão Oracle'

  async run(): Promise<void> {
    const {flags} = await this.parse(DbPing)
    await this.withConnection(flags.connection, async (adapter) => {
      const rows = await adapter.query(`
        select user as username,
               sys_context('USERENV', 'DB_NAME') as database_name,
               sys_context('USERENV', 'CON_NAME') as container_name,
               sys_context('USERENV', 'SERVICE_NAME') as service_name,
               sys_context('USERENV', 'CURRENT_SCHEMA') as current_schema
          from dual`)
      this.log(JSON.stringify(rows, null, 2))
    })
  }
}
