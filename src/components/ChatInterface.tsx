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
    <div className="h-full flex flex-col bg-white border-2 border-black mac-inset">
      {/* Title Bar */}
      <div className="bg-black text-white px-1 py-0.5 text-[10px] font-bold flex items-center justify-between flex-shrink-0">
        <span>💻 ScrLk</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onToggleVoice}
            className="text-white hover:bg-gray-700 px-1"
            title={voiceEnabled ? 'Voice on' : 'Voice off'}
          >
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-1" ref={scrollRef}>
        <div className="space-y-1">
          {messages.length === 0 && (
            <div className="text-center text-[10px] text-muted-foreground py-2 font-mono">
              I'm ScrLk. Ask me anything!
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`text-[10px] font-mono ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-1 py-0.5 border-2 border-black max-w-[90%] ${
                  message.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-white text-black'
                }`}
              >
                <div className="font-bold text-[9px]">
                  {message.role === 'user' ? '👤' : '💻'}
                </div>
                <div className="whitespace-pre-wrap leading-tight">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left text-[10px] font-mono">
              <div className="inline-block px-1 py-0.5 border border-black bg-white">
                <span className="cursor-blink">▮</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-1 border-t-2 border-black bg-white flex-shrink-0">
        <div className="flex gap-1">
          <Button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            className={`bg-white border-2 border-black hover:bg-black hover:text-white text-[10px] p-0.5 h-5 pixel-corners ${
              isListening ? 'bg-black text-white' : ''
            }`}
            title={isListening ? 'Stop' : 'Mic'}
          >
            {isListening ? <MicOff className="h-2.5 w-2.5" /> : <Mic className="h-2.5 w-2.5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "..." : "Type..."}
            disabled={isLoading || isListening}
            className="flex-1 bg-white border-2 border-black font-mono text-[10px] pixel-corners focus-visible:ring-0 focus-visible:ring-offset-0 h-5 px-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-white text-black border-2 border-black hover:bg-black hover:text-white text-[10px] p-0.5 h-5 pixel-corners"
          >
            →
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
