import {Command} from '@oclif/core'

import {printDockerStatus} from '../../cli/ui/docker-status-printer.js'
import {DockerStatusService} from '../../services/docker/docker-status.service.js'

export default class DockerStatus extends Command {
  static override description = 'Verifica se o Docker está instalado e se o daemon está rodando'

  async run(): Promise<void> {
    const service = new DockerStatusService()
    const status = await service.run()
    printDockerStatus(status)
  }
}