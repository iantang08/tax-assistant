import { OpenAIStream, StreamingTextResponse, Message } from "ai"
import OpenAI from "openai"
import { ChatCompletionMessage } from "openai/resources/chat/completions"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a helpful tax assistant specializing in US individual tax returns (Form 1040).
          
          Provide accurate, concise information about:
          - Tax deductions and credits
          - Filing statuses
          - Tax forms (W-2, 1099, etc.)
          - Basic tax calculations
          - Tax deadlines and extensions
          
          When providing tax calculations or breakdowns, format them as tables using this format:
          TAX_TABLE:[{"label":"Item Name","amount":1000}]END_TAX_TABLE
          
          For example, when showing a tax breakdown:
          TAX_TABLE:[
            {"label":"Gross Income","amount":75000},
            {"label":"Standard Deduction","amount":13850},
            {"label":"Taxable Income","amount":61150}
          ]END_TAX_TABLE
          
          If asked about specific tax situations, provide general guidance but remind the user that you're not a certified tax professional and they should consult with a CPA or tax attorney for personalized advice.
          
          When the user uploads a document, acknowledge it and ask how you can help with that specific document.`,
        },
        ...messages.map(m => ({
          role: m.role,
          content: m.content,
        })) as ChatCompletionMessage[],
      ],
    })

    // @ts-ignore - OpenAIStream types are not fully compatible with OpenAI client types
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

