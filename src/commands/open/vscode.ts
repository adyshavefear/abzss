import {Args, Command} from '@oclif/core'

import {printOpenEditorResult} from '../../cli/ui/open-editor-printer.js'
import {OpenEditorService} from '../../services/editor/open-editor.service.js'

export default class OpenVscode extends Command {
  static override args = {
    path: Args.string({default: '.', description: 'Caminho a ser aberto no VS Code'}),
  }
static override description = 'Abre o projeto (ou um caminho específico) no VS Code'

  async run(): Promise<void> {
    const {args} = await this.parse(OpenVscode)
    const service = new OpenEditorService()
    const result = await service.run(args.path)
    printOpenEditorResult(result)
  }
}
