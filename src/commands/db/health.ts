import {OracleCommand} from '../../cli/oracle-command.js'

export default class DbHealth extends OracleCommand {
  static override description = 'Mostra a ocupação dos tablespaces e a contagem de sessões de usuários'

  async run(): Promise<void> {
    const {flags} = await this.parse(DbHealth)
    await this.withConnection(flags.connection, async (adapter) => {
      const tablespaces = await adapter.query(`
        select tablespace_name,
               round(used_percent, 2) as used_percent
          from dba_tablespace_usage_metrics
         order by used_percent desc, tablespace_name`)
      const sessions = await adapter.query(`
        select status, count(*) as total
          from v$session
         where type = 'USER'
         group by status
         order by status`)
      this.log(JSON.stringify({sessions, tablespaces}, null, 2))
    })
  }
}
