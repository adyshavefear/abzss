import {expect} from 'chai'

import {loadConfig} from '../../src/config/config-loader.js'

describe('loadConfig', () => {
  it('retorna os valores padrão quando não há .abzssrc.json', () => {
    const config = loadConfig()

    expect(config.output.colors).to.equal(true)
  })
})