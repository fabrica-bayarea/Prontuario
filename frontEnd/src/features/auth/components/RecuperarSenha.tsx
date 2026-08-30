import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiClient } from '../../../libs/api-client';
import AuthLayout from './AuthLayout';
import keyIcon from '../../../assets/key.svg';
import greenCheckIcon from '../../../assets/green_check.svg';

interface RecuperarFormData {
  email: string;
}

function RecuperarSenha() {
  const [enviado, setEnviado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RecuperarFormData>();

  async function onSubmit(data: RecuperarFormData) {
    setError('');
    setIsSubmitting(true);

    try {
      await apiClient.post('/auth/recuperar-senha', { email: data.email });
      setEnviado(true);
    } catch (err: any) {
      const message =
        err.response?.data?.error || 'Erro ao enviar e-mail. Tente novamente.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Estado 2: Confirmação de e-mail enviado
  if (enviado) {
    return (
      <AuthLayout>
        <div className="auth-icon auth-icon--large">
          <img src={greenCheckIcon} alt="E-mail enviado" />
        </div>

        <h1 className="auth-title">E-mail enviado!</h1>

        <p className="auth-confirmation-text">
          Se o e-mail informado estiver cadastrado, você receberá um link em
          instantes. Verifique também sua caixa de spam.
        </p>

        <div className="auth-actions">
          <Link to="/login" className="auth-btn">
            Voltar para o Login
          </Link>

          <button
            type="button"
            className="auth-btn auth-btn--warning"
            onClick={() => setEnviado(false)}
          >
            💡 Não recebeu? Verifique sua pasta de spam ou lixo eletrônico
          </button>
        </div>
      </AuthLayout>
    );
  }

  // Estado 1: Formulário
  return (
    <AuthLayout>
      <div className="auth-icon">
        <img src={keyIcon} alt="Recuperar senha" />
      </div>

      <h1 className="auth-title">Recuperar Senha</h1>
      <p className="auth-subtitle">
        Informe seu e-mail institucional para receber um link de redefinição.
      </p>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            E-mail institucional
          </label>
          <div className="auth-input-wrapper">
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="exemplo@iesb.edu.br"
              autoComplete="email"
              {...register('email', {
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'E-mail inválido',
                },
              })}
            />
          </div>
          {errors.email && (
            <span style={{ color: '#DC2626', fontSize: '13px' }}>
              {errors.email.message}
            </span>
          )}
        </div>

        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar link'}
        </button>

        <Link to="/login" className="auth-back-link">
          Voltar para o login
        </Link>
      </form>
    </AuthLayout>
  );
}

export default RecuperarSenha;
