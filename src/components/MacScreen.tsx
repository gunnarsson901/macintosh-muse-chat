import { ReactNode } from 'react';

interface MacScreenProps {
  children: ReactNode;
}

const MacScreen = ({ children }: MacScreenProps) => {
  return (
    <div className="h-[600px] w-[800px] mx-auto bg-primary overflow-hidden border-4 border-primary">
      {children}
    </div>
  );
};

export default MacScreen;
