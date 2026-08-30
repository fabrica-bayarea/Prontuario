import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from './AuthLayout';
import lockIcon from '../../../assets/lock.svg';
import { apiClient } from '../../../libs/api-client';

interface RedefinirFormData {
  novaSenha: string;
  confirmarSenha: string;
}

function calcularForcaSenha(senha: string): { nivel: number; label: string } {
  if (!senha) return { nivel: 0, label: '' };

  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
  if (/\d/.test(senha)) pontos++;
  if (/[^a-zA-Z0-9]/.test(senha)) pontos++;

  if (pontos <= 1) return { nivel: 1, label: 'Fraca' };
  if (pontos <= 2) return { nivel: 2, label: 'Média' };
  if (pontos <= 3) return { nivel: 3, label: 'Forte' };
  return { nivel: 4, label: 'Forte' };
}

function RedefinirSenha() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RedefinirFormData>();

  const novaSenha = watch('novaSenha', '');
  const forca = useMemo(() => calcularForcaSenha(novaSenha), [novaSenha]);

  function getBarClass(barIndex: number): string {
    if (barIndex > forca.nivel) return '';
    if (forca.nivel <= 1) return 'active-weak';
    if (forca.nivel <= 2) return 'active-medium';
    return 'active-strong';
  }

  async function onSubmit(data: RedefinirFormData) {
    setError('');
    setIsSubmitting(true);

    try {
      // Simulado: pega token da URL query string
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      
      if (!token) {
        setError('Link de recuperação inválido. Solicite um novo link.');
        setIsSubmitting(false);
        return;
      }

      await apiClient.post('/auth/redefinir-senha', { 
        token, 
        novaSenha: data.novaSenha, 
        confirmarSenha: data.confirmarSenha 
      });

      setSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Erro ao redefinir senha. Tente novamente.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="auth-icon">
          <img src={lockIcon} alt="Senha redefinida" />
        </div>
        <h1 className="auth-title">Senha redefinida!</h1>
        <p className="auth-subtitle">
          Sua senha foi alterada com sucesso. Faça login com a nova senha.
        </p>
        <Link
          to="/login"
          className="auth-btn"
          style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
        >
          Voltar para o Login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth-icon">
        <img src={lockIcon} alt="Redefinir senha" />
      </div>

      <h1 className="auth-title">Defina sua nova senha</h1>
      <p className="auth-subtitle">Crie uma senha forte e segura</p>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="novaSenha">
            Nova Senha
          </label>
          <div className="auth-input-wrapper">
            <input
              id="novaSenha"
              type={showPassword ? 'text' : 'password'}
              className="auth-input auth-input--has-toggle"
              placeholder="Digite sua nova senha"
              autoComplete="new-password"
              {...register('novaSenha', {
                required: 'Nova senha é obrigatória',
                minLength: {
                  value: 8,
                  message: 'A senha deve ter pelo menos 8 caracteres',
                },
              })}
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
          {errors.novaSenha && (
            <span style={{ color: '#DC2626', fontSize: '13px' }}>
              {errors.novaSenha.message}
            </span>
          )}
        </div>

        {/* Indicador de força da senha */}
        {novaSenha && (
          <div className="password-strength">
            <div className="password-strength-bars">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`password-strength-bar ${getBarClass(i)}`}
                />
              ))}
            </div>
            <span
              className={`password-strength-label ${
                forca.nivel <= 1
                  ? 'weak'
                  : forca.nivel <= 2
                    ? 'medium'
                    : 'strong'
              }`}
            >
              {forca.label}
            </span>
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmarSenha">
            Confirmar Nova Senha
          </label>
          <div className="auth-input-wrapper">
            <input
              id="confirmarSenha"
              type={showConfirmPassword ? 'text' : 'password'}
              className="auth-input auth-input--has-toggle"
              placeholder="Confirme sua nova senha"
              autoComplete="new-password"
              {...register('confirmarSenha', {
                required: 'Confirmação de senha é obrigatória',
                validate: (value) =>
                  value === novaSenha || 'As senhas não coincidem',
              })}
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmarSenha && (
            <span style={{ color: '#DC2626', fontSize: '13px' }}>
              {errors.confirmarSenha.message}
            </span>
          )}
        </div>

        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>

        <Link to="/login" className="auth-back-link">
          Voltar para o login
        </Link>
      </form>
    </AuthLayout>
  );
}

export default RedefinirSenha;
