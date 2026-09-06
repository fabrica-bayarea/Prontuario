import painelIcon from '../assets/painel_icon.svg';
import pacientesIcon from '../assets/pacientes_icon.svg';
import triagemIcon from '../assets/triagem_icon.svg';
import validacaoIcon from '../assets/validacao_icon.svg';
import usuariosIcon from '../assets/usuarios_icon.svg';

// Gating de UX (menu e rotas). A autorização real é o `rbacMiddleware` do back;
// mantenha esta tabela alinhada com `backEnd/src/routes/*`.

export const PERFIS = ['ADM', 'COO', 'PRO', 'ATE', 'COM'] as const;
export type Perfil = (typeof PERFIS)[number];

export interface RotaProtegida {
  path: string;
  perfis: readonly Perfil[];
  /** Ausente em rotas que não aparecem na Sidebar. */
  menu?: {
    rotulo: string;
    icone: string;
  };
}

// `/` aparece duas vezes de propósito: o rótulo muda por perfil e os conjuntos são disjuntos.
export const ROTAS_PROTEGIDAS: readonly RotaProtegida[] = [
  { path: '/', perfis: ['COM'], menu: { rotulo: 'Meus Dados', icone: painelIcon } },
  { path: '/', perfis: ['ADM', 'COO', 'PRO', 'ATE'], menu: { rotulo: 'Painel', icone: painelIcon } },
  { path: '/pacientes', perfis: ['ADM', 'COO', 'PRO', 'ATE'], menu: { rotulo: 'Pacientes', icone: pacientesIcon } },
  { path: '/triagem', perfis: ['ADM', 'COO', 'ATE'], menu: { rotulo: 'Triagem', icone: triagemIcon } },
  { path: '/validacao', perfis: ['ADM', 'COO', 'PRO'], menu: { rotulo: 'Validação (Professores)', icone: validacaoIcon } },
  { path: '/novoAcolhimento', perfis: ['ADM', 'COO', 'ATE'] },
  { path: '/usuarios', perfis: ['ADM'], menu: { rotulo: 'Usuários', icone: usuariosIcon } },
];

export function podeAcessar(perfil: Perfil | null | undefined, path: string): boolean {
  if (!perfil) return false;
  return ROTAS_PROTEGIDAS.some((rota) => rota.path === path && rota.perfis.includes(perfil));
}

export function itensMenuPara(perfil: Perfil | null | undefined) {
  if (!perfil) return [];
  return ROTAS_PROTEGIDAS.filter(
    (rota): rota is RotaProtegida & { menu: NonNullable<RotaProtegida['menu']> } =>
      rota.menu !== undefined && rota.perfis.includes(perfil),
  );
}
