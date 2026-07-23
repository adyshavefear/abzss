import {Command} from '@oclif/core'

import {printDiagnostics} from '../cli/ui/diagnostics-printer.js'
import {DiagnosticsService} from '../services/diagnostics/diagnostics.service.js'

export default class Doctor extends Command {
  static override description = 'Diagnostica o ambiente de desenvolvimento'

  async run(): Promise<void> {
    const diagnostics = new DiagnosticsService()
    const results = await diagnostics.runAll()
    printDiagnostics(results)
  }
}