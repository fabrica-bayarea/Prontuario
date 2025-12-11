import React from "react";
import { IMaskInput } from "react-imask";

const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return "";

  const dataNasc = new Date(dataNascimento);
  const dataHoje = new Date();

  let idade = dataHoje.getFullYear() - dataNasc.getFullYear();
  const mes = dataHoje.getMonth() - dataNasc.getMonth();

  if (mes < 0 || (mes === 0 && dataHoje.getDate() < dataNasc.getDate())) {
    idade--;
  }
  return idade;
}

// função de validação de CPF
const validarCPF = (cpf) => {

  //remove caracteres de formatação (., -)
  const cleanCpf = cpf.replace(/[^\d]/g, "");

  //verificar se tem 11 dígitos
  if (cleanCpf.length !== 11) return false;

  //verificar se todos os dígitos são iguais 
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  let soma;
  let resto;

  //validação do primeiro dígito verificador
  soma = 0;
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);    
  }
  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cleanCpf.substring(9, 10))) return false;

  //validação do segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cleanCpf.substring(10, 11))) return false;
    
  return true;
};

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

  // Função para lidar com a mudança da Data de nascimento
  const handleDataNascimentoChange = (e) => {
    const dataNascimento = e.target.value;
    const idadeCalculada =  calcularIdade(dataNascimento);

    //atualiza o estado da data de nascimento
    handleChange(e);

    // atualizar o campo "idade" com o valor calculado
    const eventoIdade = {
      target: {
        name: 'idade',
        value: idadeCalculada.toString()
      }
    };
    if (idadeCalculada !== "") {
      handleChange(eventoIdade);
    }
  }; 
  
  // verifica o estado da validação do CPF
  const isCpfValid = formData.cpf && formData.cpf.replace(/[^\d]/g, "").length === 11 ? validarCPF(formData.cpf) : null;

  const cpfStatusStyle = {
    fontSize: '0.9em',
    fontWeight: 'bold',
    marginLeft: '10px',
    color: isCpfValid === true ? 'green' : (isCpfValid === false ? 'red' : 'inherit')    
  };

  const handleNext = () => {

    const form = document.getElementById('etapa1-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (formData.atendimentoParaQuem === "Outra pessoa" && !formData.nomeOutraPessoa) {
      alert("Obrigatório");
      return;
    }

    if (formData.cpf && isCpfValid === false) {
      alert("Por favor, insira um CPF válido");
      return;
    }
  }

  const buscarCep = async (cep) => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (!data.erro) {
            // AQUI ESTÁ O TRUQUE:
            // Em vez de usar setFormData, chamamos o handleChange para cada campo
            // fingindo que o usuário digitou algo.
            
            handleChange({ target: { name: 'logradouro', value: data.logradouro } });
            handleChange({ target: { name: 'bairro', value: data.bairro } });
            handleChange({ target: { name: 'cidade', value: data.localidade } });
            
            // Se quiser preencher o estado automaticamente também:
            handleChange({ target: { name: 'estado', value: data.uf } });

        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };
  
  return (
    <form id="etapa1-form">
      <div className="input-group col-12">
        <label htmlFor="nome">Nome Completo<span className="required">*</span>
        </label>
        <input type="text" id="nome" name="nome" value={formData.nome || ""} onChange={handleChange} required placeholder="Digite seu nome completo"/>
      </div>

      <div className="input-group col-8">
        <label htmlFor="email">E-mail<span className="required">*</span></label>
        <input type="email" id="email" name="email" value={formData.email || ""} onChange={handleChange} required placeholder="seu@email.com"/>
      </div>

      <div className="input-group col-4">
      <label htmlFor="cpf">CPF<span className="required">*</span></label>
      {isCpfValid !== null && (
        <span style={cpfStatusStyle}>
          {isCpfValid ? "Válido" : "Inválido"}
        </span>
      )}
        <IMaskInput
        type="text"
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


    <div className="row"> 
        
        <div className="input-group col-4">
            <label htmlFor="dataNascimento">
                Data de Nascimento<span className="required">*</span>
            </label>
            <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                className="form-control" // Garante estilo padrão se usar Bootstrap
                value={formData.dataNascimento || ""}
                onChange={handleDataNascimentoChange}
                placeholder="dd/mm/aaaa"
            />
        </div>

        <div className="input-group col-2">
            <label htmlFor="idade">
                Idade<span className="required">*</span>
            </label>

            <input 
                type="number" 
                id="idade" 
                name="idade" 
                min="0" 
                className="form-control" 
                value={formData.idade || ""} 
                onChange={handleChange} 
                readOnly 
                style={{ backgroundColor: '#e9ecef', borderColor: '#ced4da' }} 
            />
        </div>

    </div>


      <div className="row">
      <div className="input-group col-4">
        <label htmlFor="cep">CEP<span className="required">*</span></label>
        <IMaskInput
          type="text"
          mask="00000-000"
          id="cep"
          name="cep"
          value={formData.cep || ""}
          placeholder="00000-000"
          className="form-control"
          onAccept={(value) => {
            handleChange({ target: { name: 'cep', value: value } });
            buscarCep(value);
          }}
        />
      </div>

      <div className="input-group col-12">
        <label htmlFor="estado">Estado<span className="required">*</span></label>
        <input 
          type="text" 
          id="estado" 
          name="estado" 
          className="form-control"
          value={formData.estado || ""} 
          // Como o CEP preenche isso, não precisa de onChange manual se for puramente automático,
          // mas manter o onChange evita erros de console do React.
          onChange={handleChange} 
          readOnly 
          style={{ backgroundColor: '#e9ecef' }} // Mesmo estilo cinza dos outros campos travados
        />
      </div>   

      <div className="input-group col-12">
        <label htmlFor="logradouro">Logradouro</label>
        <input 
          type="text" 
          id="logradouro" 
          name="logradouro" 
          className="form-control"
          value={formData.logradouro || ""} 
          onChange={handleChange} 
          readOnly
          style={{ backgroundColor: '#e9ecef' }}
        />
      </div>

      <div className="input-group col-12">
        <label htmlFor="bairro">Bairro</label>
        <input 
          type="text" 
          id="bairro" 
          name="bairro" 
          className="form-control"
          value={formData.bairro || ""} 
          onChange={handleChange} 
          readOnly 
          style={{ backgroundColor: '#e9ecef' }}
        />
      </div>

  
      <div className="input-group col-6">
        <label htmlFor="cidade">Cidade<span className="required">*</span></label>
        <input 
          type="text" 
          id="cidade" 
          name="cidade" 
          className="form-control"
          value={formData.cidade || ""} 
          onChange={handleChange} 
          required
          readOnly
          style={{ backgroundColor: '#e9ecef' }}
        />
      </div>
    </div>
    
    <div className="input-group col-12">
      <label htmlFor="complemento">Complemento</label>
      <input type="text" id="complemento" name="complemento" value={formData.complemento || ""} onChange={handleChange} />
    </div>

    <div className="col-12 form-grid" style={{padding: 0, gap: '1.5rem'}}>
      <div className="col-6">
        <fieldset>
          <legend>
            Estado Civil<span className="required">*</span>
          </legend>
          <div className="radio-group">
          {[
            "solteiro",
            "casado",
            "divorciado(a)",
            "separado judicialmente",
            "união estável",
            "viúvo",
            "amasiado(a)",
          ].map((estado) => (
            <label key={estado} className="radio-option">
              <input type="radio" name="estadoCivil" value={estado} checked={formData.estadoCivil === estado} onChange={handleChange} required
              />
              {estado}
            </label>
          ))}
          </div>
        </fieldset>
      </div>

      <div className="col-6">
        <fieldset>
          <legend>Gênero<span className="required">*</span></legend>
          <div className="radio-group">
            {["feminino", "masculino", "não-binário", "transgênero", "prefiro não dizer"].map(
              (g) => (
                <label key={g} className="radio-option">
                  <input type="radio" name="genero" value={g} checked={formData.genero === g} onChange={handleChange} required/>
                  {g}
                </label>
              )
            )}
          </div>
        </fieldset>
      </div>
    </div>

    <div className="col-12">
      <fieldset>
        <legend>Cor/Raça que você se declara<span className="required">*</span></legend>
        <div className="radio-group" style={{flexDirection: 'row', flexWrap: 'wrap', gap: '15px'}}>
          {["preta", "amarela", "parda", "indigena", "branca", "prefiro não dizer"].map(
            (c) => (
              <label key={c} className="radio-option">
                <input type="radio" name="corRaca" value={c} checked={formData.corRaca === c} onChange={handleChange} required/>
                {c}
              </label>
            )
          )}
        </div>
      </fieldset>
    </div>

    <div className="col-12">
      <fieldset>
        <legend>
          Tipo de atendimento<span className="required">*</span></legend>
          <div className="radio-group">
            {["Clínica Escola Ceilândia", "Clínica Escola Asa Sul"].map((clinica) => (
              <label key={clinica} className="radio-option">
                <input type="radio" name="clinicaAtendimento" value={clinica} checked={formData.clinicaAtendimento === clinica} onChange={handleChange} required/>
                {clinica}
              </label>
            ))}
          </div>  
        {/* só mostra a área depois de escolher a clínica */}
        {formData.clinicaAtendimento ? (
          <div className="input-group" style={{ marginTop: '15px' }}>
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

    <div className="col-12">
      <fieldset>
        <legend>Classificação do atendimento<span className="required">*</span></legend>
          <div className="radio-group">
            {[
              "1 - Atendimentos não urgentes",
              "2 - Atendimento urgente ou mediato (mais rápido possível, não correm risco de vida)",
              "3 - Atendimento urgente ou imediato (coloca em risco a própria vida)",
              "4 - Atendimento urgente e imediato (coloca em risco a própria vida e de terceiros)",
              "5 - Outro",
            ].map((c) => (
              <label key={c} className="radio-option">
                <input type="radio" name="classAtendimento" value={c} checked={formData.classAtendimento === c} onChange={handleChange} required/>
                {c}
              </label>
            ))}
          </div>
      </fieldset>
    </div>

      <div className="input-group col-6">
        <label htmlFor="telefone">Telefone<span className="required">*</span></label>
        <IMaskInput
          type="text"
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

      <div className="input-group col-12">
        <label>Faz faculdade particular?</label>
        <div style={{display:'flex', gap:'20px'}}>
          <label className="radio-option">
            <input type="radio" name="faculdadeParticular" value="sim" checked={formData.faculdadeParticular === "sim"} onChange={handleChange}/>Sim</label>
          <label className="radio-option">
            <input type="radio" name="faculdadeParticular" value="não" checked={formData.faculdadeParticular === "não"} onChange={handleChange}/>Não</label>
        </div>
      </div>

      <div className="input-group col-12">
        <label htmlFor="atendimentoParaQuem">Você está buscando atendimento para:<span className="required">*</span></label>
        <select id="atendimentoParaQuem" name="atendimentoParaQuem" value={formData.atendimentoParaQuem || ""} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="Você">Você</option>
          <option value="Outra pessoa">Outra pessoa</option>
        </select>

        {/* se escolher "Outra pessoa", permite preencher o nome */}
        {formData.atendimentoParaQuem === "Outra pessoa" && (
          <div className="input-group" style={{ marginTop: '10px' }}>
            <label htmlFor="nomeOutraPessoa">Nome da outra pessoa</label>
            <input type="text" id="nomeOutraPessoa" name="nomeOutraPessoa" value={formData.nomeOutraPessoa || ""} onChange={handleChange} required/>
          </div>
        )}
      </div>

      <div className="input-group col-12">
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
      <div className="col-12 button-group">
        <button type="button" onClick={proximaEtapa}>
          Avançar
        </button>
      </div>
      
    </form>
  );
}

export default Etapa1;