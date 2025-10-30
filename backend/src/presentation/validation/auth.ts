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
  email:z.string('Invalid email address'),
  password: z.string().min(6,'Invalid password')
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;