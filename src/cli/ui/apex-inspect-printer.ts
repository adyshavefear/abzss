import chalk from 'chalk'

import type {ApexInspectResult} from '../../services/apex/apex-inspect.service.js'

export function printApexInspect(result: ApexInspectResult): void {
  console.log(chalk.bold('\nABZSS Apex Inspect\n'))

  if (!result.configured) {
    console.log(chalk.red('Configuração Oracle não encontrada.'))
    console.log(chalk.gray('  Adicione um bloco "oracle" em ~/.abzssrc.json com user, password e connectString.'))
    return
  }

  if (result.error) {
    console.log(chalk.red(`Erro ao consultar: ${result.error}`))
    return
  }

  if (result.applications) {
    if (result.applications.length === 0) {
      console.log(chalk.yellow('Nenhuma aplicação encontrada neste workspace.'))
      return
    }

    for (const app of result.applications) {
      console.log(
        `${chalk.cyan(app.applicationId.toString().padEnd(6))} ${chalk.bold(app.applicationName.padEnd(30))} ${chalk.gray(app.owner)}  (${app.pageCount} páginas)`,
      )
    }

    return
  }

  if (result.pages) {
    if (result.pages.length === 0) {
      console.log(chalk.yellow('Nenhuma página encontrada nesta aplicação.'))
      return
    }

    for (const page of result.pages) {
      console.log(`${chalk.cyan(page.pageId.toString().padEnd(6))} ${chalk.bold(page.pageName.padEnd(30))} ${chalk.gray(page.pageType)}`)
    }
  }
}