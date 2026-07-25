import chalk from 'chalk'

import type {GitReviewResult} from '../../services/git-review/git-review.service.js'

export function printGitReview(result: GitReviewResult): void {
  console.log(chalk.bold('\nABZSS Git Review\n'))

  if (!result.isRepository) {
    console.log(chalk.red('Esta pasta não é um repositório Git.'))
    return
  }

  const {snapshot} = result
  if (!snapshot) return

  console.log(`${chalk.bold('Branch:')} ${chalk.cyan(snapshot.branch)}\n`)

  printSection('Staged', snapshot.staged, chalk.green)
  printSection('Modificados', snapshot.modified, chalk.yellow)
  printSection('Não rastreados', snapshot.untracked, chalk.gray)

  const total = snapshot.staged.length + snapshot.modified.length + snapshot.untracked.length
  console.log()
  console.log(
    total === 0
      ? chalk.green.bold('Nada para revisar. Repositório limpo.')
      : chalk.bold(`${total} arquivo(s) com alterações.`),
  )
}

function printSection(title: string, files: string[], color: (text: string) => string): void {
  if (files.length === 0) return

  console.log(chalk.bold(`${title}:`))
  for (const file of files) {
    console.log(`  ${color('●')} ${file}`)
  }

  console.log()
}