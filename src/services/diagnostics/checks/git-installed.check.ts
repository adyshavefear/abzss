import {execSync} from 'node:child_process'

import type {DiagnosticCheck, DiagnosticResult} from '../../../core/contracts/diagnostic-check.contract.js'

export class GitInstalledCheck implements DiagnosticCheck {
  readonly name = 'Git'

  async run(): Promise<DiagnosticResult> {
    try {
      const output = execSync('git --version', {encoding: 'utf8'}).trim()
      return {message: output, name: this.name, status: 'ok'}
    } catch {
      return {
        message: 'Git não encontrado no PATH',
        name: this.name,
        status: 'error',
      }
    }
  }
}