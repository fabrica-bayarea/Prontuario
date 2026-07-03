import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { apiClient } from '../../../libs/api-client';
import { useAuth } from '../../../contexts/AuthContext';
import AuthLayout from './AuthLayout';
import keyIcon from '../../../assets/key.svg';

interface PrimeiroAcessoFormData {
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

function PrimeiroAcesso() {
  const { tokenTemporario } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PrimeiroAcessoFormData>();
  const novaSenha = watch('novaSenha', '');
  
  const forca = calcularForcaSenha(novaSenha);

  function getBarClass(barIndex: number): string {
    if (barIndex > forca.nivel) return '';
    if (forca.nivel <= 1) return 'active-weak';
    if (forca.nivel <= 2) return 'active-medium';
    return 'active-strong';
  }

  useEffect(() => {
    if (!tokenTemporario) {
      navigate('/login', { replace: true });
    }
  }, [tokenTemporario, navigate]);

  async function onSubmit(data: PrimeiroAcessoFormData) {
    if (data.novaSenha !== data.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiClient.post(
        '/auth/primeiro-acesso', 
        { novaSenha: data.novaSenha, confirmarSenha: data.confirmarSenha },
        { headers: { Authorization: `Bearer ${tokenTemporario}` } }
      );
      
      // Sucesso! O backend retornou o token definitivo e o usuário
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      sessionStorage.removeItem('tokenTemporario');
      
      // Força um reload para o AuthContext carregar os dados novos do localStorage e entrar no painel
      window.location.href = '/';
      
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Erro ao definir nova senha. Tente novamente.';
      setError(message);
      setIsSubmitting(false);
    }
  }

  if (!tokenTemporario) {
    return null; // Evita piscar a tela enquanto redireciona
  }

  return (
    <AuthLayout>
      <div className="auth-icon-wrapper">
        <img src={keyIcon} alt="Primeiro Acesso" className="auth-icon" />
      </div>

      <h1 className="auth-title">Primeiro Acesso</h1>
      <p className="auth-subtitle">
        Para sua segurança, defina uma nova senha antes de continuar.
      </p>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="novaSenha">Nova Senha</label>
          <div className="auth-input-wrapper">
            <input
              id="novaSenha"
              type={showPassword ? 'text' : 'password'}
              className="auth-input auth-input--has-toggle"
              placeholder="Digite a nova senha"
              {...register('novaSenha', { 
                required: 'Nova senha é obrigatória',
                minLength: { value: 8, message: 'Mínimo de 8 caracteres' }
              })}
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.novaSenha && (
            <span style={{ color: '#DC2626', fontSize: '13px' }}>
              {errors.novaSenha.message}
            </span>
          )}

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
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmarSenha">Confirmar Nova Senha</label>
          <div className="auth-input-wrapper">
            <input
              id="confirmarSenha"
              type={showConfirmPassword ? 'text' : 'password'}
              className="auth-input auth-input--has-toggle"
              placeholder="Confirme a nova senha"
              {...register('confirmarSenha', { required: 'Confirmação é obrigatória' })}
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
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
          {isSubmitting ? 'Salvando...' : 'Salvar e Acessar'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default PrimeiroAcesso;
