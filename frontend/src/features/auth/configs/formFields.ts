import type { RegisterData } from '../../../shared/types/authTypes';
import type { FieldComponentProps } from '../../../shared/types/authTypes';
import { PasswordInput } from '../components/PasswordInput';

export const signUpFields: Array<{
  name: keyof RegisterData;
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  component?: React.ComponentType<FieldComponentProps>;
}> = [
  { 
    name: 'firstName', 
    label: 'First Name', 
    placeholder: 'Abhishek',
    type: 'text'
  },
  { 
    name: 'lastName', 
    label: 'Last Name', 
    placeholder: 'Abhi',
    type: 'text'
  },
  { 
    name: 'email', 
    label: 'Email', 
    placeholder: 'eg: abhishek@example.com',
    type: 'text'
  },
  { 
    name: 'phone', 
    label: 'Phone', 
    placeholder: 'eg: 8921412046',
    type: 'tel'
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'eg: Abhishek@123',
    type: 'password',
    component: PasswordInput,
  },
];
