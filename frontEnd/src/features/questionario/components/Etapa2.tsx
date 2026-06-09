import React, { useEffect, useRef} from 'react';
import { UseFormRegister, FieldErrors, Control, useFieldArray } from 'react-hook-form';
import { FormularioData } from '../schema';
import { ErrorMessage } from './ErrorMessage';

interface EtapaProps {
  register: UseFormRegister<FormularioData>;
  errors: FieldErrors<FormularioData>;
  control: Control<FormularioData>;
  proximaEtapa?: () => void;
  anteriorEtapa?: () => void;
}

function Etapa2({ register, errors, control, proximaEtapa, anteriorEtapa }: EtapaProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependentes",
  });

  const foiInicializado = useRef(false);

  useEffect(() => {
    if (fields.length === 0 && !foiInicializado.current) {
      foiInicializado.current = true;
      append({ nome: '', relacao: '' });
    }
  }, [fields.length, append]);

  return (
    <div className="flex-col-container">
      <div className="formulario-header w-full">
        <h1>Paciente / Dependente</h1>
        <p>O apoio é para o próprio solicitante ou para outra pessoa?</p>
      </div>


      {fields.map((field, index) => (
        <div key={field.id} className="flex-col-container w-full" style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          
          <div className="input-group w-full">
            <label>Nome do Paciente (Dependente {index + 1})</label>
            <input
              type="text"
              className={errors.dependentes?.[index]?.nome ? 'input-error form-control' : 'form-control'}
              {...register(`dependentes.${index}.nome` as const)}
              placeholder="Nome de quem receberá o apoio"
            />
            <ErrorMessage message={errors.dependentes?.[index]?.nome?.message} />
          </div>

          <div className="input-group w-full">
            <label>Relação com o Solicitante</label>
            <select
              className={errors.dependentes?.[index]?.relacao ? 'input-error form-control' : 'form-control'}
              {...register(`dependentes.${index}.relacao` as const)}
            >
              <option value="">Selecione uma relação</option>
              <option value="Filho(a)">Filho(a)</option>
              <option value="Cônjuge">Cônjuge</option>
              <option value="Parente">Parente</option>
              <option value="Outro">Outro</option>
            </select>
            <ErrorMessage message={errors.dependentes?.[index]?.relacao?.message} />
          </div>

          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)} style={{ backgroundColor: '#fee2e2', color: '#d92d20', marginTop: '10px', alignSelf: 'flex-start' }}>
              Remover este dependente
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={() => append({ nome: '', relacao: '' })} style={{ alignSelf: 'flex-start', backgroundColor: '#f3f4f6', color: '#432dd7' }}>
        + Adicionar outro dependente
      </button>

      <div className="w-full button-group flex-row">
        <button type="button" onClick={anteriorEtapa}>Voltar</button>
        <button type="button" onClick={proximaEtapa}>Próxima Etapa &gt;</button>
      </div>
    </div>
  );
}

export default Etapa2;