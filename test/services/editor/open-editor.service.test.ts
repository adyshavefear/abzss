import {expect} from 'chai'

import type {Editor} from '../../../src/core/contracts/editor.contract.js'

import {OpenEditorService} from '../../../src/services/editor/open-editor.service.js'

class FakeEditor implements Editor {
  constructor(
    private readonly available: boolean,
    private readonly openSucceeds = true,
  ) {}

  isAvailable(): boolean {
    return this.available
  }

  open(): boolean {
    return this.openSucceeds
  }
}

describe('OpenEditorService', () => {
  it('retorna isAvailable false quando o editor não está instalado', async () => {
    const service = new OpenEditorService(new FakeEditor(false))
    const result = await service.run('.')

    expect(result.isAvailable).to.equal(false)
    expect(result.opened).to.equal(false)
  })

  it('retorna opened false quando o caminho não existe', async () => {
    const service = new OpenEditorService(new FakeEditor(true))
    const result = await service.run('caminho-que-nao-existe-com-certeza')

    expect(result.isAvailable).to.equal(true)
    expect(result.opened).to.equal(false)
  })

  it('retorna opened true quando o editor está disponível e o caminho existe', async () => {
    const service = new OpenEditorService(new FakeEditor(true))
    const result = await service.run('.')

    expect(result.isAvailable).to.equal(true)
    expect(result.opened).to.equal(true)
  })
})