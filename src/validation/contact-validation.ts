import { z, ZodType } from 'zod';

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    firstName: z.string().min(3).max(255),
    lastName: z.string().min(3).max(255).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(9).max(15).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid(),
    firstName: z.string().min(3).max(255).optional(),
    lastName: z.string().min(3).max(255).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(9).max(15).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(3).max(255).optional(),
    phone: z.string().min(9).max(15).optional(),
    email: z.string().email().optional(),
    page: z.number().int().min(1),
    size: z.number().int().min(1),
  });
}
