import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col bg-white flex-grow pb-4">
      {children}
    </div>
  );
}
