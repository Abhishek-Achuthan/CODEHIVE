import type { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 md:px-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
