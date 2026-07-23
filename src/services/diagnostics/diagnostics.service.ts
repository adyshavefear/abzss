import type {DiagnosticCheck, DiagnosticResult} from '../../core/contracts/diagnostic-check.contract.js'

import {GitInstalledCheck} from './checks/git-installed.check.js'
import {NodeVersionCheck} from './checks/node-version.check.js'

export class DiagnosticsService {
  private readonly checks: DiagnosticCheck[] = [
    new NodeVersionCheck(),
    new GitInstalledCheck(),
  ]

  async runAll(): Promise<DiagnosticResult[]> {
    return Promise.all(this.checks.map((check) => check.run()))
  }
}