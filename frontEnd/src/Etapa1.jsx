import React from "react";
import { IMaskInput } from "react-imask";

function Etapa1({ formData, handleChange, proximaEtapa }) {
  const estados = [
    "",
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
  ];

  const areasAtendimento = [
    "",
    "Psicologia",
    "Nutrição",
    "Odontologia",
    "Enfermagem",
    "Contabilidade",
    "Direito"
  ];

  return (
    <>
      <div>
        <label htmlFor="nome">Nome Completo<span className="required">*</span>
        </label>
        <input type="text" id="nome" name="nome" value={formData.nome || ""} onChange={handleChange} required/>
      </div>

      <div>
        <label htmlFor="email">E-mail<span className="required">*</span></label>
        <input type="email" id="email" name="email" value={formData.email || ""} onChange={handleChange} required />
      </div>

     <div>
      <label htmlFor="cpf">CPF<span className="required">*</span></label>
        <IMaskInput
        mask="000.000.000-00"
        id="cpf"
        name="cpf"
        value={formData.cpf || ""}
        placeholder="000.000.000-00"
        onAccept={(value) => {
        const event = {
          target: {
            name: 'cpf',
            value: value
          }};
        handleChange(event);}}/>      
     </div>

     <div>
      <label htmlFor="dataNascimento">Data de Nascimento<span className="required">*</span></label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento || ""}
          onChange={handleChange}
          placeholder="dd/mm/aaaa"/>
   
     </div>

      <div>
        <label htmlFor="idade">Idade<span className="required">*</span></label>
        <input type="number" id="idade" name="idade" min="0" value={formData.idade || ""} onChange={handleChange} required/>
      </div>

     <div>
        <label htmlFor="cep">CEP<span className="required">*</span></label>
        <IMaskInput
          mask="00000-000"
          id="cep"
          name="cep"
          value={formData.cep || ""}
          placeholder="00000-000"
          onAccept={(value) => {
          const event = {
            target: {
              name: 'cep',
              value: value
            }};
        handleChange(event);}}/>
     </div>

      <div>
        <label htmlFor="endereco">Endereço</label>
        <input type="text" id="endereco" name="endereco" value={formData.endereco || ""} onChange={handleChange} />
      </div>

      <div>
        <fieldset>
          <legend>
            Estado Civil<span className="required">*</span>
          </legend>
          {[
            "solteiro",
            "casado",
            "divorciado(a)",
            "separado judicialmente",
            "união estável",
            "viúvo",
            "amasiado(a)",
          ].map((estado) => (
            <label key={estado} style={{ display: "block" }}>
              <input type="radio" name="estadoCivil" value={estado} checked={formData.estadoCivil === estado} onChange={handleChange} required
              />
              {estado}
            </label>
          ))}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend>Gênero<span className="required">*</span></legend>
          {["feminino", "masculino", "não-binário", "transgênero", "prefiro não dizer"].map(
            (g) => (
              <label key={g} style={{ display: "block" }}>
                <input type="radio" name="genero" value={g} checked={formData.genero === g} onChange={handleChange} required/>
                {g}
              </label>
            )
          )}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend>Cor/Raça que você se declara<span className="required">*</span></legend>
          {["preta", "amarela", "parda", "indigena", "branca", "prefiro não dizer"].map(
            (c) => (
              <label key={c} style={{ display: "block" }}>
                <input type="radio" name="corRaca" value={c} checked={formData.corRaca === c} onChange={handleChange} required/>
                {c}
              </label>
            )
          )}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend>
            Tipo de atendimento<span className="required">*</span></legend>

          {["Clínica Escola Ceilândia", "Clínica Escola Asa Sul"].map((clinica) => (
            <label key={clinica} style={{ display: "block" }}>
              <input type="radio" name="clinicaAtendimento" value={clinica} checked={formData.clinicaAtendimento === clinica} onChange={handleChange} required/>
              {clinica}
            </label>
          ))}

          {/* só mostra a área depois de escolher a clínica */}
          {formData.clinicaAtendimento ? (
            <div style={{ marginTop: 8 }}>
              <label htmlFor="areaAtendimento">Área</label>
              <select id="areaAtendimento" name="areaAtendimento" value={formData.areaAtendimento || ""} onChange={handleChange}>
                {areasAtendimento.map((a) => (
                  <option key={a} value={a}>
                    {a || "Selecione a área"}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend>Classificação do atendimento<span className="required">*</span></legend>
          {[
            "1 - Atendimentos não urgentes",
            "2 - Atendimento urgente ou mediato (mais rápido possível, não correm risco de vida)",
            "3 - Atendimento urgente ou imediato (coloca em risco a própria vida)",
            "4 - Atendimento urgente e imediato (coloca em risco a própria vida e de terceiros)",
            "5 - Outro",
          ].map((c) => (
            <label key={c} style={{ display: "block" }}>
              <input type="radio" name="classAtendimento" value={c} checked={formData.classAtendimento === c} onChange={handleChange} required/>
              {c}
            </label>
          ))}
        </fieldset>
      </div>

      <div>
        <label htmlFor="estado">Estado<span className="required">*</span></label>
        <select id="estado" name="estado" value={formData.estado || ""} onChange={handleChange} required>
          {estados.map((e) => (
            <option key={e} value={e}>
              {e || "Selecione o estado"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cidade">Cidade<span className="required">*</span></label>
        <input type="text" id="cidade" name="cidade" value={formData.cidade || ""} onChange={handleChange} placeholder="Auto-complete possível com integração externa" required/>
      </div>

      <div>
        <label htmlFor="telefone">Telefone<span className="required">*</span></label>
<IMaskInput

  mask={[
    { mask: '(00) 0000-00000' },  // Máscara para telefone fixo (8 dígitos)
    { mask: '(00) 00000-0000' } // Máscara para celular (9 dígitos)
  ]}

  dispatch={(appended, dynamicMasked) => {
    if (!dynamicMasked || !dynamicMasked.compiledMasks) {
      return dynamicMasked.compiledMasks[0];
    }
    
    const unmaskedValue = dynamicMasked.unmaskedValue;

    if (unmaskedValue.length <= 10) {
      return dynamicMasked.compiledMasks[0];
    }

    return dynamicMasked.compiledMasks[1];
  }}

  id="telefone"
  name="telefone"
  value={formData.telefone || ""}
  placeholder="(00) 00000-0000"
  onAccept={(value) => {
    const event = { target: { name: 'telefone', value } };
    handleChange(event);
  }}
/>
        <small>Informe o tipo: residencial / celular / recado (no campo ao lado, se desejar)</small>
      </div>

      <div>
        <label>Faz faculdade particular?</label>
        <label style={{ marginLeft: 8 }}>
          <input type="radio" name="faculdadeParticular" value="sim" checked={formData.faculdadeParticular === "sim"} onChange={handleChange}/>
          Sim
        </label>
        <label style={{ marginLeft: 8 }}>
          <input type="radio" name="faculdadeParticular" value="não" checked={formData.faculdadeParticular === "não"} onChange={handleChange}/>
          Não
        </label>
      </div>

      <div>
        <label htmlFor="atendimentoParaQuem">Você está buscando atendimento para:<span className="required">*</span></label>
        <select id="atendimentoParaQuem" name="atendimentoParaQuem" value={formData.atendimentoParaQuem || ""} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="Você">Você</option>
          <option value="Outra pessoa">Outra pessoa</option>
        </select>

        {/* se escolher "Outra pessoa", permite preencher o nome */}
        {formData.atendimentoParaQuem === "Outra pessoa" && (
          <div style={{ marginTop: 8 }}>
            <label htmlFor="nomeOutraPessoa">Nome da outra pessoa</label>
            <input type="text" id="nomeOutraPessoa" name="nomeOutraPessoa" value={formData.nomeOutraPessoa || ""} onChange={handleChange}/>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="acompanhamentoOutroLugar">Você faz acompanhamento em algum outro local?<span className="required">*</span></label>
        <select id="acompanhamentoOutroLugar" name="acompanhamentoOutroLugar" value={formData.acompanhamentoOutroLugar || ""} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="Não">Não</option>
          <option value="Sim, no Conselho Tutelar">Sim, no Conselho Tutelar</option>
          <option value="Sim, no CAPS">Sim, no CAPS</option>
          <option value="Sim, no CRAS">Sim, no CRAS</option>
          <option value="Sim, no Hospital Público">Sim, no Hospital Público</option>
          <option value="Sim, no Hospital Particular">Sim, no Hospital Particular</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {/* botão para avançar etapas */}
      <div style={{ marginTop: 12 }}>
        <button type="button" onClick={proximaEtapa}>
          Avançar
        </button>
      </div>
    </>
  );
}

export default Etapa1;