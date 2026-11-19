import {OracleCommand} from '../../cli/oracle-command.js'
import {oracleNetDirectory} from '../../config/oracle-net.js'

function connectionHint(code: string | undefined): string {
  switch (code) {
    case 'EAI_AGAIN':
    case 'ENOTFOUND': {
      return 'Confira o hostname e a resolução DNS da rede ou VPN.'
    }

    case 'NJS-503':
    case 'NJS-510':
    case 'NJS-511':
    case 'ORA-12170':
    case 'ORA-12541': {
      return 'Confira a rede ou VPN, o hostname, a porta e se o listener está ativo.'
    }

    case 'NJS-516':
    case 'NJS-517':
    case 'NJS-520':
    case 'ORA-12154': {
      return 'Confira TNS_ADMIN e use db aliases para verificar o alias no tnsnames.ora.'
    }

    case 'NJS-518':
    case 'NJS-519':
    case 'ORA-12505':
    case 'ORA-12514': {
      return 'Confira se o serviço ou SID está correto e registrado no listener.'
    }

    case 'ORA-01017': {
      return 'Confira o usuário, a senha e a autorização da conta nesse serviço.'
    }

    default: {
      return 'Execute db ping para ver os detalhes do erro retornado pelo driver.'
    }
  }
}

export default class DbDoctor extends OracleCommand {
  static override description = 'Diagnostica o perfil local e testa a autenticação Oracle'

  async run(): Promise<void> {
    const {flags} = await this.parse(DbDoctor)
    let stage = 'Configuração local'

    this.log(`Diretório Oracle Net: ${oracleNetDirectory() ?? 'não localizado'}`)
    try {
      await this.withConnection(flags.connection, async (adapter) => {
        this.log('Configuração local OK')
        stage = 'Conexão Oracle'
        await adapter.connect()
        stage = 'Encerramento da sessão'
      })
    } catch (error) {
      if (stage === 'Configuração local') {
        this.error(`${stage}: ${error instanceof Error ? error.message : 'falha ao ler o perfil'}`, {exit: 1})
      }

      const code = error instanceof Error
        ? /^(?:ORA-\d{5}|NJS-\d{3}|ENOTFOUND|EAI_AGAIN)(?=:)/.exec(error.message)?.[0]
        : undefined
      this.error(`${stage}${code ? ` (${code})` : ''}: ${connectionHint(code)}`, {exit: 1})
    }

    this.log('Autenticação Oracle OK')
  }
}
