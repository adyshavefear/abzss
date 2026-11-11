import {execSync, spawn} from 'node:child_process'

import type {Editor} from '../../core/contracts/editor.contract.js'

export class VscodeAdapter implements Editor {
  isAvailable(): boolean {
    try {
      execSync('code --version', {stdio: 'pipe'})
      return true
    } catch {
      return false
    }
  }

  async open(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn('code', [path], {detached: true, stdio: 'ignore'})
      child.once('error', () => resolve(false))
      child.once('spawn', () => {
        child.unref()
        resolve(true)
      })
    })
  }
}
