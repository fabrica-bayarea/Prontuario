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
  const [bloqueado, setBloqueado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginFormData>({ mode: 'onChange' });
  const matricula = watch('matricula');
  const senha = watch('senha');
  // EP-01 US-01 RI-4: botão só habilita com os dois campos preenchidos.
  const camposPreenchidos = Boolean(matricula?.trim()) && Boolean(senha);

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
      const status = err.response?.status;
      // EP-01 US-01 RV-5: bloqueio (conta, IP ou limite de requisições) tem aviso próprio, distinto de credencial.
      if (status === 429) {
        setBloqueado(true);
        setError('Acesso bloqueado temporariamente por excesso de tentativas. Aguarde 15 minutos e tente novamente.');
      } else {
        setBloqueado(false);
        setError(err.response?.data?.error?.message || 'Não foi possível entrar. Tente novamente.');
      }
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

      {error && (
        <div className={bloqueado ? 'auth-error auth-error--bloqueio' : 'auth-error'} role="alert" aria-live="assertive">
          {error}
        </div>
      )}

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
              aria-pressed={showPassword}
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

        <button type="submit" className="auth-btn" disabled={isSubmitting || !camposPreenchidos}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
