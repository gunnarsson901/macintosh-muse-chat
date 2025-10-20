import { ReactNode } from 'react';

interface MacScreenProps {
  children: ReactNode;
}

const MacScreen = ({ children }: MacScreenProps) => {
  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto bg-primary overflow-hidden border-4 border-primary p-2 md:p-4">
      {children}
    </div>
  );
};

export default MacScreen;
