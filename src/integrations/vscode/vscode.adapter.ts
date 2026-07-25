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

  open(path: string): boolean {
    try {
      const child = spawn('code', [path], {detached: true, stdio: 'ignore'})
      child.unref()
      return true
    } catch {
      return false
    }
  }
}