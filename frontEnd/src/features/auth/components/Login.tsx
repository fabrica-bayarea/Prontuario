import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import AuthLayout from './AuthLayout';
import iesbIcon from '../../../assets/iesbemacao_icon.svg';

interface LoginFormData {
  matricula: string;
  senha: string;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    setError('');
    setIsSubmitting(true);

    try {
      const resultado = await login(data.matricula, data.senha);
      if (resultado.primeiroAcesso) {
        navigate('/primeiro-acesso', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message || 'Erro ao fazer login. Tente novamente.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-brand">
        <img src={iesbIcon} alt="IESB em Ação" />
        <span>IESB em Ação</span>
      </div>

      <h1 className="auth-title auth-title--left">Bem-vindo(a)!</h1>
      <p className="auth-subtitle auth-subtitle--left">
        Acesse o sistema com suas credenciais institucionais
      </p>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="matricula">
            Matrícula ou E-mail
          </label>
          <div className="auth-input-wrapper">
            <input
              id="matricula"
              type="text"
              className="auth-input"
              placeholder="Sua matrícula ou e-mail"
              autoComplete="username"
              {...register('matricula', { required: 'Matrícula é obrigatória' })}
            />
          </div>
          {errors.matricula && (
            <span style={{ color: '#DC2626', fontSize: '13px' }}>
              {errors.matricula.message}
            </span>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="senha">
            Senha
          </label>
          <div className="auth-input-wrapper">
            <input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              className="auth-input auth-input--has-toggle"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              {...register('senha', { required: 'Senha é obrigatória' })}
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.senha && (
            <span style={{ color: '#DC2626', fontSize: '13px' }}>
              {errors.senha.message}
            </span>
          )}
        </div>

        <Link to="/recuperar-senha" className="auth-forgot-link">
          Esqueceu sua senha?
        </Link>

        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
