import {expect} from 'chai'
import {mkdtempSync, rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

import {VscodeAdapter} from '../../src/integrations/vscode/vscode.adapter.js'

describe('VscodeAdapter', () => {
  it('returns false when the editor cannot be spawned', async () => {
    const path = process.env.PATH
    const directory = mkdtempSync(join(tmpdir(), 'abz-editor-'))
    try {
      process.env.PATH = directory
      expect(await new VscodeAdapter().open('.')).to.equal(false)
    } finally {
      process.env.PATH = path
      rmSync(directory, {force: true, recursive: true})
    }
  })
})
