import React, {useState} from 'react';
import Etapa1 from './Etapa1';
import Etapa2 from './Etapa2';
import Etapa3 from './Etapa3';
import { ProntuarioService } from './services/api';

//Lista do campos obrigatorios-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const camposObrigatoriosPorEtapa = {
  // Etapa 1: Dados Pessoais, de Contato e de Atendimento Inicial 
  1: [
     'nome', 
     'email',                         
     'cpf', 
     'dataNascimento', 
     'idade', 
     'cep', 
     'genero', 
     'corRaca',
     'clinicaAtendimento',
     'areaAtendimento',
     'estado',
     'cidade',
     'telefone',
     'classAtendimento',
     'atendimentoParaQuem',
     'acompanhamentoOutroLugar',
     'atendimentoParaOutraPessoa'    
     
  ],

  // Etapa 2: Dados Socioeconômicos, de Moradia e Saúde Familiar
  2: [
    'pessoasPorCasa',            
    'suaCasaE',
    'rendaFamiliar', 
    'origemRenda',             
    'quaisBeneficios',         
    'suaCasaEstuda',
    'residemSuaCasa',
    'residenciaDoencaCronica', 
    'residenciaDeficiencia',
    'comoSoubeIESB'               
  ],

  // Etapa 3: Motivo da Busca e Conhecimento do Serviço
  3: [
    'servicoIESB', 
    'antesIESB', 
    'encaminhamentoMedico'
  ] 
};


function Questionario () {

// Controla qual etapa do formulário está sendo exibida.---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const[etapaAtual,setEtapaAtual] = useState(1); 

// Funções para navegar entre as etapas do formulário.-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const proximaEtapa = () =>{   
  
  const camposDaEtapaAtual = camposObrigatoriosPorEtapa[etapaAtual];

  for (const campo of camposDaEtapaAtual) {
   
    const valorDoCampo = formData[campo];
    if (!valorDoCampo || (typeof valorDoCampo === 'string' && valorDoCampo.trim() === '') || (Array.isArray(valorDoCampo) && valorDoCampo.length === 0)) {
      alert(`O campo "${campo}" é obrigatório.`);
      return; 
    }
  }
    if (etapaAtual < 3){
        setEtapaAtual(etapaAtual + 1)
}}


const anteriorEtapa = () =>{
    if (etapaAtual > 1){
        setEtapaAtual(etapaAtual - 1)
}}

// Armazena todos os dados do formulário em um único objeto de estado.-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const[formData,setFormData] = useState({

  //Etapa 1
  nome:'', //0 
  email:'', //1 
  cpf:'', //2 
  dataNascimento:'', //3 
  idade:'', //4 
  cep:'', //5 
  endereco:'', //6
  estadoCivil:'', //7 
  genero:'', //8
  corRaca:'', //9
  clinicaAtendimento:'', //10
  areaAtendimento:'', //10
  classAtendimento:'', //11
  estado:'', //12
  cidade:'', //13
  telefone:'', //14
  faculdadeParticular:'', //15
  atendimentoParaQuem:'', //16
  nomeOutraPessoa:'' , //16
  acompanhamentoOutroLugar:'', //17
  atendimentoParaOutraPessoa:'Não', //18
  
  //Etapa 2
  pessoasPorCasa:'', //19
  suaCasaE:'', //20
  outroTipoCasa: '', //20
  valorAluguel: '', //20
  rendaFamiliar:'', //21
  origemRenda:'', //22
  outroOrigemRenda:'',
  CADUnico:'', //23
  beneficioSocial:'', //24
  outroBeneficio: '',
  outroBeneficioValor: '',
  quaisBeneficios: ['Não tem beneficios sociais'], //24
  valoresBeneficios:{}, //24
  suaCasaEstuda:'', //25
  valorMensalidade:'',//25
  residemSuaCasa:[], //26
  residenciaDoencaCronica:[], //27
  residenciaDeficiencia:'', //28
  quaisDeficiencia:[], //28
  outraDeficienciaEspecifique: '', //28
  acompanhamentoMedico:'', //27
  outroAcompanhamento:'', //27
  tipoAcompanhamento:'', //27 
  especialidadeMedica:'', //29
  outraEspecialidade:'', //29
  gastosSaude:[], //30
  valoresGastosSaude:{}, //30
  gastosAlimentacao:[], //31
  valoresGastosAlimentacao:{}, //31
  possuiFinanciamento:'', //32
  tiposFinanciamento:'', //32
  gastoAgua:'', //33
  gastoEnergia:'', //34
  gastoInternet:'', //35
  gastoCondominio:'', //36
  comoSoubeIESB:[], //37
  fonteRedeSocio: '', //37
  outroFonteRedeSocio:'', //37

  //Etapa3
  servicoIESB:[], //38
  antesIESB:[], //39tip
  encaminhamentoMedico:'' //40
});

// Manipulador de eventos genérico que atualiza o estado 'formData' para qualquer tipo de input.-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
const handleChange = (e) =>{
  const{name,value,type,checked} = e.target;
  
   if(type === 'checkbox' ){

    setFormData(prevFormData => {
      const listaAtual = prevFormData[name] ? [...prevFormData[name]]:[]

      if(checked){
        listaAtual.push(value);

      } else{

        const index = listaAtual.indexOf(value);

        if (index > -1){
          listaAtual.splice(index,1);
        }
      }

      return {...prevFormData,[name]: listaAtual};
     });

   } else { 
      setFormData(prevFormData =>({...prevFormData,[name]:value,
         ...(name === 'beneficioSocial' && value === 'Sim' && { quaisBeneficios: [] }),
         ...(name === 'beneficioSocial' && value === 'Nao' && { quaisBeneficios: ['Não tem Beneficios sociais'] })
      }));
   } 
 
};


// Checagem para ver se os campos obrigatorios foram preenchidos ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const handleSubmit = async (e) => {
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
    // Feedback visual (opcional, pode por um loading aqui se quiser)
    console.log("Enviando dados para o servidor...", formData);

    // Chama o serviço que criamos
    const resposta = await ProntuarioService.criar(formData);

    console.log("✅ Sucesso!", resposta);
    alert(`Formulário salvo com sucesso! ID: ${resposta._id}`);

    // Opcional: Limpar o formulário ou voltar para a etapa 1
    // setFormData({ ...estadoInicial... });
    // setEtapaAtual(1);

  } catch (error) {
    console.error("❌ Erro ao enviar:", error);
    alert("Houve um erro ao salvar os dados. Verifique se o servidor está rodando.");
  }

  const formDataJson = JSON.stringify(formData, null, 2);
  console.log('Dados do formulário em formato JSON:', formDataJson);
  console.log("Formulário completo, Dados:", formData);
  alert("Formulario preenchido com sucesso!");
};

// Renderiza o componente da etapa correta com base no estado 'etapaAtual'.--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
return(
  
<div>
  <h1>IESBem Formulário</h1>
     {etapaAtual === 1 && <Etapa1 formData={formData} handleChange={handleChange} proximaEtapa={proximaEtapa} />}
     {etapaAtual === 2 && <Etapa2 formData={formData} handleChange={handleChange} proximaEtapa={proximaEtapa} anteriorEtapa={anteriorEtapa} handleSubmit={handleSubmit}/>}
     {etapaAtual === 3 && <Etapa3 formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} anteriorEtapa={anteriorEtapa}/>} 
</div> 
);
};
export default Questionario