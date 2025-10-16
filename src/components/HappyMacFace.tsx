import { useEffect } from 'react';

interface HappyMacFaceProps {
  isThinking?: boolean;
  isTalking?: boolean;
}

const HappyMacFace = ({ isThinking = false, isTalking = false }: HappyMacFaceProps) => {
  useEffect(() => {
    // Auto-rotate the model based on talking state
    const iframe = document.querySelector('iframe[title="Voxel Macintosh"]') as HTMLIFrameElement;
    if (iframe && isTalking) {
      // Could add interaction with Sketchfab API here if needed
    }
  }, [isTalking]);

  return (
    <div className="relative inline-block w-full max-w-[600px]">
      <div className={`transition-transform duration-200 ${isTalking ? 'scale-105' : 'scale-100'}`}>
        <iframe 
          title="Voxel Macintosh" 
          className="w-full aspect-square rounded-lg"
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          src="https://sketchfab.com/models/620bb90715f049b18441938549fcdf4f/embed?autostart=1&preload=1&ui_theme=dark&dnt=1"
        />
      </div>
      {isThinking && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-6 h-6 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  );
};

export default HappyMacFace;
