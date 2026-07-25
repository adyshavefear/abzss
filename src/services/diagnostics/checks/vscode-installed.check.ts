import type {DiagnosticCheck, DiagnosticResult} from '../../../core/contracts/diagnostic-check.contract.js'

import {VscodeAdapter} from '../../../integrations/vscode/vscode.adapter.js'

export class VscodeInstalledCheck implements DiagnosticCheck {
  readonly name = 'VS Code'

  async run(): Promise<DiagnosticResult> {
    const isAvailable = new VscodeAdapter().isAvailable()

    return isAvailable
      ? {message: 'Comando "code" disponível no PATH', name: this.name, status: 'ok'}
      : {message: 'Não encontrado no PATH (opcional)', name: this.name, status: 'warning'}
  }
}