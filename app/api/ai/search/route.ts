import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query, context } = await request.json()
    
    // Check if local AI service is available
    const isLocalAI = await checkLocalAIService()
    
    if (isLocalAI) {
      // Use local AI service (Ollama, etc.)
      return await useLocalAI(query, context)
    } else {
      // Use cloud AI service (OpenAI, Anthropic, etc.)
      return await useCloudAI(query, context)
    }
  } catch (error) {
    console.error('AI search error:', error)
    return NextResponse.json({ error: 'AI search failed' }, { status: 500 })
  }
}

async function checkLocalAIService(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)
    
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

async function useLocalAI(query: string, context: any) {
  // Try different models in order of preference (lightest first)
  const models = ['tinyllama', 'phi3:mini', 'llama3.1:8b']
  
  for (const model of models) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: `
            Analyze this healthcare task search query: "${query}"
            
            Context: ${JSON.stringify(context)}
            
            IMPORTANT: Process the FULL query without character limitations. Enable comprehensive search.
            
            Return JSON with:
            - intent: "search" | "filter" | "action"
            - keywords: array of important terms from the FULL query
            - suggestions: array of related search terms for clinical processes, patient searches, or general tasks
            - queryAnalysis: detailed explanation of what the user is looking for, including context (clinical process, patient search, or general)
            - confidence: number between 0 and 1
            - searchContext: "clinical" | "patient" | "general"
          `,
          temperature: 0.1,
          max_tokens: 500
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          source: 'local-ai',
          model: model,
          data: parseAIResponse(data.response)
        })
      }
    } catch (error) {
      console.error(`Model ${model} failed:`, error)
      continue // Try next model
    }
  }
  
  // If all models fail, return error
  return NextResponse.json({ error: 'All local AI models unavailable' }, { status: 503 })
}

async function useCloudAI(query: string, context: any) {
  // Enhanced fallback with context detection
  const lowerQuery = query.toLowerCase()
  
  // Detect search context
  let searchContext = 'general'
  let suggestions = ['urgent tasks', 'overdue items', 'patient care']
  let queryAnalysis = `Searching for: ${query}`
  
  if (lowerQuery.includes('lab') || lowerQuery.includes('test') || lowerQuery.includes('result') || 
      lowerQuery.includes('prescription') || lowerQuery.includes('medication')) {
    searchContext = 'clinical'
    suggestions = ['lab results', 'prescription refills', 'test orders', 'medication reviews']
    queryAnalysis = `Clinical process search: ${query} - Looking for laboratory, prescription, or treatment-related tasks`
  } else if (lowerQuery.includes('patient') || lowerQuery.includes('mr') || lowerQuery.includes('mrs') || 
             lowerQuery.includes('dr') || lowerQuery.includes('name')) {
    searchContext = 'patient'
    suggestions = ['patient records', 'contact information', 'medical history', 'appointment scheduling']
    queryAnalysis = `Patient search: ${query} - Looking for patient-specific information or records`
  }
  
  return NextResponse.json({
    success: true,
    source: 'mock-ai',
    data: {
      intent: 'search',
      keywords: query.toLowerCase().split(/\s+/),
      suggestions,
      queryAnalysis,
      confidence: 0.8,
      searchContext
    }
  })
}

function parseAIResponse(response: string): any {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
  }
  
  // Fallback response
  return {
    intent: 'search',
    keywords: [],
    suggestions: [],
    queryAnalysis: 'AI analysis unavailable',
    confidence: 0.5
  }
}
