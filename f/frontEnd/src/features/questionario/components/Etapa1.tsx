import React, { useEffect } from "react";
import { IMaskInput } from "react-imask";
import { consultarCep } from "../api/viaCep";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { FormularioData } from "../schema";

interface EtapaProps {
  register: UseFormRegister<FormularioData>;
  errors: FieldErrors<FormularioData>;
  watch: UseFormWatch<FormularioData>;
  setValue: UseFormSetValue<FormularioData>;
  proximaEtapa?: () => void;
  anteriorEtapa?: () => void;
  isPending?: boolean;
}

const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return "";
  const dataNasc = new Date(dataNascimento);
  const dataHoje = new Date();
  let idade = dataHoje.getFullYear() - dataNasc.getFullYear();
  const mes = dataHoje.getMonth() - dataNasc.getMonth();
  if (mes < 0 || (mes === 0 && dataHoje.getDate() < dataNasc.getDate())) {
    idade--;
  }
  return idade.toString();
}

function Etapa1({ register, errors, watch, setValue, proximaEtapa }: EtapaProps) {
  const areasAtendimento = [
    "", "Psicologia", "Nutrição", "Odontologia", "Enfermagem", "Contabilidade", "Direito"
  ];

  const dataNascimento = watch("dataNascimento");
  const clinicaAtendimento = watch("clinicaAtendimento");
  const atendimentoParaQuem = watch("atendimentoParaQuem");
  const cpf = watch("cpf");
  const cep = watch("cep");
  const telefone = watch("telefone");

  useEffect(() => {
    if (dataNascimento) {
      setValue("idade", calcularIdade(dataNascimento), { shouldValidate: true });
    }
  }, [dataNascimento, setValue]);

  const handleBuscarCep = async (cepBuscado) => {
    try {
      const endereco = await consultarCep(cepBuscado);
      setValue('logradouro', endereco.logradouro, { shouldValidate: true });
      setValue('bairro', endereco.bairro, { shouldValidate: true });
      setValue('cidade', endereco.cidade, { shouldValidate: true });
      setValue('estado', endereco.estado, { shouldValidate: true });
    } catch (error) {
      alert("CEP não encontrado ou inválido.");
    }
  };

  return (
    <div id="etapa1-form">
      <div className="input-group col-12">
        <label htmlFor="nome">Nome Completo<span className="required">*</span></label>
        <input type="text" id="nome" {...register("nome")} placeholder="Digite seu nome completo"/>
        {errors.nome && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.nome.message}</span>}
      </div>

      <div className="input-group col-8">
        <label htmlFor="email">E-mail<span className="required">*</span></label>
        <input type="email" id="email" {...register("email")} placeholder="seu@email.com"/>
        {errors.email && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.email.message}</span>}
      </div>

      <div className="input-group col-4">
        <label htmlFor="cpf">CPF<span className="required">*</span></label>
        <IMaskInput
          mask="000.000.000-00"
          id="cpf"
          value={cpf || ""}
          placeholder="000.000.000-00"
          onAccept={(value) => setValue('cpf', value, { shouldValidate: true })}
        />
        <input type="hidden" {...register("cpf")} />
        {errors.cpf && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.cpf.message}</span>}
      </div>

      <div className="row">
        <div className="input-group col-4">
          <label htmlFor="dataNascimento">Data de Nascimento<span className="required">*</span></label>
          <input type="date" id="dataNascimento" className="form-control" {...register("dataNascimento")} />
          {errors.dataNascimento && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.dataNascimento.message}</span>}
        </div>

        <div className="input-group col-2">
          <label htmlFor="idade">Idade<span className="required">*</span></label>
          <input type="number" id="idade" className="form-control" {...register("idade")} readOnly style={{ backgroundColor: '#e9ecef' }} />
          {errors.idade && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.idade.message}</span>}
        </div>
      </div>

      <div className="row">
        <div className="input-group col-4">
          <label htmlFor="cep">CEP<span className="required">*</span></label>
          <IMaskInput
            mask="00000-000"
            id="cep"
            className="form-control"
            value={cep || ""}
            placeholder="00000-000"
            onAccept={(value) => {
              setValue('cep', value, { shouldValidate: true });
              if (value.replace(/\D/g, '').length === 8) handleBuscarCep(value);
            }}
          />
          <input type="hidden" {...register("cep")} />
          {errors.cep && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.cep.message}</span>}
        </div>

        <div className="input-group col-12">
          <label htmlFor="estado">Estado<span className="required">*</span></label>
          <input type="text" id="estado" className="form-control" {...register("estado")} readOnly style={{ backgroundColor: '#e9ecef' }} />
          {errors.estado && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.estado.message}</span>}
        </div>

        <div className="input-group col-12">
          <label htmlFor="logradouro">Logradouro</label>
          <input type="text" id="logradouro" className="form-control" {...register("logradouro")} readOnly style={{ backgroundColor: '#e9ecef' }} />
        </div>

        <div className="input-group col-12">
          <label htmlFor="bairro">Bairro</label>
          <input type="text" id="bairro" className="form-control" {...register("bairro")} readOnly style={{ backgroundColor: '#e9ecef' }} />
        </div>

        <div className="input-group col-6">
          <label htmlFor="cidade">Cidade<span className="required">*</span></label>
          <input type="text" id="cidade" className="form-control" {...register("cidade")} readOnly style={{ backgroundColor: '#e9ecef' }} />
          {errors.cidade && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.cidade.message}</span>}
        </div>
      </div>

      <div className="input-group col-12">
        <label htmlFor="complemento">Complemento</label>
        <input type="text" id="complemento" {...register("complemento")} />
      </div>

      <div className="col-12 form-grid" style={{padding: 0, gap: '1.5rem'}}>
        <div className="col-6">
          <fieldset>
            <legend>Estado Civil<span className="required">*</span></legend>
            <div className="radio-group">
            {[
              "solteiro", "casado", "divorciado(a)", "separado judicialmente", "união estável", "viúvo", "amasiado(a)"
            ].map((estado) => (
              <label key={estado} className="radio-option">
                <input type="radio" value={estado} {...register("estadoCivil")} />
                {estado}
              </label>
            ))}
            </div>
            {errors.estadoCivil && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.estadoCivil.message}</span>}
          </fieldset>
        </div>

        <div className="col-6">
          <fieldset>
            <legend>Gênero<span className="required">*</span></legend>
            <div className="radio-group">
              {["feminino", "masculino", "não-binário", "transgênero", "prefiro não dizer"].map((g) => (
                <label key={g} className="radio-option">
                  <input type="radio" value={g} {...register("genero")} />
                  {g}
                </label>
              ))}
            </div>
            {errors.genero && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.genero.message}</span>}
          </fieldset>
        </div>
      </div>

      <div className="col-12">
        <fieldset>
          <legend>Cor/Raça que você se declara<span className="required">*</span></legend>
          <div className="radio-group" style={{flexDirection: 'row', flexWrap: 'wrap', gap: '15px'}}>
            {["preta", "amarela", "parda", "indigena", "branca", "prefiro não dizer"].map((c) => (
              <label key={c} className="radio-option">
                <input type="radio" value={c} {...register("corRaca")} />
                {c}
              </label>
            ))}
          </div>
          {errors.corRaca && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.corRaca.message}</span>}
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
          <legend>Tipo de atendimento<span className="required">*</span></legend>
          <div className="radio-group">
            {["Clínica Escola Ceilândia", "Clínica Escola Asa Sul"].map((clinica) => (
              <label key={clinica} className="radio-option">
                <input type="radio" value={clinica} {...register("clinicaAtendimento")} />
                {clinica}
              </label>
            ))}
          </div>
          {errors.clinicaAtendimento && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.clinicaAtendimento.message}</span>}

          {clinicaAtendimento && (
            <div className="input-group" style={{ marginTop: '15px' }}>
              <label htmlFor="areaAtendimento">Área<span className="required">*</span></label>
              <select id="areaAtendimento" {...register("areaAtendimento")}>
                {areasAtendimento.map((a) => (
                  <option key={a} value={a}>{a || "Selecione a área"}</option>
                ))}
              </select>
              {errors.areaAtendimento && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.areaAtendimento.message}</span>}
            </div>
          )}
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
          <legend>Classificação do atendimento<span className="required">*</span></legend>
          <div className="radio-group">
            {[
              "1 - Atendimentos não urgentes",
              "2 - Atendimento urgente ou mediato (mais rápido possível, não correm risco de vida)",
              "3 - Atendimento urgente ou imediato (coloca em risco a própria vida)",
              "4 - Atendimento urgente e imediato (coloca em risco a própria vida e de terceiros)",
              "5 - Outro"
            ].map((c) => (
              <label key={c} className="radio-option">
                <input type="radio" value={c} {...register("classAtendimento")} />
                {c}
              </label>
            ))}
          </div>
          {errors.classAtendimento && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.classAtendimento.message}</span>}
        </fieldset>
      </div>

      <div className="input-group col-6">
        <label htmlFor="telefone">Telefone<span className="required">*</span></label>
        <IMaskInput
          mask={[ { mask: '(00) 0000-00000' }, { mask: '(00) 00000-0000' } ]}
          dispatch={(appended, dynamicMasked) => {
            if (!dynamicMasked || !dynamicMasked.compiledMasks) return dynamicMasked.compiledMasks[0];
            const unmaskedValue = dynamicMasked.unmaskedValue;
            if (unmaskedValue.length <= 10) return dynamicMasked.compiledMasks[0];
            return dynamicMasked.compiledMasks[1];
          }}
          id="telefone"
          value={telefone || ""}
          placeholder="(00) 00000-0000"
          onAccept={(value) => setValue('telefone', value, { shouldValidate: true })}
        />
        <input type="hidden" {...register("telefone")} />
        <small>Informe o tipo: residencial / celular / recado (no campo ao lado, se desejar)</small>
        {errors.telefone && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.telefone.message}</span>}
      </div>

      <div className="input-group col-12">
        <label>Faz faculdade particular?</label>
        <div style={{display:'flex', gap:'20px'}}>
          <label className="radio-option">
            <input type="radio" value="sim" {...register("faculdadeParticular")} />Sim
          </label>
          <label className="radio-option">
            <input type="radio" value="não" {...register("faculdadeParticular")} />Não
          </label>
        </div>
      </div>

      <div className="input-group col-12">
        <label htmlFor="atendimentoParaQuem">Você está buscando atendimento para:<span className="required">*</span></label>
        <select id="atendimentoParaQuem" {...register("atendimentoParaQuem")}>
          <option value="">Selecione</option>
          <option value="Você">Você</option>
          <option value="Outra pessoa">Outra pessoa</option>
        </select>
        {errors.atendimentoParaQuem && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.atendimentoParaQuem.message}</span>}

        {atendimentoParaQuem === "Outra pessoa" && (
          <div className="input-group" style={{ marginTop: '10px' }}>
            <label htmlFor="nomeOutraPessoa">Nome da outra pessoa<span className="required">*</span></label>
            <input type="text" id="nomeOutraPessoa" {...register("nomeOutraPessoa")} />
            {errors.nomeOutraPessoa && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.nomeOutraPessoa.message}</span>}
          </div>
        )}
      </div>

      <div className="input-group col-12">
        <label htmlFor="acompanhamentoOutroLugar">Você faz acompanhamento em algum outro local?<span className="required">*</span></label>
        <select id="acompanhamentoOutroLugar" {...register("acompanhamentoOutroLugar")}>
          <option value="">Selecione</option>
          <option value="Não">Não</option>
          <option value="Sim, no Conselho Tutelar">Sim, no Conselho Tutelar</option>
          <option value="Sim, no CAPS">Sim, no CAPS</option>
          <option value="Sim, no CRAS">Sim, no CRAS</option>
          <option value="Sim, no Hospital Público">Sim, no Hospital Público</option>
          <option value="Sim, no Hospital Particular">Sim, no Hospital Particular</option>
          <option value="Outro">Outro</option>
        </select>
        {errors.acompanhamentoOutroLugar && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.acompanhamentoOutroLugar.message}</span>}
      </div>

      <div className="col-12 button-group">
        <button type="button" onClick={proximaEtapa}>
          Avançar
        </button>
      </div>
    </div>
  );
}

export default Etapa1;