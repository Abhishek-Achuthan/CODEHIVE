import { LeftIntro } from '../components/LeftIntro';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] px-4">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        <LeftIntro />
        <div className="flex flex-col items-center justify-center">
          <ResetPasswordForm />
        </div>
      </div>
    </main>
  );
}
