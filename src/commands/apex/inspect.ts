import {Args, Command, Flags} from '@oclif/core'

import {printApexInspect} from '../../cli/ui/apex-inspect-printer.js'
import {ApexInspectService} from '../../services/apex/apex-inspect.service.js'

export default class ApexInspect extends Command {
  static override args = {
    applicationId: Args.integer({description: 'ID da aplicação para listar páginas', min: 1}),
  }
  static override description = 'Lista aplicações APEX ou páginas de uma aplicação'
  static override flags = {
    connection: Flags.string({description: 'Nome da conexão em .abzssrc.json'}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(ApexInspect)
    const result = await new ApexInspectService().run(args.applicationId, flags.connection)
    if (result.error) this.error(result.error)
    printApexInspect(result)
  }
}
