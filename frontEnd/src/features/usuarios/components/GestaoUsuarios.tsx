import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { apiClient } from '../../../libs/api-client';
import ModalCriarUsuario from './ModalCriarUsuario';
import './Usuarios.css';
import { UserCheck, UserX, Plus, Mail } from 'lucide-react';

interface Usuario {
  id: number;
  matricula: string;
  email: string;
  nome: string;
  perfil: string;
  ativo: boolean;
  primeiro_acesso: boolean;
}

function GestaoUsuarios() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/usuarios');
      setUsuarios(res.usuarios);
    } catch (err: any) {
      setError('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario?.perfil === 'ADM') {
      fetchUsuarios();
    }
  }, [usuario]);

  const toggleStatus = async (id: number, ativoAtualmente: boolean) => {
    try {
      await apiClient.patch(`/usuarios/${id}/status`, { ativo: !ativoAtualmente });
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, ativo: !ativoAtualmente } : u));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao alterar status.');
    }
  };

  const reenviarEmail = async (id: number) => {
    try {
      if (!window.confirm('Isto irá gerar uma nova senha e enviar para o e-mail do usuário. Confirmar?')) return;
      await apiClient.post(`/usuarios/${id}/reenviar-boas-vindas`);
      alert('E-mail reenviado com sucesso com uma nova senha!');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Erro ao reenviar e-mail.');
    }
  };

  if (usuario?.perfil !== 'ADM') {
    return <div className="usuarios-container">Acesso Negado</div>;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestão de Usuários</h1>
          <p className="page-subtitle">Gerencie os acessos e permissões do sistema.</p>
        </div>
        <button className="btn-novo-acolhimento" onClick={() => setShowModal(true)}>
          <Plus size={18} className="icon-plus" /> Novo Usuário
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="panel-container">
        <table className="pacientes-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum usuário encontrado.</td>
              </tr>
            ) : (
              usuarios.map(u => (
                <tr key={u.id} className={!u.ativo ? 'inativo' : ''}>
                  <td>
                    {u.nome}
                    {u.primeiro_acesso && <span className="badge badge-warning">Pendente</span>}
                  </td>
                  <td>{u.matricula}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="badge badge-primary">{u.perfil}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.ativo ? 'badge-success' : 'badge-danger'}`}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {u.primeiro_acesso && (
                        <button 
                          className="action-btn"
                          style={{ color: '#3b82f6' }}
                          onClick={() => reenviarEmail(u.id)}
                          title="Reenviar E-mail (Gera nova senha)"
                        >
                          <Mail size={18} />
                        </button>
                      )}
                      {u.id !== usuario.id && (
                        <button 
                          className={`action-btn ${u.ativo ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleStatus(u.id, u.ativo)}
                          title={u.ativo ? 'Desativar Usuário' : 'Ativar Usuário'}
                        >
                          {u.ativo ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ModalCriarUsuario 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchUsuarios();
          }}
        />
      )}
    </div>
  );
}

export default GestaoUsuarios;
