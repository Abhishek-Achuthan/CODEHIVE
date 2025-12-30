import z, { email } from 'zod';

export const RegisterUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string('Phone number is required'),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;


export const LoginUserSchema = z.object({
  email:z.email('Invalid email address'),
  password: z.string().min(6,'Invalid password')
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;

export const EmailOnlySchema = z.object({
  email: email('Invalid email address'),
});

export type EmailOnlyInput = z.infer<typeof EmailOnlySchema>;

export const ForgotPasswordVerifySchema = z.object({
  otp: z.string().min(1, 'OTP is required'),
  email: email('Invalid email address'),
});

export type ForgotPasswordVerifyInput = z.infer<typeof ForgotPasswordVerifySchema>;

export const ResetPasswordSchema = z.object({
  email: email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z.object({
  previousPass: z.string().min(6,'Invalid password'),
  newPass: z.string().min(6,'Invalid password'),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

