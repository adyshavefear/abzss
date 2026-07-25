import type {ContainerRuntime, ContainerRuntimeStatus} from '../../core/contracts/container-runtime.contract.js'

import {DockerAdapter} from '../../integrations/docker/docker.adapter.js'

export class DockerStatusService {
  constructor(private readonly runtime: ContainerRuntime = new DockerAdapter()) {}

  async run(): Promise<ContainerRuntimeStatus> {
    return this.runtime.getStatus()
  }
}