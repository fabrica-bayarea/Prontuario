import React from 'react';
import './PacientesModal.css';
import { X } from 'lucide-react';

interface PacienteDetalhesProps {
  paciente: any;
  onClose: () => void;
}

export default function PacientesModal({ paciente, onClose }: PacienteDetalhesProps) {
  if (!paciente) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Detalhes do Acolhimento</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="detail-group">
            <h3>Dados Pessoais</h3>
            <p><strong>Nome:</strong> {paciente.nome}</p>
            <p><strong>CPF:</strong> {paciente.cpf}</p>
            <p><strong>Email:</strong> {paciente.email}</p>
            <p><strong>Data de Nascimento:</strong> {paciente.dataNascimento}</p>
            <p><strong>Telefone:</strong> {paciente.telefone}</p>
            <p><strong>Gênero:</strong> {paciente.genero}</p>
            <p><strong>Cor/Raça:</strong> {paciente.corRaca}</p>
            <p><strong>Estado Civil:</strong> {paciente.estadoCivil}</p>
          </div>
          
          <div className="detail-group">
            <h3>Endereço</h3>
            <p><strong>CEP:</strong> {paciente.cep}</p>
            <p><strong>Logradouro:</strong> {paciente.logradouro}</p>
            <p><strong>Bairro:</strong> {paciente.bairro}</p>
            <p><strong>Cidade:</strong> {paciente.cidade} - {paciente.estado}</p>
            <p><strong>Complemento:</strong> {paciente.complemento}</p>
          </div>

          <div className="detail-group">
            <h3>Triagem / Atendimento</h3>
            <p><strong>Clínica:</strong> {paciente.clinicaAtendimento}</p>
            <p><strong>Área:</strong> {paciente.areaAtendimento}</p>
            <p><strong>Classificação:</strong> {paciente.classAtendimento}</p>
            <p><strong>Atendimento Para:</strong> {paciente.atendimentoParaQuem}</p>
          </div>

          <div className="detail-group">
            <h3>Socioeconômico</h3>
            <p><strong>Renda Familiar:</strong> {paciente.rendaFamiliar}</p>
            <p><strong>Origem Renda:</strong> {paciente.origemRenda}</p>
            <p><strong>Moradia:</strong> {paciente.suaCasaE}</p>
            <p><strong>Pessoas por casa:</strong> {paciente.pessoasPorCasa}</p>
            <p><strong>Benefício Social:</strong> {paciente.beneficioSocial}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-fechar" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
