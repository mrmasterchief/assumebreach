import { ReactNode } from 'react';

export default function ContentContainer({ children, styles }: { children: ReactNode, styles?: string }) {
  return (
    <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        <div className={`flex align-center mx-auto flex-col justify-center mt-10 w-full ${styles}`}>
      {children}
    </div>
    </div>
  );
}
