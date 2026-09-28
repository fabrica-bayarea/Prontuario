// Controle de tentativas de login por IP.
//
// O bloqueio por usuário (usuarios.tentativas_login / bloqueado_ate) não
// impede alguém de tentar uma mesma senha comum contra várias contas
// diferentes a partir do mesmo IP. Este helper conta as falhas por IP,
// independentemente da conta tentada, e bloqueia o IP temporariamente ao
// atingir o limite.
//
// Estado mantido em memória: suficiente para a instância única atual da API.
// Se o backend passar a rodar em múltiplas réplicas, este contador precisará
// migrar para um armazenamento compartilhado (ex: Redis).

interface EstadoIp {
  tentativas: number;
  bloqueadoAte: Date | null;
}

const TENTATIVAS_MAX_IP = 6;
const BLOQUEIO_IP_MS = 15 * 60_000; // 15 minutos

const tentativasPorIp = new Map<string, EstadoIp>();

function obterEstado(ip: string): EstadoIp {
  let estado = tentativasPorIp.get(ip);
  if (!estado) {
    estado = { tentativas: 0, bloqueadoAte: null };
    tentativasPorIp.set(ip, estado);
  }
  if (estado.bloqueadoAte && estado.bloqueadoAte <= new Date()) {
    estado.tentativas = 0;
    estado.bloqueadoAte = null;
  }
  return estado;
}

export function ipEstaBloqueado(ip: string): boolean {
  const estado = obterEstado(ip);
  return estado.bloqueadoAte !== null && estado.bloqueadoAte > new Date();
}

/**
 * Registra uma falha de login vinda deste IP.
 * Retorna `bloqueouAgora: true` quando esta falha foi a que atingiu o limite
 * e acabou de acionar o bloqueio do IP.
 */
export function registrarFalhaIp(ip: string): { bloqueouAgora: boolean } {
  const estado = obterEstado(ip);

  if (estado.bloqueadoAte) {
    return { bloqueouAgora: false };
  }

  estado.tentativas += 1;

  if (estado.tentativas >= TENTATIVAS_MAX_IP) {
    estado.bloqueadoAte = new Date(Date.now() + BLOQUEIO_IP_MS);
    return { bloqueouAgora: true };
  }

  return { bloqueouAgora: false };
}

/** Limpa o contador do IP após um login bem-sucedido a partir dele. */
export function resetarIp(ip: string): void {
  tentativasPorIp.delete(ip);
}
