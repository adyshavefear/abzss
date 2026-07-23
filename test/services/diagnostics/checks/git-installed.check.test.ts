import {expect} from 'chai'

import {GitInstalledCheck} from '../../../../src/services/diagnostics/checks/git-installed.check.js'

describe('GitInstalledCheck', () => {
  it('retorna status ok quando o Git está instalado', async () => {
    const check = new GitInstalledCheck()
    const result = await check.run()

    expect(result.name).to.equal('Git')
    expect(result.status).to.equal('ok')
    expect(result.message).to.include('git version')
  })
})