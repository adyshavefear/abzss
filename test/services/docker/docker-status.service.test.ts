import {expect} from 'chai'

import type {ContainerRuntime, ContainerRuntimeStatus} from '../../../src/core/contracts/container-runtime.contract.js'

import {DockerStatusService} from '../../../src/services/docker/docker-status.service.js'

class FakeContainerRuntime implements ContainerRuntime {
  constructor(private readonly status: ContainerRuntimeStatus) {}

  getStatus(): ContainerRuntimeStatus {
    return this.status
  }
}

describe('DockerStatusService', () => {
  it('retorna installed false quando o Docker não está instalado', async () => {
    const service = new DockerStatusService(new FakeContainerRuntime({daemonRunning: false, installed: false}))
    const status = await service.run()

    expect(status.installed).to.equal(false)
    expect(status.daemonRunning).to.equal(false)
  })

  it('retorna daemonRunning false quando instalado mas o daemon está parado', async () => {
    const service = new DockerStatusService(
      new FakeContainerRuntime({daemonRunning: false, installed: true, version: 'Docker version 24.0.0'}),
    )
    const status = await service.run()

    expect(status.installed).to.equal(true)
    expect(status.daemonRunning).to.equal(false)
  })

  it('retorna tudo ok quando instalado e o daemon está rodando', async () => {
    const service = new DockerStatusService(
      new FakeContainerRuntime({daemonRunning: true, installed: true, version: 'Docker version 24.0.0'}),
    )
    const status = await service.run()

    expect(status.installed).to.equal(true)
    expect(status.daemonRunning).to.equal(true)
  })
})