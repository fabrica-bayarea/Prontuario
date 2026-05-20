import { z } from 'zod';

// Função de validação de CPF
const validarCPF = (cpf: string) => {
  const cleanCpf = cpf.replace(/[^\d]/g, "");
  if (cleanCpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cleanCpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
};

// Esquema completo do formulário
export const questionarioSchema = z.object({
  // Etapa 1
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  cpf: z.string().refine(validarCPF, { message: "CPF inválido" }),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  idade: z.string().min(1, "Idade é obrigatória"),
  cep: z.string().min(1, "CEP é obrigatório"),
  complemento: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  estadoCivil: z.string().min(1, "Estado civil é obrigatório"),
  genero: z.string().min(1, "Gênero é obrigatório"),
  corRaca: z.string().min(1, "Cor/Raça é obrigatória"),
  clinicaAtendimento: z.string().min(1, "Clínica de atendimento é obrigatória"),
  areaAtendimento: z.string().min(1, "Área de atendimento é obrigatória"),
  classAtendimento: z.string().min(1, "Classificação do atendimento é obrigatória"),
  estado: z.string().min(1, "Estado é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  faculdadeParticular: z.string().optional(),
  atendimentoParaQuem: z.string().min(1, "Obrigatório informar para quem é o atendimento"),
  nomeOutraPessoa: z.string().optional(),
  acompanhamentoOutroLugar: z.string().min(1, "Obrigatório informar se faz acompanhamento"),
  atendimentoParaOutraPessoa: z.string().optional(),

  // Etapa 2
  pessoasPorCasa: z.string().min(1, "Obrigatório"),
  suaCasaE: z.string().min(1, "Obrigatório"),
  outroTipoCasa: z.string().optional(),
  valorAluguel: z.string().optional(),
  rendaFamiliar: z.string().min(1, "Obrigatório"),
  origemRenda: z.string().min(1, "Obrigatório"),
  outroOrigemRenda: z.string().optional(),
  CADUnico: z.string().optional(),
  beneficioSocial: z.string().optional(),
  outroBeneficio: z.string().optional(),
  outroBeneficioValor: z.string().optional(),
  quaisBeneficios: z.array(z.string()).optional(),
  valoresBeneficios: z.record(z.string(), z.any()).optional(),
  suaCasaEstuda: z.string().min(1, "Obrigatório"),
  valorMensalidade: z.string().optional(),
  residemSuaCasa: z.array(z.string()).min(1, "Obrigatório"),
  residenciaDoencaCronica: z.array(z.string()).min(1, "Obrigatório"),
  residenciaDeficiencia: z.string().min(1, "Obrigatório"),
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

  // Etapa 3
  comoSoubeIESB: z.array(z.string()).optional(),
  fonteRedeSocio: z.string().optional(),
  outroFonteRedeSocio: z.string().optional(),
  servicoIESB: z.array(z.string()).min(1, "Obrigatório"),
  antesIESB: z.array(z.string()).min(1, "Obrigatório"),
  encaminhamentoMedico: z.string().min(1, "Obrigatório")
}).superRefine((data, ctx) => {
  // Validação condicional: se for "Outra pessoa", o nome é obrigatório
  if (data.atendimentoParaQuem === "Outra pessoa" && (!data.nomeOutraPessoa || data.nomeOutraPessoa.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "O nome da outra pessoa é obrigatório.",
      path: ["nomeOutraPessoa"]
    });
  }
});

// Tipagem automática gerada a partir do esquema
export type FormularioData = z.infer<typeof questionarioSchema>;