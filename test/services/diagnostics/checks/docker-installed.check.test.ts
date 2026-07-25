import {expect} from 'chai'

import {DockerInstalledCheck} from '../../../../src/services/diagnostics/checks/docker-installed.check.js'

describe('DockerInstalledCheck', () => {
  it('retorna um resultado com o nome "Docker"', async () => {
    const check = new DockerInstalledCheck()
    const result = await check.run()

    expect(result.name).to.equal('Docker')
    expect(['ok', 'warning']).to.include(result.status)
  })
})