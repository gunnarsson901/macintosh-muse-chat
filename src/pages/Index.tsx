import { useState, useEffect } from 'react';
import MacScreen from '@/components/MacScreen';
import HappyMacFace from '@/components/HappyMacFace';
import ChatInterface from '@/components/ChatInterface';
import { initializeChatModel, generateResponse } from '@/utils/aiChat';
import { useToast } from '@/components/ui/use-toast';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { toast } = useToast();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: speechSynthesisSupported } = useSpeechSynthesis();

  useEffect(() => {
    // Preload the AI model
    const loadModel = async () => {
      try {
        await initializeChatModel();
        setIsModelLoading(false);
        toast({
          title: "Ready!",
          description: "Happy Mac is ready to chat",
        });
        // Show chat interface after a brief delay
        setTimeout(() => setShowChat(true), 1000);
      } catch (error) {
        console.error('Failed to load model:', error);
        setIsModelLoading(false);
        setShowChat(true);
        toast({
          title: "Note",
          description: "Running in fallback mode",
          variant: "destructive",
        });
      }
    };
    loadModel();
  }, [toast]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history
      const history = messages
        .map((m) => `${m.role === 'user' ? 'User' : 'Happy Mac'}: ${m.content}`)
        .join('\n');

      const response = await generateResponse(content, history);
      
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response if voice is enabled
      if (voiceEnabled && speechSynthesisSupported) {
        speak(response, 1.0, 1.0);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Oops! Something went wrong. But I'm still here!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
    toast({
      title: voiceEnabled ? "Voice output disabled" : "Voice output enabled",
      description: voiceEnabled ? "Happy Mac will no longer speak" : "Happy Mac will speak responses",
    });
  };

  return (
    <MacScreen>
      {isModelLoading ? (
        <div className="h-screen flex flex-col items-center justify-center gap-8">
          <HappyMacFace isThinking={true} />
          <p className="text-foreground text-center font-mono text-2xl">
            Loading Happy Mac...
          </p>
        </div>
      ) : (
        <div className="h-screen flex flex-col relative">
          {!chatVisible ? (
            <div className="flex flex-col items-center justify-center h-full">
              <HappyMacFace 
                isThinking={isLoading} 
                isTalking={isSpeaking}
              />
              <button
                onClick={() => setChatVisible(true)}
                className="mt-12 px-12 py-6 bg-foreground text-background font-mono text-2xl border-4 border-foreground hover:bg-background hover:text-foreground transition-all duration-200"
              >
                CHAT
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-shrink-0 flex items-center justify-center py-4">
                <HappyMacFace 
                  isThinking={isLoading} 
                  isTalking={isSpeaking}
                />
              </div>
              <div className="flex-1 min-h-0 px-8 pb-8">
                <ChatInterface
                  onSendMessage={handleSendMessage}
                  messages={messages}
                  isLoading={isLoading}
                  voiceEnabled={voiceEnabled}
                  onToggleVoice={handleToggleVoice}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </MacScreen>
  );
};

export default Index;
