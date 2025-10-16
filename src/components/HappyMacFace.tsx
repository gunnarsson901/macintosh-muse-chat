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
    <div className="relative inline-block">
      <img
        src={happyMacIcon}
        alt="Happy Mac"
        className={`w-[400px] h-[400px] object-contain pixel-corners transition-transform duration-200 ${
          isTalking ? 'scale-105' : 'scale-100'
        }`}
        style={{ imageRendering: 'pixelated' }}
      />
      {isThinking && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
      {blink && (
        <div className="absolute inset-0 bg-background"></div>
      )}
    </div>
  );
};

export default HappyMacFace;
