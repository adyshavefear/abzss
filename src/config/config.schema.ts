import {z} from 'zod'

const oracleProfile = z.object({
  connectString: z.string().min(1),
  passwordEnv: z.string().min(1).optional(),
  user: z.string().min(1),
})

export const configSchema = z.object({
  ai: z
    .object({
      model: z.string().optional(),
      provider: z.enum(['anthropic', 'openai', 'google']).optional(),
    })
    .optional(),
  connections: z.record(z.string(), oracleProfile).optional(),
  oracle: z
    .object({
      connectString: z.string(),
      password: z.string(),
      user: z.string(),
    })
    .optional(),
  output: z
    .object({
      colors: z.boolean().default(true),
    })
    .default({colors: true}),
})

export type AbzssConfig = z.infer<typeof configSchema>