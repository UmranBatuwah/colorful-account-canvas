
import { z } from 'zod';

export const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
  note: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
