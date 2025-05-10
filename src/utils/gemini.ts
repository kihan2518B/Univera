import {
  ArraySchema,
  GoogleGenerativeAI,
  SchemaType
} from "@google/generative-ai"
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-d785ed671be34aef920a746667c10b65"
})

export async function DeepseekQuizGenerater(
  documentText: string,
  quizDetails: any
) {
  const prompt = `
      Generate a multichoice quiz on the following topic:
      Document: ${documentText}
      Quiz Details: ${JSON.stringify(quizDetails)}
      Return a JSON response with:
      - title: string
      - description: string
      - questions: Array<{ title: string, description?: string, options: string[], correctAnswer: number, marks: number }>
    `
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "deepseek-chat"
  })
  console.log(completion.choices[0].message.content)
  return completion.choices[0].message.content
}

const genAI = new GoogleGenerativeAI("AIzaSyCq83BDk07EJwz8ekUN40wz5V8_FnIg4xA")

export const quizSchema: ArraySchema = {
  description: "List of quiz questions with options and correct answers",
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      title: {
        type: SchemaType.STRING,
        description: "The question text",
        nullable: false
      },
      description: {
        type: SchemaType.STRING,
        description:
          "Optional additional details or explanation for the question",
        nullable: true
      },
      options: {
        type: SchemaType.ARRAY,
        description: "List of possible answer options",
        items: {
          type: SchemaType.STRING
        },
        nullable: false
      },
      correctAnswer: {
        type: SchemaType.NUMBER,
        description:
          "Index of the correct answer in the options array (0-based index)",
        nullable: false
      },
      marks: {
        type: SchemaType.NUMBER,
        description: "Marks awarded for the correct answer",
        nullable: false
      }
    },
    required: ["title", "options", "correctAnswer", "marks"]
  }
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: quizSchema
  }
})

// Placeholder for AI API call (replace with actual Gemini/xAI API)
export async function generateQuizFromDocument(
  documentText: string,
  quizDetails: any
) {
  // Example AI prompt (modify based on API)
  const prompt = `
      Generate a multichoice quiz on the following topic:
      Document: ${documentText}
      Quiz Details: ${JSON.stringify(quizDetails)}
      Return a JSON response with:
      - title: string
      - description: string
      - questions: Array<{ title: string, description?: string, options: string[], correctAnswer: number, marks: number }>
    `
  // Replace with actual API call (e.g., Gemini or xAI)
  // const aiResponse = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyDK41x-JYemcNaRgecl2hj4TMXO437JELA", { // Example URL
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer AIzaSyDK41x-JYemcNaRgecl2hj4TMXO437JELA`,
  //     },
  //     body: JSON.stringify({ prompt }),
  // });

  const aiResponse = await model.generateContent(prompt)

  const result = await aiResponse.response.text()
  console.log("aiResponse: ", result)
  return result // Expected format: { title, description, questions }
}
