import type {DiagnosticCheck, DiagnosticResult} from '../../core/contracts/diagnostic-check.contract.js'

import {ConfigValidCheck} from './checks/config-valid.check.js'
import {DockerInstalledCheck} from './checks/docker-installed.check.js'
import {GitInstalledCheck} from './checks/git-installed.check.js'
import {NodeVersionCheck} from './checks/node-version.check.js'
import {VscodeInstalledCheck} from './checks/vscode-installed.check.js'

export class DiagnosticsService {
  private readonly checks: DiagnosticCheck[] = [
    new NodeVersionCheck(),
    new GitInstalledCheck(),
    new ConfigValidCheck(),
    new DockerInstalledCheck(),
    new VscodeInstalledCheck(),
  ]

  async runAll(): Promise<DiagnosticResult[]> {
    return Promise.all(this.checks.map((check) => check.run()))
  }
}