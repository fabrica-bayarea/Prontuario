import React, { useState } from "react";

function Etapa2({ formData, handleChange, proximaEtapa, anteriorEtapa, handleSubmit }) { //Adicionei handleSubmit aqui caso precise, mas o fluxo usa proximaEtapa
  const [mostrarOutroCampo, setMostrarOutroCampo] = useState(false);
  // ... (Mantenha todos os useState e funções handlers iguais)
  const [mostrarCampoAluguel, setMostrarCampoAluguel] = useState(false);
  const [mostrarOutroOrigemRenda, setMostrarOutroOrigemRenda] = useState(false);
  const [mostrarQuaisBeneficios, setMostrarQuaisBeneficios] = useState(false);
  const [mostrarQuaisDeficiencias, setMostrarQuaisDeficiencias] = useState(false);
  const [mostrarCampoMensalidade, setMostrarCampoMensalidade] = useState(false);
  const [mostrarOpcoesAcompanhamento, setMostrarOpcoesAcompanhamento] = useState(false);
  const [mostrarOutroAcompanhamento, setMostrarOutroAcompanhamento] = useState(false);
  const [mostrarOutraEspecialidade, setMostrarOutraEspecialidade] = useState(false);
  const [mostrarOpcoesFinanciamento, setMostrarOpcoesFinanciamento] = useState(false);
  const [mostrarOpcoesRedeSocio, setMostrarOpcoesRedeSocio] = useState(false);
  const [mostrarOutroRedeSocio, setMostrarOutroRedeSocio] = useState(false);

  const especialidadesMedicas = ["Cardiologia", "Clínica Geral", "Dermatologia", "Endocrinologia", "Fisioterapia", "Ginecologia", "Neurologia", "Nutrição", "Ortopedia", "Pediatria", "Psicologia", "Psiquiatria", "Outra"];

  const formatarMoeda = (valor) => { let somenteNumeros = valor.replace(/\D/g, ""); if (somenteNumeros === "") return ""; let numero = Number(somenteNumeros) / 100; return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL", }); };
  const desformatarMoeda = (valor) => { if (!valor) return 0; let somenteNumeros = String(valor).replace(/\D/g, ""); if (somenteNumeros === "") return 0; return parseFloat(somenteNumeros) / 100; };

  // ... (Mantenha os handlers handleValorAluguelChange, handleValorMensalidadeChange, handleEstudaParticularChange, etc. IGUAIS)
  const handleValorAluguelChange = (e) => { const valorFormatado = formatarMoeda(e.target.value); handleChange({ target: { name: "valorAluguel", value: valorFormatado } }); };
  const handleValorMensalidadeChange = (e) => { const valorFormatado = formatarMoeda(e.target.value); handleChange({ target: { name: "valorMensalidade", value: valorFormatado }, }); };
  const handleEstudaParticularChange = (event) => { const { value } = event.target; handleChange(event); setMostrarCampoMensalidade(value === "Sim"); if (value !== "Sim") { handleChange({ target: { name: "valorMensalidade", value: "" } }); } };
  const handleValorBeneficioChange = (e, beneficioId) => { const valorFormatado = formatarMoeda(e.target.value); const currentValores = formData.valoresBeneficios || {}; const novosValoresBeneficios = { ...currentValores, [beneficioId]: { valor: valorFormatado, }, }; handleChange({ target: { name: "valoresBeneficios", value: novosValoresBeneficios }, }); };
  const handleOutroBeneficioValorChange = (e) => { const valorFormatado = formatarMoeda(e.target.value); handleChange({ target: { name: "outroBeneficioValor", value: valorFormatado }, }); };
  const handleResidemCasaChange = (event) => { const { value, checked } = event.target; const valoresAtuais = formData.residemSuaCasa || []; let novosValores; if (value === "naoTem") { novosValores = checked ? ["naoTem"] : []; } else { if (checked) { novosValores = [ ...valoresAtuais.filter((item) => item !== "naoTem"), value, ]; } else { novosValores = valoresAtuais.filter((item) => item !== value); } } handleChange({ target: { name: "residemSuaCasa", value: novosValores } }); };
  const handleSelectChange = (event, setMostrarCampo, campoParaLimpar) => { const { value } = event.target; handleChange(event); setMostrarCampo(value === "Outro" || value === "Sim"); if (campoParaLimpar && value !== "Outro" && value !== "Sim") { handleChange({ target: { name: campoParaLimpar, value: "" } }); } };
  const handleTipoCasaChange = (event) => { const { value } = event.target; handleChange(event); setMostrarOutroCampo(value === "Outro"); setMostrarCampoAluguel(value === "Alugada"); if (value !== "Outro") { handleChange({ target: { name: "outroTipoCasa", value: "" } }); } if (value !== "Alugada") { handleChange({ target: { name: "valorAluguel", value: "" } }); } };
  const handleOrigemRendaChange = (event) => handleSelectChange(event, setMostrarOutroOrigemRenda, "outroOrigemRenda");
  const handleBeneficioSocialChange = (event) => { const valor = event.target.value; handleChange(event); setMostrarQuaisBeneficios(valor === "Sim"); if (valor !== "Sim") { handleChange({ target: { name: "quaisBeneficios", value: [] } }); handleChange({ target: { name: "outroBeneficio", value: "" } }); handleChange({ target: { name: "outroBeneficioValor", value: "" } }); handleChange({ target: { name: "valoresBeneficios", value: {} } }); } };
  const handleDeficienciaChange = (event) => { const valor = event.target.value; handleChange(event); setMostrarQuaisDeficiencias(valor === "Sim"); if (valor !== "Sim") { handleChange({ target: { name: "quaisDeficiencia", value: [] } }); handleChange({ target: { name: "outraDeficienciaEspecifique", value: "" }, }); } };
  const handleCheckboxChange = (event, campo) => { const { value, checked } = event.target; const valoresAtuais = formData[campo] || []; const novosValores = checked ? [...valoresAtuais, value] : valoresAtuais.filter((item) => item !== value); handleChange({ target: { name: campo, value: novosValores }, }); if (campo === "quaisDeficiencia" && value === "def_outra" && !checked) { handleChange({ target: { name: "outraDeficienciaEspecifique", value: "" }, }); } };
  const handleAcompanhamentoMedicoChange = (event) => { const { value } = event.target; handleChange(event); setMostrarOpcoesAcompanhamento(value === "Sim"); setMostrarOutroAcompanhamento(value === "Outro"); if (value !== "Sim") { handleChange({ target: { name: "tipoAcompanhamento", value: "" } }); handleChange({ target: { name: "especialidadeMedica", value: "" } }); handleChange({ target: { name: "outraEspecialidade", value: "" } }); setMostrarOutraEspecialidade(false); } if (value !== "Outro") { handleChange({ target: { name: "outroAcompanhamento", value: "" } }); } };
  const handleEspecialidadeChange = (event) => { const { value } = event.target; handleChange(event); setMostrarOutraEspecialidade(value === "Outra"); if (value !== "Outra") { handleChange({ target: { name: "outraEspecialidade", value: "" } }); } };
  const handlePossuiFinanciamentoChange = (event) => { const { value } = event.target; handleChange(event); setMostrarOpcoesFinanciamento(value === "Sim"); if (value !== "Sim") { handleChange({ target: { name: "tiposFinanciamento", value: [] } }); } };
  const handleGastoAguaChange = (e) => { const valorFormatado = formatarMoeda(e.target.value); handleChange({ target: { name: "gastoAgua", value: valorFormatado } }); };
  const handleGastoEnergiaChange = (e) => { const valorFormatado = formatarMoeda(e.target.value); handleChange({ target: { name: "gastoEnergia", value: valorFormatado } }); };
  const handleGastoInternetChange = (e) => { const valorFormatado = formatarMoeda(e.target.value); handleChange({ target: { name: "gastoInternet", value: valorFormatado } }); };
  const handleGastoCondominioChange = (e) => { const valorFormatado = formatarMoeda(e.target.value); handleChange({ target: { name: "gastoCondominio", value: valorFormatado }, }); };
  const handleComoSoubeChange = (event) => { const { value, checked } = event.target; const atuais = formData.comoSoubeIESB || []; const novos = checked ? [...atuais, value] : atuais.filter((item) => item !== value); handleChange({ target: { name: "comoSoubeIESB", value: novos } }); if (value === "redeSocio") { setMostrarOpcoesRedeSocio(checked); if (!checked) { handleChange({ target: { name: "fonteRedeSocio", value: "" } }); handleChange({ target: { name: "outroFonteRedeSocio", value: "" } }); setMostrarOutroRedeSocio(false); } } };
  const handleFonteRedeSocioChange = (event) => { const { value } = event.target; handleChange(event); setMostrarOutroRedeSocio(value === "Outro"); if (value !== "Outro") { handleChange({ target: { name: "outroFonteRedeSocio", value: "" } }); } };
  const isSelecionado = (campo, valor) => formData[campo]?.includes(valor) || false;

  return (
    <div className="form-grid">
      <div className="input-group col-6">
        <label htmlFor="pessoasPorCasa">Quantas pessoas residem na sua casa? *</label>
        <input type="number" id="pessoasPorCasa" name="pessoasPorCasa" value={formData.pessoasPorCasa || ""} onChange={handleChange} min="1" required/>
      </div>

      <div className="input-group col-6">
        <label htmlFor="suaCasaE">Sua casa é: *</label>
        <select id="suaCasaE" name="suaCasaE" value={formData.suaCasaE || ""} onChange={handleTipoCasaChange} required>
          <option value="">Selecione</option>
          <option value="Quitada">Própria (Quitada)</option>
          <option value="Financiada">Própria (Financiada)</option>
          <option value="Cedida">Cedida (Parentes, amigos, etc)</option>
          <option value="Alugada">Alugada</option>
          <option value="Outro">Outro</option>
        </select>
        {mostrarCampoAluguel && (<input type="text" id="valorAluguel" name="valorAluguel" value={formData.valorAluguel || ""} onChange={handleValorAluguelChange} placeholder="Valor do aluguel" required style={{marginTop: '10px'}}/>)}
        {mostrarOutroCampo && (<input type="text" id="outroTipoCasa" name="outroTipoCasa" value={formData.outroTipoCasa || ""} onChange={handleChange} placeholder="Digite o tipo de residência" required style={{marginTop: '10px'}}/>)}
      </div>

      <div className="input-group col-6">
        <label htmlFor="rendaFamiliar">Qual é sua renda familiar? *</label>
        <select id="rendaFamiliar" name="rendaFamiliar" value={formData.rendaFamiliar || ""} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="Nenhuma">Nenhuma</option>
          <option value="MeioUm">De 1/2 até 1 salário mínimo.</option>
          <option value="DeUmAteTres">De 1 a 3 salários mínimos</option>
          <option value="DeTresAteQuatro">De 3 a 4 salários mínimos.</option>
          <option value="AcimaDeQuatro">Acima de 4 salários mínimos.</option>
        </select>
      </div>

      <div className="input-group col-6">
        <label htmlFor="origemRenda">Origem principal de sua renda: *</label>
        <select id="origemRenda" name="origemRenda" value={formData.origemRenda || ""} onChange={handleOrigemRendaChange} required>
          <option value="">Selecione</option>
          <option value="SeguroDesemprego">Seguro desemprego.</option>
          <option value="Empregaticio">Trabalho com vínculo empregatício</option>
          <option value="Bico">Trabalho temporário (bico)</option>
          <option value="Autonomo">Trabalho autônomo</option>
          <option value="Concursado">Servidor público concursado</option>
          <option value="Aposentadoria">Pensão/Aposentadoria</option>
          <option value="PensaoAlimenticia">Pensão alimentícia</option>
          <option value="BeneficioSocial">Programa/Benefício social</option>
          <option value="Outro">Outro</option>
        </select>
        {mostrarOutroOrigemRenda && (<input type="text" id="outroOrigemRenda" name="outroOrigemRenda" value={formData.outroOrigemRenda || ""} onChange={handleChange} placeholder="Digite a origem da renda" required style={{marginTop:'10px'}}/>)}
      </div>

      <div className="input-group col-6">
        <label htmlFor="CADUnico">Informe o seu CADÚnico:</label>
        <input type="text" id="CADUnico" name="CADUnico" value={formData.CADUnico || ""} onChange={handleChange}/>
      </div>

      <div className="col-12">
        <fieldset>
            <legend>Benefícios Sociais</legend>
            <div className="input-group">
                <label htmlFor="beneficioSocial">Sua família recebe algum benefício social? *</label>
                <select id="beneficioSocial" name="beneficioSocial" value={formData.beneficioSocial || ""} onChange={handleBeneficioSocialChange} required>
                <option value="">Selecione</option>
                <option value="Nao">Não</option>
                <option value="Sim">Sim</option>
                </select>
            </div>
            
            {mostrarQuaisBeneficios && (
                <div className="checkbox-group" style={{marginTop:'15px'}}>
                <label>Quais benefícios? *</label>
                {[
                    { id: "bolsaFamilia", label: "Bolsa Família" }, { id: "pratoCheio", label: "Prato Cheio" }, { id: "materialEscolar", label: "Cartão Material Escolar" }, { id: "valeGasBPC", label: "Cartão Vale Gás / BPC-LOAS" }, { id: "dfSocial", label: "DF Social" }, { id: "cartaoCreche", label: "Cartão Creche" }, { id: "habitacaoSocial", label: "Habitação Social" }, { id: "tarifaEletrica", label: "Tarifa Social de Energia Elétrica", }, { id: "tarifaAguaEsgoto", label: "Tarifa Social de Água e Esgoto" },
                ].map(({ id, label }) => (
                    <div key={id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
                        <div className="checkbox-option">
                            <input type="checkbox" id={id} value={id} checked={isSelecionado("quaisBeneficios", id)} onChange={(e) => handleCheckboxChange(e, "quaisBeneficios")}/>
                            <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
                        </div>
                        {isSelecionado("quaisBeneficios", id) && (<input type="text" placeholder="R$" value={formData.valoresBeneficios?.[id]?.valor || ""} onChange={(e) => handleValorBeneficioChange(e, id)} style={{width: '100px'}}/>)}
                    </div>
                ))}
                 {/* Outro Benefício */}
                 <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'10px'}}>
                     <label style={{marginBottom:0}}>Outro:</label>
                     <input type="text" name="outroBeneficio" value={formData.outroBeneficio || ""} onChange={handleChange} placeholder="Benefício" style={{flex:1}}/>
                     <input type="text" name="outroBeneficioValor" value={formData.outroBeneficioValor || ""} onChange={handleOutroBeneficioValorChange} placeholder="R$" style={{width:'100px'}}/>
                 </div>
                 <div style={{marginTop:'15px', fontWeight:'bold', textAlign:'right'}}>
                     Total: {(() => { const totalBeneficios = Object.values(formData.valoresBeneficios || {}).reduce((soma, item) => soma + desformatarMoeda(item.valor), 0); const valorOutro = desformatarMoeda(formData.outroBeneficioValor); return (totalBeneficios + valorOutro).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); })()}
                 </div>
                </div>
            )}
        </fieldset>
      </div>

      <div className="col-12">
          <div className="input-group">
            <label htmlFor="suaCasaEstuda">Entre as pessoas que residem em sua casa, alguma estuda em escola ou faculdade particular? *</label>
            <select id="suaCasaEstuda" name="suaCasaEstuda" value={formData.suaCasaEstuda || ""} onChange={handleEstudaParticularChange} required>
            <option value="">Selecione</option>
            <option value="Nao">Não</option>
            <option value="Sim">Sim</option>
            </select>
          </div>
          {mostrarCampoMensalidade && (
            <div className="input-group" style={{marginTop:'10px'}}>
            <label htmlFor="valorMensalidade">Qual o valor da mensalidade? *</label>
            <input type="text" id="valorMensalidade" name="valorMensalidade" value={formData.valorMensalidade || ""} onChange={handleValorMensalidadeChange} placeholder="Valor da mensalidade (R$)" required/>
            </div>
          )}
      </div>

      <div className="col-12">
        <fieldset>
          <legend>Pessoas na residência</legend>
          <div className="checkbox-group">
            {[ { id: "gestante", label: "Gestante" }, { id: "idoso", label: "Idoso (Acima de 60 anos)" }, { id: "pcd", label: "PCD" }, { id: "naoTem", label: "Não tem" } ].map(({ id, label }) => (
                <div key={id} className="checkbox-option">
                <input type="checkbox" id={id} value={id} checked={isSelecionado("residemSuaCasa", id)} onChange={handleResidemCasaChange} disabled={id !== "naoTem" && isSelecionado("residemSuaCasa", "naoTem")}/>
                <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
                </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
           <legend>Doenças Crônicas</legend>
           <div className="checkbox-group" style={{display:'grid', gridTemplateColumns:'1fr 1fr'}}>
            {[ { id: "nenhumaDoenca", label: "Não" }, { id: "cancer", label: "Câncer" }, { id: "hipertensao", label: "Hipertensão" }, { id: "doencaRenal", label: "Doença Renal" }, { id: "asma", label: "Asma" }, { id: "diabetes", label: "Diabetes" }, { id: "hiv", label: "HIV" } ].map(({ id, label }) => (
                <div key={id} className="checkbox-option">
                <input type="checkbox" id={id} value={id} checked={isSelecionado("residenciaDoencaCronica", id)} onChange={(e) => handleCheckboxChange(e, "residenciaDoencaCronica")}/>
                <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
                </div>
            ))}
           </div>
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
            <legend>Deficiências</legend>
            <div className="input-group">
                <label>Alguém em sua residência possui deficiência física ou mental? *</label>
                <select id="residenciaDeficiencia" name="residenciaDeficiencia" value={formData.residenciaDeficiencia || ""} onChange={handleDeficienciaChange} required>
                    <option value="">Selecione</option>
                    <option value="Nao">Não</option>
                    <option value="Sim">Sim</option>
                </select>
            </div>
            {mostrarQuaisDeficiencias && (
                <div className="checkbox-group" style={{marginTop:'15px'}}>
                 <label>Quais?</label>
                 {[ { id: "def_fisica", label: "Física (motora)" }, { id: "def_visual", label: "Visual" }, { id: "def_auditiva", label: "Auditiva" }, { id: "def_intelectual", label: "Intelectual" }, { id: "def_autismo", label: "Transtorno do Espectro Autista (TEA)", }, { id: "def_esquizofrenia", label: "Esquizofrenia" }, { id: "def_depressao_grave", label: "Depressão grave" }, { id: "def_outra", label: "Outra" } ].map(({ id, label }) => (
                    <div key={id} className="checkbox-option">
                        <input type="checkbox" id={id} value={id} checked={isSelecionado("quaisDeficiencia", id)} onChange={(e) => handleCheckboxChange(e, "quaisDeficiencia")}/>
                        <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
                    </div>
                 ))}
                 {isSelecionado("quaisDeficiencia", "def_outra") && (
                     <div className="input-group" style={{marginTop:'10px'}}>
                        <input type="text" name="outraDeficienciaEspecifique" value={formData.outraDeficienciaEspecifique || ""} onChange={handleChange} placeholder="Especifique" required/>
                     </div>
                 )}
                </div>
            )}
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
            <legend>Acompanhamento Médico</legend>
            <div className="input-group">
                <label>Você ou alguém da sua família faz acompanhamento médico? *</label>
                <select id="acompanhamentoMedico" name="acompanhamentoMedico" value={formData.acompanhamentoMedico || ""} onChange={handleAcompanhamentoMedicoChange} required>
                    <option value="">Selecione</option>
                    <option value="Nao">Não</option>
                    <option value="Sim">Sim</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
            {mostrarOpcoesAcompanhamento && (
                <div style={{marginTop:'15px'}}>
                    <div className="radio-group" style={{flexDirection:'row', gap:'20px', marginBottom:'10px'}}>
                        <label className="radio-option"><input type="radio" name="tipoAcompanhamento" value="Publico" checked={formData.tipoAcompanhamento === "Publico"} onChange={handleChange} required/> Público</label>
                        <label className="radio-option"><input type="radio" name="tipoAcompanhamento" value="Particular" checked={formData.tipoAcompanhamento === "Particular"} onChange={handleChange} required/> Particular</label>
                    </div>
                    <div className="input-group">
                        <label>Especialidade:</label>
                        <select id="especialidadeMedica" name="especialidadeMedica" value={formData.especialidadeMedica || ""} onChange={handleEspecialidadeChange} required>
                            <option value="">Selecione</option>
                            {especialidadesMedicas.map((e) => (<option key={e} value={e}>{e}</option>))}
                        </select>
                    </div>
                    {mostrarOutraEspecialidade && (<input type="text" name="outraEspecialidade" value={formData.outraEspecialidade || ""} onChange={handleChange} placeholder="Especifique" required style={{marginTop:'10px'}}/>)}
                </div>
            )}
            {mostrarOutroAcompanhamento && (<input type="text" name="outroAcompanhamento" value={formData.outroAcompanhamento || ""} onChange={handleChange} placeholder="Especifique" required style={{marginTop:'10px'}}/>)}
        </fieldset>
      </div>
      
      {/* Gastos Fixos de Saúde e Alimentação simplificados para caber no espaço, seguindo a mesma lógica */}
      <div className="col-6">
        <fieldset>
          <legend>Gastos Saúde</legend>
          {[{ id: "consultas", label: "Consultas" }, { id: "medicacao", label: "Medicação" }, { id: "planoSaude", label: "Plano de Saúde" }, { id: "outro", label: "Outro" }].map(({id, label}) => (
            
            <div key={id} style={{display:'flex', justifyContent:'space-between', alignItems: 'center', minHeight: '40px', marginBottom:'5px'}}>
              
              {/* Checkbox e Label agrupados e alinhados */}
              <div className="checkbox-option" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                      type="checkbox" 
                      id={id} 
                      value={id} 
                      checked={formData.gastosSaude?.includes(id)} 
                      onChange={(e)=>{ const { checked, value } = e.target; const novos = checked ? [...(formData.gastosSaude||[]), value] : (formData.gastosSaude||[]).filter(i=>i!==value); handleChange({target:{name:"gastosSaude", value:novos}}); if(!checked){ const nv = {...(formData.valoresGastosSaude||{})}; deletenv[value]; handleChange({target:{name:"valoresGastosSaude", value:nv}});} }}
                  />
                  <label htmlFor={id} style={{ margin: 0, cursor: 'pointer' }}>
                      {label}
                  </label>
              </div>

              {/* Input de valor */}
              {formData.gastosSaude?.includes(id) && (
                  <input 
                      type="text" 
                      placeholder="R$" 
                      style={{width:'120px', padding: '4px 8px'}} 
                      value={formData.valoresGastosSaude?.[id] || ""} 
                      onChange={(e) => { const vf = formatarMoeda(e.target.value); handleChange({target:{name:"valoresGastosSaude", value:{...(formData.valoresGastosSaude||{}), [id]:vf}}}); }}
                  />
              )}
            </div>
          ))}
        </fieldset>
      </div>

<div className="col-6">
  <fieldset>
    <legend>Gastos Alimentação</legend>
    {[{ id: "alimentacaoDinheiro", label: "Dinheiro" }, { id: "alimentacaoVale", label: "Vale" }, { id: "alimentacaoPratoCheio", label: "Prato Cheio" }].map(({id, label}) => (
        
        <div key={id} style={{display:'flex', justifyContent:'space-between', alignItems: 'center', minHeight: '40px', marginBottom:'5px'}}>
             
             <div className="checkbox-option" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                    type="checkbox" 
                    id={id} 
                    value={id} 
                    checked={formData.gastosAlimentacao?.includes(id)} 
                    onChange={(e)=>{ 
                        const { checked, value } = e.target; 
                        const novos = checked ? [...(formData.gastosAlimentacao||[]), value] : (formData.gastosAlimentacao||[]).filter(i=>i!==value); 
                        handleChange({target:{name:"gastosAlimentacao", value:novos}}); 
                        if(!checked){ 
                            const nv = {...(formData.valoresGastosAlimentacao||{})}; 
                            delete nv[value];
                            handleChange({target:{name:"valoresGastosAlimentacao", value:nv}});
                        } 
                    }}
                />
                <label htmlFor={id} style={{ margin: 0, cursor: 'pointer' }}>{label}</label>
             </div>

             {formData.gastosAlimentacao?.includes(id) && (
                <input 
                    type="text" 
                    placeholder="R$" 
                    style={{width:'120px', padding: '4px 8px'}} 
                    value={formData.valoresGastosAlimentacao?.[id] || ""} 
                    onChange={(e) => { 
                        const vf = formatarMoeda(e.target.value); 
                        handleChange({target:{name:"valoresGastosAlimentacao", value:{...(formData.valoresGastosAlimentacao||{}), [id]:vf}}}); 
                    }}
                />
             )}
        </div>
    ))}
  </fieldset>
</div>

      <div className="input-group col-12">
        <label>Despesas Mensais da Casa (R$)</label>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'10px'}}>
            <input type="text" name="gastoAgua" value={formData.gastoAgua || ""} onChange={handleGastoAguaChange} placeholder="Água"/>
            <input type="text" name="gastoEnergia" value={formData.gastoEnergia || ""} onChange={handleGastoEnergiaChange} placeholder="Energia"/>
            <input type="text" name="gastoInternet" value={formData.gastoInternet || ""} onChange={handleGastoInternetChange} placeholder="Internet"/>
            <input type="text" name="gastoCondominio" value={formData.gastoCondominio || ""} onChange={handleGastoCondominioChange} placeholder="Condomínio"/>
        </div>
      </div>

      <div className="col-12">
        <fieldset>
          <legend>Como soube dos serviços do IESB?</legend>
        <div className="checkbox-group">
          {[
            { id: "internetTV", label: "Internet/TV" },
            { id: "alunoIESB", label: "Sou/fui aluno(a) do IESB" },
            {
              id: "conhecidoIESB",
              label: "Conheço alguém que estuda ou trabalha no IESB",
            },
            { id: "outrosServicosIESB", label: "Outros Serviços do IESB" },
            { id: "redeSocio", label: "Rede sócio-assistencial" },
          ].map(({ id, label }) => (
            <div key={id} className="checkbox-option">
              <input
                type="checkbox"
                id={id}
                value={id}
                checked={isSelecionado("comoSoubeIESB", id)}
                onChange={handleComoSoubeChange}
              />
              <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
            </div>
          ))}
        </div>

        {/* Campo condicional: aparece se 'redeSocio' for selecionado. */}
        {mostrarOpcoesRedeSocio && (
          <>
            <div className="campo">
              <label htmlFor="fonteRedeSocio">
                Especifique a rede sócio-assistencial: *
              </label>
              <select
                id="fonteRedeSocio"
                name="fonteRedeSocio"
                value={formData.fonteRedeSocio || ""}
                onChange={handleFonteRedeSocioChange}
                required
              >
                <option value="">Selecione</option>
                <option value="Conselho Tutelar">Conselho Tutelar</option>
                <option value="Hospital">Hospital</option>
                <option value="CESAM">CESAM</option>
                <option value="CAPS">CAPS</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Campo condicional: aparece se 'Outro' for selecionado no select acima. */}
            {mostrarOutroRedeSocio && (
              <div className="campo">
                <label htmlFor="outroFonteRedeSocio">Especifique: *</label>
                <input
                  type="text"
                  id="outroFonteRedeSocio"
                  name="outroFonteRedeSocio"
                  value={formData.outroFonteRedeSocio || ""}
                  onChange={handleChange}
                  placeholder="Informe a origem"
                  required
                />
              </div>
            )}
          </>
        )}
        </fieldset>
      </div>
      <div className="col-12 button-group">
        <button type="button" onClick={anteriorEtapa}>Voltar</button>
        <button type="button" onClick={proximaEtapa}>Avançar</button>
      </div>
    </div>
  );
}
export default Etapa2;