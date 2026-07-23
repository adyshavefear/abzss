import chalk from 'chalk'

import type {DiagnosticResult} from '../../core/contracts/diagnostic-check.contract.js'

const icons = {
  error: chalk.red('✖'),
  ok: chalk.green('✔'),
  warning: chalk.yellow('⚠'),
}

export function printDiagnostics(results: DiagnosticResult[]): void {
  console.log(chalk.bold('\nABZSS Doctor — Diagnóstico do Ambiente\n'))

  for (const result of results) {
    const icon = icons[result.status]
    const name = chalk.bold(result.name.padEnd(12))
    console.log(`${icon}  ${name} ${result.message}`)
  }

  const hasError = results.some((r) => r.status === 'error')
  console.log()

  if (hasError) {
    console.log(chalk.red.bold('Alguns problemas foram encontrados. Corrija antes de continuar.'))
  } else {
    console.log(chalk.green.bold('Ambiente pronto para uso.'))
  }
}