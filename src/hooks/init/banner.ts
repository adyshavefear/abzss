import type {Hook} from '@oclif/core'

import {printBanner} from '../../cli/ui/banner.js'

const hook: Hook.Init = async function (opts) {
  if (!opts.id) {
    printBanner()
  }
}

export default hook