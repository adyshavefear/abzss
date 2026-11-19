import {execSync} from 'node:child_process'

import type {GitRepository, GitReviewSnapshot} from '../../core/contracts/git-repository.contract.js'

export class GitRepositoryAdapter implements GitRepository {
  getReviewSnapshot(): GitReviewSnapshot {
    const branch = execSync('git branch --show-current', {encoding: 'utf8'}).trim() || '(sem branch)'
    const statusOutput = execSync('git status --porcelain=v1 -z', {encoding: 'utf8'})

    const modified: string[] = []
    const staged: string[] = []
    const untracked: string[] = []

    const entries = statusOutput.split('\0')
    for (let i = 0; i < entries.length; i++) {
      const line = entries[i]
      if (!line) continue

      const indexStatus = line[0]
      const worktreeStatus = line[1]
      const path = line.slice(3)

      // In -z output, a rename/copy has a second entry containing the original path.
      if (/[RC]/.test(indexStatus + worktreeStatus)) i++

      if (indexStatus === '?' && worktreeStatus === '?') {
        untracked.push(path)
        continue
      }

      if (indexStatus !== ' ') {
        staged.push(path)
      }

      if (worktreeStatus !== ' ') {
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
