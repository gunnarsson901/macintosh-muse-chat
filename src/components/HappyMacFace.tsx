import { useEffect, useState } from 'react';
import happyMacIcon from '@/assets/happy-mac-icon.png';

interface HappyMacFaceProps {
  isThinking?: boolean;
  isTalking?: boolean;
}

const HappyMacFace = ({ isThinking = false, isTalking = false }: HappyMacFaceProps) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    // Random blinking effect
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Main Happy Mac Face */}
        <div className={`transition-transform duration-200 ${isTalking ? 'scale-105' : 'scale-100'}`}>
          <img 
            src={happyMacIcon} 
            alt="Happy Mac" 
            className="w-48 h-48 object-contain pixel-corners"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Thinking dots animation */}
        {isThinking && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}

        {/* Blink overlay */}
        {blink && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 flex items-center justify-center">
              <div className="flex gap-16 mt-4">
                <div className="w-8 h-2 bg-black"></div>
                <div className="w-8 h-2 bg-black"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HappyMacFace;
