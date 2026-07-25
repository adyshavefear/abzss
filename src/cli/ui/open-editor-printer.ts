import chalk from 'chalk'

import type {OpenEditorResult} from '../../services/editor/open-editor.service.js'

export function printOpenEditorResult(result: OpenEditorResult): void {
  if (!result.isAvailable) {
    console.log(chalk.red('VS Code não encontrado. Verifique se o comando "code" está no PATH.'))
    return
  }

  if (!result.opened) {
    console.log(chalk.red(`Caminho não encontrado: ${result.path}`))
    return
  }

  console.log(chalk.green(`✔ Abrindo no VS Code: ${result.path}`))
}