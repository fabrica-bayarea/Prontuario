// import React, { useState } from "react";
// import LogoIESB from "../../../assets/Images/LogoIESB.png";

// function App() {
//   const [showModalForm, setShowModalForm] = useState(false);
//   const [showModalPermissoes, setShowModalPermissoes] = useState(false);
//   const [showModalConfirmar, setShowModalConfirmar] = useState(false);

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <aside className="dashboard-sidebar">
//         <img src="imgs/LogoIESB.png" alt="Logo IESB" className="logo-sidebar" />
//         <nav>
//           <ul>
//             <li><a href="index.html">🏠 Dashboard</a></li>
//             <li><a href="gerenciar-cursos.html">📚 Cursos</a></li>
//             <li><a href="gerenciar-coordenadores.html">👨‍🏫 Coordenadores</a></li>
//             <li><a href="importar-usuarios.html">📥 Importar Usuários</a></li>
//             <li><a href="conteudo-institucional.html">📄 Conteúdo Institucional</a></li>
//             <li><a href="configuracoes-gerais.html">⚙️ Configurações</a></li>
//             <li><a href="logs-auditoria.html">🧾 Logs e Auditoria</a></li>
//             <li><a href="relatorios.html">📊 Relatórios</a></li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main */}
//       <main className="dashboard-main">
//         {/* Header */}
//         <header className="dashboard-header">
//           <h1 className="dashboard-title">Gerenciar Coordenadores</h1>
//           <button onClick={() => setShowModalForm(true)}>+ Adicionar Coordenador</button>
//         </header>

//         {/* Filtros */}
//         <section className="filters-section">
//           <input type="search" placeholder="Buscar por nome ou e-mail" />
//           <select>
//             <option value="">Todos os cursos</option>
//           </select>
//           <div className="status-filtros">
//             <button className="filtro-btn active">Todos</button>
//             <button className="filtro-btn">Ativos</button>
//             <button className="filtro-btn">Inativos</button>
//           </div>
//         </section>

//         {/* Tabela */}
//         <section className="tabela-coordenadores">
//           <table>
//             <thead>
//               <tr>
//                 <th>Nome</th>
//                 <th>E-mail</th>
//                 <th>Cursos Vinculados</th>
//                 <th>Status</th>
//                 <th>Ações</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Exemplo de linha */}
//               <tr>
//                 <td>João Silva</td>
//                 <td>joao@iesb.edu.br</td>
//                 <td>Engenharia, ADS</td>
//                 <td>Ativo</td>
//                 <td>
//                   <button onClick={() => setShowModalForm(true)}>✏️</button>
//                   <button onClick={() => setShowModalPermissoes(true)}>🔒</button>
//                   <button onClick={() => setShowModalConfirmar(true)}>🗑️</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </section>
//       </main>

//       {/* Modal Form */}
//       {showModalForm && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="modal-close" onClick={() => setShowModalForm(false)}>&times;</span>
//             <h2>Adicionar Coordenador</h2>
//             <form>
//               <label>
//                 Nome completo*
//                 <input type="text" required />
//               </label>
//               <label>
//                 E-mail institucional*
//                 <input type="email" required />
//               </label>
//               <label>
//                 CPF*
//                 <input type="text" placeholder="000.000.000-00" required />
//               </label>
//               <label>
//                 Cursos vinculados*
//                 <select multiple required>
//                   <option>Engenharia</option>
//                   <option>ADS</option>
//                 </select>
//               </label>
//               <label>
//                 Status
//                 <select>
//                   <option value="ativo">Ativo</option>
//                   <option value="inativo">Inativo</option>
//                 </select>
//               </label>
//               <fieldset>
//                 <legend>Permissões</legend>
//                 <label><input type="checkbox" /> Pode aprovar beneficiários</label>
//                 <label><input type="checkbox" /> Pode cadastrar conteúdos</label>
//                 <label><input type="checkbox" /> Pode gerar relatórios</label>
//               </fieldset>
//               <button type="submit">Salvar</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal Permissões */}
//       {showModalPermissoes && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="modal-close" onClick={() => setShowModalPermissoes(false)}>&times;</span>
//             <h2>Permissões de João Silva</h2>
//             <div>
//               <label><input type="checkbox" /> Pode aprovar beneficiários</label>
//               <label><input type="checkbox" /> Pode cadastrar conteúdos</label>
//               <label><input type="checkbox" /> Pode gerar relatórios</label>
//             </div>
//             <button>Salvar Permissões</button>
//           </div>
//         </div>
//       )}

//       {/* Modal Confirmar */}
//       {showModalConfirmar && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="modal-close" onClick={() => setShowModalConfirmar(false)}>&times;</span>
//             <p>Tem certeza que deseja remover este coordenador?</p>
//             <div style={{ marginTop: "1rem" }}>
//               <button onClick={() => setShowModalConfirmar(false)}>Cancelar</button>
//               <button>Confirmar</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       <div className="toast hidden">Operação realizada com sucesso!</div>
//     </div>
//   );
// }

// export default MenuCor;
