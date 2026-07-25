import {existsSync} from 'node:fs'
import {resolve} from 'node:path'

import type {Editor, OpenEditorResult} from '../../core/contracts/editor.contract.js'

import {VscodeAdapter} from '../../integrations/vscode/vscode.adapter.js'

export class OpenEditorService {
  constructor(private readonly editor: Editor = new VscodeAdapter()) {}

  async run(path: string): Promise<OpenEditorResult> {
    const resolvedPath = resolve(path)

    if (!this.editor.isAvailable()) {
      return {isAvailable: false, opened: false, path: resolvedPath}
    }

    if (!existsSync(resolvedPath)) {
      return {isAvailable: true, opened: false, path: resolvedPath}
    }

    const opened = this.editor.open(resolvedPath)
    return {isAvailable: true, opened, path: resolvedPath}
  }
}
export {type OpenEditorResult} from '../../core/contracts/editor.contract.js'