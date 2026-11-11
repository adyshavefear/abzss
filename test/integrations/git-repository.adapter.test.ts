import {expect} from 'chai'
import {execFileSync} from 'node:child_process'
import {mkdtempSync, renameSync, rmSync, unlinkSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

import {GitRepositoryAdapter} from '../../src/integrations/git/git-repository.adapter.js'

describe('GitRepositoryAdapter', () => {
  it('reports deletions, staged renames and paths containing newlines', () => {
    const cwd = process.cwd()
    const directory = mkdtempSync(join(tmpdir(), 'abz-git-'))
    const git = (...args: string[]) => execFileSync('git', args, {cwd: directory, stdio: 'pipe'})
    try {
      git('init')
      writeFileSync(join(directory, 'removed.txt'), 'removed')
      writeFileSync(join(directory, 'old.txt'), 'renamed')
      git('add', '.')
      git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'fixture')
      unlinkSync(join(directory, 'removed.txt'))
      renameSync(join(directory, 'old.txt'), join(directory, 'new.txt'))
      git('add', 'old.txt', 'new.txt')
      const untracked = process.platform === 'win32' ? 'new file.txt' : 'new\nfile.txt'
      writeFileSync(join(directory, untracked), 'untracked')
      process.chdir(directory)
      const snapshot = new GitRepositoryAdapter().getReviewSnapshot()
      expect(snapshot.modified).to.deep.equal(['removed.txt'])
      expect(snapshot.staged).to.deep.equal(['new.txt'])
      expect(snapshot.untracked).to.deep.equal([untracked])
    } finally {
      process.chdir(cwd)
      rmSync(directory, {force: true, recursive: true})
    }
  })
})
