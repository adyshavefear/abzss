export interface ContainerRuntimeStatus {
  daemonRunning: boolean
  installed: boolean
  version?: string
}

export interface ContainerRuntime {
  getStatus(): ContainerRuntimeStatus
}