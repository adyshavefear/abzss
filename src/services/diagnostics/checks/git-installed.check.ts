import {execFile} from 'node:child_process'
import {promisify} from 'node:util'

import type {DiagnosticCheck, DiagnosticResult} from '../../../core/contracts/diagnostic-check.contract.js'

export class GitInstalledCheck implements DiagnosticCheck {
  readonly name = 'Git'

  async run(): Promise<DiagnosticResult> {
    try {
      const {stdout} = await promisify(execFile)('git', ['--version'], {encoding: 'utf8'})
      return {message: stdout.trim(), name: this.name, status: 'ok'}
    } catch {
      return {
        message: 'Git não encontrado no PATH',
        name: this.name,
        status: 'error',
      }
    }
  }
}