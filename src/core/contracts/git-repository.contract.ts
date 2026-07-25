export interface GitReviewSnapshot {
  branch: string
  modified: string[]
  staged: string[]
  untracked: string[]
}

export interface GitRepository {
  getReviewSnapshot(): GitReviewSnapshot
  isRepository(): boolean
}