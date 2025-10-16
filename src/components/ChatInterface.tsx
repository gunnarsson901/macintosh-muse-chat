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
    <div className="h-full flex flex-col">
      {/* Menu Bar */}
      <div className="bg-white border-2 border-black p-1 mb-2 flex items-center gap-4 text-xs font-bold">
        <span>🍎</span>
        <span>File</span>
        <span>Edit</span>
        <span>Chat</span>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white border-2 border-black mac-inset overflow-hidden flex flex-col">
        {/* Title Bar */}
        <div className="bg-black text-white px-2 py-1 text-xs font-bold flex items-center justify-between">
          <span>Happy Mac Chat</span>
          <span className="cursor-pointer">✕</span>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8 font-mono">
                Hello! I'm the Happy Mac.
                <br />
                What would you like to talk about?
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`text-sm font-mono ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 border-2 border-black ${
                    message.role === 'user'
                      ? 'bg-mac-beige'
                      : 'bg-white'
                  }`}
                >
                  <div className="font-bold text-xs mb-1">
                    {message.role === 'user' ? '👤 You' : '💻 Happy Mac'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left text-sm font-mono">
                <div className="inline-block px-3 py-2 border-2 border-black bg-white">
                  <div className="font-bold text-xs mb-1">💻 Happy Mac</div>
                  <div className="flex gap-1">
                    <span className="cursor-blink">▮</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-2 border-t-2 border-black bg-mac-beige">
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              onClick={handleMicClick}
              disabled={isLoading}
              className={`bg-white border-2 border-black hover:bg-mac-beige font-bold text-sm pixel-corners ${
                isListening ? 'bg-red-100' : ''
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              onClick={onToggleVoice}
              className={`bg-white border-2 border-black hover:bg-mac-beige font-bold text-sm pixel-corners ${
                voiceEnabled ? '' : 'opacity-50'
              }`}
              title={voiceEnabled ? 'Voice output enabled' : 'Voice output disabled'}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your message..."}
              disabled={isLoading || isListening}
              className="flex-1 bg-white border-2 border-black font-mono text-sm pixel-corners focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-white text-black border-2 border-black hover:bg-mac-beige font-bold text-sm pixel-corners"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
