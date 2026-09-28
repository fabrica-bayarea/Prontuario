import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiClient } from '../../../libs/api-client';
import AuthLayout from './AuthLayout';
import keyIcon from '../../../assets/key.svg';
import greenCheckIcon from '../../../assets/green_check.svg';

interface RecuperarFormData {
  identificador: string;
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
      // `email` é compatibilidade com a API atual, que ainda busca só por e-mail;
      // o BE-07 passa a ler `identificador` (matrícula ou e-mail). Remover `email` depois dele.
      await apiClient.post('/auth/recuperar-senha', {
        identificador: data.identificador,
        email: data.identificador,
      });
      setEnviado(true);
    } catch (err: any) {
      const message =
        err.response?.data?.error?.message || 'Erro ao enviar e-mail. Tente novamente.';
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
          Se o identificador informado estiver cadastrado, você receberá um link no e-mail da conta em instantes. Verifique também a caixa de spam.
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
        Informe sua matrícula ou e-mail institucional. O link de redefinição vai para o e-mail cadastrado na sua conta.
      </p>

      {error && <div className="auth-error" role="alert" aria-live="assertive">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="identificador">
            Matrícula ou e-mail
          </label>
          <div className="auth-input-wrapper">
            <input
              id="identificador"
              type="text"
              className="auth-input"
              placeholder="Sua matrícula ou e-mail institucional"
              autoComplete="username"
              {...register('identificador', { required: 'Informe sua matrícula ou e-mail' })}
            />
          </div>
          {errors.identificador && (
            <span style={{ color: '#DC2626', fontSize: '13px' }}>
              {errors.identificador.message}
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
