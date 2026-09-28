import database from '../config/Database';

const pool = database.getPool();

export interface VersaoCriterios {
  id: number;
  clinicaId: number | null;
  versao: number;
  pesos: Record<string, number>;
}

/**
 * Busca a configuração ATIVA de uma clínica; se ela não tiver configuração
 * própria, cai pra global (clinica_id IS NULL) — regra "clínica sem
 * configuração usa a global" (issue #154).
 *
 * `clinicaId: null` pede direto a global (é o que `criarProntuario` usa hoje,
 * até o BE-08 #152 existir e `prontuario.clinica_id` virar uma coluna real —
 * ver TODO em prontuarioService.criarProntuario).
 */
export async function buscarAtivaPorClinica(clinicaId: number | null): Promise<VersaoCriterios | null> {
  const result = await pool.query(
    `
      SELECT id, clinica_id, versao, pesos
      FROM criterios_triagem
      WHERE ativa = true AND (clinica_id = $1 OR clinica_id IS NULL)
      ORDER BY clinica_id NULLS LAST
      LIMIT 1
    `,
    [clinicaId],
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return { id: row.id, clinicaId: row.clinica_id, versao: row.versao, pesos: row.pesos };
}
