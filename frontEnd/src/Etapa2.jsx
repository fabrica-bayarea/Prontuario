import React, { useState } from "react";

function Etapa2({ formData, handleChange, proximaEtapa, anteriorEtapa }) {
  const [mostrarOutroCampo, setMostrarOutroCampo] = useState(false);
  const [mostrarCampoAluguel, setMostrarCampoAluguel] = useState(false);
  const [mostrarOutroOrigemRenda, setMostrarOutroOrigemRenda] = useState(false);
  const [mostrarQuaisBeneficios, setMostrarQuaisBeneficios] = useState(false);
  const [mostrarQuaisDeficiencias, setMostrarQuaisDeficiencias] =
    useState(false);
  const [mostrarCampoMensalidade, setMostrarCampoMensalidade] = useState(false);
  const [mostrarOpcoesAcompanhamento, setMostrarOpcoesAcompanhamento] =
    useState(false);
  const [mostrarOutroAcompanhamento, setMostrarOutroAcompanhamento] =
    useState(false);
  const [mostrarOutraEspecialidade, setMostrarOutraEspecialidade] =
    useState(false);
  const [mostrarOpcoesFinanciamento, setMostrarOpcoesFinanciamento] =
    useState(false);
  const [mostrarOpcoesRedeSocio, setMostrarOpcoesRedeSocio] = useState(false);
  const [mostrarOutroRedeSocio, setMostrarOutroRedeSocio] = useState(false);

  const especialidadesMedicas = [
    "Cardiologia",
    "Clínica Geral",
    "Dermatologia",
    "Endocrinologia",
    "Fisioterapia",
    "Ginecologia",
    "Neurologia",
    "Nutrição",
    "Ortopedia",
    "Pediatria",
    "Psicologia",
    "Psiquiatria",
    "Outra",
  ];

  const formatarMoeda = (valor) => {
    let somenteNumeros = valor.replace(/\D/g, ""); // Remove tudo que não for dígito.
    if (somenteNumeros === "") return ""; // Retorna vazio se não houver números.
    let numero = Number(somenteNumeros) / 100; // Divide por 100 para tratar os centavos.
    return numero.toLocaleString("pt-BR", {
      // Formata o número para o padrão de moeda brasileiro.
      style: "currency",
      currency: "BRL",
    });
  };

  const desformatarMoeda = (valor) => {
    if (!valor) return 0; // Retorna 0 se o valor for nulo ou indefinido.
    let somenteNumeros = String(valor).replace(/\D/g, ""); // Remove caracteres não numéricos.
    if (somenteNumeros === "") return 0; // Retorna 0 se o resultado for vazio.
    return parseFloat(somenteNumeros) / 100; // Converte para número de ponto flutuante.
  };

  const handleValorAluguelChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    handleChange({ target: { name: "valorAluguel", value: valorFormatado } });
  };

  const handleValorMensalidadeChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    handleChange({
      target: { name: "valorMensalidade", value: valorFormatado },
    });
  };

  const handleEstudaParticularChange = (event) => {
    const { value } = event.target;
    handleChange(event);
    setMostrarCampoMensalidade(value === "Sim");
    if (value !== "Sim") {
      handleChange({ target: { name: "valorMensalidade", value: "" } });
    }
  };

  const handleValorBeneficioChange = (e, beneficioId) => {
    const valorFormatado = formatarMoeda(e.target.value);
    const currentValores = formData.valoresBeneficios || {};
    const novosValoresBeneficios = {
      ...currentValores,
      [beneficioId]: {
        valor: valorFormatado,
      },
    };
    handleChange({
      target: { name: "valoresBeneficios", value: novosValoresBeneficios },
    });
  };

  const handleOutroBeneficioValorChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value); // Formata o valor.
    handleChange({
      target: { name: "outroBeneficioValor", value: valorFormatado },
    });
  };

  const handleResidemCasaChange = (event) => {
    const { value, checked } = event.target;
    const valoresAtuais = formData.residemSuaCasa || []; // Pega o array de valores selecionados.
    let novosValores;
    if (value === "naoTem") {
      novosValores = checked ? ["naoTem"] : [];
    } else {
      if (checked) {
        novosValores = [
          ...valoresAtuais.filter((item) => item !== "naoTem"),
          value,
        ];
      } else {
        novosValores = valoresAtuais.filter((item) => item !== value);
      }
    }
    handleChange({ target: { name: "residemSuaCasa", value: novosValores } });
  };

  const handleSelectChange = (event, setMostrarCampo, campoParaLimpar) => {
    const { value } = event.target;
    handleChange(event);
    setMostrarCampo(value === "Outro" || value === "Sim");
    if (campoParaLimpar && value !== "Outro" && value !== "Sim") {
      handleChange({ target: { name: campoParaLimpar, value: "" } });
    }
  };

  const handleTipoCasaChange = (event) => {
    const { value } = event.target;
    handleChange(event);
    setMostrarOutroCampo(value === "Outro");
    setMostrarCampoAluguel(value === "Alugada");
    if (value !== "Outro") {
      handleChange({ target: { name: "outroTipoCasa", value: "" } });
    }
    if (value !== "Alugada") {
      handleChange({ target: { name: "valorAluguel", value: "" } });
    }
  };

  const handleOrigemRendaChange = (event) =>
    handleSelectChange(event, setMostrarOutroOrigemRenda, "outroOrigemRenda");

  const handleBeneficioSocialChange = (event) => {
    const valor = event.target.value;
    handleChange(event);
    setMostrarQuaisBeneficios(valor === "Sim");
    if (valor !== "Sim") {
      handleChange({ target: { name: "quaisBeneficios", value: [] } });
      handleChange({ target: { name: "outroBeneficio", value: "" } });
      handleChange({ target: { name: "outroBeneficioValor", value: "" } });
      handleChange({ target: { name: "valoresBeneficios", value: {} } });
    }
  };

  const handleDeficienciaChange = (event) => {
    const valor = event.target.value;
    handleChange(event);
    setMostrarQuaisDeficiencias(valor === "Sim");
    if (valor !== "Sim") {
      handleChange({ target: { name: "quaisDeficiencia", value: [] } });
      handleChange({
        target: { name: "outraDeficienciaEspecifique", value: "" },
      });
    }
  };

  const handleCheckboxChange = (event, campo) => {
    const { value, checked } = event.target;
    const valoresAtuais = formData[campo] || [];
    const novosValores = checked
      ? [...valoresAtuais, value]
      : valoresAtuais.filter((item) => item !== value);
    handleChange({
      target: { name: campo, value: novosValores },
    });
    if (campo === "quaisDeficiencia" && value === "def_outra" && !checked) {
      handleChange({
        target: { name: "outraDeficienciaEspecifique", value: "" },
      });
    }
  };

  const handleAcompanhamentoMedicoChange = (event) => {
    const { value } = event.target;
    handleChange(event);

    setMostrarOpcoesAcompanhamento(value === "Sim");
    setMostrarOutroAcompanhamento(value === "Outro");

    if (value !== "Sim") {
      handleChange({ target: { name: "tipoAcompanhamento", value: "" } });
      // Limpa os campos de especialidade.
      handleChange({ target: { name: "especialidadeMedica", value: "" } });
      handleChange({ target: { name: "outraEspecialidade", value: "" } });
      setMostrarOutraEspecialidade(false); // Esconde o campo "outra" especialidade.
    }
    if (value !== "Outro") {
      handleChange({ target: { name: "outroAcompanhamento", value: "" } });
    }
  };

  const handleEspecialidadeChange = (event) => {
    const { value } = event.target;
    handleChange(event); // Atualiza o valor da especialidade selecionada.

    setMostrarOutraEspecialidade(value === "Outra");

    if (value !== "Outra") {
      handleChange({ target: { name: "outraEspecialidade", value: "" } });
    }
  };

  const handlePossuiFinanciamentoChange = (event) => {
    const { value } = event.target;
    handleChange(event);
    setMostrarOpcoesFinanciamento(value === "Sim");
    if (value !== "Sim") {
      // Limpa os checkboxes se a resposta não for "Sim"
      handleChange({ target: { name: "tiposFinanciamento", value: [] } });
    }
  };

  const handleGastoAguaChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    handleChange({ target: { name: "gastoAgua", value: valorFormatado } });
  };

  const handleGastoEnergiaChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    handleChange({ target: { name: "gastoEnergia", value: valorFormatado } });
  };

  const handleGastoInternetChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    handleChange({ target: { name: "gastoInternet", value: valorFormatado } });
  };

  const handleGastoCondominioChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value);
    handleChange({
      target: { name: "gastoCondominio", value: valorFormatado },
    });
  };

  const handleComoSoubeChange = (event) => {
    const { value, checked } = event.target;
    const atuais = formData.comoSoubeIESB || [];
    const novos = checked
      ? [...atuais, value]
      : atuais.filter((item) => item !== value);

    handleChange({ target: { name: "comoSoubeIESB", value: novos } });

    // Mostra ou esconde o select da rede sócio-assistencial
    if (value === "redeSocio") {
      setMostrarOpcoesRedeSocio(checked);
      // Se desmarcar, limpa os campos dependentes para não enviar dados antigos
      if (!checked) {
        handleChange({ target: { name: "fonteRedeSocio", value: "" } });
        handleChange({ target: { name: "outroFonteRedeSocio", value: "" } });
        setMostrarOutroRedeSocio(false);
      }
    }
  };

  const handleFonteRedeSocioChange = (event) => {
    const { value } = event.target;
    handleChange(event); // Atualiza o valor do select no formData
    setMostrarOutroRedeSocio(value === "Outro");

    // Limpa o campo de texto se a opção não for "Outro"
    if (value !== "Outro") {
      handleChange({ target: { name: "outroFonteRedeSocio", value: "" } });
    }
  };

  const isSelecionado = (campo, valor) =>
    formData[campo]?.includes(valor) || false;

  return (
    <>
      {/* Seção: Quantas pessoas residem na sua casa? */}
      <div className="campo">
        <label htmlFor="pessoasPorCasa">
          Quantas pessoas residem na sua casa? *
        </label>
        <input
          type="number"
          id="pessoasPorCasa"
          name="pessoasPorCasa"
          value={formData.pessoasPorCasa || ""} // Garante que o valor seja controlado.
          onChange={handleChange} // Usa a função do componente pai para atualizar o estado.
          min="1" // Define o valor mínimo.
          required // Campo obrigatório.
        />
      </div>

      {/* Seção: Sua casa é */}
      <div className="campo">
        <label htmlFor="suaCasaE">Sua casa é: *</label>
        <select
          id="suaCasaE"
          name="suaCasaE"
          value={formData.suaCasaE || ""}
          onChange={handleTipoCasaChange} // Usa o manipulador específico.
          required
        >
          <option value="">Selecione</option>
          <option value="Quitada">Própria (Quitada)</option>
          <option value="Financiada">Própria (Financiada)</option>
          <option value="Cedida">Cedida (Parentes, amigos, etc)</option>
          <option value="Alugada">Alugada</option>
          <option value="Outro">Outro</option>
        </select>
        {/* Campo condicional: aparece se 'suaCasaE' for 'Alugada'. */}
        {mostrarCampoAluguel && (
          <input
            type="text"
            id="valorAluguel"
            name="valorAluguel"
            value={formData.valorAluguel || ""}
            onChange={handleValorAluguelChange}
            placeholder="Valor do aluguel"
            required
          />
        )}
      </div>

      {/* Campo condicional: aparece se 'suaCasaE' for 'Outro'. */}
      {mostrarOutroCampo && (
        <div className="campo">
          <label htmlFor="outroTipoCasa">Especifique: *</label>
          <input
            type="text"
            id="outroTipoCasa"
            name="outroTipoCasa"
            value={formData.outroTipoCasa || ""}
            onChange={handleChange}
            placeholder="Digite o tipo de residência"
            required
          />
        </div>
      )}

      {/* Seção: Qual é sua renda familiar? */}
      <div className="campo">
        <label htmlFor="rendaFamiliar">Qual é sua renda familiar? *</label>
        <select
          id="rendaFamiliar"
          name="rendaFamiliar"
          value={formData.rendaFamiliar || ""}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="Nenhuma">Nenhuma</option>
          <option value="MeioUm">De 1/2 até 1 salário mínimo.</option>
          <option value="DeUmAteTres">De 1 a 3 salários mínimos</option>
          <option value="DeTresAteQuatro">De 3 a 4 salários mínimos.</option>
          <option value="AcimaDeQuatro">Acima de 4 salários mínimos.</option>
        </select>
      </div>

      {/* Seção: Qual é a origem principal de sua renda familiar? */}
      <div className="campo">
        <label htmlFor="origemRenda">
          Qual é a origem principal de sua renda familiar? *
        </label>
        <select
          id="origemRenda"
          name="origemRenda"
          value={formData.origemRenda || ""}
          onChange={handleOrigemRendaChange} // Usa o manipulador específico.
          required
        >
          <option value="">Selecione</option>
          <option value="SeguroDesemprego">Seguro desemprego.</option>
          <option value="Empregaticio">
            Trabalho com vínculo empregatício
          </option>
          <option value="Bico">Trabalho temporário (bico)</option>
          <option value="Autonomo">Trabalho autônomo</option>
          <option value="Concursado">Servidor público concursado</option>
          <option value="Aposentadoria">Pensão/Aposentadoria</option>
          <option value="PensaoAlimenticia">Pensão alimentícia</option>
          <option value="BeneficioSocial">Programa/Benefício social</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {/* Campo condicional: aparece se 'origemRenda' for 'Outro'. */}
      {mostrarOutroOrigemRenda && (
        <div className="campo">
          <label htmlFor="outroOrigemRenda">Especifique: *</label>
          <input
            type="text"
            id="outroOrigemRenda"
            name="outroOrigemRenda"
            value={formData.outroOrigemRenda || ""}
            onChange={handleChange}
            placeholder="Digite a origem da renda"
            required
          />
        </div>
      )}

      {/* Seção: CADÚnico */}
      <div className="campo">
        <label htmlFor="CADUnico">Informe o seu CADÚnico:</label>
        <input
          type="number"
          id="CADUnico"
          name="CADUnico"
          value={formData.CADUnico || ""}
          onChange={handleChange}
        />
      </div>

      {/* Seção: Sua família recebe algum benefício social? */}
      <div className="campo">
        <label htmlFor="beneficioSocial">
          Sua família recebe algum benefício social? *
        </label>
        <select
          id="beneficioSocial"
          name="beneficioSocial"
          value={formData.beneficioSocial || ""}
          onChange={handleBeneficioSocialChange} // Usa o manipulador específico.
          required
        >
          <option value="">Selecione</option>
          <option value="Nao">Não</option>
          <option value="Sim">Sim</option>
        </select>
      </div>

      {/* Seção condicional: aparece se 'beneficioSocial' for 'Sim'. */}
      {mostrarQuaisBeneficios && (
        <div className="grupo-checkbox">
          <label htmlFor="quaisBeneficios">Quais benefícios? *</label>
          {/* Mapeia um array de objetos para renderizar dinamicamente cada opção de benefício. */}
          {[
            { id: "bolsaFamilia", label: "Bolsa Família" },
            { id: "pratoCheio", label: "Prato Cheio" },
            { id: "materialEscolar", label: "Cartão Material Escolar" },
            { id: "valeGasBPC", label: "Cartão Vale Gás / BPC-LOAS" },
            { id: "dfSocial", label: "DF Social" },
            { id: "cartaoCreche", label: "Cartão Creche" },
            { id: "habitacaoSocial", label: "Habitação Social" },
            {
              id: "tarifaEletrica",
              label: "Tarifa Social de Energia Elétrica",
            },
            { id: "tarifaAguaEsgoto", label: "Tarifa Social de Água e Esgoto" },
          ].map(({ id, label }) => (
            <div key={id} className="beneficio-item">
              <div>
                <input
                  type="checkbox"
                  id={id}
                  value={id}
                  checked={isSelecionado("quaisBeneficios", id)}
                  onChange={(e) => handleCheckboxChange(e, "quaisBeneficios")}
                />
                <label htmlFor={id}>{label}</label>
              </div>
              {/* Campo de valor condicional: aparece se o benefício correspondente estiver marcado. */}
              {isSelecionado("quaisBeneficios", id) && (
                <div className="campo-valor-beneficio">
                  <input
                    type="text"
                    placeholder="Valor (R$)"
                    value={formData.valoresBeneficios?.[id]?.valor || ""}
                    onChange={(e) => handleValorBeneficioChange(e, id)}
                  />
                </div>
              )}
            </div>
          ))}
          {/* Seção para especificar outro benefício. */}
          <div className="beneficio-item">
            <div>
              <label htmlFor="outroBeneficio">Outro:</label>
            </div>
            <div className="outro-beneficio-inputs">
              <input
                type="text"
                id="outroBeneficio"
                name="outroBeneficio"
                value={formData.outroBeneficio || ""}
                onChange={handleChange}
                placeholder="Informe o benefício"
              />
              <input
                type="text"
                name="outroBeneficioValor"
                value={formData.outroBeneficioValor || ""}
                onChange={handleOutroBeneficioValorChange}
                placeholder="Valor (R$)"
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>

          {/* Campo para exibir a soma total dos benefícios. */}
          <div className="campo">
            <strong>
              Total dos benefícios:{" "}
              {/* IIFE (Immediately Invoked Function Expression) para calcular e formatar o total. */}
              {(() => {
                const totalBeneficios = Object.values(
                  formData.valoresBeneficios || {}
                ).reduce(
                  (soma, item) => soma + desformatarMoeda(item.valor),
                  0
                );
                const valorOutro = desformatarMoeda(
                  formData.outroBeneficioValor
                );
                const total = totalBeneficios + valorOutro;
                return total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              })()}
            </strong>
          </div>
        </div>
      )}

      {/* Seção: Alguém estuda em escola particular? */}
      <div className="campo">
        <label htmlFor="suaCasaEstuda">
          Entre as pessoas que residem em sua casa, alguma estuda em escola ou
          faculdade particular? *
        </label>
        <select
          id="suaCasaEstuda"
          name="suaCasaEstuda"
          value={formData.suaCasaEstuda || ""}
          onChange={handleEstudaParticularChange} // Usa manipulador específico.
          required
        >
          <option value="">Selecione</option>
          <option value="Nao">Não</option>
          <option value="Sim">Sim</option>
        </select>
      </div>
      {/* Campo condicional: aparece se a resposta anterior for "Sim". */}
      {mostrarCampoMensalidade && (
        <div className="campo">
          <label htmlFor="valorMensalidade">
            Qual o valor da mensalidade? *
          </label>
          <input
            type="text"
            id="valorMensalidade"
            name="valorMensalidade"
            value={formData.valorMensalidade || ""}
            onChange={handleValorMensalidadeChange}
            placeholder="Valor da mensalidade (R$)"
            required
          />
        </div>
      )}

      {/* Seção: Dentre as pessoas que residem em sua casa alguma é... */}
     
      <div className="grupo-checkbox"> 
        <fieldset>  
          <label htmlFor="residemSuaCasa">
            Dentre as pessoas que residem em sua casa alguma é:
          </label>
          {[
            { id: "gestante", label: "Gestante" },
            { id: "idoso", label: "Idoso (Acima de 60 anos)" },
            { id: "pcd", label: "PCD" },
            { id: "naoTem", label: "Não tem" },
          ].map(({ id, label }) => (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                value={id}
                checked={isSelecionado("residemSuaCasa", id)}
                onChange={handleResidemCasaChange}
                disabled={
                  id !== "naoTem" && isSelecionado("residemSuaCasa", "naoTem")
                }
              />
              <label htmlFor={id}>{label}</label>
            </div>
          ))}
        </fieldset>
     </div> 
      {/* Seção: Doença crônica na família. */}
      <div className="grupo-checkbox">
       <fieldset>    
          <label htmlFor="residenciaDoencaCronica">
            Tem algum familiar de sua residência que possui doença crônica
            (permanente)?
          </label>
          {[
            { id: "nenhumaDoenca", label: "Não" },
            { id: "cancer", label: "Câncer" },
            { id: "hipertensao", label: "Hipertensão" },
            { id: "doencaRenal", label: "Doença Renal" },
            { id: "asma", label: "Asma" },
            { id: "diabetes", label: "Diabetes" },
            { id: "hiv", label: "HIV" },
          ].map(({ id, label }) => (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                value={id}
                checked={isSelecionado("residenciaDoencaCronica", id)}
                onChange={(e) =>
                  handleCheckboxChange(e, "residenciaDoencaCronica")
                }
              />
              <label htmlFor={id}>{label}</label>
          </div>
        ))}
       </fieldset> 
      </div>

      {/* Seção: Deficiência física ou mental na residência. */}
      <div className="campo">
        <label htmlFor="residenciaDeficiencia">
          Alguém em sua residência possui deficiência física ou mental? *
        </label>
        <select
          id="residenciaDeficiencia"
          name="residenciaDeficiencia"
          value={formData.residenciaDeficiencia || ""}
          onChange={handleDeficienciaChange} // Usa manipulador específico.
          required
        >
          <option value="">Selecione</option>
          <option value="Nao">Não</option>
          <option value="Sim">Sim</option>
        </select>
      </div>
      {/* Seção condicional: aparece se a resposta anterior for "Sim". */}
      <fieldset>
      {mostrarQuaisDeficiencias && (
        <div className="grupo-checkbox">
          <label htmlFor="quaisDeficiencia">
            Quais deficiências/condições? *
          </label>
          {[
            { id: "def_fisica", label: "Física (motora)" },
            { id: "def_visual", label: "Visual" },
            { id: "def_auditiva", label: "Auditiva" },
            { id: "def_intelectual", label: "Intelectual" },
            {
              id: "def_autismo",
              label: "Transtorno do Espectro Autista (TEA)",
            },
            { id: "def_esquizofrenia", label: "Esquizofrenia" },
            {
              id: "def_depressao_grave",
              label: "Depressão grave/Transtornos Mentais graves",
            },
            { id: "def_outra", label: "Outra" },
          ].map(({ id, label }) => (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                value={id}
                checked={isSelecionado("quaisDeficiencia", id)}
                onChange={(e) => handleCheckboxChange(e, "quaisDeficiencia")}
              />
              <label htmlFor={id}>{label}</label>
            </div>
          ))}
          {/* Campo condicional: aparece se o checkbox "Outra" estiver marcado. */}
          {isSelecionado("quaisDeficiencia", "def_outra") && (
            <div className="campo">
              <label htmlFor="outraDeficienciaEspecifique">
                Especifique a outra deficiência/condição: *
              </label>
              <input
                type="text"
                id="outraDeficienciaEspecifique"
                name="outraDeficienciaEspecifique"
                value={formData.outraDeficienciaEspecifique || ""}
                onChange={handleChange}
                placeholder="Digite a deficiência ou condição"
                required
              />
            </div>
          )}
        </div>
      )}
      </fieldset>
      {/* Seção: Acompanhamento médico. */}
      <div className="campo">
        <label htmlFor="familiaAcompanhamentoMedico">
          Você ou alguém da sua família faz acompanhamento médico? *
        </label>
        <select
          id="acompanhamentoMedico"
          name="acompanhamentoMedico"
          value={formData.acompanhamentoMedico || ""}
          onChange={handleAcompanhamentoMedicoChange}
          required
        >
          <option value="">Selecione</option>
          <option value="Nao">Não</option>
          <option value="Sim">Sim</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {/* Seção condicional: aparece se a resposta anterior for "Sim". */}
      {mostrarOpcoesAcompanhamento && (
        <>
          <div className="campo grupo-radio">
            <label>Qual o tipo de acompanhamento? *</label>
            <div>
              <input
                type="radio"
                id="acompanhamentoPublico"
                name="tipoAcompanhamento"
                value="Publico"
                checked={formData.tipoAcompanhamento === "Publico"}
                onChange={handleChange}
                required
              />
              <label htmlFor="acompanhamentoPublico">Público</label>
            </div>
            <div>
              <input
                type="radio"
                id="acompanhamentoParticular"
                name="tipoAcompanhamento"
                value="Particular"
                checked={formData.tipoAcompanhamento === "Particular"}
                onChange={handleChange}
                required
              />
              <label htmlFor="acompanhamentoParticular">Particular</label>
            </div>
          </div>

          <div className="campo">
            <label htmlFor="especialidadeMedica">
              Qual a especialidade médica você acompanha? *
            </label>
            <select
              id="especialidadeMedica"
              name="especialidadeMedica"
              value={formData.especialidadeMedica || ""}
              onChange={handleEspecialidadeChange}
              required
            >
              <option value="">Selecione uma especialidade</option>
              {/* Mapeia o array de especialidades para criar as opções dinamicamente. */}
              {especialidadesMedicas.map((especialidade) => (
                <option key={especialidade} value={especialidade}>
                  {especialidade}
                </option>
              ))}
            </select>
          </div>
          {/* Campo condicional: aparece se a especialidade "Outra" for selecionada. */}
          {mostrarOutraEspecialidade && (
            <div className="campo">
              <label htmlFor="outraEspecialidade">
                Especifique a outra especialidade: *
              </label>
              <input
                type="text"
                id="outraEspecialidade"
                name="outraEspecialidade"
                value={formData.outraEspecialidade || ""}
                onChange={handleChange}
                placeholder="Digite a especialidade"
                required
              />
            </div>
          )}
        </>
      )}

      {/* Campo condicional: aparece se a resposta para acompanhamento médico for "Outro". */}
      {mostrarOutroAcompanhamento && (
        <div className="campo">
          <label htmlFor="outroAcompanhamento">Especifique: *</label>
          <input
            type="text"
            id="outroAcompanhamento"
            name="outroAcompanhamento"
            value={formData.outroAcompanhamento || ""}
            onChange={handleChange}
            placeholder="Especifique o acompanhamento"
            required
          />
        </div>
      )}

      {/* A família possui gastos fixos com saúde? */}
      <fieldset>
      <div className="grupo-checkbox">
        <label htmlFor="gastosFixosSaude">
          A família possui gastos fixos com saúde?
        </label>

        {[
          { id: "consultas", label: "Consultas" },
          { id: "medicacao", label: "Medicação" },
          { id: "planoSaude", label: "Plano de Saúde" },
          { id: "outro", label: "Outro" },
        ].map(({ id, label }) => (
          <div key={id} style={{ marginBottom: "5px" }}>
            <input
              type="checkbox"
              id={id}
              value={id}
              checked={formData.gastosSaude?.includes(id) || false}
              onChange={(e) => {
                const { checked, value } = e.target;
                const atuais = formData.gastosSaude || [];
                const novos = checked
                  ? [...atuais, value]
                  : atuais.filter((item) => item !== value);

                handleChange({ target: { name: "gastosSaude", value: novos } });

                // Se desmarcar, limpa o valor
                if (!checked) {
                  const novosValores = {
                    ...(formData.valoresGastosSaude || {}),
                  };
                  delete novosValores[value];
                  handleChange({
                    target: { name: "valoresGastosSaude", value: novosValores },
                  });
                }
              }}
            />
            <label htmlFor={id}>{label}</label>

            {/* Campo de valor se o item estiver marcado */}
            {formData.gastosSaude?.includes(id) && (
              <input
                type="text"
                placeholder="Valor (R$)"
                value={formData.valoresGastosSaude?.[id] || ""}
                onChange={(e) => {
                  const valorFormatado = formatarMoeda(e.target.value);
                  handleChange({
                    target: {
                      name: "valoresGastosSaude",
                      value: {
                        ...(formData.valoresGastosSaude || {}),
                        [id]: valorFormatado,
                      },
                    },
                  });
                }}
                style={{ marginLeft: "10px" }}
              />
            )}
          </div>
        ))}

        {/* Totalizador */}
        {formData.gastosSaude?.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <strong>
              Total de despesas médicas:{" "}
              {(() => {
                const total = Object.values(
                  formData.valoresGastosSaude || {}
                ).reduce((soma, valor) => soma + desformatarMoeda(valor), 0);
                return total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              })()}
            </strong>
          </div>
        )}
      </div>
        </fieldset>
      {/* Gasto com alimentação */}
      <fieldset>
      <div className="grupo-checkbox">
        <label htmlFor="gastosAlimentacao">Gasto com alimentação </label>

        {[
          { id: "alimentacaoDinheiro", label: "Dinheiro" },
          { id: "alimentacaoVale", label: "Vale-alimentação" },
          { id: "alimentacaoPratoCheio", label: "Cartão Prato Cheio" },
        ].map(({ id, label }) => (
          <div key={id} style={{ marginBottom: "5px" }}>
            <input
              type="checkbox"
              id={id}
              value={id}
              checked={formData.gastosAlimentacao?.includes(id) || false}
              onChange={(e) => {
                const { checked, value } = e.target;
                const atuais = formData.gastosAlimentacao || [];
                const novos = checked
                  ? [...atuais, value]
                  : atuais.filter((item) => item !== value);

                handleChange({
                  target: { name: "gastosAlimentacao", value: novos },
                });

                // Se o checkbox for desmarcado, limpa o valor monetário associado
                if (!checked) {
                  const novosValores = {
                    ...(formData.valoresGastosAlimentacao || {}),
                  };
                  delete novosValores[value];
                  handleChange({
                    target: {
                      name: "valoresGastosAlimentacao",
                      value: novosValores,
                    },
                  });
                }
              }}
            />
            <label htmlFor={id}>{label}</label>

            {/* Campo de valor que aparece se o item estiver marcado */}
            {formData.gastosAlimentacao?.includes(id) && (
              <input
                type="text"
                placeholder="Valor (R$)"
                value={formData.valoresGastosAlimentacao?.[id] || ""}
                onChange={(e) => {
                  const valorFormatado = formatarMoeda(e.target.value);
                  handleChange({
                    target: {
                      name: "valoresGastosAlimentacao",
                      value: {
                        ...(formData.valoresGastosAlimentacao || {}),
                        [id]: valorFormatado,
                      },
                    },
                  });
                }}
                style={{ marginLeft: "10px" }}
              />
            )}
          </div>
        ))}

        {/* Totalizador de gastos com alimentação */}
        {formData.gastosAlimentacao?.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <strong>
              Total de gastos com alimentação:{" "}
              {(() => {
                const total = Object.values(
                  formData.valoresGastosAlimentacao || {}
                ).reduce((soma, valor) => soma + desformatarMoeda(valor), 0);
                return total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
              })()}
            </strong>
          </div>
        )}
      </div>
        </fieldset>
      {/* Possui algum financiamento */}

      <div className="campo">
        <label htmlFor="financiamento">Possui algum financiamento? *</label>
        <select
          id="possuiFinanciamento"
          name="possuiFinanciamento"
          value={formData.possuiFinanciamento || ""}
          onChange={handlePossuiFinanciamentoChange}
          required
        >
          <option value="">Selecione</option>
          <option value="Nao">Não</option>
          <option value="Sim">Sim</option>
        </select>
      </div>

      {/* Seção condicional: aparece se 'possuiFinanciamento' for 'Sim'. */}
      {mostrarOpcoesFinanciamento && (
        <div className="grupo-checkbox">
          <label>Se sim, quais? *</label>
          {[
            { id: "financiamentoBancario", label: "Financiamento Bancário" },
            {
              id: "financiamentoImobiliario",
              label: "Financiamento Imobiliário",
            },
            { id: "financiamentoVeicular", label: "Financiamento Veicular" },
          ].map(({ id, label }) => (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                value={id}
                checked={isSelecionado("tiposFinanciamento", id)}
                onChange={(e) => handleCheckboxChange(e, "tiposFinanciamento")}
              />
              <label htmlFor={id}>{label}</label>
            </div>
          ))}
        </div>
      )}

      {/* Gastos com Água */}
      <div className="campo">
        <label htmlFor="gastoAgua">Gastos com Água</label>
        <input
          type="text"
          id="gastoAgua"
          name="gastoAgua"
          value={formData.gastoAgua || ""}
          onChange={handleGastoAguaChange}
          placeholder="Valor (R$)"
        />
      </div>

      {/* Gastos com energia */}
      <div className="campo">
        <label htmlFor="gastoEnergia">Gastos com Energia</label>
        <input
          type="text"
          id="gastoEnergia"
          name="gastoEnergia"
          value={formData.gastoEnergia || ""}
          onChange={handleGastoEnergiaChange}
          placeholder="Valor (R$)"
        />
      </div>

      {/* Gastos com internet */}
      <div className="campo">
        <label htmlFor="gastoInternet">Gastos com Internet</label>
        <input
          type="text"
          id="gastoInternet"
          name="gastoInternet"
          value={formData.gastoInternet || ""}
          onChange={handleGastoInternetChange}
          placeholder="Valor (R$)"
        />
      </div>

      {/* Gastos com condomínio */}
      <div className="campo">
        <label htmlFor="gastoCondominio">Gastos com Condomínio</label>
        <input
          type="text"
          id="gastoCondominio"
          name="gastoCondominio"
          value={formData.gastoCondominio || ""}
          onChange={handleGastoCondominioChange}
          placeholder="Valor (R$)"
        />
      </div>

      {/* Como soube dos serviços do IEBS? */}
      <fieldset>
      <div className="grupo-checkbox">
        <label>Como soube dos serviços do IESB? *</label>
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
          <div key={id}>
            <input
              type="checkbox"
              id={id}
              value={id}
              checked={isSelecionado("comoSoubeIESB", id)}
              onChange={handleComoSoubeChange}
            />
            <label htmlFor={id}>{label}</label>
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
      {/* Botões de navegação para voltar à etapa anterior ou avançar para a próxima. */}
      <div className="botoes">
        <button type="button" onClick={anteriorEtapa}>
          Voltar
        </button>
        <button type="button" onClick={proximaEtapa}>
          Avançar
        </button>
      </div>
     
    </>
  );
}

export default Etapa2;