import { ReactNode } from 'react';

interface MacScreenProps {
  children: ReactNode;
}

const MacScreen = ({ children }: MacScreenProps) => {
  return (
    <div className="min-h-screen w-full bg-background">
      {children}
    </div>
  );
};

export default MacScreen;
