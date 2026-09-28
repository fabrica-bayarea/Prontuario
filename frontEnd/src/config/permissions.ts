import painelIcon from '../assets/painel_icon.svg';
import pacientesIcon from '../assets/pacientes_icon.svg';
import triagemIcon from '../assets/triagem_icon.svg';
import validacaoIcon from '../assets/validacao_icon.svg';
import usuariosIcon from '../assets/usuarios_icon.svg';

// Gating de UX (menu e rotas). A autorização real é o `rbacMiddleware` do back.

export const PERFIS = ['ADM', 'COO', 'PRO', 'ATE', 'COM'] as const;
export type Perfil = (typeof PERFIS)[number];

export const CHAVES_TELA = [
  'painel',
  'pacientes',
  'triagem',
  'validacao',
  'novoAcolhimento',
  'usuarios',
  'meusDados',
] as const;
export type ChaveTela = (typeof CHAVES_TELA)[number];

export interface Telas {
  chave: ChaveTela;
  path: string;
  /** Ausente em telas que não aparecem na Sidebar. */
  menu?: {
    rotulo: string;
    icone: string;
  };
}

export const TELAS: readonly Telas[] = [
  { chave: 'painel', path: '/', menu: { rotulo: 'Painel', icone: painelIcon } },
  { chave: 'meusDados', path: '/meus-dados', menu: { rotulo: 'Meus Dados', icone: painelIcon } },
  { chave: 'pacientes', path: '/pacientes', menu: { rotulo: 'Pacientes', icone: pacientesIcon } },
  { chave: 'triagem', path: '/triagem', menu: { rotulo: 'Triagem', icone: triagemIcon } },
  { chave: 'validacao', path: '/validacao', menu: { rotulo: 'Validação (Professores)', icone: validacaoIcon } },
  { chave: 'novoAcolhimento', path: '/novoAcolhimento' },
  { chave: 'usuarios', path: '/usuarios', menu: { rotulo: 'Usuários', icone: usuariosIcon } },
];

// PROVISÓRIO até o BE-06 devolver `permissoes` e `rotaInicial` no login e no /me.
// Valores conforme o contrato de permissões (RBAC §2 e §5).
export const PERMISSOES_POR_PERFIL: Record<Perfil, readonly ChaveTela[]> = {
  ADM: ['painel', 'usuarios'],
  COO: ['painel', 'pacientes', 'triagem'],
  PRO: ['pacientes', 'validacao'],
  ATE: ['pacientes', 'triagem', 'novoAcolhimento'],
  COM: ['meusDados'],
};

export const ROTA_INICIAL_POR_PERFIL: Record<Perfil, string> = {
  ADM: '/',
  COO: '/',
  PRO: '/validacao',
  ATE: '/pacientes',
  COM: '/meus-dados',
};

export function itensMenuPara(permissoes: readonly ChaveTela[]) {
  return TELAS.filter(
    (tela): tela is Telas & { menu: NonNullable<Telas['menu']> } =>
      tela.menu !== undefined && permissoes.includes(tela.chave),
  );
}
