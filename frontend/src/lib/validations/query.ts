import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "text/plain"];

export const querySchema = z.object({
  document: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Document is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File size must be less than 10MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only PDF and TXT files are accepted"
    ),
  question: z
    .string()
    .min(1, "Question is required")
    .min(10, "Question must be at least 10 characters")
    .max(500, "Question must be less than 500 characters"),
});

export type QueryFormData = z.infer<typeof querySchema>;
