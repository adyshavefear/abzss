import {Command} from '@oclif/core'

import {printGitReview} from '../../cli/ui/git-review-printer.js'
import {GitReviewService} from '../../services/git-review/git-review.service.js'

export default class GitReview extends Command {
  static override description = 'Revisa o estado atual do repositório Git (staged, modificados, não rastreados)'

  async run(): Promise<void> {
    const service = new GitReviewService()
    const result = await service.run()
    printGitReview(result)
  }
}