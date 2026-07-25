import type {DiagnosticCheck, DiagnosticResult} from '../../../core/contracts/diagnostic-check.contract.js'

import {loadConfig} from '../../../config/config-loader.js'

export class ConfigValidCheck implements DiagnosticCheck {
  readonly name = 'Configuração'

  async run(): Promise<DiagnosticResult> {
    try {
      loadConfig()
      return {message: 'Configuração válida (ou usando padrões)', name: this.name, status: 'ok'}
    } catch (error) {
      return {message: (error as Error).message, name: this.name, status: 'error'}
    }
  }
}