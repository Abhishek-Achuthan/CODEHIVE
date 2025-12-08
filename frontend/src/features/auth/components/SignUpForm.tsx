import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '../validations/authValidation';
import { useOTP } from '../hooks/useOTP';
import { OTPModal } from '../../../shared/ui/dialog/OTPModal';
import { OAuthButtons } from './OAuthButtons';
import type { RegisterData } from '../../../shared/types/api/auth';
import type { SignUpFormProps } from '../types';
import { FormField } from './FormField';
import { Link } from 'react-router-dom';
import { AuthService } from '../../../services/authService';
import toast from 'react-hot-toast';
import { BaseError } from '../../../shared/errors/BaseError';

export function SignUpForm({
  fields = [],
  sendOTP,
  loginUrl = '/',
  className,
}: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<RegisterData>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const {
    otpModalOpen,
    setOtpModalOpen, 
    handleSubmit: handleOtpSubmit,
    handleVerifyOtp,
  } = useOTP<RegisterData>(
    async (data) => {
      try {
        if (!data.email) throw new Error('Email is required');
        if(!sendOTP) {
          throw new Error('Send OTP function is not available');
        }
        const res = await sendOTP({ email: data.email });
        toast.success(res.data.message);
        
      } catch (error) {
        if(error instanceof BaseError) {
          if(error.status===409) {
           toast.error(error.message);
           throw error
          }
        }
      }
    },
    async (otp, values) => {

      try {
        const res = await AuthService.register(otp, values);
        toast.success(res.message)
        if(res?.success) return true;
        return false
      } catch (error) {
        if(error instanceof BaseError) {
          toast.error(error.message);
        }
        return false
      }
    },
    'email'
  );

  const onSubmit = async (values: RegisterData) => {
    try {
      await handleOtpSubmit(values);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`w-full max-w-md ${className || ''}`}>
      <header className="mb-6">
        <h1 className="text-center text-2xl font-semibold">Sign Up Account</h1>
        <p className="mt-1 text-center text-sm text-white/70">
          Enter your personal data to create your account.
        </p>
      </header>

      <OAuthButtons />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/50">Or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.slice(0, 2).map((field) => (
            <FormField key={field.name} field={field} register={register} errors={errors} />
          ))}
        </div>

        {fields.slice(2).map((field) => (
          <FormField key={field.name} field={field} register={register} errors={errors} />
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-white/70">
          Already have an account?{' '}
          <Link to={loginUrl} className="font-medium text-white underline underline-offset-4">
            Log in
          </Link>
        </p>
      </form>

      <OTPModal
        open={otpModalOpen}
        onOpenChange={setOtpModalOpen}
        onVerify={(otp) => handleVerifyOtp(otp, getValues())}
        onResend={() => sendOTP && sendOTP({ email: getValues('email') })}
      />
    </div>
  );
}
