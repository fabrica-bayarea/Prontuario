import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { apiClient } from '../../../libs/api-client';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface CriarUsuarioForm {
  nome: string;
  matricula: string;
  email: string;
  perfil: string;
}

function ModalCriarUsuario({ onClose, onSuccess }: ModalProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CriarUsuarioForm>();

  const onSubmit = async (data: CriarUsuarioForm) => {
    setError('');
    setIsSubmitting(true);
    try {
      await apiClient.post('/usuarios', data);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao criar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h2>Novo Usuário</h2>
        <p className="modal-subtitle">As credenciais iniciais serão enviadas para o e-mail informado.</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-group">
            <label>Nome Completo</label>
            <input 
              type="text" 
              {...register('nome', { required: 'Nome é obrigatório' })} 
              placeholder="Ex: João da Silva"
            />
            {errors.nome && <span className="error-text">{errors.nome.message}</span>}
          </div>

          <div className="form-group">
            <label>Matrícula / Identificador</label>
            <input 
              type="text" 
              {...register('matricula', { required: 'Matrícula é obrigatória' })} 
              placeholder="Ex: 1234567"
            />
            {errors.matricula && <span className="error-text">{errors.matricula.message}</span>}
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" 
              {...register('email', { 
                required: 'E-mail é obrigatório',
                pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' }
              })} 
              placeholder="email@iesb.edu.br"
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Perfil de Acesso</label>
            <select {...register('perfil', { required: 'Selecione um perfil' })}>
              <option value="">Selecione...</option>
              <option value="COO">Coordenador (COO)</option>
              <option value="PRO">Professor (PRO)</option>
              <option value="ATE">Estagiário/Atendimento (ATE)</option>
            </select>
            {errors.perfil && <span className="error-text">{errors.perfil.message}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Criar e Enviar E-mail'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCriarUsuario;
