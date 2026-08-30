import { z } from 'zod';

function validarCPF(cpf: string): boolean {
  if (!cpf) return false;
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleanCPF.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

const campoTexto = (msg: string) => 
  z.string({ message: msg }).min(1, msg);

export const questionarioSchema = z.object({
  // Etapa 1
  nome: campoTexto('O nome completo é obrigatório'),
  email: campoTexto('O e-mail é obrigatório').email('Digite um e-mail válido'),
  cpf: campoTexto('O CPF é obrigatório').refine(validarCPF, { message: 'CPF inválido' }),
  dataNascimento: campoTexto('Data de nascimento é obrigatória'),
  idade: z.coerce.number({ message: 'Idade inválida' }).min(18, 'O solicitante deve ter pelo menos 18 anos'),
  cep: campoTexto('O CEP é obrigatório'),
  complemento: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  estadoCivil: campoTexto('Selecione o estado civil'),
  genero: campoTexto('Selecione o gênero'),
  corRaca: campoTexto('Selecione a cor/raça'),
  clinicaAtendimento: z.string().optional(),
  areaAtendimento: z.string().optional(),
  classAtendimento: campoTexto('Selecione a classificação do atendimento'),
  estado: campoTexto('O estado é obrigatório'),
  cidade: campoTexto('A cidade é obrigatória'),
  telefone: campoTexto('O telefone é obrigatório'),
  faculdadeParticular: campoTexto('Informe se faz faculdade particular'),
  bolsaFaculdade: z.string().optional(),
  atendimentoParaQuem: campoTexto('Informe para quem é o atendimento'),
  acompanhamentoOutroLugar: campoTexto('Informe se faz acompanhamento em outro local'),
  atendimentoParaOutraPessoa: z.string().optional(),
  
  // Etapa 2
  dependentes: z.array(
    z.object({
      nome: campoTexto('Digite o nome do dependente'),
      relacao: campoTexto('Selecione a relação com o solicitante'),
    })
  ).optional(),

  // Etapa 3
  pessoasPorCasa: z.coerce.number({ message: 'Informe a quantidade de pessoas' }).min(1, 'Informe a quantidade de pessoas que residem na casa'),
  suaCasaE: campoTexto('Selecione a situação da sua residência'),
  outroTipoCasa: z.string().optional(),
  valorAluguel: z.string().optional(),
  rendaFamiliar: campoTexto('Selecione a sua renda familiar'),
  origemRenda: campoTexto('Selecione a origem principal da renda'),
  outroOrigemRenda: z.string().optional(),
  CADUnico: z.string().optional(),
  beneficioSocial: campoTexto('Informe se recebe algum benefício social'),
  outroBeneficio: z.string().optional(),
  outroBeneficioValor: z.string().optional(),
  quaisBeneficios: z.array(z.string()).optional(),
  valoresBeneficios: z.record(z.string(), z.any()).optional(),
  suaCasaEstuda: campoTexto('Informe se alguém na sua casa estuda'),
  valorMensalidade: z.string().optional(),
  residemSuaCasa: z.array(z.string()).min(1, 'Selecione ao menos uma opção sobre moradores'),
  residenciaDoencaCronica: z.array(z.string()).min(1, 'Selecione ao menos uma opção sobre doença crônica'),
  residenciaDeficiencia: campoTexto('Informe se há pessoa com deficiência'),
  quaisDeficiencia: z.array(z.string()).optional(),
  outraDeficienciaEspecifique: z.string().optional(),
  acompanhamentoMedico: z.string().optional(),
  outroAcompanhamento: z.string().optional(),
  tipoAcompanhamento: z.string().optional(),
  especialidadeMedica: z.string().optional(),
  outraEspecialidade: z.string().optional(),
  gastosSaude: z.array(z.string()).optional(),
  valoresGastosSaude: z.record(z.string(), z.any()).optional(),
  gastosAlimentacao: z.array(z.string()).optional(),
  valoresGastosAlimentacao: z.record(z.string(), z.any()).optional(),
  possuiFinanciamento: z.string().optional(),
  tiposFinanciamento: z.string().optional(),
  gastoAgua: z.string().optional(),
  gastoEnergia: z.string().optional(),
  gastoInternet: z.string().optional(),
  gastoCondominio: z.string().optional(),

  // Etapa 4
  comoSoubeIESB: z.array(z.string()).optional(),
  fonteRedeSocio: z.string().optional(),
  outroFonteRedeSocio: z.string().optional(),
  servicoIESB: z.array(z.string()).min(1, 'Selecione ao menos um serviço do IESB'),
  antesIESB: z.array(z.string()).min(1, 'Selecione ao menos uma opção'),
  encaminhamentoMedico: campoTexto('Informe se possui encaminhamento médico'),
}).superRefine((dados, contexto) => {
  const addError = (path: string[], message: string) => {
    contexto.addIssue({ code: z.ZodIssueCode.custom, message, path });
  };

  // Regras da Etapa 1
  if (dados.dataNascimento) {
    const dataNasc = new Date(dados.dataNascimento);
    const dataHoje = new Date();
    let idadeCalculada = dataHoje.getFullYear() - dataNasc.getFullYear();
    const mes = dataHoje.getMonth() - dataNasc.getMonth();
    if (mes < 0 || (mes === 0 && dataHoje.getDate() < dataNasc.getDate())) {
      idadeCalculada--;
    }
    if (idadeCalculada < 18) {
      addError(['dataNascimento'], 'É necessário ter pelo menos 18 anos de idade');
      addError(['idade'], 'O solicitante deve ter pelo menos 18 anos');
    }
  }

  // Regras da Etapa 2
  if (dados.atendimentoParaQuem === 'Outra pessoa' && (!dados.dependentes || dados.dependentes.length === 0)) {
    addError(['dependentes'], 'Adicione pelo menos um dependente');
  }

  // Regras da Etapa 3
  if (dados.suaCasaE === 'Alugada' && !dados.valorAluguel) {
    addError(['valorAluguel'], 'Informe o valor do aluguel');
  }
  if (dados.suaCasaE === 'Outro' && !dados.outroTipoCasa) {
    addError(['outroTipoCasa'], 'Especifique o tipo de residência');
  }
  if (dados.origemRenda === 'Outro' && !dados.outroOrigemRenda) {
    addError(['outroOrigemRenda'], 'Especifique a origem da renda');
  }
  if (dados.beneficioSocial === 'Sim' && (!dados.quaisBeneficios || dados.quaisBeneficios.length === 0)) {
    addError(['quaisBeneficios'], 'Selecione pelo menos um benefício social');
  }
  if (dados.suaCasaEstuda === 'Sim' && !dados.valorMensalidade) {
    addError(['valorMensalidade'], 'Informe o valor da mensalidade');
  }
  if (dados.residenciaDeficiencia === 'Sim' && (!dados.quaisDeficiencia || dados.quaisDeficiencia.length === 0)) {
    addError(['quaisDeficiencia'], 'Selecione o tipo de deficiência');
  }
  if (dados.quaisDeficiencia?.includes('def_outra') && !dados.outraDeficienciaEspecifique) {
    addError(['outraDeficienciaEspecifique'], 'Especifique a deficiência');
  }
  if (dados.faculdadeParticular === 'sim' && !dados.bolsaFaculdade) {
    addError(['bolsaFaculdade'], 'Selecione o programa de bolsa');
  }
});

export type FormularioData = z.infer<typeof questionarioSchema>;