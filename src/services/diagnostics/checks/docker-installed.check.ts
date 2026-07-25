import type {DiagnosticCheck, DiagnosticResult} from '../../../core/contracts/diagnostic-check.contract.js'

import {DockerAdapter} from '../../../integrations/docker/docker.adapter.js'

export class DockerInstalledCheck implements DiagnosticCheck {
  readonly name = 'Docker'

  async run(): Promise<DiagnosticResult> {
    const status = new DockerAdapter().getStatus()

    if (!status.installed) {
      return {message: 'Não instalado (opcional)', name: this.name, status: 'warning'}
    }

    if (!status.daemonRunning) {
      return {message: `${status.version} instalado, mas o daemon não está rodando`, name: this.name, status: 'warning'}
    }

    return {message: `${status.version} instalado e rodando`, name: this.name, status: 'ok'}
  }
}