import React, { useState } from 'react';
import "../../dashboard/stylecon.css";
import LogoIesb from "../../../assets/Images/LogoIesb.png";

function ConteudoInstitucional() {

  const [conteudos, setConteudos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [publico, setPublico] = useState([]);
  const [status, setStatus] = useState('rascunho');
  const [textoInformativo, setTextoInformativo] = useState('');

  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPublico, setFiltroPublico] = useState('');

  const limparFormulario = () => {
    setTitulo('');
    setTipo('');
    setPublico([]);
    setStatus('rascunho');
    setTextoInformativo('');
  };

  const salvarConteudo = (e) => {
    e.preventDefault();
    if (!titulo) {
      alert('Título é obrigatório');
      return;
    }
    const novo = {
      id: Date.now(),
      titulo,
      tipo,
      publico,
      status,
      textoInformativo,
    };
    setConteudos([...conteudos, novo]);
    limparFormulario();
    setModalAberto(false);
  };

  const confirmarExclusao = () => {
    setConteudos(conteudos.filter(item => item.id !== itemParaExcluir.id));
    setModalExcluirAberto(false);
    setItemParaExcluir(null);
  };

  const alternarPublico = (valor) => {
    if (publico.includes(valor)) {
      setPublico(publico.filter(p => p !== valor));
    } else {
      setPublico([...publico, valor]);
    }
  };

  const conteudosFiltrados = conteudos.filter(c => {
    return (
      c.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
      (filtroTipo ? c.tipo === filtroTipo : true) &&
      (filtroStatus ? c.status === filtroStatus : true) &&
      (filtroPublico ? c.publico.includes(filtroPublico) : true)
    );
  });

  return (
    <div>
      <h1>Conteúdo Institucional</h1>
      <button onClick={() => setModalAberto(true)}>+ Adicionar Novo Conteúdo</button>

      <div>
        <input
          placeholder="Buscar por título..."
          value={filtroTitulo}
          onChange={(e) => setFiltroTitulo(e.target.value)}
        />
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          <option value="PDF">PDF</option>
          <option value="Vídeo">Vídeo</option>
          <option value="Texto">Texto</option>
        </select>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </select>
        <select value={filtroPublico} onChange={(e) => setFiltroPublico(e.target.value)}>
          <option value="">Todos os públicos</option>
          <option value="Aluno">Aluno</option>
          <option value="Coordenador">Coordenador</option>
          <option value="Beneficiário">Beneficiário</option>
        </select>
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Público-Alvo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {conteudosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="5">Nenhum conteúdo cadastrado até o momento.</td>
            </tr>
          ) : (
            conteudosFiltrados.map(item => (
              <tr key={item.id}>
                <td>{item.titulo}</td>
                <td>{item.tipo}</td>
                <td>{item.publico.join(', ')}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => {
                    setItemParaExcluir(item);
                    setModalExcluirAberto(true);
                  }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modalAberto && (
        <div>
          <div>
            <h2>Adicionar Novo Conteúdo</h2>
            <form onSubmit={salvarConteudo}>
              <label>
                Título* <br />
                <input
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  required
                />
              </label>
              <br />
              <label>
                Tipo <br />
                <select value={tipo} onChange={e => setTipo(e.target.value)} required>
                  <option value="">Selecione</option>
                  <option value="PDF">PDF</option>
                  <option value="Vídeo">Vídeo</option>
                  <option value="Texto">Texto</option>
                </select>
              </label>
              <br />
              {tipo === 'Texto' && (
                <label>
                  Texto Informativo <br />
                  <textarea
                    value={textoInformativo}
                    onChange={e => setTextoInformativo(e.target.value)}
                  />
                </label>
              )}
              <br />
              <fieldset>
                <legend>Público-Alvo</legend>
                {['Aluno', 'Coordenador', 'Beneficiário'].map(p => (
                  <label key={p}>
                    <input
                      type="checkbox"
                      checked={publico.includes(p)}
                      onChange={() => alternarPublico(p)}
                    />
                    {p}
                  </label>
                ))}
              </fieldset>
              <br />
              <label>
                Status <br />
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="rascunho">Rascunho</option>
                  <option value="publicado">Publicado</option>
                </select>
              </label>
              <br />
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setModalAberto(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {modalExcluirAberto && (
        <div>
          <div>
            <p>Tem certeza que deseja remover este conteúdo?</p>
            <button onClick={() => setModalExcluirAberto(false)}>Cancelar</button>
            <button onClick={confirmarExclusao}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConteudoInstitucional;

