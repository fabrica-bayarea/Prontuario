import React from "react";

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

function Etapa2({ register, errors, watch, setValue, proximaEtapa, anteriorEtapa }: EtapaProps) {
  const formatarMoeda = (valor) => {
    if (!valor) return "";
    let somenteNumeros = String(valor).replace(/\D/g, "");
    if (somenteNumeros === "") return "";
    let numero = Number(somenteNumeros) / 100;
    return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const desformatarMoeda = (valor) => {
    if (!valor) return 0;
    let somenteNumeros = String(valor).replace(/\D/g, "");
    if (somenteNumeros === "") return 0;
    return parseFloat(somenteNumeros) / 100;
  };

  // Observando valores para renderização condicional
  const suaCasaE = watch("suaCasaE");
  const origemRenda = watch("origemRenda");
  const beneficioSocial = watch("beneficioSocial");
  const quaisBeneficios = watch("quaisBeneficios") || [];
  const valoresBeneficios = watch("valoresBeneficios") || {};
  const outroBeneficioValor = watch("outroBeneficioValor");
  const suaCasaEstuda = watch("suaCasaEstuda");
  const residemSuaCasa = watch("residemSuaCasa") || [];
  const residenciaDeficiencia = watch("residenciaDeficiencia");
  const quaisDeficiencia = watch("quaisDeficiencia") || [];
  const acompanhamentoMedico = watch("acompanhamentoMedico");
  const especialidadeMedica = watch("especialidadeMedica");
  const gastosSaude = watch("gastosSaude") || [];
  const valoresGastosSaude = watch("valoresGastosSaude") || {};
  const gastosAlimentacao = watch("gastosAlimentacao") || [];
  const valoresGastosAlimentacao = watch("valoresGastosAlimentacao") || {};
  const comoSoubeIESB = watch("comoSoubeIESB") || [];
  const fonteRedeSocio = watch("fonteRedeSocio");

  // Handlers customizados para os arrays e formatações
  const handleCheckboxArray = (e, campo, valoresAtuais) => {
    const { value, checked } = e.target;
    if (checked) {
      setValue(campo, [...valoresAtuais, value], { shouldValidate: true });
    } else {
      setValue(campo, valoresAtuais.filter((v) => v !== value), { shouldValidate: true });
    }
  };

  const handleResidemCasaChange = (e) => {
    const { value, checked } = e.target;
    if (value === "naoTem") {
      setValue("residemSuaCasa", checked ? ["naoTem"] : [], { shouldValidate: true });
    } else {
      if (checked) {
        setValue("residemSuaCasa", [...residemSuaCasa.filter(v => v !== "naoTem"), value], { shouldValidate: true });
      } else {
        setValue("residemSuaCasa", residemSuaCasa.filter(v => v !== value), { shouldValidate: true });
      }
    }
  };

  return (
    <div className="form-grid">
      <div className="input-group col-6">
        <label htmlFor="pessoasPorCasa">Quantas pessoas residem na sua casa? *</label>
        <input type="number" id="pessoasPorCasa" {...register("pessoasPorCasa")} min="1" />
        {errors.pessoasPorCasa && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.pessoasPorCasa.message}</span>}
      </div>

      <div className="input-group col-6">
        <label htmlFor="suaCasaE">Sua casa é: *</label>
        <select id="suaCasaE" {...register("suaCasaE")}>
          <option value="">Selecione</option>
          <option value="Quitada">Própria (Quitada)</option>
          <option value="Financiada">Própria (Financiada)</option>
          <option value="Cedida">Cedida (Parentes, amigos, etc)</option>
          <option value="Alugada">Alugada</option>
          <option value="Outro">Outro</option>
        </select>
        {errors.suaCasaE && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.suaCasaE.message}</span>}
        
        {suaCasaE === "Alugada" && (
          <input type="text" value={watch("valorAluguel") || ""} onChange={(e) => setValue("valorAluguel", formatarMoeda(e.target.value))} placeholder="Valor do aluguel" style={{marginTop: '10px'}}/>
        )}
        {suaCasaE === "Outro" && (
          <input type="text" {...register("outroTipoCasa")} placeholder="Digite o tipo de residência" style={{marginTop: '10px'}}/>
        )}
      </div>

      <div className="input-group col-6">
        <label htmlFor="rendaFamiliar">Qual é sua renda familiar? *</label>
        <select id="rendaFamiliar" {...register("rendaFamiliar")}>
          <option value="">Selecione</option>
          <option value="Nenhuma">Nenhuma</option>
          <option value="MeioUm">De 1/2 até 1 salário mínimo.</option>
          <option value="DeUmAteTres">De 1 a 3 salários mínimos</option>
          <option value="DeTresAteQuatro">De 3 a 4 salários mínimos.</option>
          <option value="AcimaDeQuatro">Acima de 4 salários mínimos.</option>
        </select>
        {errors.rendaFamiliar && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.rendaFamiliar.message}</span>}
      </div>

      <div className="input-group col-6">
        <label htmlFor="origemRenda">Origem principal de sua renda: *</label>
        <select id="origemRenda" {...register("origemRenda")}>
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
        {errors.origemRenda && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.origemRenda.message}</span>}
        {origemRenda === "Outro" && (
          <input type="text" {...register("outroOrigemRenda")} placeholder="Digite a origem da renda" style={{marginTop:'10px'}}/>
        )}
      </div>

      <div className="input-group col-6">
        <label htmlFor="CADUnico">Informe o seu CADÚnico:</label>
        <input type="text" id="CADUnico" {...register("CADUnico")} />
      </div>

      <div className="col-12">
        <fieldset>
            <legend>Benefícios Sociais</legend>
            <div className="input-group">
                <label htmlFor="beneficioSocial">Sua família recebe algum benefício social? *</label>
                <select id="beneficioSocial" {...register("beneficioSocial")}>
                <option value="">Selecione</option>
                <option value="Nao">Não</option>
                <option value="Sim">Sim</option>
                </select>
            </div>
            
            {beneficioSocial === "Sim" && (
                <div className="checkbox-group" style={{marginTop:'15px'}}>
                <label>Quais benefícios? *</label>
                {[
                    { id: "bolsaFamilia", label: "Bolsa Família" }, { id: "pratoCheio", label: "Prato Cheio" }, { id: "materialEscolar", label: "Cartão Material Escolar" }, { id: "valeGasBPC", label: "Cartão Vale Gás / BPC-LOAS" }, { id: "dfSocial", label: "DF Social" }, { id: "cartaoCreche", label: "Cartão Creche" }, { id: "habitacaoSocial", label: "Habitação Social" }, { id: "tarifaEletrica", label: "Tarifa Social de Energia Elétrica", }, { id: "tarifaAguaEsgoto", label: "Tarifa Social de Água e Esgoto" },
                ].map(({ id, label }) => (
                    <div key={id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
                        <div className="checkbox-option">
                            <input type="checkbox" id={id} value={id} checked={quaisBeneficios.includes(id)} onChange={(e) => handleCheckboxArray(e, "quaisBeneficios", quaisBeneficios)}/>
                            <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
                        </div>
                        {quaisBeneficios.includes(id) && (
                            <input type="text" placeholder="R$" value={valoresBeneficios[id] || ""} onChange={(e) => setValue("valoresBeneficios", {...valoresBeneficios, [id]: formatarMoeda(e.target.value)})} style={{width: '100px'}}/>
                        )}
                    </div>
                ))}
                 <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'10px'}}>
                     <label style={{marginBottom:0}}>Outro:</label>
                     <input type="text" {...register("outroBeneficio")} placeholder="Benefício" style={{flex:1}}/>
                     <input type="text" value={outroBeneficioValor || ""} onChange={(e) => setValue("outroBeneficioValor", formatarMoeda(e.target.value))} placeholder="R$" style={{width:'100px'}}/>
                 </div>
                 <div style={{marginTop:'15px', fontWeight:'bold', textAlign:'right'}}>
                     Total: {(() => { const total = Object.values(valoresBeneficios).reduce<number>((acc, val) => acc + desformatarMoeda(val as string), 0) + desformatarMoeda(outroBeneficioValor as string); return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); })()}
                 </div>
                </div>
            )}
        </fieldset>
      </div>

      <div className="col-12">
          <div className="input-group">
            <label htmlFor="suaCasaEstuda">Entre as pessoas que residem em sua casa, alguma estuda em escola ou faculdade particular? *</label>
            <select id="suaCasaEstuda" {...register("suaCasaEstuda")}>
            <option value="">Selecione</option>
            <option value="Nao">Não</option>
            <option value="Sim">Sim</option>
            </select>
          </div>
          {suaCasaEstuda === "Sim" && (
            <div className="input-group" style={{marginTop:'10px'}}>
            <label htmlFor="valorMensalidade">Qual o valor da mensalidade? *</label>
            <input type="text" id="valorMensalidade" value={watch("valorMensalidade") || ""} onChange={(e) => setValue("valorMensalidade", formatarMoeda(e.target.value))} placeholder="Valor da mensalidade (R$)"/>
            </div>
          )}
      </div>

      <div className="col-12">
        <fieldset>
          <legend>Pessoas na residência</legend>
          <div className="checkbox-group">
            {[ { id: "gestante", label: "Gestante" }, { id: "idoso", label: "Idoso (Acima de 60 anos)" }, { id: "pcd", label: "PCD" }, { id: "naoTem", label: "Não tem" } ].map(({ id, label }) => (
                <div key={id} className="checkbox-option">
                <input type="checkbox" id={id} value={id} checked={residemSuaCasa.includes(id)} onChange={handleResidemCasaChange} disabled={id !== "naoTem" && residemSuaCasa.includes("naoTem")}/>
                <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
                </div>
            ))}
          </div>
          {errors.residemSuaCasa && <span style={{color: 'red', fontSize: '0.8em'}}>{errors.residemSuaCasa.message}</span>}
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset>
           <legend>Doenças Crônicas</legend>
           <div className="checkbox-group" style={{display:'grid', gridTemplateColumns:'1fr 1fr'}}>
            {[ { id: "nenhumaDoenca", label: "Não" }, { id: "cancer", label: "Câncer" }, { id: "hipertensao", label: "Hipertensão" }, { id: "doencaRenal", label: "Doença Renal" }, { id: "asma", label: "Asma" }, { id: "diabetes", label: "Diabetes" }, { id: "hiv", label: "HIV" } ].map(({ id, label }) => (
                <div key={id} className="checkbox-option">
                <input type="checkbox" id={id} value={id} checked={watch("residenciaDoencaCronica")?.includes(id) || false} onChange={(e) => handleCheckboxArray(e, "residenciaDoencaCronica", watch("residenciaDoencaCronica") || [])}/>
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
                <select id="residenciaDeficiencia" {...register("residenciaDeficiencia")}>
                    <option value="">Selecione</option>
                    <option value="Nao">Não</option>
                    <option value="Sim">Sim</option>
                </select>
            </div>
            {residenciaDeficiencia === "Sim" && (
                <div className="checkbox-group" style={{marginTop:'15px'}}>
                 <label>Quais?</label>
                 {[ { id: "def_fisica", label: "Física (motora)" }, { id: "def_visual", label: "Visual" }, { id: "def_auditiva", label: "Auditiva" }, { id: "def_intelectual", label: "Intelectual" }, { id: "def_autismo", label: "Transtorno do Espectro Autista (TEA)", }, { id: "def_esquizofrenia", label: "Esquizofrenia" }, { id: "def_depressao_grave", label: "Depressão grave" }, { id: "def_outra", label: "Outra" } ].map(({ id, label }) => (
                    <div key={id} className="checkbox-option">
                        <input type="checkbox" id={id} value={id} checked={quaisDeficiencia.includes(id)} onChange={(e) => handleCheckboxArray(e, "quaisDeficiencia", quaisDeficiencia)}/>
                        <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
                    </div>
                 ))}
                 {quaisDeficiencia.includes("def_outra") && (
                     <div className="input-group" style={{marginTop:'10px'}}>
                        <input type="text" {...register("outraDeficienciaEspecifique")} placeholder="Especifique"/>
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
                <select id="acompanhamentoMedico" {...register("acompanhamentoMedico")}>
                    <option value="">Selecione</option>
                    <option value="Nao">Não</option>
                    <option value="Sim">Sim</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
            {acompanhamentoMedico === "Sim" && (
                <div style={{marginTop:'15px'}}>
                    <div className="radio-group" style={{flexDirection:'row', gap:'20px', marginBottom:'10px'}}>
                        <label className="radio-option"><input type="radio" value="Publico" {...register("tipoAcompanhamento")}/> Público</label>
                        <label className="radio-option"><input type="radio" value="Particular" {...register("tipoAcompanhamento")}/> Particular</label>
                    </div>
                    <div className="input-group">
                        <label>Especialidade:</label>
                        <select id="especialidadeMedica" {...register("especialidadeMedica")}>
                            <option value="">Selecione</option>
                            {["Cardiologia", "Clínica Geral", "Dermatologia", "Endocrinologia", "Fisioterapia", "Ginecologia", "Neurologia", "Nutrição", "Ortopedia", "Pediatria", "Psicologia", "Psiquiatria", "Outra"].map((e) => (<option key={e} value={e}>{e}</option>))}
                        </select>
                    </div>
                    {especialidadeMedica === "Outra" && (<input type="text" {...register("outraEspecialidade")} placeholder="Especifique" style={{marginTop:'10px'}}/>)}
                </div>
            )}
            {acompanhamentoMedico === "Outro" && (<input type="text" {...register("outroAcompanhamento")} placeholder="Especifique" style={{marginTop:'10px'}}/>)}
        </fieldset>
      </div>
      
      <div className="col-6">
        <fieldset>
          <legend>Gastos Saúde</legend>
          {[{ id: "consultas", label: "Consultas" }, { id: "medicacao", label: "Medicação" }, { id: "planoSaude", label: "Plano de Saúde" }, { id: "outro", label: "Outro" }].map(({id, label}) => (
            <div key={id} style={{display:'flex', justifyContent:'space-between', alignItems: 'center', minHeight: '40px', marginBottom:'5px'}}>
              <div className="checkbox-option" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id={id} value={id} checked={gastosSaude.includes(id)} onChange={(e) => handleCheckboxArray(e, "gastosSaude", gastosSaude)} />
                  <label htmlFor={id} style={{ margin: 0, cursor: 'pointer' }}>{label}</label>
              </div>
              {gastosSaude.includes(id) && (
                  <input type="text" placeholder="R$" style={{width:'120px', padding: '4px 8px'}} value={valoresGastosSaude[id] || ""} onChange={(e) => setValue("valoresGastosSaude", {...valoresGastosSaude, [id]: formatarMoeda(e.target.value)})} />
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
                      <input type="checkbox" id={id} value={id} checked={gastosAlimentacao.includes(id)} onChange={(e) => handleCheckboxArray(e, "gastosAlimentacao", gastosAlimentacao)} />
                      <label htmlFor={id} style={{ margin: 0, cursor: 'pointer' }}>{label}</label>
                   </div>
                   {gastosAlimentacao.includes(id) && (
                      <input type="text" placeholder="R$" style={{width:'120px', padding: '4px 8px'}} value={valoresGastosAlimentacao[id] || ""} onChange={(e) => setValue("valoresGastosAlimentacao", {...valoresGastosAlimentacao, [id]: formatarMoeda(e.target.value)})} />
                   )}
              </div>
          ))}
        </fieldset>
      </div>

      <div className="input-group col-12">
        <label>Despesas Mensais da Casa (R$)</label>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'10px'}}>
            <input type="text" value={watch("gastoAgua") || ""} onChange={(e) => setValue("gastoAgua", formatarMoeda(e.target.value))} placeholder="Água"/>
            <input type="text" value={watch("gastoEnergia") || ""} onChange={(e) => setValue("gastoEnergia", formatarMoeda(e.target.value))} placeholder="Energia"/>
            <input type="text" value={watch("gastoInternet") || ""} onChange={(e) => setValue("gastoInternet", formatarMoeda(e.target.value))} placeholder="Internet"/>
            <input type="text" value={watch("gastoCondominio") || ""} onChange={(e) => setValue("gastoCondominio", formatarMoeda(e.target.value))} placeholder="Condomínio"/>
        </div>
      </div>

      <div className="col-12">
        <fieldset>
          <legend>Como soube dos serviços do IESB?</legend>
        <div className="checkbox-group">
          {[
            { id: "internetTV", label: "Internet/TV" }, { id: "alunoIESB", label: "Sou/fui aluno(a) do IESB" }, { id: "conhecidoIESB", label: "Conheço alguém que estuda ou trabalha no IESB" }, { id: "outrosServicosIESB", label: "Outros Serviços do IESB" }, { id: "redeSocio", label: "Rede sócio-assistencial" },
          ].map(({ id, label }) => (
            <div key={id} className="checkbox-option">
              <input type="checkbox" id={id} value={id} checked={comoSoubeIESB.includes(id)} onChange={(e) => handleCheckboxArray(e, "comoSoubeIESB", comoSoubeIESB)} />
              <label htmlFor={id} style={{marginBottom:0}}>{label}</label>
            </div>
          ))}
        </div>

        {comoSoubeIESB.includes("redeSocio") && (
          <>
            <div className="campo">
              <label htmlFor="fonteRedeSocio">Especifique a rede sócio-assistencial: *</label>
              <select id="fonteRedeSocio" {...register("fonteRedeSocio")}>
                <option value="">Selecione</option>
                <option value="Conselho Tutelar">Conselho Tutelar</option>
                <option value="Hospital">Hospital</option>
                <option value="CESAM">CESAM</option>
                <option value="CAPS">CAPS</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            {fonteRedeSocio === "Outro" && (
              <div className="campo">
                <label htmlFor="outroFonteRedeSocio">Especifique: *</label>
                <input type="text" {...register("outroFonteRedeSocio")} placeholder="Informe a origem" />
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