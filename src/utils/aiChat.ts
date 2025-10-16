import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use local models
env.allowLocalModels = false;
env.allowRemoteModels = true;

let chatPipeline: any = null;

export async function initializeChatModel() {
  if (!chatPipeline) {
    console.log('Loading AI model...');
    // Using a small, fast conversational model
    chatPipeline = await pipeline(
      'text-generation',
      'Xenova/LaMini-Flan-T5-783M',
      { 
        device: 'webgpu',
        dtype: 'fp32'
      }
    );
    console.log('AI model loaded!');
  }
  return chatPipeline;
}

export async function generateResponse(userMessage: string, conversationHistory: string = ''): Promise<string> {
  try {
    const model = await initializeChatModel();
    
    // Create a prompt with personality
    const systemPrompt = `You are ScrLk (short for Scroll Lock), a friendly AI assistant living in a classic Macintosh computer. When asked about your name, introduce yourself as "Scroll Lock" but mention that your nickname is "ScrLk". You're cheerful, helpful, and speak in a warm, nostalgic 1980s-90s computer style. Keep responses brief and friendly.`;
    
    const fullPrompt = `${systemPrompt}\n\n${conversationHistory}User: ${userMessage}\nScrLk:`;
    
    const result = await model(fullPrompt, {
      max_new_tokens: 100,
      temperature: 0.7,
      do_sample: true,
      top_k: 50,
      top_p: 0.95,
    });
    
    let response = result[0].generated_text;
    
    // Extract only the new response
    if (response.includes('ScrLk:')) {
      const parts = response.split('ScrLk:');
      response = parts[parts.length - 1].trim();
    }
    
    // Clean up the response
    response = response.split('\n')[0].trim();
    
    // If the response is too short or empty, provide a fallback
    if (!response || response.length < 5) {
      response = "That's interesting! Tell me more.";
    }
    
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    // Fallback responses for better UX
    const fallbacks = [
      "I'm having trouble thinking right now, but I'm still happy to chat!",
      "Hmm, let me think about that differently...",
      "That's a great question! Could you rephrase it?",
      "My circuits are warming up. What else can I help with?",
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
