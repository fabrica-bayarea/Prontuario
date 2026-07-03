import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from 'react-hook-form';
import { FormularioData } from '../schema';
import { ErrorMessage } from './ErrorMessage';

import psicologiaIcon from '../assets/psicologia.svg';
import nutricaoIcon from '../assets/nutricao.svg';
import odontologiaIcon from '../assets/odonto.svg';
import saudeIcon from '../assets/saude.svg';
import nafIcon from '../assets/naf.svg';
import direitoIcon from '../assets/direito.svg';
import pedagogiaIcon from '../assets/pedagogia.svg';
import socialIcon from '../assets/social.svg';
import includigitalIcon from '../assets/includigital.svg';

interface EtapaProps {
  register: UseFormRegister<FormularioData>;
  errors: FieldErrors<FormularioData>;
  watch: UseFormWatch<FormularioData>;
  setValue: UseFormSetValue<FormularioData>;
  control: Control<FormularioData>;
  proximaEtapa?: () => void;
  anteriorEtapa?: () => void;
  isPending?: boolean;
}

function Etapa4({ register, errors, watch, setValue, anteriorEtapa}: EtapaProps) {
  const servicoIESBVal = watch('servicoIESB');
  const servicoIESB = Array.isArray(servicoIESBVal) ? servicoIESBVal : [];

  const antesIESBVal = watch('antesIESB');
  const antesIESB = Array.isArray(antesIESBVal) ? antesIESBVal : [];

  const getErrorMessage = (error: any) => {
    if (!error) return undefined;
    if (typeof error === 'string') return error;
    if (typeof error.message === 'string') return error.message;
    if (Array.isArray(error) && error.length > 0 && typeof error[0]?.message === 'string') return error[0].message;
    return undefined;
  };

  const handleCheckboxArray = (e: React.ChangeEvent<HTMLInputElement>, campo: keyof FormularioData, valoresAtuais: string[]) => {
    const { value, checked } = e.target;
    if (checked) {
      setValue(campo, [...valoresAtuais, value] as any, { shouldValidate: true });
    } else {
      setValue(
        campo,
        valoresAtuais.filter((v) => v !== value) as any,
        { shouldValidate: true }
      );
    }
  };

  const servicosData = [
    { id: 'servico_direito', label: 'Direito', icon: direitoIcon },
    { id: 'servico_nutricao', label: 'Nutrição', icon: nutricaoIcon },
    { id: 'servico_psicologia', label: 'Psicologia', icon: psicologiaIcon },
    { id: 'servico_odontologia', label: 'Clínica Escola de Odontologia', icon: odontologiaIcon },
    { id: 'servico_saude', label: 'Clínica Escola Saúde: Enfermagem, Farmácia e Biomedicina', icon: saudeIcon },
    { id: 'servico_pedagogia', label: 'Pedagogia Projeto Letrar Cidadania', icon: pedagogiaIcon },
    { id: 'servico_social', label: 'Serviço Social', icon: socialIcon },
    { id: 'servico_sistemas', label: 'Análise de Desen. de Sistemas/Curso de Inclusão Digital', icon: includigitalIcon },
    { id: 'servico_naf', label: 'NAF - Núcleo de Apoio Fiscal', icon: nafIcon },
  ];

  return (
    <div className="flex-col-container">
      
      <div className="formulario-header w-full">
        <h1>Qual serviço do IESB você está buscando?</h1>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>Você pode selecionar mais de um.</p>
      </div>

      <div className="w-full">
        <div className={`servicos-grid ${errors.servicoIESB ? 'input-error' : ''}`} style={{ borderRadius: '12px' }}>
          {servicosData.map(({ id, label, icon }) => (
            <label key={id} className={`servico-card ${servicoIESB.includes(id) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                value={id}
                className="hidden-checkbox"
                checked={servicoIESB.includes(id)}
                onChange={(e) => handleCheckboxArray(e, 'servicoIESB', servicoIESB)}
              />
              <img src={icon} alt={label} className="servico-icon" />
              <span className="servico-label">{label}</span>
            </label>
          ))}
        </div>
        <ErrorMessage message={getErrorMessage(errors.servicoIESB)} />
      </div>

      <div className="w-full">
        <fieldset className={errors.antesIESB ? 'input-error' : ''}>
          <legend>
            Antes de procurar o IESB, você buscou atendimento em outro local?{' '}
            <span className="required">*</span>
          </legend>
          <div className="checkbox-group">
            {[
              { id: 'antes_nao', label: 'Não busquei' },
              { id: 'antes_caps', label: 'CAPS' },
              { id: 'antes_hospital', label: 'Hospital Público / Posto de Saúde' },
              { id: 'antes_particular', label: 'Clínica Particular' },
              { id: 'antes_ong', label: 'ONG / Projetos Sociais' },
              { id: 'antes_outro', label: 'Outro' },
            ].map(({ id, label }) => (
              <div key={id} className="checkbox-option">
                <input
                  type="checkbox"
                  id={id}
                  value={id}
                  checked={antesIESB.includes(id)}
                  onChange={(e) => handleCheckboxArray(e, 'antesIESB', antesIESB)}
                />
                <label htmlFor={id} style={{ marginBottom: 0 }}>
                  {label}
                </label>
              </div>
            ))}
          </div>
          <ErrorMessage message={getErrorMessage(errors.antesIESB)} />
        </fieldset>
      </div>

      <div className="w-full">
        <fieldset className={errors.encaminhamentoMedico ? 'input-error' : ''}>
          <legend>
            Você possui encaminhamento médico ou de outro profissional?{' '}
            <span className="required">*</span>
          </legend>
          <div className="radio-group flex-row" style={{ gap: '20px', justifyContent: 'flex-start' }}>
            <label className="radio-option">
              <input type="radio" value="Sim" {...register('encaminhamentoMedico')} />
              Sim
            </label>
            <label className="radio-option">
              <input type="radio" value="Não" {...register('encaminhamentoMedico')} />
              Não
            </label>
          </div>
          <ErrorMessage message={getErrorMessage(errors.encaminhamentoMedico)} />
        </fieldset>
      </div>

      <div className="w-full button-group flex-row">
        <button type="button" onClick={anteriorEtapa}>
          Voltar
        </button>
        <button type="submit">
          Enviar Formulário
        </button>
      </div>
    </div>
  );
}

export default Etapa4;