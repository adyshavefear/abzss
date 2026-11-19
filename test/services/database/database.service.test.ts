import {expect} from 'chai'
import oracledb from 'oracledb'

import {OracleConnectionAdapter} from '../../../src/integrations/oracle/oracle-connection.adapter.js'
import {DatabaseService, prepareStatement} from '../../../src/services/database/database.service.js'

function fixture(statementType = oracledb.STMT_TYPE_SELECT, fail = false) {
  const calls: string[] = []
  const connection = {
    async commit() { calls.push('commit') },
    async execute(sql: string) {
      calls.push(sql)
      if (fail && sql !== 'set transaction read only') throw new Error('falha SQL')
      return {rows: [{VALUE: 1}], rowsAffected: 2}
    },
    async getStatementInfo() { return {statementType} },
    async rollback() { calls.push('rollback') },
  }
  const adapter = {async connect() { return connection }} as unknown as OracleConnectionAdapter
  return {calls, service: new DatabaseService(adapter)}
}

async function rejects(action: () => Promise<unknown>, message: string) {
  let caught: unknown
  try { await action() } catch (error) { caught = error }
  expect(caught).to.be.instanceOf(Error)
  expect((caught as Error).message).to.contain(message)
}

describe('DatabaseService', () => {
  it('remove o terminador SQL e preserva ponto e vírgula em literais', () => {
    expect(prepareStatement("select ';' from dual;\n/\n")).to.equal("select ';' from dual")
  })

  it('preserva o terminador de PL/SQL mesmo com comentário inicial', () => {
    expect(prepareStatement('-- teste\nbegin null; end;\n/')).to.equal('-- teste\nbegin null; end;')
    expect(prepareStatement('create or replace procedure p as begin null; end;')).to.match(/end;$/)
  })

  it('rejeita arquivo vazio', () => {
    expect(() => prepareStatement('  ')).to.throw('vazio')
  })

  it('executa consultas em transação somente leitura e encerra com rollback', async () => {
    const {calls, service} = fixture()
    expect(await service.query('select 1 from dual;')).to.deep.equal([{VALUE: 1}])
    expect(calls).to.deep.equal(['set transaction read only', 'select 1 from dual', 'rollback'])
  })

  it('recusa DML na consulta antes de executar', async () => {
    const {calls, service} = fixture(oracledb.STMT_TYPE_DELETE)
    await rejects(() => service.query('delete from t'), 'somente SELECT')
    expect(calls).to.deep.equal([])
  })

  it('encerra a transação quando a consulta falha', async () => {
    const {calls, service} = fixture(oracledb.STMT_TYPE_SELECT, true)
    await rejects(() => service.query('select 1 from dual'), 'falha SQL')
    expect(calls.at(-1)).to.equal('rollback')
  })

  it('confirma alterações somente após sucesso', async () => {
    const {calls, service} = fixture()
    expect(await service.run('delete from t;')).to.equal(2)
    expect(calls).to.deep.equal(['delete from t', 'commit'])
  })

  it('reverte DML quando a execução falha', async () => {
    const {calls, service} = fixture(oracledb.STMT_TYPE_SELECT, true)
    await rejects(() => service.run('delete from t'), 'falha SQL')
    expect(calls).to.deep.equal(['delete from t', 'rollback'])
  })
})
