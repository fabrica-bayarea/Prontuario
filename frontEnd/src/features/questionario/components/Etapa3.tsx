import React from 'react';

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormularioData } from '../schema';

interface EtapaProps {
  register: UseFormRegister<FormularioData>;
  errors: FieldErrors<FormularioData>;
  watch: UseFormWatch<FormularioData>;
  setValue: UseFormSetValue<FormularioData>;
  proximaEtapa?: () => void;
  anteriorEtapa?: () => void;
  isPending?: boolean;
}

function Etapa3({ register, errors, watch, setValue, anteriorEtapa }: EtapaProps) {
  const comoSoubeIESB = watch('comoSoubeIESB') || [];
  const servicoIESB = watch('servicoIESB') || [];
  const antesIESB = watch('antesIESB') || [];

  const handleCheckboxArray = (e, campo, valoresAtuais) => {
    const { value, checked } = e.target;
    if (checked) {
      setValue(campo, [...valoresAtuais, value], { shouldValidate: true });
    } else {
      setValue(
        campo,
        valoresAtuais.filter((v) => v !== value),
        { shouldValidate: true }
      );
    }
  };

  return (
    <div className="form-grid">
      <div className="col-12">
        <fieldset>
          <legend>
            Qual serviço do IESB você está buscando? <span className="required">*</span>
          </legend>
          <div className="checkbox-group">
            {[
              { id: 'servico_psicologia', label: 'Psicologia' },
              { id: 'servico_nutricao', label: 'Nutrição' },
              { id: 'servico_odontologia', label: 'Odontologia' },
              { id: 'servico_enfermagem', label: 'Enfermagem' },
              { id: 'servico_juridico', label: 'Núcleo de Práticas Jurídicas (NPJ)' },
              { id: 'servico_contabilidade', label: 'Núcleo de Apoio Contábil e Fiscal (NAF)' },
            ].map(({ id, label }) => (
              <div key={id} className="checkbox-option">
                <input
                  type="checkbox"
                  id={id}
                  value={id}
                  checked={servicoIESB.includes(id)}
                  onChange={(e) => handleCheckboxArray(e, 'servicoIESB', servicoIESB)}
                />
                <label htmlFor={id} style={{ marginBottom: 0 }}>
                  {label}
                </label>
              </div>
            ))}
          </div>
          {errors.servicoIESB && (
            <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.servicoIESB.message}</span>
          )}
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
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
          {errors.antesIESB && (
            <span style={{ color: 'red', fontSize: '0.8em' }}>{errors.antesIESB.message}</span>
          )}
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
          <legend>
            Você possui encaminhamento médico ou de outro profissional?{' '}
            <span className="required">*</span>
          </legend>
          <div className="radio-group" style={{ flexDirection: 'row', gap: '20px' }}>
            <label className="radio-option">
              <input type="radio" value="Sim" {...register('encaminhamentoMedico')} />
              Sim
            </label>
            <label className="radio-option">
              <input type="radio" value="Não" {...register('encaminhamentoMedico')} />
              Não
            </label>
          </div>
          {errors.encaminhamentoMedico && (
            <span style={{ color: 'red', fontSize: '0.8em' }}>
              {errors.encaminhamentoMedico.message}
            </span>
          )}
        </fieldset>
      </div>

      <div className="col-12 button-group">
        <button type="button" onClick={anteriorEtapa}>
          Voltar
        </button>
        <button type="submit">Enviar Formulário</button>
      </div>
    </div>
  );
}

export default Etapa3;
