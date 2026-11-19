import {expect} from 'chai'
import oracledb from 'oracledb'

import {OracleConnectionAdapter} from '../../../src/integrations/oracle/oracle-connection.adapter.js'

// Sem conexão de rede: valida o contrato com o driver instalado.
describe('OracleConnectionAdapter', () => {
  it('reutiliza conexão, define timeout e fecha antes de reconectar', async () => {
    const originalDirectory = process.env.TNS_ADMIN
    const original = oracledb.getConnection
    let opened = 0
    let closed = 0
    let options: unknown
    const fake = {
      callTimeout: 0,
      async close() { closed++ },
      async execute(_sql: string, _binds: unknown, opts: unknown) {
        options = opts
        return {rows: [{VALUE: 1}]}
      },
    }
    oracledb.getConnection = (async (credentials: oracledb.ConnectionAttributes) => {
      expect(credentials.configDir).to.equal('/example/oracle/net')
      expect(credentials.connectTimeout).to.equal(10)
      opened++
      return fake
    }) as typeof oracledb.getConnection
    try {
      process.env.TNS_ADMIN = '/example/oracle/net'
      const adapter = new OracleConnectionAdapter({connectString: 'DEV', password: 'test', user: 'app'})
      expect(await adapter.query('select 1 from dual')).to.deep.equal([{VALUE: 1}])
      await adapter.query('select 1 from dual')
      expect(opened).to.equal(1)
      expect(fake.callTimeout).to.equal(30_000)
      expect(options).to.deep.equal({autoCommit: false, outFormat: oracledb.OUT_FORMAT_OBJECT})
      await adapter.close()
      await adapter.close()
      expect(closed).to.equal(1)
      await adapter.query('select 1 from dual')
      expect(opened).to.equal(2)
      await adapter.close()
    } finally {
      oracledb.getConnection = original
      if (originalDirectory === undefined) delete process.env.TNS_ADMIN
      else process.env.TNS_ADMIN = originalDirectory
    }
  })
})
