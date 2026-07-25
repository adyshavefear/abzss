import {expect} from 'chai'

import {VscodeInstalledCheck} from '../../../../src/services/diagnostics/checks/vscode-installed.check.js'

describe('VscodeInstalledCheck', () => {
  it('retorna um resultado com o nome "VS Code"', async () => {
    const check = new VscodeInstalledCheck()
    const result = await check.run()

    expect(result.name).to.equal('VS Code')
    expect(['ok', 'warning']).to.include(result.status)
  })
})