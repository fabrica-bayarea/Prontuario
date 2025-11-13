import mongoose, { Schema, Document } from 'mongoose';

interface IProntuario extends Document {
    nome: string;
    email: string;
    cpf: string;
    dataNascimento: Date;
    idade: number;
    cep: string;
    endereco: string;
    estadoCivil: string;
    genero: string;
    corRaca: string;
    clinicaAtendimento: string;
    areaAtendimento: string;
    classAtendimento: string;
    estado: string;
    cidade: string;
    telefone: string;
    faculdadeParticular: string;
    atendimentoParaQuem: string;
    nomeOutraPessoa?: string;
    acompanhamentoOutroLugar: string;
    atendimentoParaOutraPessoa: string;
    pessoasPorCasa: number;
    suaCasaE: string;
    outroTipoCasa?: string;
    valorAluguel?: string;
    rendaFamiliar: string;
    origemRenda: string;
    outroOrigemRenda?: string;
    CADUnico: string;
    beneficioSocial: string;
    outroBeneficio: string;
    outroBeneficioValor: string;
    quaisBeneficios: string[];
    valoresBeneficios: Record<string, string>;
    suaCasaEstuda: string;
    valorMensalidade?: string;
    residemSuaCasa: string[];
    residenciaDoencaCronica: string[];
    residenciaDeficiencia: string;
    quaisDeficiencia: string[];
    outraDeficienciaEspecifique?: string;
    acompanhamentoMedico: string;
    outroAcompanhamento?: string;
    tipoAcompanhamento: string;
    especialidadeMedica?: string;
    outraEspecialidade?: string;
    gastosSaude: string[];
    valoresGastosSaude: Record<string, string>;
    gastosAlimentacao: string[];
    valoresGastosAlimentacao: Record<string, string>;
    possuiFinanciamento: string;
    tiposFinanciamento: string[];
    gastoAgua: string;
    gastoEnergia: string;
    gastoInternet: string;
    gastoCondominio: string;
    comoSoubeIESB: string[];
    fonteRedeSocio?: string;
    outroFonteRedeSocio?: string;
    servicoIESB: string[];
    antesIESB: string[];
    encaminhamentoMedico: string;
}

const ProntuarioSchema: Schema = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  idade: { type: Number, required: true },
  cep: { type: String, required: true },
  endereco: { type: String, required: true },
  estadoCivil: { type: String, required: true },
  genero: { type: String, required: true },
  corRaca: { type: String, required: true },
  clinicaAtendimento: { type: String, required: true },
  areaAtendimento: { type: String, required: true },
  classAtendimento: { type: String, required: true },
  estado: { type: String, required: true },
  cidade: { type: String, required: true },
  telefone: { type: String },
  faculdadeParticular: { type: String },
  atendimentoParaQuem: { type: String },
  nomeOutraPessoa: { type: String },
  acompanhamentoOutroLugar: { type: String },
  atendimentoParaOutraPessoa: { type: String },
  pessoasPorCasa: { type: Number },
  suaCasaE: { type: String },
  outroTipoCasa: { type: String },
  valorAluguel: { type: String },
  rendaFamiliar: { type: String },
  origemRenda: { type: String },
  outroOrigemRenda: { type: String },
  CADUnico: { type: String },
  beneficioSocial: { type: String },
  outroBeneficio: { type: String },
  outroBeneficioValor: { type: String },
  quaisBeneficios: [{ type: String }],
  valoresBeneficios: { type: Object },
  suaCasaEstuda: { type: String },
  valorMensalidade: { type: String },
  residemSuaCasa: [{ type: String }],
  residenciaDoencaCronica: [{ type: String }],
  residenciaDeficiencia: { type: String },
  quaisDeficiencia: [{ type: String }],
  outraDeficienciaEspecifique: { type: String },
  acompanhamentoMedico: { type: String },
  outroAcompanhamento: { type: String },
  tipoAcompanhamento: { type: String },
  especialidadeMedica: { type: String },
  outraEspecialidade: { type: String },
  gastosSaude: [{ type: String }],
  valoresGastosSaude: { type: Object },
  gastosAlimentacao: [{ type: String }],
  valoresGastosAlimentacao: { type: Object },
  possuiFinanciamento: { type: String },
  tiposFinanciamento: [{ type: String }],
  gastoAgua: { type: String },
  gastoEnergia: { type: String },
  gastoInternet: { type: String },
  gastoCondominio: { type: String },
  comoSoubeIESB: [{ type: String }],
  fonteRedeSocio: { type: String },
  outroFonteRedeSocio: { type: String },
  servicoIESB: [{ type: String }],
  antesIESB: [{ type: String }],
  encaminhamentoMedico: { type: String }
}, { timestamps: true });

export default mongoose.model<IProntuario>('Prontuario', ProntuarioSchema);