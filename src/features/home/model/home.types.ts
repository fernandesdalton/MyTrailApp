import { z } from 'zod';

export const homeHighlightSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

export type HomeHighlight = z.infer<typeof homeHighlightSchema>;
