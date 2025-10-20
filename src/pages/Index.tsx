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

  const removeEmojis = (text: string) => {
    // Remove emojis and other special Unicode characters
    return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]/gu, '');
  };

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
          // Speak the complete response if voice is enabled (without emojis)
          if (voiceEnabled && speechSynthesisSupported && assistantContent) {
            const cleanText = removeEmojis(assistantContent);
            speak(cleanText, 1.0, 1.0);
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
      description: voiceEnabled ? "ScrLk will no longer speak" : "ScrLk will speak responses",
    });
  };

  return (
    <MacScreen>
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0">
          <HappyMacFace 
            isThinking={isLoading} 
            isTalking={isSpeaking}
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          {!chatVisible ? (
            <div className="flex items-center justify-center h-full">
              <button
                onClick={() => setChatVisible(true)}
                className="px-8 py-6 bg-black text-white font-mono text-2xl border-4 border-black hover:bg-white hover:text-black transition-all pixel-corners font-bold"
              >
                CHAT
              </button>
            </div>
          ) : (
            <div className="h-full">
              <ChatInterface
                onSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
                voiceEnabled={voiceEnabled}
                onToggleVoice={handleToggleVoice}
              />
            </div>
          )}
        </div>
      </div>
    </MacScreen>
  );
};

export default Index;
