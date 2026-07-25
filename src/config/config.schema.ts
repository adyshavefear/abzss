import {z} from 'zod'

export const configSchema = z.object({
  ai: z
    .object({
      model: z.string().optional(),
      provider: z.enum(['anthropic', 'openai', 'google']).optional(),
    })
    .optional(),
  output: z
    .object({
      colors: z.boolean().default(true),
    })
    .default({colors: true}),
})

export type AbzssConfig = z.infer<typeof configSchema>