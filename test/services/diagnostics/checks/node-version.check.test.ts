import {expect} from 'chai'

import {NodeVersionCheck} from '../../../../src/services/diagnostics/checks/node-version.check.js'

describe('NodeVersionCheck', () => {
  it('retorna status ok quando a versão do Node é >= 18', async () => {
    const check = new NodeVersionCheck()
    const result = await check.run()

    expect(result.name).to.equal('Node.js')
    expect(result.status).to.equal('ok')
    expect(result.message).to.include(process.version)
  })
})