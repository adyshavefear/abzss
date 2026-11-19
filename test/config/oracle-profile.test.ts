import {expect} from 'chai'

import {configSchema} from '../../src/config/config.schema.js'
import {resolveOracleCredentials} from '../../src/config/oracle-profile.js'

describe('Oracle profiles', () => {
  it('aceita perfis sem senha literal', () => {
    const config = configSchema.parse({connections: {dev: {connectString: 'localhost/FREEPDB1', passwordEnv: 'DEV_PASSWORD', user: 'app'}}})
    expect(config.connections?.dev.passwordEnv).to.equal('DEV_PASSWORD')
  })

  it('rejeita conexão sem usuário ou endereço', () => {
    expect(configSchema.safeParse({connections: {dev: {connectString: '', user: ''}}}).success).to.equal(false)
  })

  it('preserva a configuração Oracle antiga', () => {
    expect(configSchema.parse({oracle: {connectString: 'db/service', password: 'legacy', user: 'app'}}).oracle?.user).to.equal('app')
  })

  it('informa quando o perfil solicitado não existe', () => {
    expect(() => resolveOracleCredentials('__abz_missing_test_profile__')).to.throw('não configurada')
  })
})
