import { useState } from 'react';
import MacScreen from '@/components/MacScreen';
import HappyMacFace from '@/components/HappyMacFace';
import ChatInterface from '@/components/ChatInterface';
import { streamChat } from '@/utils/chatStream';
import { useToast } from '@/hooks/use-toast';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { toast } = useToast();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: speechSynthesisSupported } = useSpeechSynthesis();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";
    
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMessage],
        onDelta: updateAssistant,
        onDone: () => {
          setIsLoading(false);
          // Speak the complete response if voice is enabled
          if (voiceEnabled && speechSynthesisSupported && assistantContent) {
            speak(assistantContent, 1.0, 1.0);
          }
        },
        onError: (error) => {
          console.error("Stream error:", error);
          setIsLoading(false);
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        role: "assistant",
        content: "Oops! Something went wrong. But I'm still here!",
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    </MacScreen>
  );
};

export default Index;
