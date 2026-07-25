import {execSync} from 'node:child_process'

import type {GitRepository, GitReviewSnapshot} from '../../core/contracts/git-repository.contract.js'

export class GitRepositoryAdapter implements GitRepository {
  getReviewSnapshot(): GitReviewSnapshot {
    const branch = execSync('git branch --show-current', {encoding: 'utf8'}).trim() || '(sem branch)'
    const statusOutput = execSync('git status --porcelain=v1', {encoding: 'utf8'})

    const modified: string[] = []
    const staged: string[] = []
    const untracked: string[] = []

    for (const line of statusOutput.split('\n')) {
      if (!line) continue

      const indexStatus = line[0]
      const worktreeStatus = line[1]
      const path = line.slice(3)

      if (indexStatus === '?' && worktreeStatus === '?') {
        untracked.push(path)
        continue
      }

      if (indexStatus !== ' ') {
        staged.push(path)
      }

      if (worktreeStatus === 'M') {
        modified.push(path)
      }
    }

    return {branch, modified, staged, untracked}
  }

  isRepository(): boolean {
    try {
      execSync('git rev-parse --is-inside-work-tree', {stdio: 'pipe'})
      return true
    } catch {
      return false
    }
  }
}