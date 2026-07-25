import chalk from 'chalk'

import type {ContainerRuntimeStatus} from '../../core/contracts/container-runtime.contract.js'

export function printDockerStatus(status: ContainerRuntimeStatus): void {
  console.log(chalk.bold('\nABZSS Docker Status\n'))

  if (!status.installed) {
    console.log(chalk.red('✖ Docker não está instalado.'))
    console.log(chalk.gray('  Instale em: https://docs.docker.com/get-docker/'))
    return
  }

  console.log(chalk.green(`✔ Docker instalado: ${status.version}`))

  if (status.daemonRunning) {
    console.log(chalk.green('✔ Daemon do Docker está rodando.'))
  } else {
    console.log(chalk.yellow('⚠ Docker instalado, mas o daemon não está rodando.'))
    console.log(chalk.gray('  Inicie o Docker Desktop (ou o serviço docker) e tente novamente.'))
  }
}