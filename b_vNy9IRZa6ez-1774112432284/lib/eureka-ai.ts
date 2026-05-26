export type EurekaConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type EurekaUserContext = Record<string, unknown> | null

type AskEurekaAIParams = {
  question: string
  role?: string
  userId?: string
  currentPage?: string
  conversation?: EurekaConversationMessage[]
  userContext?: EurekaUserContext
}

type AskEurekaAIResponse = {
  answer?: string
}

export async function askEurekaAI(params: AskEurekaAIParams): Promise<string> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

  const res = await fetch(`${API_URL}/exam-prep/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: params.question,
      role: params.role,
      user_id: params.userId,
      current_page: params.currentPage,
      conversation: params.conversation ?? [],
      user_context: params.userContext ?? null,
    }),
  })

  if (!res.ok) {
    throw new Error(`Eureka AI request failed (${res.status})`)
  }

  const data = (await res.json()) as AskEurekaAIResponse
  const answer = data.answer?.trim()
  if (!answer) {
    throw new Error('Eureka AI returned an empty response.')
  }

  return answer
}
