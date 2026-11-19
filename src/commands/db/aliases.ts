import {Command} from '@oclif/core'
import oracledb from 'oracledb'

import {oracleNetDirectory} from '../../config/oracle-net.js'

export default class DbAliases extends Command {
  static override description = 'Lista os aliases do tnsnames.ora sem se conectar ao banco'

  async run(): Promise<void> {
    await this.parse(DbAliases)
    const directory = oracleNetDirectory()
    if (!directory) this.error('Defina TNS_ADMIN com o diretório que contém tnsnames.ora')
    const aliases = await oracledb.getNetworkServiceNames(directory)
    this.log(JSON.stringify(aliases.sort(), null, 2))
  }
}
