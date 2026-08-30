import React, { useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import { consultarCep } from '../api/viaCep';

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from 'react-hook-form';
import { FormularioData } from '../schema';
import { ErrorMessage } from './ErrorMessage';

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

const calcularIdade = (dataNascimento: string): number => {
  if (!dataNascimento) return 0;
  const dataNasc = new Date(dataNascimento);
  const dataHoje = new Date();
  let idade = dataHoje.getFullYear() - dataNasc.getFullYear();
  const mes = dataHoje.getMonth() - dataNasc.getMonth();
  if (mes < 0 || (mes === 0 && dataHoje.getDate() < dataNasc.getDate())) {
    idade--;
  }
  return idade;
};

function Etapa1({ register, errors, watch, setValue, proximaEtapa }: EtapaProps) {
  const dataNascimento = watch('dataNascimento');
  const clinicaAtendimento = watch('clinicaAtendimento');
  const cpf = watch('cpf');
  const cep = watch('cep');
  const telefone = watch('telefone');
  const faculdadeParticular = watch('faculdadeParticular');

  useEffect(() => {
    if (dataNascimento) {
      setValue('idade', calcularIdade(dataNascimento), { shouldValidate: true });
    }
  }, [dataNascimento, setValue]);

  useEffect(() => {
    if (clinicaAtendimento && watch('areaAtendimento') === undefined) {
      setValue('areaAtendimento', '', { shouldValidate: true });
    }
  }, [clinicaAtendimento, setValue, watch]);

  useEffect(() => {
    if (faculdadeParticular === 'não') {
      setValue('bolsaFaculdade', '', { shouldValidate: true });
    }
  }, [faculdadeParticular, setValue]);

  const handleBuscarCep = async (cepBuscado: string) => {
    try {
      const endereco = await consultarCep(cepBuscado);
      setValue('logradouro', endereco.logradouro, { shouldValidate: true });
      setValue('bairro', endereco.bairro, { shouldValidate: true });
      setValue('cidade', endereco.cidade, { shouldValidate: true });
      setValue('estado', endereco.estado, { shouldValidate: true });
    } catch {
      alert('CEP não encontrado ou inválido.');
    }
  };

  return (
    <div className="flex-col-container">
      <div className="formulario-header w-full">
        <h1>Dados do Solicitante</h1>
        <p>Quem está buscando o acolhimento hoje?</p>
      </div>

      <div className="flex-row w-full">
        <div className="input-group w-half">
          <label htmlFor="nome">
            Nome Completo<span className="required">*</span>
          </label>
          <input
            type="text"
            id="nome"
            className={errors.nome ? 'input-error' : ''}
            {...register('nome')}
            placeholder="Digite seu nome completo"
          />
          <ErrorMessage message={errors.nome?.message} />
        </div>

        <div className="input-group w-half">
          <label htmlFor="email">
            E-mail<span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            className={errors.email ? 'input-error' : ''}
            {...register('email')}
            placeholder="seu@email.com"
          />
          <ErrorMessage message={errors.email?.message} />
        </div>
      </div>

      <div className="flex-row w-full">
        <div className="input-group w-cpf">
          <label htmlFor="cpf">
            CPF<span className="required">*</span>
          </label>
          <IMaskInput
            mask="000.000.000-00"
            id="cpf"
            value={cpf || ''}
            className={`form-control ${errors.cpf ? 'input-error' : ''}`}
            placeholder="000.000.000-00"
            onAccept={(value: string) => setValue('cpf', value, { shouldValidate: true })}
          />
          <ErrorMessage message={errors.cpf?.message} />
        </div>
        <div className="input-group w-custom">
          <label htmlFor="dataNascimento">
            Data de Nascimento<span className="required">*</span>
          </label>
          <input
            type="date"
            id="dataNascimento"
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            className={`form-control ${errors.dataNascimento ? 'input-error' : ''}`}
            {...register('dataNascimento')}
          />
          <ErrorMessage message={errors.dataNascimento?.message} />
        </div>

        <div className="input-group w-custom">
          <label htmlFor="idade">
            Idade<span className="required">*</span>
          </label>
          <input
            type="number"
            id="idade"
            className={errors.idade ? 'input-error' : ''}
            {...register('idade')}
            readOnly
          />
          <ErrorMessage message={errors.idade?.message} />
        </div>
      </div>

      <div className="flex-row w-full">

        <div className="input-group">
          <label htmlFor="cep">
            CEP<span className="required">*</span>
          </label>
          <IMaskInput
            mask="00000-000"
            id="cep"
            className={`form-control ${errors.cep ? 'input-error' : ''}`}
            value={cep || ''}
            placeholder="00000-000"
            onAccept={(value: string) => {
              setValue('cep', value, { shouldValidate: true });
              if (value.replace(/\D/g, '').length === 8) handleBuscarCep(value);
            }}
          />
          <ErrorMessage message={errors.cep?.message} />
        </div>
        
        <div className="input-group estado">
          <label htmlFor="estado">
            Estado<span className="required">*</span>
          </label>
          <input
            type="text"
            id="estado"
            className={errors.estado ? 'input-error' : ''}
            {...register('estado')}
            readOnly
          />
          <ErrorMessage message={errors.estado?.message} />
        </div>

        <div className="input-group">
          <label htmlFor="logradouro">Logradouro</label>
          <input
            type="text"
            id="logradouro"
            className="form-control"
            {...register('logradouro')}
            readOnly
          />
        </div>
      </div>

      <div className="flex-row w-full">
        <div className="input-group w-half">
          <label htmlFor="bairro">Bairro</label>
          <input
            type="text"
            id="bairro"
            className="form-control"
            {...register('bairro')}
            readOnly
          />
        </div>

        <div className="input-group w-half">
          <label htmlFor="cidade">
            Cidade<span className="required">*</span>
          </label>
          <input
            type="text"
            id="cidade"
            className="form-control"
            {...register('cidade')}
            readOnly
          />
          <ErrorMessage message={errors.cidade?.message} />
        </div>
      </div>

      <div className="input-group w-full">
        <label htmlFor="complemento">Complemento</label>
        <input type="text" id="complemento" {...register('complemento')} />
      </div>

      <div className="flex-row w-full">
        <div className="w-half">
          <fieldset className={errors.estadoCivil ? 'input-error' : ''}>
            <legend>
              Estado Civil<span className="required">*</span>
            </legend>
            <div className="radio-group">
              {[
                'solteiro',
                'casado',
                'divorciado(a)',
                'separado judicialmente',
                'união estável',
                'viúvo',
                'amasiado(a)',
              ].map((estado) => (
                <label key={estado} className="radio-option">
                  <input type="radio" value={estado} {...register('estadoCivil')} />
                  {estado}
                </label>
              ))}
            </div>
            <ErrorMessage message={errors.estadoCivil?.message} />
          </fieldset>
        </div>

        <div className="w-half">
          <fieldset className={errors.genero ? 'input-error' : ''}>
            <legend>
              Gênero<span className="required">*</span>
            </legend>
            <div className="radio-group">
              {['feminino', 'masculino', 'não-binário', 'transgênero', 'prefiro não dizer'].map(
                (g) => (
                  <label key={g} className="radio-option">
                    <input type="radio" value={g} {...register('genero')} />
                    {g}
                  </label>
                )
              )}
            </div>
            <ErrorMessage message={errors.genero?.message} />
          </fieldset>
        </div>
      </div>

      <div className="w-full">
        <fieldset className={errors.corRaca ? 'input-error' : ''}>
          <legend>
            Cor/Raça que você se declara<span className="required">*</span>
          </legend>
          <div className="radio-group flex-row" style={{ flexWrap: 'wrap', gap: '15px' }}>
            {['preta', 'amarela', 'parda', 'indigena', 'branca', 'prefiro não dizer'].map((c) => (
              <label key={c} className="radio-option">
                <input type="radio" value={c} {...register('corRaca')} />
                {c}
              </label>
            ))}
          </div>
          <ErrorMessage message={errors.corRaca?.message} />
        </fieldset>
      </div>

      <div className="input-group w-full">
        <label htmlFor="telefone">
          Telefone<span className="required">*</span>
        </label>
        <IMaskInput
          className={`form-control ${errors.telefone ? 'input-error' : ''}`}
          mask={[{ mask: '(00) 0000-00000' }, { mask: '(00) 00000-0000' }]}
          dispatch={(appended, dynamicMasked) => {
            if (!dynamicMasked || !dynamicMasked.compiledMasks)
              return dynamicMasked.compiledMasks[0];
            const unmaskedValue = dynamicMasked.unmaskedValue;
            if (unmaskedValue.length <= 10) return dynamicMasked.compiledMasks[0];
            return dynamicMasked.compiledMasks[1];
          }}
          id="telefone"
          value={telefone || ''}
          placeholder="(00) 00000-0000"
          onAccept={(value: string) => setValue('telefone', value, { shouldValidate: true })}
        />
        <input type="hidden" {...register('telefone')} />
        <small>Informe o tipo: residencial / celular / recado</small>
        <ErrorMessage message={errors.telefone?.message} />
      </div>

      <div className="input-group w-full">
        <label htmlFor="atendimentoParaQuem">
          Você está buscando atendimento para:<span className="required">*</span>
        </label>
        <select id="atendimentoParaQuem" 
        className={errors.atendimentoParaQuem ? 'input-error' : ''}
        {...register('atendimentoParaQuem')}
        >
          <option value="">Selecione</option>
          <option value="Você">Você</option>
          <option value="Outra pessoa">Outra pessoa</option>
        </select>
        <ErrorMessage message={errors.atendimentoParaQuem?.message} />
      </div>

      <div className="w-full button-group">
        <button type="button" onClick={proximaEtapa}>
          Próxima Etapa &gt;
        </button>
      </div>
    </div>
  );
}

export default Etapa1;
