import { z } from "zod"

const quizQuestionSchema = z.object({
  title: z.string().describe("The question text"),
  description: z
    .string()
    .optional()
    .describe("Optional additional details or explanation for the question"),
  options: z.array(z.string()).describe("List of answer options"),
  correctAnswer: z
    .number()
    .describe(
      "Index of the correct answer in the options array (0-based index)"
    ),
  marks: z.number().describe("Marks awarded for the correct answer")
})

// Exported Zod schema for the full quiz (an array of questions)
export const quizSchema = z.array(quizQuestionSchema)
