import { ReactNode } from 'react';

interface MacScreenProps {
  children: ReactNode;
}

const MacScreen = ({ children }: MacScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Macintosh Computer Case */}
      <div className="relative flex flex-col items-center">
        {/* Screen Bezel */}
        <div className="bg-mac-beige-dark p-6 rounded-lg mac-shadow">
          <div className="bg-mac-beige p-4 rounded">
            {/* CRT Screen */}
            <div className="crt-screen w-[512px] h-[384px] p-6 scanlines relative overflow-hidden">
              <div className="relative z-20 h-full">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Apple Logo */}
        <div className="mt-4 text-4xl">🍎</div>
        
        {/* Base */}
        <div className="w-64 h-12 bg-mac-beige-darker rounded-b-lg mt-2 mac-inset"></div>
        <div className="w-48 h-4 bg-mac-shadow rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default MacScreen;
