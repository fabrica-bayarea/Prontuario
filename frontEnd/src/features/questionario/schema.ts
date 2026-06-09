import { z } from 'zod';

const validarCPF = (cpf: string) => {
  const cleanCpf = cpf.replace(/[^\d]/g, '');
  if (cleanCpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleanCpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
};

const campoTexto = (msg: string) => 
  z.string({ message: msg }).min(1, msg);

export const questionarioSchema = z.object({
  // Etapa 1
  nome: campoTexto('O nome é obrigatório'),
  email: campoTexto('O e-mail é obrigatório').email('E-mail inválido'),
  cpf: campoTexto('O CPF é obrigatório').refine(validarCPF, { message: 'CPF inválido' }),
  dataNascimento: campoTexto('Data de nascimento é obrigatória'),
  idade: z.coerce.number({ message: 'Idade inválida' }).min(0, 'Idade inválida'),
  cep: campoTexto('CEP é obrigatório'),
  complemento: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  estadoCivil: campoTexto('Estado civil é obrigatório'),
  genero: campoTexto('Gênero é obrigatório'),
  corRaca: campoTexto('Cor/Raça é obrigatória'),
  clinicaAtendimento: campoTexto('Clínica de atendimento é obrigatória'),
  areaAtendimento: z.string().optional(),
  classAtendimento: campoTexto('Classificação do atendimento é obrigatória'),
  estado: campoTexto('Estado é obrigatório'),
  cidade: campoTexto('Cidade é obrigatória'),
  telefone: campoTexto('Telefone é obrigatório'),
  faculdadeParticular: z.string().optional(),
  bolsaFaculdade: z.string().optional(),
  atendimentoParaQuem: campoTexto('Obrigatório informar para quem é o atendimento'),
  acompanhamentoOutroLugar: campoTexto('Obrigatório informar se faz acompanhamento'),
  atendimentoParaOutraPessoa: z.string().optional(),
  
  // Etapa 2
  dependentes: z.array(
    z.object({
      nome: campoTexto('Nome do dependente é obrigatório'),
      relacao: campoTexto('Relação é obrigatória'),
    })
  ).optional(),

  // Etapa 3
  pessoasPorCasa: z.coerce.number({ message: 'Deve ser um número' }).min(1, 'Obrigatório'),
  suaCasaE: campoTexto('Obrigatório'),
  outroTipoCasa: z.string().optional(),
  valorAluguel: z.string().optional(),
  rendaFamiliar: campoTexto('Obrigatório'),
  origemRenda: campoTexto('Obrigatório'),
  outroOrigemRenda: z.string().optional(),
  CADUnico: z.string().optional(),
  beneficioSocial: z.string().optional(),
  outroBeneficio: z.string().optional(),
  outroBeneficioValor: z.string().optional(),
  quaisBeneficios: z.array(z.string()).optional(),
  valoresBeneficios: z.record(z.string(), z.any()).optional(),
  suaCasaEstuda: campoTexto('Obrigatório'),
  valorMensalidade: z.string().optional(),
  residemSuaCasa: z.array(z.string()).min(1, 'Obrigatório'),
  residenciaDoencaCronica: z.array(z.string()).min(1, 'Obrigatório'),
  residenciaDeficiencia: campoTexto('Obrigatório'),
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
  servicoIESB: z.array(z.string()).min(1, 'Obrigatório'),
  antesIESB: z.array(z.string()).min(1, 'Obrigatório'),
  
  encaminhamentoMedico: campoTexto('Obrigatório'),
}).superRefine((dados, contexto) => {
  
  const addError = (path: string[], message: string) => {
    contexto.addIssue({ code: z.ZodIssueCode.custom, message, path });
  };

  // Regras da Etapa 1
  if (dados.clinicaAtendimento && (!dados.areaAtendimento || dados.areaAtendimento.trim() === '')) {
    addError(['areaAtendimento'], 'Área de atendimento é obrigatória');
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
    addError(['quaisBeneficios'], 'Selecione pelo menos um benefício');
  }
  if (dados.suaCasaEstuda === 'Sim' && !dados.valorMensalidade) {
    addError(['valorMensalidade'], 'Informe o valor da mensalidade');
  }
  if (dados.residenciaDeficiencia === 'Sim' && (!dados.quaisDeficiencia || dados.quaisDeficiencia.length === 0)) {
    addError(['quaisDeficiencia'], 'Selecione a deficiência');
  }
  if (dados.quaisDeficiencia?.includes('def_outra') && !dados.outraDeficienciaEspecifique) {
    addError(['outraDeficienciaEspecifique'], 'Especifique a deficiência');
  }
  if (dados.acompanhamentoMedico === 'Sim') {
    if (!dados.tipoAcompanhamento) addError(['tipoAcompanhamento'], 'Selecione o tipo de acompanhamento');
    if (!dados.especialidadeMedica) addError(['especialidadeMedica'], 'Selecione a especialidade médica');
  }
  if (dados.acompanhamentoMedico === 'Outro' && !dados.outroAcompanhamento) {
    addError(['outroAcompanhamento'], 'Especifique o acompanhamento');
  }
  if (dados.especialidadeMedica === 'Outra' && !dados.outraEspecialidade) {
    addError(['outraEspecialidade'], 'Especifique a especialidade');
  }

  // Regras da Etapa 4
  if (dados.comoSoubeIESB?.includes('redeSocio') && !dados.fonteRedeSocio) {
    addError(['fonteRedeSocio'], 'Especifique a rede sócio-assistencial');
  }
  if (dados.fonteRedeSocio === 'Outro' && !dados.outroFonteRedeSocio) {
    addError(['outroFonteRedeSocio'], 'Especifique a rede');
  }
});

export type FormularioData = z.infer<typeof questionarioSchema>;