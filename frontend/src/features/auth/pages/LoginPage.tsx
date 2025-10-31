import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../../layouts/AuthLayout';
import { LoginLeftIntro } from '../components/LoginLeftIntro';
import { LoginForm } from '../components/LoginForm';
import { userLogin } from '../../../api/endpoints/authAPI';
import type { LoginData } from '../../../shared/types/authTypes';
import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/authSlice';


interface ErrorResponse {
    message:string
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data: LoginData) => {
    try {
      const response = await userLogin(data);

      const {user, accessToken} = response.data;
      
      dispatch(loginSuccess({user,accessToken}));
      
      if (response.status === 200) {
        toast.success('Login successful!');
        navigate('/home');
      }
    } catch (error: unknown) {

      if(error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;
        toast.error(axiosError.response?.data?.message||'Login failed');
      
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Login failed');
      }

      throw error;
    }
  };

  return (
    <AuthLayout>
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2">
        <LoginLeftIntro />
        <section aria-label="Login form" className="mx-auto w-full max-w-md md:max-w-none">
          <LoginForm
            onSubmit={handleLogin}
            registerUrl="/register"
            forgotPasswordUrl="/forgot-password"
          />
        </section>
      </div>
    </AuthLayout>
  );
}
