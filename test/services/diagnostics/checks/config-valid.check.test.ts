import {expect} from 'chai'

import {ConfigValidCheck} from '../../../../src/services/diagnostics/checks/config-valid.check.js'

describe('ConfigValidCheck', () => {
  it('retorna status ok quando a configuração é válida ou usa os padrões', async () => {
    const check = new ConfigValidCheck()
    const result = await check.run()

    expect(result.name).to.equal('Configuração')
    expect(result.status).to.equal('ok')
  })
})