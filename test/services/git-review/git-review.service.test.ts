import {expect} from 'chai'

import type {GitRepository, GitReviewSnapshot} from '../../../src/core/contracts/git-repository.contract.js'

import {GitReviewService} from '../../../src/services/git-review/git-review.service.js'

class FakeGitRepository implements GitRepository {
  constructor(
    private readonly repo: boolean,
    private readonly snapshot?: GitReviewSnapshot,
  ) {}

  getReviewSnapshot(): GitReviewSnapshot {
    return this.snapshot ?? {branch: 'main', modified: [], staged: [], untracked: []}
  }

  isRepository(): boolean {
    return this.repo
  }
}

describe('GitReviewService', () => {
  it('retorna isRepository false quando a pasta não é um repositório Git', async () => {
    const service = new GitReviewService(new FakeGitRepository(false))
    const result = await service.run()

    expect(result.isRepository).to.equal(false)
    expect(result.snapshot).to.equal(undefined)
  })

  it('retorna o snapshot quando é um repositório Git válido', async () => {
    const snapshot: GitReviewSnapshot = {
      branch: 'feature/teste',
      modified: ['arquivo.ts'],
      staged: [],
      untracked: ['novo.ts'],
    }
    const service = new GitReviewService(new FakeGitRepository(true, snapshot))
    const result = await service.run()

    expect(result.isRepository).to.equal(true)
    expect(result.snapshot).to.deep.equal(snapshot)
  })
})