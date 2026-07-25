import {execSync} from 'node:child_process'

import type {ContainerRuntime, ContainerRuntimeStatus} from '../../core/contracts/container-runtime.contract.js'

export class DockerAdapter implements ContainerRuntime {
  getStatus(): ContainerRuntimeStatus {
    let version: string | undefined

    try {
      version = execSync('docker --version', {encoding: 'utf8', stdio: 'pipe'}).trim()
    } catch {
      return {daemonRunning: false, installed: false}
    }

    try {
      execSync('docker info', {stdio: 'pipe'})
      return {daemonRunning: true, installed: true, version}
    } catch {
      return {daemonRunning: false, installed: true, version}
    }
  }
}