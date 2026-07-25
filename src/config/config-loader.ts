import {existsSync, readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {join} from 'node:path'

import {type AbzssConfig, configSchema} from './config.schema.js'
import {defaultConfig} from './default-config.js'

const GLOBAL_CONFIG_PATH = join(homedir(), '.abzssrc.json')
const PROJECT_CONFIG_PATH = join(process.cwd(), '.abzssrc.json')

function readJsonIfExists(path: string): Record<string, unknown> | undefined {
  if (!existsSync(path)) {
    return undefined
  }

  try {
    const raw = readFileSync(path, 'utf8')
    return JSON.parse(raw) as Record<string, unknown>
  } catch (error) {
    throw new Error(`Falha ao ler ${path}: ${(error as Error).message}`)
  }
}

export function loadConfig(): AbzssConfig {
  const globalRaw = readJsonIfExists(GLOBAL_CONFIG_PATH)
  const projectRaw = readJsonIfExists(PROJECT_CONFIG_PATH)

  const merged = {
    ...defaultConfig,
    ...globalRaw,
    ...projectRaw,
    output: {
      ...defaultConfig.output,
      ...(globalRaw?.output as object | undefined),
      ...(projectRaw?.output as object | undefined),
    },
  }

  const result = configSchema.safeParse(merged)

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`Configuração inválida em .abzssrc.json:\n${issues}`)
  }

  return result.data
}