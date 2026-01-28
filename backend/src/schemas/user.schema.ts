import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be between 2 and 50 characters' })
    .max(50, { message: 'Name must be between 2 and 50 characters' }),

  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email' })
    .transform(val => val.toLowerCase()),

  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),

  companyName: z.string().trim().optional(),

  website: z.string().trim().url({ message: 'Please provide a valid URL' }).optional(),
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email' })
    .transform(val => val.toLowerCase()),

  password: z.string().min(1, { message: 'Password is required' }),
})

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>
