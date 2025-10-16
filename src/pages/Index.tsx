import { useState, useEffect } from 'react';
import MacScreen from '@/components/MacScreen';
import HappyMacFace from '@/components/HappyMacFace';
import ChatInterface from '@/components/ChatInterface';
import { initializeChatModel, generateResponse } from '@/utils/aiChat';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

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

  return (
    <MacScreen>
      {!showChat || isModelLoading ? (
        <div className="h-full flex flex-col items-center justify-center">
          <HappyMacFace isThinking={isModelLoading} />
          <div className="text-center mt-4 font-mono text-sm">
            {isModelLoading ? (
              <>
                <p className="font-bold">Loading Happy Mac...</p>
                <p className="text-xs mt-2">Initializing AI model</p>
              </>
            ) : (
              <p className="font-bold">Welcome!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full grid grid-cols-5 gap-4">
          {/* Happy Mac Face - Takes up 2 columns */}
          <div className="col-span-2 flex items-center justify-center">
            <HappyMacFace 
              isTalking={isLoading}
              isThinking={isLoading}
            />
          </div>
          
          {/* Chat Interface - Takes up 3 columns */}
          <div className="col-span-3">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </MacScreen>
  );
};

export default Index;
