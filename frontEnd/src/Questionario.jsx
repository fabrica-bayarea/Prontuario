import React, {useState} from 'react';
import Etapa1 from './Etapa1';
import Etapa2 from './Etapa2';
import Etapa3 from './Etapa3';
import { ProntuarioService } from './services/api';
import './Questionario.css'; // <--- 1. Importação do CSS

// ... (Mantenha o objeto camposObrigatoriosPorEtapa igual) ...
const camposObrigatoriosPorEtapa = {
  // ... (seu código existente)
  1: [
    //'nome', 'email', 'cpf', 'dataNascimento', 'idade', 'cep', 'genero', 'corRaca', 'clinicaAtendimento', 'areaAtendimento', 'estado', 'cidade', 'telefone', 'classAtendimento', 'atendimentoParaQuem', 'acompanhamentoOutroLugar', 'atendimentoParaOutraPessoa'
  ],
  2: [
    //'pessoasPorCasa', 'suaCasaE', 'rendaFamiliar', 'origemRenda', 'suaCasaEstuda', 'residemSuaCasa', 'residenciaDoencaCronica', 'residenciaDeficiencia', //'comoSoubeIESB'
  ],
  3: [
    'servicoIESB', 'antesIESB', 'encaminhamentoMedico'
  ] 
};

function Questionario () {
  // ... (Mantenha todo o estado e funções existentes iguais) ...
  const[etapaAtual,setEtapaAtual] = useState(1); 
  // ... (funções proximaEtapa, anteriorEtapa, handleChange, handleSubmit, formData...)

  const proximaEtapa = () =>{   
    const camposDaEtapaAtual = camposObrigatoriosPorEtapa[etapaAtual];
    for (const campo of camposDaEtapaAtual) {
      const valorDoCampo = formData[campo];
      if (!valorDoCampo || (typeof valorDoCampo === 'string' && valorDoCampo.trim() === '') || (Array.isArray(valorDoCampo) && valorDoCampo.length === 0)) {
        alert(`O campo "${campo}" é obrigatório.`);
        return; 
      }
    }
    if (etapaAtual < 3){ setEtapaAtual(etapaAtual + 1) }
  }

  const anteriorEtapa = () =>{ if (etapaAtual > 1){ setEtapaAtual(etapaAtual - 1) } }

  const [formData,setFormData] = useState({
     // ... (Mantenha seu estado inicial exatamente como está)
     nome:'', 
     email:'', 
     cpf:'', 
     dataNascimento:'', 
     idade:'', 
     cep:'', 
     complemento:'', 
     logradouro:'',
     bairro:'',
     estadoCivil:'', 
     genero:'', 
     corRaca:'', 
     clinicaAtendimento:'', 
     areaAtendimento:'', 
     classAtendimento:'', 
     estado:'', 
     cidade:'', 
     telefone:'', 
     faculdadeParticular:'', 
     atendimentoParaQuem:'', 
     nomeOutraPessoa:'' , 
     acompanhamentoOutroLugar:'', 
     atendimentoParaOutraPessoa:'Não', 
     pessoasPorCasa:'', 
     suaCasaE:'', 
     outroTipoCasa: '', 
     valorAluguel: '', 
     rendaFamiliar:'', 
     origemRenda:'', 
     outroOrigemRenda:'', 
     CADUnico:'', 
     beneficioSocial:'', 
     outroBeneficio: '', 
     outroBeneficioValor: '', 
     quaisBeneficios: ['Não tem beneficios sociais'], 
     valoresBeneficios:{}, 
     suaCasaEstuda:'', 
     valorMensalidade:'', 
     residemSuaCasa:[], 
     residenciaDoencaCronica:[], 
     residenciaDeficiencia:'', 
     quaisDeficiencia:[], 
     outraDeficienciaEspecifique: '', 
     acompanhamentoMedico:'', 
     outroAcompanhamento:'', 
     tipoAcompanhamento:'', 
     especialidadeMedica:'', 
     outraEspecialidade:'', 
     gastosSaude:[], 
     valoresGastosSaude:{}, 
     gastosAlimentacao:[], 
     valoresGastosAlimentacao:{}, 
     possuiFinanciamento:'', 
     tiposFinanciamento:'', 
     gastoAgua:'', 
     gastoEnergia:'', 
     gastoInternet:'', 
     gastoCondominio:'', 
     comoSoubeIESB:[], 
     fonteRedeSocio: '', 
     outroFonteRedeSocio:'', 
     servicoIESB:[], 
     antesIESB:[], 
     encaminhamentoMedico:''
  });

  const handleChange = (e) =>{
    // ... (Mantenha sua lógica handleChange exatamente como está)
    const{name,value,type,checked} = e.target;
    if(type === 'checkbox' ){
      setFormData(prevFormData => {
        const listaAtual = prevFormData[name] ? [...prevFormData[name]]:[]
        if(checked){ listaAtual.push(value); } else{ const index = listaAtual.indexOf(value); if (index > -1){ listaAtual.splice(index,1); } }
        return {...prevFormData,[name]: listaAtual};
      });
    } else { 
        setFormData(prevFormData =>({...prevFormData,[name]:value, ...(name === 'beneficioSocial' && value === 'Sim' && { quaisBeneficios: [] }), ...(name === 'beneficioSocial' && value === 'Nao' && { quaisBeneficios: ['Não tem Beneficios sociais'] }) }));
    } 
  };

  const handleSubmit = async (e) => {
    // ... (Mantenha sua lógica handleSubmit exatamente como está)
    e.preventDefault();
    const camposDaEtapa3 = camposObrigatoriosPorEtapa[3];
    for (const campo of camposDaEtapa3) {
        const valorDoCampo = formData[campo];
        if (!valorDoCampo || (typeof valorDoCampo === 'string' && valorDoCampo.trim() === '') || (Array.isArray(valorDoCampo) && valorDoCampo.length === 0)) {
        alert(`O campo "${campo}" da última etapa é obrigatório.`);
        return; 
        }
    }
    try {
        console.log("Enviando dados...", formData);
        const resposta = await ProntuarioService.criar(formData);
        console.log("✅ Sucesso!", resposta);
        alert(`Formulário salvo com sucesso! ID: ${resposta._id}`);
    } catch (error) {
        console.error("❌ Erro ao enviar:", error);
        alert("Houve um erro ao salvar os dados.");
    }
  };

  return(
    <div className="formulario-container"> {/* <--- 3. Container Principal */}
      
      <div className="formulario-header">
         <h1>Prontuário BayArea</h1>
         <p>Formulário de Prontuário</p>
      </div>

      {/* <--- 2. Visual Stepper adicionado aqui */}
      <div className="stepper">
        <div className={`step ${etapaAtual >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <div className="step-label">Dados Pessoais</div>
        </div>
        <div className={`step ${etapaAtual >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <div className="step-label">Socioeconômico</div>
        </div>
        <div className={`step ${etapaAtual >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <div className="step-label">Serviços</div>
        </div>
      </div>

      {etapaAtual === 1 && <Etapa1 formData={formData} handleChange={handleChange} proximaEtapa={proximaEtapa} />}
      {etapaAtual === 2 && <Etapa2 formData={formData} handleChange={handleChange} proximaEtapa={proximaEtapa} anteriorEtapa={anteriorEtapa} handleSubmit={handleSubmit}/>}
      {etapaAtual === 3 && <Etapa3 formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} anteriorEtapa={anteriorEtapa}/>} 
    </div> 
  );
};
export default Questionario;