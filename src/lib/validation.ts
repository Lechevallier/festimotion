import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image_url: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required')
}).refine(
  (data) => {
    if (!data.end_date) return true;
    return new Date(data.start_date) < new Date(data.end_date);
  },
  {
    message: "End date must be after start date",
    path: ["end_date"]
  }
);

export type EventFormData = z.infer<typeof eventSchema>;