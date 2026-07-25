import type {GitRepository, GitReviewSnapshot} from '../../core/contracts/git-repository.contract.js'

import {GitRepositoryAdapter} from '../../integrations/git/git-repository.adapter.js'

export interface GitReviewResult {
  isRepository: boolean
  snapshot?: GitReviewSnapshot
}

export class GitReviewService {
  constructor(private readonly repository: GitRepository = new GitRepositoryAdapter()) {}

  async run(): Promise<GitReviewResult> {
    if (!this.repository.isRepository()) {
      return {isRepository: false}
    }

    return {isRepository: true, snapshot: this.repository.getReviewSnapshot()}
  }
}