import AuthLayout from '../../../layouts/AuthLayout';
import { LeftIntro } from '../components/LeftIntro';
import { SignUpForm } from '../components/SignUpForm';
import { signUpFields } from '../configs/formFields';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
        <LeftIntro />
        <section aria-label="Sign up form" className="mx-auto w-full max-w-md md:max-w-none">
          <SignUpForm 
            fields={signUpFields}
            loginUrl='/'
          />
        </section>
      </div>
    </AuthLayout>     
  );
}

