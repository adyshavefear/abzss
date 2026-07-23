import type {DiagnosticCheck, DiagnosticResult} from '../../../core/contracts/diagnostic-check.contract.js'

const MIN_MAJOR_VERSION = 18

export class NodeVersionCheck implements DiagnosticCheck {
  readonly name = 'Node.js'

  async run(): Promise<DiagnosticResult> {
    const {version} = process
    const major = Number(version.replace('v', '').split('.')[0])

    if (major >= MIN_MAJOR_VERSION) {
      return {message: `Versão ${version} instalada`, name: this.name, status: 'ok'}
    }

    return {
      message: `Versão ${version} é muito antiga. Requer >= v${MIN_MAJOR_VERSION}.0.0`,
      name: this.name,
      status: 'error',
    }
  }
}