import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

const ChatInterface = ({ onSendMessage, messages, isLoading, voiceEnabled, onToggleVoice }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSpeechResult = (transcript: string) => {
    setInput(transcript);
    toast({
      title: "Voice recognized",
      description: `"${transcript}"`,
    });
  };

  const handleSpeechError = (error: string) => {
    toast({
      title: "Voice input error",
      description: error,
      variant: "destructive",
    });
  };

  const { isListening, isSupported: speechSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: handleSpeechError,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleMicClick = () => {
    if (!speechSupported) {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-4 border-black mac-inset">
      {/* Title Bar */}
      <div className="bg-black text-white px-3 py-2 text-base font-bold flex items-center justify-between flex-shrink-0">
        <span>💻 ScrLk</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onToggleVoice}
            className="text-white hover:bg-gray-700 px-2 text-lg"
            title={voiceEnabled ? 'Voice on' : 'Voice off'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-lg text-muted-foreground py-4 font-mono font-bold">
              I'm ScrLk. Ask me anything!
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`text-base font-mono ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-3 py-2 border-4 border-black max-w-[90%] ${
                  message.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-white text-black'
                }`}
              >
                <div className="font-bold text-sm mb-1">
                  {message.role === 'user' ? '👤' : '💻'}
                </div>
                <div className="whitespace-pre-wrap leading-snug">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left text-base font-mono">
              <div className="inline-block px-3 py-2 border-3 border-black bg-white">
                <span className="cursor-blink text-xl">▮</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t-4 border-black bg-white flex-shrink-0">
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            className={`bg-white border-3 border-black hover:bg-black hover:text-white text-base p-2 h-12 pixel-corners ${
              isListening ? 'bg-black text-white' : ''
            }`}
            title={isListening ? 'Stop' : 'Mic'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "..." : "Type..."}
            disabled={isLoading || isListening}
            className="flex-1 bg-white border-3 border-black font-mono text-base pixel-corners focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-3"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-white text-black border-3 border-black hover:bg-black hover:text-white text-xl p-2 h-12 pixel-corners font-bold"
          >
            →
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
