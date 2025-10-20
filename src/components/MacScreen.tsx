import { ReactNode } from 'react';

interface MacScreenProps {
  children: ReactNode;
}

const MacScreen = ({ children }: MacScreenProps) => {
  return (
    <div className="h-[342px] w-[512px] mx-auto bg-background overflow-hidden">
      {children}
    </div>
  );
};

export default MacScreen;
